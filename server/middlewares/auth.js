const jwt = require('jsonwebtoken');

/**
 *  Verify Token
 */

let verifyToken = (req, res, next) => {

    let token = req.get('x-auth-token');

    jwt.verify(token, process.env.SEED, (err, decode) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err,

            });
        }
        req.user = decode.user;
        next();
    });
}

let verifyAdmin = (req, res, next) => {

    let user = req.user;

    if (user.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err:{
                message: 'Usuario sin permisos'
            }
        });
    } else {
        next();
    }
}

module.exports = {
    verifyToken,
    verifyAdmin
}