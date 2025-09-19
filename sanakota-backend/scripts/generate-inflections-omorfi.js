#!/usr/bin/env node

const { Pool } = require("pg");
const { spawn } = require("child_process");
require("dotenv").config();

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "sanakota_db",
  user: process.env.DB_USER || "sanakota",
  password: process.env.DB_PASSWORD || "sanakota123",
};

const OMORFI_LOOKUP_BIN = process.env.OMORFI_LOOKUP_BIN || "hfst-lookup";
const OMORFI_GENERATOR_PATH =
  process.env.OMORFI_GENERATOR_PATH || process.env.OMORFI_GEN || "";

function ensureOmorfiConfigured() {
  if (!OMORFI_GENERATOR_PATH) {
    throw new Error(
      "OMORFI_GENERATOR_PATH is not set. Set env var to your omorfi generator .hfstol file."
    );
  }
}

function runHfstLookup(input) {
  return new Promise((resolve, reject) => {
    const proc = spawn(OMORFI_LOOKUP_BIN, [OMORFI_GENERATOR_PATH]);

    let stdout = "";
    let stderr = "";
    proc.stdout.on("data", (d) => {
      stdout += d.toString();
    });
    proc.stderr.on("data", (d) => {
      stderr += d.toString();
    });

    proc.on("error", (err) => reject(err));
    proc.on("close", (code) => {
      if (code !== 0) {
        return reject(
          new Error(`hfst-lookup exited with code ${code}: ${stderr}`)
        );
      }
      resolve(stdout);
    });

    proc.stdin.write(input + "\n");
    proc.stdin.end();
  });
}

function parseLookupOutput(output) {
  const lines = output
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const forms = [];
  for (const line of lines) {
    if (line.startsWith(">>>")) continue;
    const parts = line.split("\t").map((s) => s.trim());
    if (parts.length >= 2) {
      const surface = parts[1].split("\t")[0].split("/")[0].trim();
      if (surface && surface !== "??") forms.push(surface);
    }
  }
  return forms;
}

// Minimal paradigm targets per POS. Adjust as needed.
const TARGETS = {
  noun: {
    Sg_Nom: "+N+Sg+Nom",
    Sg_Gen: "+N+Sg+Gen",
    Sg_Par: "+N+Sg+Par",
    Pl_Nom: "+N+Pl+Nom",
    Pl_Gen: "+N+Pl+Gen",
    Pl_Par: "+N+Pl+Par",
    Sg_Ine: "+N+Sg+Ine",
    Sg_Ill: "+N+Sg+Ill",
  },
  verb: {
    Inf1: "+V+Inf",
    Pres_3Sg: "+V+Act+Ind+Prs+Sg3",
    Past_3Sg: "+V+Act+Ind+Prt+Sg3",
    Cond_3Sg: "+V+Act+Cond+Sg3",
    Potn_3Sg: "+V+Act+Pot+Sg3",
    Imp_2Sg: "+V+Act+Imprt+Sg2",
    Prs_Part_Act: "+V+Act+PrsPrc",
    Pst_Part_Act: "+V+Act+Prc",
  },
  adjective: {
    Pos_Sg_Nom: "+A+Pos+Sg+Nom",
    Comp_Sg_Nom: "+A+Cmp+Sg+Nom",
    Sup_Sg_Nom: "+A+Sup+Sg+Nom",
    Sg_Par: "+A+Sg+Par",
  },
  adverb: {
    Base: "+Adv",
  },
};

function tagsForPos(pos) {
  const key = (pos || "").toLowerCase();
  return TARGETS[key] || TARGETS["noun"];
}

async function generateInflectionsFor(lemma, pos) {
  const targets = tagsForPos(pos);
  const result = {};

  for (const [label, tags] of Object.entries(targets)) {
    const query = `${lemma}${tags}`;
    try {
      const out = await runHfstLookup(query);
      const forms = parseLookupOutput(out);
      if (forms.length > 0) {
        result[label] = forms[0];
      }
    } catch (e) {
      // Skip silently per form
    }
  }
  return result;
}

async function main() {
  ensureOmorfiConfigured();

  const onlyMissing = process.argv.includes("--only-missing");
  const limitArg = process.argv.find((a) => a.startsWith("--limit="));
  const limit = limitArg ? parseInt(limitArg.split("=")[1], 10) : 500;
  const offsetArg = process.argv.find((a) => a.startsWith("--offset="));
  const offset = offsetArg ? parseInt(offsetArg.split("=")[1], 10) : 0;
  const posArg = process.argv.find((a) => a.startsWith("--pos="));
  const filterPos = posArg ? posArg.split("=")[1] : null;
  const dryRun = process.argv.includes("--dry-run");

  const pool = new Pool(dbConfig);
  const client = await pool.connect();

  try {
    console.log("🔄 Fetching words to inflect...");
    let sql = "SELECT id, lemma, pos, inflections FROM words WHERE 1=1";
    const params = [];

    if (filterPos) {
      params.push(filterPos);
      sql += ` AND pos = $${params.length}`;
    }
    if (onlyMissing) {
      sql += " AND (inflections IS NULL OR inflections = '{}'::jsonb)";
    }
    if (limit) {
      params.push(limit);
      sql += ` ORDER BY created_at ASC LIMIT $${params.length}`;
    }
    if (offset) {
      params.push(offset);
      sql += ` OFFSET $${params.length}`;
    }

    const { rows } = await client.query(sql, params);
    console.log(`📋 Will process ${rows.length} words`);

    let processed = 0;
    for (const row of rows) {
      const generated = await generateInflectionsFor(row.lemma, row.pos);
      if (Object.keys(generated).length === 0) {
        processed++;
        if (processed % 50 === 0) console.log(`… processed ${processed}`);
        continue;
      }

      if (dryRun) {
        console.log(`${row.lemma} (${row.pos}) =>`, generated);
      } else {
        const merged = Object.assign({}, row.inflections || {}, generated);
        await client.query(
          "UPDATE words SET inflections = $1, updated_at = NOW() WHERE id = $2",
          [JSON.stringify(merged), row.id]
        );
      }

      processed++;
      if (processed % 50 === 0) console.log(`📈 processed ${processed}`);
    }

    console.log("✅ Done.");
  } catch (err) {
    console.error("❌ Failed:", err.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

if (require.main === module) {
  main();
}
