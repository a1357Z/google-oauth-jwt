var jwt = require('jsonwebtoken');
const fs = require("fs");
const path = require("path")

module.exports = function(userId){
    return new Promise((resolve, reject) => {
        var privateKey = fs.readFileSync(path.join(__dirname, './id_rsa_priv.pem'));
        jwt.sign(
            { 
                sub: userId,
                exp: Math.floor(Date.now() / 1000) + (60 * 60), //expires in 1 hour
            }, 
            privateKey, 
            { algorithm: 'RS256' }, 
            function(err, token) {
                if(err){
                    return reject(err);
                }
                // console.log(token);
                return resolve(token)
            }
        );
    })
    
}