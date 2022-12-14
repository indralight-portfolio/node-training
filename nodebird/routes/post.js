const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Post, Hashtag, PostHashtag } = require('../models').Models;
const { isLoggedIn } = require('./middlewares');
const { route } = require('./user');

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

router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {
  try {
    const post_ = await Post.create({
      content: req.body.content,
      img: req.body.url,
      userId: req.user.id,
    });
    const hashtags = req.body.content.match(/#[^\s#]+/g);
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map((tag) => {
          return Hashtag.findOrCreate({
            where: { title: tag.slice(1).toLowerCase() },
          });
        })
      );
      await post_.addHashtags(result.map((r) => r[0]));
    }
    res.redirect('/');
  } catch (error) {
    console.log(error);
  }
});

router.get('/', (req, res) => {
  const twits = [];
  res.render('main', { title: 'NodeBird', twits });
});

router.post('/:id/delete', async (req, res, next) => {
  try {
    await Post.destroy({ where: { id: req.params.id } });
    res.send('success');
  } catch (error) {
    console.log(error);
    next(error);
  }
});

Post.prototype.addHashtags = async function (hashtags) {
  for (const hashtag_ of hashtags) {
    await PostHashtag.create({
      postId: this.id,
      hashtagId: hashtag_.id,
    });
  }
};

module.exports = router;
