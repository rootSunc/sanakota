const Word = require('../models/Word');

class WordsController {
  // Get all words with optional filtering
  static async getAllWords(req, res) {
    try {
      const {
        lemma,
        pos,
        lexical_category,
        limit = 20,
        offset = 0
      } = req.query;

      const filters = {
        lemma,
        pos,
        lexical_category,
        limit: parseInt(limit),
        offset: parseInt(offset)
      };

      const words = await Word.findAll(filters);
      
      res.json({
        success: true,
        data: words,
        count: words.length,
        filters: filters
      });
    } catch (error) {
      console.error('Error fetching words:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch words',
        message: error.message
      });
    }
  }

  // Search words using full-text search
  static async searchWords(req, res) {
    try {
      const { q, limit = 10 } = req.query;

      if (!q) {
        return res.status(400).json({
          success: false,
          error: 'Search query is required'
        });
      }

      const words = await Word.search(q, parseInt(limit));
      
      res.json({
        success: true,
        data: words,
        count: words.length,
        query: q
      });
    } catch (error) {
      console.error('Error searching words:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to search words',
        message: error.message
      });
    }
  }

  // Get word statistics
  static async getStats(req, res) {
    try {
      const stats = await Word.getStats();
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch statistics',
        message: error.message
      });
    }
  }

  // Get words by part of speech
  static async getWordsByPos(req, res) {
    try {
      const { pos } = req.params;
      const words = await Word.findByPos(pos);
      
      res.json({
        success: true,
        data: words,
        count: words.length,
        pos: pos
      });
    } catch (error) {
      console.error('Error fetching words by POS:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch words by part of speech',
        message: error.message
      });
    }
  }

  // Get words by lexical category
  static async getWordsByCategory(req, res) {
    try {
      const { category } = req.params;
      const words = await Word.findByLexicalCategory(category);
      
      res.json({
        success: true,
        data: words,
        count: words.length,
        category: category
      });
    } catch (error) {
      console.error('Error fetching words by category:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch words by category',
        message: error.message
      });
    }
  }

  // Get a specific word by ID
  static async getWordById(req, res) {
    try {
      const { id } = req.params;
      const word = await Word.findById(id);
      
      if (!word) {
        return res.status(404).json({
          success: false,
          error: 'Word not found'
        });
      }
      
      res.json({
        success: true,
        data: word
      });
    } catch (error) {
      console.error('Error fetching word:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch word',
        message: error.message
      });
    }
  }

  // Create a new word
  static async createWord(req, res) {
    try {
      const {
        lemma,
        pos,
        translation,
        definition,
        synonyms,
        inflections,
        lexical_category,
        example_sentences
      } = req.body;

      // Validate required fields
      if (!lemma || !pos) {
        return res.status(400).json({
          success: false,
          error: 'Lemma and part of speech are required'
        });
      }

      const wordData = {
        lemma,
        pos,
        translation,
        definition,
        synonyms,
        inflections,
        lexical_category,
        example_sentences
      };

      const word = await Word.create(wordData);
      
      res.status(201).json({
        success: true,
        data: word,
        message: 'Word created successfully'
      });
    } catch (error) {
      console.error('Error creating word:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create word',
        message: error.message
      });
    }
  }

  // Update a word
  static async updateWord(req, res) {
    try {
      const { id } = req.params;
      const word = await Word.findById(id);
      
      if (!word) {
        return res.status(404).json({
          success: false,
          error: 'Word not found'
        });
      }

      const updatedWord = await word.update(req.body);
      
      if (!updatedWord) {
        return res.status(500).json({
          success: false,
          error: 'Failed to update word'
        });
      }
      
      res.json({
        success: true,
        data: updatedWord,
        message: 'Word updated successfully'
      });
    } catch (error) {
      console.error('Error updating word:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update word',
        message: error.message
      });
    }
  }

  // Delete a word
  static async deleteWord(req, res) {
    try {
      const { id } = req.params;
      const word = await Word.findById(id);
      
      if (!word) {
        return res.status(404).json({
          success: false,
          error: 'Word not found'
        });
      }

      const deleted = await word.delete();
      
      if (!deleted) {
        return res.status(500).json({
          success: false,
          error: 'Failed to delete word'
        });
      }
      
      res.json({
        success: true,
        message: 'Word deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting word:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete word',
        message: error.message
      });
    }
  }
}

module.exports = WordsController;
