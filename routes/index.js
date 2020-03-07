const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
    try {
        const resp = await db.sendQuery('SELECT id, Title FROM Posts');
        return res.json({ status: 200, data: resp });
    }
    catch(err) {
        console.log(`ERROR: ${err}`);
        res.json({ status: 500, message: `ERROR: ${err}` });
    }
});


module.exports = router;