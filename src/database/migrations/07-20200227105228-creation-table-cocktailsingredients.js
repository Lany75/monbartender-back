module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("cocktails_ingredients", {
      cocktailId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        references: {
          model: "cocktails",
          key: "id"
        }
      },
      ingredientId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        references: {
          model: "ingredients",
          key: "id"
        }
      },
      quantite: {
        allowNull: true,
        type: Sequelize.DECIMAL
      },
      unite: {
        allowNull: true,
        type: Sequelize.STRING(50)
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
    return queryInterface.dropTable("cocktails_ingredients");
  }
};
