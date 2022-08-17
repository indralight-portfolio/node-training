const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Post, HashTag } = require('../models');
const { isLoggedIn } = require('./middlewares');
const db = require('../models');

const router = express.Router();

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.log('uploads 폴더가 없어서 생성');
  fs.mkdirSync('uploads');
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
  console.log(req.file);
  res.json({ url: `/img/${req.file.filename}` });
});

const upload2 = multer();

router.post('/', isNotLoggedIn, upload2.none(), async (req, res, next) => {
  try {
    const post = await Post.findOrCreate({
      content: req.body.content,
      img: req.body.url,
      UserId: req.user.id,
    });
  } catch (error) {
    console.log(err);
  }
});

router.get('/', (req, res) => {
  const twits = [];
  res.render('main', { title: 'NodeBird', twits });
});

module.exports = router;
