const express = require("express");
const { Models } = require("../models");
const comment = Models.comment;

const router = express.Router();

router.route("/").post(async (req, res, next) => {
  try {
    const comment_ = await comment.create({
      commenter: req.body.id,
      comment: req.body.comment,
    });
    console.log(comment_);
    res.status(201).json(comment_);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router
  .route("/:id")
  .patch(async (req, res, next) => {
    try {
      const result = await comment.update(
        { comment: req.body.comment },
        { where: { id: req.params.id } }
      );
      res.json(result);
    } catch (err) {
      console.log(err);
      next(err);
    }
  })
  .delete(async (req, res, next) => {
    try {
      var result = await comment.destroy({ where: { id: req.params.id } });
      res.json(result);
    } catch (err) {
      console.log(err);
      next(err);
    }
  });

module.exports = router;
