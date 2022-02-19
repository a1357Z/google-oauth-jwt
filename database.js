const mongoose = require("mongoose");


async function connectMongo(){
    try {
        await mongoose.connect('mongodb://localhost:27017/authDb', 
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        )
        console.log("successfully connected to mongodb");
    } catch (error) {
        console.log("error in connecting to mongodb", error)
    }
}

connectMongo();

const userSchema = new mongoose.Schema({
    username: String,
    googleId: String,
    passwordHash: String,
    salt: String
})

module.exports = new mongoose.model("user", userSchema);
