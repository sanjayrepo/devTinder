const express = require('express')

const authRouter = express.Router()
const { validateSignupData } = require("../utils/validator");
const User = require("../models/user");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");


authRouter.post("/signup", async (req, res) => {
    try {
        //validation of data
        await validateSignupData(req);

        const { firstName, lastName, emailId, password } = req.body;

        //Encrypt the password
        const passwordHash = await bcrypt.hash(password, 10);
        console.log(passwordHash);

        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        });

        await user.save();
        res.send("User Added Successfully.");
    } catch (error) {
        res.status(400).send("Error :" + error.message);
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Invalid credentials");
        }
        const isPasswardValid = await user.validatePassword(password);
        if (isPasswardValid) {
            //create a JWT token
            const token = await user.getJWT()

            //Add the token to cookies and send the response back to the user.

            res.cookie("token", token);

            res.send("Login Successful");
        } else {
            throw new Error("Invalid credentials");
        }
    } catch (error) {
        res.status(400).send("Error :" + error.message);
    }
});

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, { espires: new Date(Date.now()) })
    res.send("Logged Out")
})


module.exports = authRouter;