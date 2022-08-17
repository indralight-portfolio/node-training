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
    destination:(req, file, cb) {
      cb(null, 'uploads/');
    },    
    filename: (req,file,cb) {
      const ext = path.extname(file.originalname);      
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
  console.log(req.file);
  res.json({ url : `/img/${req.file.filename}`});
});

router.get('/join', isNotLoggedIn, (req, res) => {
  res.render('join', { title: '회원가입 - NodeBird' });
});

router.get('/', (req, res) => {
  const twits = [];
  res.render('main', { title: 'NodeBird', twits });
});

module.exports = router;
