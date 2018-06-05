const express = require('express');

const { verifyToken, verifyAdmin } = require('../middlewares/auth');

const app = express();
let Category = require('../models/categories');


app.get('/categories', verifyToken, (req, res) => {
    Category.find({})
        .sort('description')
        .populate('user', 'nombre email')
        .exec((err, categories) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            Category.count({}, (err, count) => {
                res.json({
                    ok: true,
                    categories,
                    count
                })
            })
        })
});

app.get('/categories/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    Category.findById(id, (err, category) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            category
        });
    });
});

app.post('/categories', verifyToken, (req, res) => {
    let body = req.body;
    console.log(body);
    let category = new Category({
        description: body.description,
        user: req.user._id
    });
    category.save((err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        } else if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            category: categoryDB
        })
    });
});

app.put('/categories/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    Category.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoryDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            category: categoryDB
        })
    })
});

app.delete('/categories/:id', [verifyToken, verifyAdmin], (req, res) => {
    let id = req.params.id;
    Category.findByIdAndRemove(id, (err, categoryDeleted) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        } else if (!categoryDeleted) {
            return res.status(400).json({
                ok: false,
                err: 'No se encontro la categoria'
            })
        }
        res.json({
            ok: true,
            category: categoryDeleted
        })
    });
});

module.exports = app;