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
        allowNull: true,
        type: Sequelize.STRING(150)
      },
      note: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      verres_id: {
        allowNull: true,
        type: Sequelize.UUID,
        references: {
          model: "verres",
          key: "id"
        }
      },
      etapes_preparation: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
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
