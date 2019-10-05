module.exports = (sequelize, DataTypes) => {
  const message = sequelize.define('message', {
    content: DataTypes.TEXT,
    senderUserId: DataTypes.INTEGER,
    receiverUserId: DataTypes.INTEGER,
  }, {});

  message.associate = function associate(models) {
    message.belongsTo(models.user, {
      foreignKey: 'senderUserId',
      target: 'id',
    });
    message.belongsTo(models.user, {
      foreignKey: 'receiverUserId',
      target: 'id',
    });
  };

  return message;
};
