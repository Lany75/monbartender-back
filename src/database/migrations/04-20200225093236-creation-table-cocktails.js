module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("cocktails", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      nom: {
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      photo: {
        allowNull: false,
        type: Sequelize.STRING(150)
      },
      verreId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "verres",
          key: "id"
        }
      },
      alcool: {
        allowNull: false,
        type: Sequelize.BOOLEAN
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
    return queryInterface.dropTable("cocktails");
  }
};
