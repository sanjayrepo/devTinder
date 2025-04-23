const express = require('express')
const requiestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest")
const User = require("../models/user");


requiestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {

  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const allowedStatuses = ["ignored", "interested"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status type: " + status });
    }
    if(toUserId === fromUserId){

    }

    const toUser = await User.findById(toUserId)
    if (!toUser){
      return res.status(400).json({ message: "User not found." })
    }


    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status
    })
    const data = await connectionRequest.save()
    res.json({
      message: req.user.firstName + " is "+ status + " in "+ toUser.firstName,
      data
    })

    //if there is an existing connectionRequest
    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId }
      ]
    })

    if (existingConnectionRequest) {
      return res.status(400).json({ message: "Connection request already exists." });
    }
  } catch (error) {
    res.status(400).send("Error :" + error.message)
  }

})

module.exports = requiestRouter;

