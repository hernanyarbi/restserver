const express = require('express');
const app = express();
const bcryp = require('bcrypt');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
const jwt = require('jsonwebtoken');
const Users = require('../models/user');

app.post('/login', (req, res) => {

    let body = req.body;

    Users.findOne({ email: body.email }, (err, user) => {

        if (err) {
            res.status(500).json({
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
        }, process.env.SEED, { expiresIn: process.env.CADUCATE_TOKEN })

        res.json({
            ok: true,
            user,
            token
        });

    });
});

// Google Configurations
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    console.log(payload);
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture
    }
}

app.post('/google', async (req, res) => {

    let token = req.body.idtoken;
    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            });
        });

    Users.findOne({ email: googleUser.email }, (err, user) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            })
        } else if (user) {
            if (user.email === googleUser.emial) {
                res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Este correo ya esta en uso.'
                    }
                })
            } else {
                let token = jwt.sign({
                    user
                }, process.env.SEED, { expiresIn: process.env.CADUCATE_TOKEN })

                res.json({
                    ok: true,
                    user,
                    token
                });
            }

        } else {
            let user = new Users({
                nombre: googleUser.nombre,
                email: googleUser.email,
                img: googleUser.img,
                google: true,
                password: 'google-auth'
            });
            user.save((err, user) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        err
                    })
                }
                let token = jwt.sign({
                    user
                }, process.env.SEED, { expiresIn: process.env.CADUCATE_TOKEN })

                res.json({
                    ok: true,
                    user,
                    token
                });
            });
        }
    });

    // // // // // return res.json({
    // // // // //     user: googleUser
    // // // // // });

});

module.exports = app;