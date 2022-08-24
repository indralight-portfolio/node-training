const { sequelize } = require('./models');
const { Good, Auction, User } = require('./models').Models;

const end = async (id) => {
  const success = await Auction.findOne({
    where: { GoodId: id },
    order: [['bid', 'DESC']],
  });
  if (success != null) {
    await Good.update({ SoldId: success.UserId }, { where: { id } });
    await User.update(
      { money: sequelize.literal(`money - ${success.bid}`) },
      { where: { id: success.UserId } }
    );
  } else {
    await Good.destroy({ where: { id } });
  }
};

module.exports = { end };
