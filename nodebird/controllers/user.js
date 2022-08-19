const { User } = require('../models').Models;

exports.addFollowing = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (user) {
      await user.addFollowing(parseInt(req.params.id, 10));
      res.send('success');
    } else {
      res.status(404).send('no user');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

User.prototype.addFollowing = async function (id) {
  await Follow.create({
    followerId: this.id,
    followingId: id,
  });
};
