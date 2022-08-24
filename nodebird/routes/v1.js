const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const url = require('url');

const { verifyToken } = require('./middlewares');
const { Domain, User, Post, Hashtag } = require('../models').Models;

const router = express.Router();

router.use(async (req, res, next) => {
  const domain = await Domain.findOne({
    where: { host: url.parse(req.get('origin') || 'localhost').host },
  });
  if (domain) {
    cors({
      origin: req.get('origin'),
      credentials: true,
    })(req, res, next);
  } else {
    next();
  }
});

/**
 * @swagger
 *  components:
 *    schemas:
 *      tokenResponse:
 *        properties:
 *          code:
 *            type: integer
 *          message:
 *            type: string
 *          token:
 *            type: string
 */

/**
 * @swagger
 *  /token:
 *    post:
 *      summary: token 발급
 *      tags:
 *        - v1
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              properties:
 *                clientSecret:
 *                  type: string
 *      responses:
 *        '200':
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/tokenResponse'
 */
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
        expiresIn: '10s', // 분
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

/**
 * @swagger
 *  components:
 *    schemas:
 *      post:
 *        properties:
 *          id:
 *            type: integer
 *          content:
 *            type: string
 *          img:
 *            type: string
 *          userId:
 *            type: integer
 *          createdAt:
 *            type: string($date-time)
 *          updatedAt:
 *            type: string($date-time)
 */

/**
 * @swagger
 *  /posts/my:
 *    get:
 *      summary: 나의 글
 *      tags:
 *        - v1
 *      responses:
 *        '200':
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/post'
 */
router.get('/posts/my', verifyToken, async (req, res) => {
  try {
    const posts = await Post.findAll({ where: { userId: req.decoded.id } });
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

/**
 * @swagger
 *  /posts/hashtag/{title}:
 *    get:
 *      summary: 태그 검색
 *      tags:
 *        - v1
 *      parameters:
 *        - in : path
 *          name: title
 *          required: true
 *          description: 태그
 *          schema:
 *            type: string
 *      responses:
 *        '200':
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/post'
 */
router.get('/posts/hashtag/:title', verifyToken, async (req, res) => {
  try {
    const hashtag = await Hashtag.findOne({
      where: { title: req.params.title },
    });
    if (!hashtag) {
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
    model: PostHashtag,
    as: 'postHashtags',
    attributes: ['hashtagId'],
  });
  option.where = { '$postHashtags.hashtagId$': this.id };
  return await post.findAll(option);
};

module.exports = router;
