const express = require('express');
const bookController = require('../controllers/book');

const router = express.Router();

router.post('', bookController.addBook);
router.get('', bookController.getAllBooks);
router.get('/:id', bookController.getBook);
router.patch('/:id', bookController.updateBookTitle);
router.delete('/:id', bookController.deleteBook);

module.exports = router;