const express = require("express");
const { User, Comment } = require("../models");

const router = express.Router();

router
  .route("/")
  .get(async (req, res, next) => {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (err) {
      console.log(err);
      next(err);
    }
  })
  .post(async (req, res, next) => {
    try {
      const user = await User.create({
        name: req.body.name,
        age: req.body.age,
        married: req.body.married,
      });
      console.log(user);
      res.status(201).json(user);
    } catch (err) {
      console.log(err);
      next(err);
    }
  });

router.get("/:id/comments", async (req, res, next) => {
  try {
    const comments = await Comment.findAll({
      include: {
        model: User,
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
