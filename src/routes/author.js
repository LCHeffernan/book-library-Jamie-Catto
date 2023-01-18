const express = require('express');
const authorController = require('../controllers/author');

const router = express.Router();

router.post('', authorController.addAuthor);
router.get('', authorController.getAllAuthors);
router.get('/:id', authorController.getAuthor);
router.patch('/:id', authorController.updateAuthor);
router.delete('/:id', authorController.deleteAuthor);

module.exports = router;