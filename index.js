const express = require('express');
const app = express();
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const cors = require('cors');
const helmet = require('helmet');
const db = require('./config/db');
const loginCheck = require('./controllers/LoginController').isLoggedIn;

db.setConnection(require('./config/dbProps'));

app.use(session({
    secret: 'v3rg1l38',
    resave: true,
    saveUninitialized: true
}));

app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use(loginCheck);
app.use('/', require('./routes/index'));
app.use('/ticket', require('./routes/tickets'));
app.use('**', require('./routes/404'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log('Server started on port ' + PORT));