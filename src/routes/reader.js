const express = require('express');
const readerController = require('../controllers/reader');

const router = express.Router();

router.post('', readerController.addReader);
router.get('', readerController.getAllReaders);
router.get('/:id', readerController.getReader);
router.patch('/:id', readerController.updateReaderEmail);
router.delete('/:id', readerController.deleteReader);

module.exports = router;