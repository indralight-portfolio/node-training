const { sequelize } = require('./models');

sequelize
  .sync({ force: false })
  .then((result) => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.log(err);
  });
