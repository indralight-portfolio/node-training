const passport = require('passport');
const kakaoStrategy = require('passport-kakao').Strategy;

const { user } = require('../models').Models;

module.exports = () => {
  passport.use(
    new kakaoStrategy(
      {
        clientID: process.env.KAKAO_ID,
        callbackURL: '/auth/kakao/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log('kakao profile', profile);
        try {
          const exUser = await user.findOne({
            where: { snsId: profile.id, provider: 'kakao' },
          });
          if (exUser) {
            done(null, exUser);
          } else {
            const newUser = await user.create({
              email: profile._json && profile._json.kakao_account.email,
              nick: profile.displayName,
              snsId: profile.id,
              provider: 'kakao',
            });
            done(null, newUser);
          }
        } catch (error) {
          console.log(error);
          done(error);
        }
      }
    )
  );
};
