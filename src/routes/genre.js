const express = require('express');
const genreController = require('../controllers/genre');

const router = express.Router();

router.post('', genreController.addGenre);
router.get('', genreController.getAllGenres);
router.get('/:id', genreController.getGenre);
router.patch('/:id', genreController.updateGenre);
router.delete('/:id', genreController.deleteGenre);

module.exports = router;