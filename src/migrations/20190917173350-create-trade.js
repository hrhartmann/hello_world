module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('trades', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },

    shippingCost: {
      type: Sequelize.INTEGER,
    },
    state: {
      type: Sequelize.STRING,
    },
    firstUserId: {
      type: Sequelize.INTEGER,
    },
    secondUserId: {
      type: Sequelize.INTEGER,
    },
    type: {
      type: Sequelize.STRING,
    },
    publicationId: {
      type: Sequelize.INTEGER,
    },
    firstObjectId: {
      type: Sequelize.INTEGER,
    },
    secondObjectId: {
      type: Sequelize.INTEGER,
    },

    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),

  down: (queryInterface) => queryInterface.dropTable('trades'),
};
