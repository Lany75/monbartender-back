module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("ingredients", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      nom: {
        allowNull: false,
        type: Sequelize.STRING(30)
      },
      categorieId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "categories_ingredients",
          key: "id"
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("ingredients");
  }
};
