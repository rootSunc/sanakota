const { query } = require("../../config/database");

class Word {
  constructor(data) {
    this.id = data.id;
    this.lemma = data.lemma;
    this.pos = data.pos;
    this.translation = data.translation;
    this.definition = data.definition;
    this.synonyms = data.synonyms || [];
    this.inflections = data.inflections || {};
    this.lexical_category = data.lexical_category;
    this.example_sentences = data.example_sentences || [];
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Get all words with optional filtering
  static async findAll(filters = {}) {
    let sql = "SELECT * FROM words WHERE 1=1";
    const params = [];
    let paramCount = 0;

    // Add filters
    if (filters.lemma) {
      paramCount++;
      sql += ` AND lemma ILIKE $${paramCount}`;
      params.push(`%${filters.lemma}%`);
    }

    if (filters.pos) {
      paramCount++;
      sql += ` AND pos = $${paramCount}`;
      params.push(filters.pos);
    }

    if (filters.translation) {
      paramCount++;
      sql += ` AND translation ILIKE $${paramCount}`;
      params.push(`%${filters.translation}%`);
    }

    if (filters.lexical_category) {
      paramCount++;
      sql += ` AND lexical_category = $${paramCount}`;
      params.push(filters.lexical_category);
    }

    // Add ordering
    sql += " ORDER BY created_at DESC";

    // Add pagination
    if (filters.limit) {
      paramCount++;
      sql += ` LIMIT $${paramCount}`;
      params.push(filters.limit);
    }

    if (filters.offset) {
      paramCount++;
      sql += ` OFFSET $${paramCount}`;
      params.push(filters.offset);
    }

    const result = await query(sql, params);
    return result.rows.map((row) => new Word(row));
  }

  // Get a word by ID
  static async findById(id) {
    const sql = "SELECT * FROM words WHERE id = $1";
    const result = await query(sql, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return new Word(result.rows[0]);
  }

  // Get a word by lemma
  static async findByLemma(lemma) {
    const sql = "SELECT * FROM words WHERE lemma ILIKE $1";
    const result = await query(sql, [lemma]);

    if (result.rows.length === 0) {
      return null;
    }

    return new Word(result.rows[0]);
  }

  // Search words using full-text search
  static async search(searchTerm, limit = 10) {
    const sql = `
      SELECT *, ts_rank(to_tsvector('english', lemma || ' ' || COALESCE(definition, '')), plainto_tsquery('english', $1)) as rank
      FROM words 
      WHERE to_tsvector('english', lemma || ' ' || COALESCE(definition, '')) @@ plainto_tsquery('english', $1)
      ORDER BY rank DESC
      LIMIT $2
    `;

    const result = await query(sql, [searchTerm, limit]);
    return result.rows.map((row) => new Word(row));
  }

  // Create a new word
  static async create(wordData) {
    const {
      lemma,
      pos,
      translation,
      definition,
      synonyms = [],
      inflections = {},
      lexical_category,
      example_sentences = [],
    } = wordData;

    const sql = `
      INSERT INTO words (lemma, pos, translation, definition, synonyms, inflections, lexical_category, example_sentences)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const params = [
      lemma,
      pos,
      translation,
      definition,
      JSON.stringify(synonyms),
      JSON.stringify(inflections),
      lexical_category,
      JSON.stringify(example_sentences),
    ];

    const result = await query(sql, params);
    return new Word(result.rows[0]);
  }

  // Update a word
  async update(updateData) {
    const {
      lemma,
      pos,
      translation,
      definition,
      synonyms,
      inflections,
      lexical_category,
      example_sentences,
    } = updateData;

    const sql = `
      UPDATE words 
      SET lemma = COALESCE($1, lemma),
          pos = COALESCE($2, pos),
          translation = COALESCE($3, translation),
          definition = COALESCE($4, definition),
          synonyms = COALESCE($5, synonyms),
          inflections = COALESCE($6, inflections),
          lexical_category = COALESCE($7, lexical_category),
          example_sentences = COALESCE($8, example_sentences)
      WHERE id = $9
      RETURNING *
    `;

    const params = [
      lemma,
      pos,
      translation,
      definition,
      synonyms ? JSON.stringify(synonyms) : null,
      inflections ? JSON.stringify(inflections) : null,
      lexical_category,
      example_sentences ? JSON.stringify(example_sentences) : null,
      this.id,
    ];

    const result = await query(sql, params);

    if (result.rows.length > 0) {
      // Update the current instance
      Object.assign(this, result.rows[0]);
      return this;
    }

    return null;
  }

  // Delete a word
  async delete() {
    const sql = "DELETE FROM words WHERE id = $1";
    const result = await query(sql, [this.id]);
    return result.rowCount > 0;
  }

  // Get words by part of speech
  static async findByPos(pos) {
    const sql = "SELECT * FROM words WHERE pos = $1 ORDER BY lemma";
    const result = await query(sql, [pos]);
    return result.rows.map((row) => new Word(row));
  }

  // Get words by lexical category
  static async findByLexicalCategory(category) {
    const sql =
      "SELECT * FROM words WHERE lexical_category = $1 ORDER BY lemma";
    const result = await query(sql, [category]);
    return result.rows.map((row) => new Word(row));
  }

  // Get statistics
  static async getStats() {
    const sql = `
      SELECT 
        COUNT(*) as total_words,
        COUNT(DISTINCT pos) as unique_pos,
        COUNT(DISTINCT lexical_category) as unique_categories,
        MIN(created_at) as first_word_date,
        MAX(created_at) as last_word_date
      FROM words
    `;

    const result = await query(sql);
    return result.rows[0];
  }

  // Convert to JSON
  toJSON() {
    return {
      id: this.id,
      lemma: this.lemma,
      pos: this.pos,
      translation: this.translation,
      definition: this.definition,
      synonyms: this.synonyms,
      inflections: this.inflections,
      lexical_category: this.lexical_category,
      example_sentences: this.example_sentences,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}

module.exports = Word;
