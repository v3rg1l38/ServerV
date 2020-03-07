const express = require('express');
const router = express.Router();
const db = require('../config/db');


const pk = async () => {
    const resp = await db.sendQuery('SELECT id FROM Posts');
    return resp;
}

router.get('/', async (req, res) => {
    try {
        // const resp = await db.sendQuery('SELECT id, Title FROM Posts');
        const rsp = pk();
        return res.json({ status: 200, data: resp });
    }
    catch(err) {
        console.log(`ERROR: ${err}`);
        res.json({ status: 500, message: `ERROR: ${err}` });
    }
});


module.exports = router;