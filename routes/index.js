const express = require('express');
const router = express.Router();
const db = require('../config/db');


<<<<<<< HEAD
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const resp = await db.sendQuery('SELECT id, Title FROM Posts');
        return res.json({ status: 200, data: id });
=======
const pk = async () => {
    const resp = await db.sendQuery('SELECT id FROM Posts');
    return resp;
}

router.get('/', async (req, res) => {
    try {
        // const resp = await db.sendQuery('SELECT id, Title FROM Posts');
        const rsp = pk();
        return res.json({ status: 200, data: resp });
>>>>>>> eb3c0a1d7493de44c4775f12eb7fc482196f118f
    }
    catch(err) {
        console.log(`ERROR: ${err}`);
        res.json({ status: 500, message: `ERROR: ${err}` });
    }
});


module.exports = router;