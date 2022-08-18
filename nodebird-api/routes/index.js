const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { User, Domain } = require('../models').Models;
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: (req.user && req.user.id) || null },
      include: { model: Domain, as: 'domains' },
    });
    res.render('login', {
      user: user,
      domains: user && user.domains,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.post('/domain', isLoggedIn, async (req, res, next) => {
  try {
    await Domain.create({
      userId: req.user.id,
      host: req.body.host,
      type: req.body.type,
      clientSecret: uuidv4(),
    });
    res.redirect('/');
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;
