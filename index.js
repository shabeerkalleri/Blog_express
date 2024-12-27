const express = require("express");
const mongoose = require("mongoose");
const http = require("http")
const app = express();
const path = require("path")
const dotenv = require("dotenv")
dotenv.config()
let mongo_url = process.env.MONGO_URL
const connectDb = async () => {
    await mongoose.connect("mongodb://localhost:27017/blog_api"
    ).then(data => {
        console.log("db connected",)
    })
        .catch(err => {
            console.log("error in db", err)
        })
}

connectDb()

let createUserRouter = require("./routes/user_creation")
let LoginUserRouter = require("./routes/user_login")
let viewUser = require("./routes/view_user")
let BlogRouter=require("./routes/blog_management")
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use("/createUser", createUserRouter);
app.use("/login", LoginUserRouter);
app.use("/viewUser", viewUser);
app.use("/Blog", BlogRouter);

const Port = process.env.PORT;
var server = http.createServer(app)
server.listen(Port, () => {
    console.log("server running in 3002")
})

// app.use(function (req, res, next) {
//     next(createError(404));
// });