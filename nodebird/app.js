const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const nunjucksDate = require('nunjucks-date');
const dotenv = require('dotenv');
const passport = require('passport');
const helmet = require('helmet');
const hpp = require('hpp');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);

dotenv.config();
const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  //  username: process.env.REDIS_USER,
  password: process.env.REDIS_PASSWORD,
});
const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const auctionRouter = require('./routes/auction');
const v1Router = require('./routes/v1');
const { sequelize } = require('./models');
const passportConfig = require('./passport');
const checkAuction = require('./checkAuction');
const logger = require('./logger');

const { swaggerUi, spec } = require('./swagger');

const app = express();
passportConfig();
checkAuction();
app.set('port', process.env.PORT || 8001);
app.set('view engine', 'html');
const env = nunjucks.configure('views', {
  express: app,
  watch: true,
});
nunjucksDate.install(env);

sequelize
  .sync({ force: false })
  .then((result) => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.log(err);
  });

if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(hpp());
} else {
  app.use(morgan('dev'));
}
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
const sessionOption = {
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
  store: new RedisStore({ client: redisClient }),
};
if (process.env.NODE_ENV === 'production') {
  sessionOption.proxy = true;
}

app.use(session(sessionOption));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', pageRouter);
app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);
app.use('/auction', auctionRouter);
app.use('/v1', v1Router);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(spec));

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  logger.info('hello');
  logger.error(error.message);
  next(error);
});

app.use((err, req, res, next) => {
  (res.locals.message = err.message),
    (res.locals.error = process.env.NODE_ENV !== 'production' ? err : {});
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
