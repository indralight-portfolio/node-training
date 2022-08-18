const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { user, domain } = require('../models').Models;
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const user_ = await user.findOne({
      where: { id: (req.user && req.user.id) || null },
      include: { model: domain, as: 'domains' },
    });
    res.render('login', {
      user: user_,
      domains: user_ && user_.domains,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.post('/domain', isLoggedIn, async (req, res, next) => {
  try {
    await domain.create({
      userId: req.user.id,
      host: req.body.host,
      type: req.body.type,
      clientSecret: uuidv4(),
    });
    res.redirect('/');
  } catch {
    console.error(error);
    return next(error);
  }
});

module.exports = router;
