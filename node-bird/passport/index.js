const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const { user } = require('../models').Models;

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    user
      .findOne({
        where: { id },
        include: [
          {
            model: user,
            attributes: ['id', 'nick'],
            as: 'followerId_users',
          },
          {
            model: user,
            attributes: ['id', 'nick'],
            as: 'followingId_users',
          },
        ],
      })
      .then((user) => done(null, user))
      .catch((err) => done(err));
  });

  local();
  kakao();
};
