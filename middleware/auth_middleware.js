const jwt = require("jsonwebtoken");
require('dotenv').config();
const jwtSecretKey = process.env.JWT_SECRET;


// we want authenticate token 
function verifyToken(req, res, next) {
    const auth_header = req.headers.authorization
    if (auth_header) {
        let token = auth_header.split(' ')[1]  
        jwt.verify(token, jwtSecretKey, (err, decoded) => {
            if (err) { res.status(500).json({ auth: "error found" }) }
            else {
                //  res.send(decoded)
                console.log("decoded", decoded)
                next()
            }
        })
    }

    else {
        res.status(401).json({
            success: false,
            message: 'Token is not provided',
        });
    }

}
module.exports = verifyToken