const mongoose = require("mongoose")

const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        status: {
            type: String,
            required: true,
            enum: {
                values: ["ignored", "interested", "accepted", "rejected"],
                message: `{value} is incorrect status type`
            }
        }
    },
    {
        timestamps: true,
    }
)

connectionRequestSchema.pre("save", function(next){
    const connectionRequest = this;
    //chk if the fromuserId and touserId are same
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cann't send connection request to yourself.")
    }
    next()
})

const ConnectionRequestModel = new mongoose.model("ConnectionRequest",connectionRequestSchema)

module.exports = ConnectionRequestModel;