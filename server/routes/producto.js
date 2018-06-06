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
        .populate('usuario', 'nombre email')
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
    Product.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria')
        .exec((err, product) => {
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

app.get('/products/search/:term', verifyToken, (req, res) => {
    let term = req.params.term;
    let regx = new RegExp(term, 'i');
    Product.find({ nombre: regx })
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

app.post('/products', verifyToken, (req, res) => {

    let body = req.body;

    let product = new Product({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.user._id
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

app.put('/products/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Product.findByIdAndUpdate(id, body, { new: true, runValidators: true },
        (err, product) => {
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
            })
        });
});

app.delete('/products/:id', verifyToken, (req, res) => {
    let id = req.params.id;

    Product.findByIdAndUpdate(id, { disponible: false }, { new: true, runValidators: true },
        (err, product) => {
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
            })
        });
});

module.exports = app;