const { Op } = require('sequelize');
const { sequelize } = require('./models');
const { Good, Auction, User } = require('./models').Models;
const schedule = require('node-schedule');
const bid = require('./bid');

module.exports = async () => {
  console.log('checkAuction');
  try {
    const now = new Date();
    const targets = await Good.findAll({
      where: {
        SoldId: null,
        //end: { [Op.lte]: now },
      },
    });
    targets.forEach(async (target) => {
      if (target.end <= now) {
        await bid.end(target.id);
      } else {
        schedule.scheduleJob(target.end, async () => {
          await bid.end(target.id);
        });
      }
    });
  } catch (error) {
    console.error(error);
  }
};
