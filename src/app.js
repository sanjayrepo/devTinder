const express = require("express");
const app = express();

const connectDB = require("./config/database");
const User = require("./models/user");

const { validateSignupData } = require("./utils/validator");

const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());
const jwt = require("jsonwebtoken");
const {userAuth} = require("./middlewares/auth")

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
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

app.get("/profile",userAuth, async (req, res) => {
  try {
    const user = req.user
    res.send(user);
  } catch (error) {
    res.status(400).send("Error :" + error.message);
  }
});

app.post("/sendConnectionRequest",userAuth, async(req,res) =>{

  const user = req.user
  // sending a connetion request
  console.log("sending a connection request")

  res.send(user)
})

connectDB()
  .then(() => {
    console.log("Database connection in successful!!");
    app.listen(3000, () => {
      console.log("Server is listening on port 3000..");
    });
  })
  .catch((err) => {
    console.log("Database cann't be connected!!");
  });
