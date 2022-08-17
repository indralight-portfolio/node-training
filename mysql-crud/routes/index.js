const express = require("express");
const { user } = require("../models").Models;

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const users = await user.findAll();
    res.render("sequelize", { users });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
