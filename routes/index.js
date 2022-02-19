const express = require("express");
const router = express.Router();
const controller = require("../controllers");
const passport = require("passport");
const signJwt = require("../jwt/signJwt")

//render login page
router.get("/login-page", controller.renderLoginPage);

//login url
router.get("/google-login", passport.authenticate('google', { scope: ['profile','email'], session: false }))

//google callback url
router.get('/users/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login-page', session: false }),
  async function (req, res) {
    // Successful authentication
    //generate jwt token and attach in response
    try {
        let token = await signJwt(req.user._id);
        res.setHeader("Set-Cookie", `jwt=${token}`);
        // res.setHeader("Authorization", `bearer ${token}`);
        // res.redirect("/jwt-auth-route")
        res.send({ user: req.user.username, id: req.user.googleId, token: token});    
    } catch (error) {
        console.log(error)
        res.send({ message: "something went wrong"})
    }
    
  });

//authenticated route with jwt
router.get("/jwt-auth-route", passport.authenticate('jwt', { session: false }),
    function(req, res) {
        return res.send({ user: req.user.username, id: req.user.googleId, message: "you have successfully authenticated"});
    }
)

  module.exports = router;
