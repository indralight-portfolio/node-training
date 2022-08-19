const express = require('express');

const { User, Follow } = require('../models').Models;
const { isLoggedIn } = require('./middlewares');
const { addFollowing } = require('../controllers/user');

const router = express.Router();

router.post('/:id/follow', isLoggedIn, addFollowing);

router.post('/:id/notfollow', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (user) {
      await user.removeFollower(parseInt(req.params.id, 10));
      res.send('success');
    } else {
      res.status(404).send('no user');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

User.prototype.removeFollower = async function (id) {
  await Follow.destroy({
    where: {
      followerId: this.id,
      followingId: id,
    },
  });
};

module.exports = router;
