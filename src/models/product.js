module.exports = (sequelize, DataTypes) => {
  const product = sequelize.define('product', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    status: DataTypes.STRING,
    exchangePrice: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER,
  }, {});

  product.associate = function associate(models) {
    product.belongsTo(models.user, {
      foreignKey: 'userId',
      target: 'id',
    });
    product.belongsTo(models.category, {
      foreignKey: 'categoryId',
      target: 'id',
    });
    product.hasOne(models.trade, {
      foreignKey: 'firstObjectId',
      target: 'id',
    });
    product.hasOne(models.trade, {
      foreignKey: 'secondObjectId',
      target: 'id',
    });
    product.hasOne(models.publication, {
      foreignKey: 'productId',
      sourceKey: 'id',
    });
  };

  return product;
};
