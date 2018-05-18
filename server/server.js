require('./config/config');

let express = require('express')
let app = express()
 
app.get('/', function (req, res) {
  res.send('Hello World')
})
 
app.listen(process.env.PORT, () => {
    console.log('Puerto 3000');
});