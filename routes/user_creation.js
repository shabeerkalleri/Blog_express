const express=require("express")
const router=express.Router()
const UserSchema=require("../models/user_model")
const bcrypt = require("bcrypt")

router.post("/", async (req, res) => {
    var { user_name, email, password } = req.body
    // we want secure password by salt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    var userCreation = new UserSchema({
        user_name: user_name,
        password: hashedPassword,
        email: email
    })
    await userCreation.save().then(data => {
       // console.log("data is ", data)
        res.json({ mesage: "sucess", data: data })
    })
        .catch(err => {
            console.log("error is ", err)

        })
})
module.exports=router