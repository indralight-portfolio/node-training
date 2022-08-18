const express = require('express');
const jwt = require('jsonwebtoken');

const { verifyToken } = require('./middlewares');
const { domain, user } = require('../models').Models;

const router = express.Router();

router.post('/token', async (req, res) => {
  const { clientSecret } = req.body;
  try {
    const domain_ = await domain.findOne({
      where: { clientSecret },
      include: {
        model: user,
        as: 'user',
        attribute: ['nick', 'id'],
      },
    });
    if (!domain_) {
      return res.status(401).json({
        code: 401,
        message: '등록되지 않은 도메인입니다.',
      });
    }
    const token = jwt.sign(
      {
        id: domain_.user.id,
        nick: domain_.user.nick,
      },
      process.env.JWT_SECRET,
      {
        //expiresIn: '1m', // 분
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

router.get('/test', verifyToken, async (req, res) => {
  res.json(req.decoded);
});

module.exports = router;
