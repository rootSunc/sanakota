import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { WordsAPI } from "../api";

export default function WordCreatePage() {
  const navigate = useNavigate();
  const [lemma, setLemma] = useState("");
  const [pos, setPos] = useState("");
  const [translation, setTranslation] = useState("");
  const [definition, setDefinition] = useState("");
  const [synonyms, setSynonyms] = useState(""); // comma-separated
  const [inflections, setInflections] = useState("{}"); // JSON text
  const [examples, setExamples] = useState(""); // one per line
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    if (!lemma || !pos) {
      setError("Lemma and POS are required");
      return;
    }
    let inflectionsObj = {};
    try {
      inflectionsObj = inflections.trim() ? JSON.parse(inflections) : {};
      if (typeof inflectionsObj !== "object" || Array.isArray(inflectionsObj))
        throw new Error();
    } catch (_) {
      setError("Inflections must be a valid JSON object");
      return;
    }
    const synonymsArr = synonyms
      .split(/[,\n]/)
      .map((s) => s.trim())
      .filter(Boolean);
    const examplesArr = examples
      .split(/\n/)
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      lemma,
      pos,
      translation: translation || undefined,
      definition: definition || undefined,
      synonyms: synonymsArr,
      inflections: inflectionsObj,
      example_sentences: examplesArr,
    };

    try {
      setSubmitting(true);
      const resp = await WordsAPI.create(payload);
      const id = resp?.data?.id;
      if (id) navigate(`/words/${id}`);
      else navigate("/words");
    } catch (e) {
      setError(e.message || "Failed to create word");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Add Word</h2>
        <Link to="/words" className="btn-secondary">
          Cancel
        </Link>
      </div>

      {error && <div className="text-red-600">{error}</div>}

      <form
        onSubmit={onSubmit}
        className="bg-white rounded shadow p-6 space-y-4 max-w-3xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lemma *
            </label>
            <input
              value={lemma}
              onChange={(e) => setLemma(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Part of Speech *
            </label>
            <select
              value={pos}
              onChange={(e) => setPos(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Select…</option>
              <option value="noun">Noun</option>
              <option value="verb">Verb</option>
              <option value="adjective">Adjective</option>
              <option value="adverb">Adverb</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Translation
            </label>
            <input
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Definition
            </label>
            <textarea
              value={definition}
              onChange={(e) => setDefinition(e.target.value)}
              className="w-full border rounded px-3 py-2"
              rows={3}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Synonyms (comma or newline separated)
            </label>
            <textarea
              value={synonyms}
              onChange={(e) => setSynonyms(e.target.value)}
              className="w-full border rounded px-3 py-2"
              rows={2}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Inflections (JSON object)
            </label>
            <textarea
              value={inflections}
              onChange={(e) => setInflections(e.target.value)}
              className="w-full border rounded px-3 py-2 font-mono text-sm"
              rows={4}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Example sentences (one per line)
            </label>
            <textarea
              value={examples}
              onChange={(e) => setExamples(e.target.value)}
              className="w-full border rounded px-3 py-2"
              rows={3}
            />
          </div>
        </div>
        <div className="pt-2">
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? "Submitting…" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
