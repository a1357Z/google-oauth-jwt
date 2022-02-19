var GoogleStrategy = require('passport-google-oauth20').Strategy;
const userModel = require("./database");

var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const fs = require("fs");
const path = require("path");

module.exports = function(passport){
    //setup google strategy
    passport.use(new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.CALL_BACK_URL || "http://localhost:8000/users/auth/google/callback"
        },
        function(accessToken, refreshToken, profile, cb) {
            userModel.findOne({ googleId: profile.id }, async function (err, user) {
                if(err) {
                    return cb(err, false);
                }
                if(user){
                    return cb(null, user)
                }else{
                    console.log(profile)
                    user = await userModel.create({
                        username: profile.displayName,
                        googleId: profile.id
                    })
                    return cb(null, user)
                }
            });
        }
    ));

    //setup jwt strategy
    var cookieExtractor = function(req) {
        var token = null;
        if (req && req.cookies)
        {
            token = req.cookies['jwt'];
        }
        return token;
    };

    const options = {
        jwtFromRequest: cookieExtractor,
        secretOrKey: fs.readFileSync(path.join(__dirname, './jwt/id_rsa_pub.pem')),
        algorithms: ['RS256']
    };

    passport.use(new JwtStrategy(options, function(jwt_payload, done) {
        User.findOne({_id: jwt_payload.sub}, function(err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        });
    }));
    
    //setup user login

}