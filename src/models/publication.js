module.exports = (sequelize, DataTypes) => {
  const publication = sequelize.define('publication', {
    title: DataTypes.STRING,
    image: DataTypes.BLOB,
    description: DataTypes.TEXT,
    userId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
  }, {});

  publication.associate = function associate(models) {
    publication.belongsTo(models.user, {
      foreignKey: 'userId',
      target: 'id',
    });
    publication.hasMany(models.comment, {
      foreignKey: 'publicationId',
      sourceKey: 'id',
    });
    publication.belongsTo(models.product, {
      foreingKey: 'productId',
      target: 'id',
    });
  };

  return publication;
};
