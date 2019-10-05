module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('publications', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },

    title: {
      type: Sequelize.STRING,
    },
    image: {
      type: Sequelize.BLOB,
    },
    description: {
      type: Sequelize.TEXT,
    },
    userId: {
      type: Sequelize.INTEGER,
    },
    productId: {
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

  down: (queryInterface) => queryInterface.dropTable('publications'),
};
