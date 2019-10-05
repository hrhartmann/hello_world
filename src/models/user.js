const bcrypt = require('bcrypt');

const PASSWORD_SALT = 10;

async function buildPasswordHash(instance) {
  if (instance.changed('password')) {
    const hash = await bcrypt.hash(instance.password, PASSWORD_SALT);
    instance.set('password', hash);
  }
}

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    name: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    adress: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    category: DataTypes.STRING,
    reputation: DataTypes.FLOAT,
  }, {});

  user.associate = function associate(models) {
    user.hasMany(models.publication, {
      foreignKey: 'userId',
      sourceKey: 'id',
    });
    user.hasMany(models.comment, {
      foreignKey: 'userId',
      sourceKey: 'id',
    });
    user.hasMany(models.message, {
      foreignKey: 'senderUserId',
      sourceKey: 'id',
    });
    user.hasMany(models.message, {
      foreignKey: 'receiverUserId',
      sourceKey: 'id',
    });
    user.hasMany(models.product, {
      foreignKey: 'userId',
      sourceKey: 'id',
    });
    user.hasMany(models.trade, {
      foreignKey: 'firstUserId',
      sourceKey: 'id',
    });
    user.hasMany(models.trade, {
      foreignKey: 'secondUserId',
      sourceKey: 'id',
    });
  };

  user.beforeUpdate(buildPasswordHash);
  user.beforeCreate(buildPasswordHash);

  user.prototype.checkPassword = function checkPassword(password) {
    return bcrypt.compare(password, this.password);
  };

  return user;
};
