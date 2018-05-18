require('./config/config');

let express = require('express');
let app = express();
const bodyParser = require('body-parser');
 
app.get('/usuario', function (req, res) {
  res.json('Get User');
})
 
app.post('/usuario', function (req, res) {
  res.json({
      person: req.body
  })
})
 
app.put('/usuario/:id', function (req, res) {
    if(req.params.id){
        res.json({
            id:req.params.id
        })
    }else{
        res.status(400).json({
            ok: false,
            msg: 'debe ingresar un id'
        })
    }
})
 
app.delete('/usuario/:id', function (req, res) {
    if(req.params.id){
        res.json({
            id:req.params.id
        })
    }else{
        res.status(400).json({
            ok: false,
            msg: 'debe ingresar un id'
        })
    }
})
 
app.listen(process.env.PORT, () => {
    console.log('Puerto 3000');
});