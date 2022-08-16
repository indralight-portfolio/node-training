const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');

dotenv.config();
const pageRouter = require('./routes/page');

const app = express();
app.set('port', process.env.PORT || 8001);
app.set('view engine', 'html');
nunjucks.configure('views', {
  express: app,
  watch: true,
});

app.use(morgan('dev'));

const { sequelize } = require('./models');

sequelize
  .sync({ force: false })
  .then((result) => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.log(err);
  });
