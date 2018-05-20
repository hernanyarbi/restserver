const express = require('express');
const app = express();
const bcryp = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('../models/user');

app.post('/login', (req, res) => {

    let body = req.body;

    Users.findOne({ email: body.email }, (err, user) => {

        if (err) {
            res.status500.json({
                ok: false,
                err
            })
        } else if (!user) {
            res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o Contraseña Incorrecto'
                }
            })
        } else if (!bcryp.compareSync(body.password, user.password)) {
            res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o Contraseña Incorrecto'
                }
            })
        }

        let token = jwt.sign({
            user
        },process.env.SEED, { expiresIn: process.env.CADUCATE_TOKEN })

        res.json({
            ok: true,
            user,
            token
        });

    });
});

module.exports = app;