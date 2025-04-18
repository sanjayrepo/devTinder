const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    //Read the token from the request cookies
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token is invalid.");
    }
    const decoadedObj = await jwt.verify(token, "DEV@Tinder$790");
    const { _id } = decoadedObj;
    const user = User.findById(_id);
    if (!user) {
      throw new Error("User Not found");
    }

    req.user =user;
    next();
  } catch (error) {
    res.status(400).send("Error :" + error.message);
  }
};

module.exports = {
  userAuth,
};
