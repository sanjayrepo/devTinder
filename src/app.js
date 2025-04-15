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
    res.status(400).send("Error saving user" + error.message);
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
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully.");
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];

    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );

  
    if (!isUpdateAllowed) {
      throw new Error("Update Not allowed");
    }
    if(data?.skills.length>10){
      throw new Error ("Skills cann't be more than 10")
    }
    await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send("User updated successfully.");
  } catch (error) {
    res.status(400).send("UPDATE FAILED:" + error.message);
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
