const express = require("express");
const { myProfile } = require("../controllers/profileControllers");
const { authenticateToken } = require("../middleware/auth");

const profileRouter = express.Router();

profileRouter.get("/", authenticateToken, myProfile);

module.exports = profileRouter;
