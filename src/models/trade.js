module.exports = (sequelize, DataTypes) => {
  const trade = sequelize.define('trade', {
    shippingCost: DataTypes.INTEGER,
    state: DataTypes.STRING,
    firstUserId: DataTypes.INTEGER,
    secondUserId: DataTypes.INTEGER,
    type: DataTypes.STRING,
    publicationId: DataTypes.INTEGER,
    firstObjectId: DataTypes.INTEGER,
    secondObjectId: DataTypes.INTEGER,
  }, {});

  trade.associate = function associate(models) {
    trade.belongsTo(models.publication, {
      foreignKey: 'publicationId',
      target: 'id',
    });
    trade.belongsTo(models.user, {
      foreignKey: 'firstUserId',
      target: 'id',
    });
    trade.belongsTo(models.user, {
      foreignKey: 'secondUserId',
      target: 'id',
    });
    trade.belongsTo(models.product, {
      foreignKey: 'firstObjectId',
      target: 'id',
    });
    trade.belongsTo(models.product, {
      foreignKey: 'secondObjectId',
      target: 'id',
    });
    trade.hasOne(models.review, {
      foreignKey: 'tradeId',
      sourceKey: 'id',
    });
  };

  return trade;
};
