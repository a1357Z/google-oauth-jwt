const path = require("path");

module.exports = {
    renderLoginPage: function(req, res){
        res.sendFile("login.html", {
            root: path.join(__dirname,"../views")
        })
    }
}