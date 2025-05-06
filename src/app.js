const express = require("express");
const app = express();

const connectDB = require("./config/database");

const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());
const jwt = require("jsonwebtoken");

const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requistRouter = require("./routes/request")
const userRoute = require('./routes/user')

app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",requistRouter)
app.use("/",userRoute)






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
