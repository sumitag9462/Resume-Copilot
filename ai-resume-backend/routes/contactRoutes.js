const express = require('express');
const { submitQuery } = require('../controllers/contactController');

const router = express.Router();

router.post('/submit', submitQuery);

module.exports = router;
