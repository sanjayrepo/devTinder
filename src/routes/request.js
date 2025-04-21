const express = require('express')
const requiestRouter = express.Router();
const { userAuth } = require("../middlewares/auth")


requiestRouter.post("/sendConnectionRequest",userAuth, async(req,res) =>{

    const user = req.user
    // sending a connetion request
    console.log("sending a connection request")
  
    res.send(user)
  })

module.exports = requiestRouter;

