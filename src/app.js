const express = require("express");
const app = express();

const connectDB = require("./config/database");
const User = require("./models/user");

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "virat",
    lastName: "kohli",
    emailId: "kohli@gmail.com",
    password: "abcd",
  });
  try {
    await user.save();
  res.send("User Added Successfully.")
  } catch (error) {
    res.status(400).send("Error saving user"+err.message)
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
