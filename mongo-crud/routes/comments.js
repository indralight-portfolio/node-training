const express = require('express');
const User = require('../schemas/user');
const Comment = require('../schemas/comment');

const router = express.Router();

router.route('/').post(async (req, res, next) => {
  try {
    const comment = await Comment.create({
      commenter: req.body.id,
      comment: req.body.comment,
    });
    console.log(comment);
    const result = await Comment.populate(comment, { path: 'commenter' });
    res.status(201).json(result);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router
  .route('/:id')
  .patch(async (req, res, next) => {
    try {
      const result = await Comment.updateOne(
        { _id: req.params.id },
        { comment: req.body.comment }
      );
      res.json(result);
    } catch (err) {
      console.log(err);
      next(err);
    }
  })
  .delete(async (req, res, next) => {
    try {
      var result = await Comment.remove({ _id: req.params.id });
      res.json(result);
    } catch (err) {
      console.log(err);
      next(err);
    }
  });

module.exports = router;
