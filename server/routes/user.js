const express = require('express');
const app = express();
const bcryp = require('bcrypt');
const _ = require('underscore');
const Users = require('../models/user');

app.get('/usuario', function (req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    Users.find({})
        .skip(desde)
        .limit(5)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                users
            })
        })

})

app.post('/usuario', function (req, res) {

    let body = req.body;
    let user = new Users({
        nombre: body.nombre,
        email: body.email,
        password: bcryp.hashSync(body.password, 10),
        role: body.role
    });

    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            user: userDB
        })
    })
})

app.put('/usuario/:id', function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);






    Users.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            user: userDB
        })
    })

})

app.delete('/usuario/:id', function (req, res) {
    if (req.params.id) {
        res.json({
            id: req.params.id
        })
    } else {
        res.status(400).json({
            ok: false,
            msg: 'debe ingresar un id'
        })
    }
})

module.exports = app;