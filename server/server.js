require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');
 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB, (err, res) => {
    if(err) throw err;

    console.log('Base de datos corriendo');
})

app.listen(process.env.PORT, () => {
    console.log('Puerto 3000');
});