const express = require("express");
const passport = require("passport");
const routes = require("./routes");
const passportSetup = require("./passport");

require("./database");
require("dotenv").config();

const app = express();
app.use(express.json());

passportSetup(passport)
app.use(passport.initialize());

app.use("/", routes);

app.listen(8000, () => {
    console.log("app listening on port 8000")
})
