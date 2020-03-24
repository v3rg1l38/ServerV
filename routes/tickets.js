const express = require('express');
const router = express.Router();
const logger = require('../config/logger');

router.get('/:id', (req, res) => {
    const { id } = req.params;

    res.redirect('/');
});

module.exports = router;