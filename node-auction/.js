const { Op } = require('sequelize');
const { sequelize } = require('./models');
const { Good, Auction, User } = require('./models').Models;

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
        const success = await Auction.findOne({
          where: { GoodId: target.id },
          order: [['bid', 'DESC']],
        });
        await Good.update(
          { SoldId: success.UserId },
          { where: { id: target.id } }
        );
        await User.update(
          { money: sequelize.literal(`money - ${success.bid}`) },
          { where: { id: success.UserId } }
        );
      } else {
        schedule.scheduleJob(target.end, async () => {
          const success = await Auction.findOne({
            where: { GoodId: good.id },
            order: [['bid', 'DESC']],
          });
          await Good.update(
            { SoldId: success.UserId },
            { where: { id: good.id } }
          );
          await User.update(
            { money: sequelize.literal(`money - ${success.bid}`) },
            { where: { id: success.UserId } }
          );
        });
      }
    });
  } catch (error) {
    console.error(error);
  }
};
