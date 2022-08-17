const express = require("express");
const { user, comment } = require("../models").Models;

const router = express.Router();

router
  .route("/")
  .get(async (req, res, next) => {
    try {
      const users = await user.findAll();
      res.json(users);
    } catch (err) {
      console.log(err);
      next(err);
    }
  })
  .post(async (req, res, next) => {
    try {
      const user_ = await user.create({
        name: req.body.name,
        age: req.body.age,
        married: req.body.married,
      });
      console.log(user_);
      res.status(201).json(user_);
    } catch (err) {
      console.log(err);
      next(err);
    }
  });

router.get("/:id/comments", async (req, res, next) => {
  try {
    const comments = await comment.findAll({
      include: {
        model: user,
        as: "commenter_user",
        where: {
          id: req.params.id,
        },
      },
    });
    console.log(comments);
    res.json(comments);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;
