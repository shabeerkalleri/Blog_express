
const express = require("express")
const router = express.Router()
const UserSchema = require("../models/user_model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const dotenv=require("dotenv")
  dotenv.config()
router.post("/", async (req, res) => {

    let user_name = req.body.user_name
    let password = req.body.password

    await UserSchema.find({ user_name: user_name }).then(async userData => {
        if (userData.length > 0) {
            let stored_password = userData[0].password
            console.log("password", stored_password)
            let hash_pasword = await bcrypt.compare(password, stored_password)
            if (hash_pasword) {
                let payload = {
                    user_id: userData[0]["_id"],
                    user_name: userData[0]["user_name"],
                   
                }
                let token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" })
                res.status(200).json({ status: true, data: payload, user_id: payload.user_id, mesage: "login sucessfully", token })
            }
            else {
                return res.status(401).json({ auth: "password does not match" })

            }
        }
        else {
            res.status(401).json({ auth: "No user found" })
        }

    }).catch(err => {
        console.log("Error login", err)
    })
})
module.exports=router