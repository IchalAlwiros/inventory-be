const express = require("express");

const vercelrouter = express.Router();

vercelrouter.get("/", (req, res) => {
  return res.json({
    info: {
      creator: "created by ichal wira",
      creator_git: "https://gitlab.com/IchAlwiros",
    },
  });
});

module.exports = vercelrouter;
