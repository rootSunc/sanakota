// Validation middleware for word creation/updates
const validateWord = (req, res, next) => {
  const { lemma, pos } = req.body;
  
  if (!lemma || !pos) {
    return res.status(400).json({
      success: false,
      error: 'Lemma and part of speech are required'
    });
  }
  
  if (typeof lemma !== 'string' || lemma.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Lemma must be a non-empty string'
    });
  }
  
  if (typeof pos !== 'string' || pos.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Part of speech must be a non-empty string'
    });
  }
  
  next();
};

module.exports = {
  validateWord
};
