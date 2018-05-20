const express = require('express');
const app = express();
const bcryp = require('bcrypt');
const _ = require('underscore');
const Users = require('../models/user');
const { verifyToken, verifyAdmin } = require('../middlewares/auth');

app.get('/usuario', verifyToken, function (req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    Users.find({ estado: true })
        .skip(desde)
        .limit(limite)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            Users.count({ estado: true }, (err, count) => {
                res.json({
                    ok: true,
                    users,
                    count
                })
            })
        })

})

app.post('/usuario', [verifyToken, verifyAdmin], function (req, res) {

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

app.put('/usuario/:id', [verifyToken, verifyAdmin], function (req, res) {
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

app.delete('/usuario/:id', [verifyToken, verifyAdmin], function (req, res) {
    let id = req.params.id;
    //Users.findByIdAndRemove(id, (err, user) => {
    Users.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, user) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            })
        } else if (!user) {
            res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }
        res.json({
            ok: true,
            user
        })
    })
})

module.exports = app;