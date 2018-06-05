const express = require('express');
const { verifyToken } = require('../middlewares/auth');
let app = express();
let Product = require('../models/producto');

app.get('/products', verifyToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    Product.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('user', 'nombre email')
        .populate('categoria')
        .exec((err, products) => {
            if (err) {
                return res.status(500)
                    .json({
                        ok: false,
                        err
                    });
            }

            Product.count({ disponible: true }, (err, count) => {
                res.json({
                    ok: true,
                    products,
                    count
                })
            })
        });

});

app.get('/products/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    Product.findById(id, (err, product) => {
        if (err) {
            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        }

        res.json({
            ok: true,
            product
        });
    });
});

app.post('/products', verifyToken, (req, res) => {

    let body = req.body;

    let product = new Product({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: body.usuario
    });

    product.save((err, product) => {
        if (err) {
            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        }

        res.json({
            ok: true,
            product
        });
    });


});



module.exports = app;