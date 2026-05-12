const express = require("express");

const requestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../model/connectionRequest");
const User = require("../model/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json("Invalid status type: " + status);
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(400).send("user not found");
      }

      const existingConnectionRequest = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .json({ message: "Connection Request Already Exists!" });
      }

      const connectionReq = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionReq.save();

      res.json({
        message: req.user.firstName + " is " + status + " in " + toUser.firstName,
        data,
      });
    } catch (error) {
      res.status(400).send("Err: " + error.message);
    }
  },
);


requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user
    const { status, requestId } = req.params

    const allowedStatus = ["accepted", "rejected"]
    if (!allowedStatus.includes(status)) {
      return res.status(400).send("status not allowed")
    }
    const connectionRequest = await ConnectionRequestModel.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested"
    })
    if (!connectionRequest) {
      return res.status(404).send("Connection request not found")
    }
    connectionRequest.status = status
    const data = await connectionRequest.save();
    res.json({ message: "Connection request " + status, data });
  } catch (error) {
    res.status(400).send("Err: " + error.message);
  }
});
module.exports = requestRouter;
