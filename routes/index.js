const express = require('express');
const router = express.Router();
const db = require('../config/db');


router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const resp = await db.sendQuery('SELECT id, Title FROM Posts');
        return res.json({ status: 200, data: id });
    }
    catch(err) {
        console.log(`ERROR: ${err}`);
        res.json({ status: 500, message: `ERROR: ${err}` });
    }
});


module.exports = router;