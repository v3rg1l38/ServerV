const express = require('express');
const app = express();
const cors = require('cors');
const helmet = require('helmet');
const fs = require('fs');

app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());


const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log('Server started on port ' + PORT));