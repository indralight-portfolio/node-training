const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { post, user, hashtag, postHashtag } = require('../models').Models;

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.followerCount = req.user ? req.user.followerId_users.length : 0;
  res.locals.followingCount = req.user ? req.user.followingId_users.length : 0;
  res.locals.followerIdList = req.user
    ? req.user.followingId_users.map((f) => f.id)
    : [];
  next();
});

router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile', { title: '내정보 - NodeBird' });
});

router.get('/join', isNotLoggedIn, (req, res) => {
  res.render('join', { title: '회원가입 - NodeBird' });
});

router.get('/', async (req, res, next) => {
  try {
    const posts = await post.findAll({
      include: {
        model: user,
        as: 'user',
        attributes: ['id', 'nick'],
      },
      order: [['createdAt', 'desc']],
    });
    res.render('main', { title: 'NodeBird', twits: posts });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get('/hashtag', async (req, res, next) => {
  const query = req.query.hashtag;
  if (!query) {
    return res.redirect('/');
  }
  try {
    const hashtag_ = await hashtag.findOne({ where: { title: query } });
    let posts = [];
    if (hashtag_) {
      posts = await hashtag_.getPosts({
        include: [{ model: user, as: 'user' }],
      });
    }

    return res.render('main', {
      title: `${query} | NodeBird`,
      twits: posts,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

hashtag.prototype.getPosts = async function (option) {
  option.include.push({
    model: postHashtag,
    as: 'postHashtags',
    attributes: ['hashtagId'],
  });
  option.where = { '$postHashtags.hashtagId$': this.id };
  return await post.findAll(option);
};

module.exports = router;
