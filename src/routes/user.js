const express = require('express');
const userRouter = express.Router();
const { userAuth } = require('../middlewares/auth')
const ConnectionRequests = require('../models/connectionRequest')
const User = require('../models/user')

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills"

// Get all the pending connection 
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequests.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", USER_SAFE_DATA)

        res.json({ message: "Data fetched successfully" })

    } catch (error) {
        res.status(400).send("Error :" + error.message)
    }
})

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequests.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" }
            ]
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", connectionRequests)

        const data = ConnectionRequests.map((row) => {
            if (row.formUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId
            }
            return row.fromUserId
        })
        res.json({ data: connectionRequests })
    }
    catch (error) {
        res.status(400).send("Error :" + error.message)
    }
})

userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        //user should see all the user cards

        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit>50? 50:limit;
        const skip = (page - 1) * limit;
        //find all collection requests(sent+received)
        const connectionRequest = await ConnectionRequests.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId")

        const hideUsersFromFeed = new Set()
        hideUsersFromFeed.forEach(req => {
            hideUsersFromFeed.add(req.formUserId.toString()),
                hideUsersFromFeed.add(req.toUserId.toString())
        })

        console.log(hideUsersFromFeed)

        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: loggedInUser._id } }
            ]

        }).select(USER_SAFE_DATA).skip(skip).limit(limit)


        res.send(users)


    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})


module.exports = userRouter;
