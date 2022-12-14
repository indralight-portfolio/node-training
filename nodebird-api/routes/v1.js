const express = require('express');
const jwt = require('jsonwebtoken');

const { verifyToken, deprecated } = require('./middlewares');
const { Domain, User, Post, Hashtag } = require('../models').Models;

const router = express.Router();

router.use(deprecated);

router.post('/token', async (req, res) => {
  const { clientSecret } = req.body;
  try {
    const domain = await Domain.findOne({
      where: { clientSecret },
      include: {
        model: User,
        as: 'user',
        attribute: ['nick', 'id'],
      },
    });
    if (!domain) {
      return res.status(401).json({
        code: 401,
        message: '등록되지 않은 도메인입니다.',
      });
    }
    const token = jwt.sign(
      {
        id: domain.user.id,
        nick: domain.user.nick,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1m', // 분
        issuer: 'nodebird',
      }
    );
    return res.json({
      code: 200,
      message: '토큰이 발급되었습니다.',
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: '서버 에러',
    });
  }
});

router.get('/test', verifyToken, async (req, res) => {
  res.json(req.decoded);
});

router.get('/posts/my', verifyToken, async (req, res) => {
  try {
    const posts = await Post.findAll({ where: { userId: req.decoded.id } });
    console.log(post);
    return res.json({
      code: 200,
      payload: posts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      message: '서버 에러',
    });
  }
});

router.get('/posts/hashtag/:title', verifyToken, async (req, res) => {
  try {
    const hashtag_ = await Hashtag.findOne({
      where: { title: req.params.title },
    });
    if (!hashtag_) {
      return res.json({
        code: 404,
        message: '검색결과가 없습니다.',
      });
    }
    const posts = await hashtag.getPosts();
    return res.json({
      code: 200,
      payload: posts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      message: '서버 에러',
    });
  }
});

Hashtag.prototype.getPosts = async function (option) {
  option.include.push({
    model: postHashtag,
    as: 'postHashtags',
    attributes: ['hashtagId'],
  });
  option.where = { '$postHashtags.hashtagId$': this.id };
  return await Post.findAll(option);
};

module.exports = router;
