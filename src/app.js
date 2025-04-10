const express = require("express");
const app = express();

const connectDB = require("./config/database");
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  console.log(req.body);
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User Added Successfully.");
  } catch (error) {
    res.status(400).send("Error saving user" + err.message);
  }
});

// Get user by email
app.get("/user", async (req, res) => {
  try {
    const userEmail = req.body.emailId;
    const users = await User.find({ emailId: userEmail });
    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

//Feed API - GET/feed - get all the user from db
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({})
    res.send(users)
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

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
