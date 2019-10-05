module.exports = (sequelize, DataTypes) => {
  const comment = sequelize.define('comment', {
    content: DataTypes.TEXT,
    userId: DataTypes.INTEGER,
    publicationId: DataTypes.INTEGER,
  }, {});

  comment.associate = function associate(models) {
    comment.belongsTo(models.user, {
      foreignKey: 'userId',
      target: 'id',
    });
    comment.belongsTo(models.publication, {
      foreignKey: 'publicationId',
      target: 'publicationId',
    });
  };

  return comment;
};
