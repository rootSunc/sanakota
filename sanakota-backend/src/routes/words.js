const express = require('express');
const WordsController = require('../controllers/wordsController');
const router = express.Router();

// GET /api/words - Get all words with optional filtering
router.get('/', WordsController.getAllWords);

// GET /api/words/search - Search words using full-text search
router.get('/search', WordsController.searchWords);

// GET /api/words/stats - Get word statistics
router.get('/stats', WordsController.getStats);

// GET /api/words/pos/:pos - Get words by part of speech
router.get('/pos/:pos', WordsController.getWordsByPos);

// GET /api/words/category/:category - Get words by lexical category
router.get('/category/:category', WordsController.getWordsByCategory);

// GET /api/words/:id - Get a specific word by ID
router.get('/:id', WordsController.getWordById);

// POST /api/words - Create a new word
router.post('/', WordsController.createWord);

// PUT /api/words/:id - Update a word
router.put('/:id', WordsController.updateWord);

// DELETE /api/words/:id - Delete a word
router.delete('/:id', WordsController.deleteWord);

module.exports = router;
