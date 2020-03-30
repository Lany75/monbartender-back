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
      note: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      verre_id: {
        allowNull: false,
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
      etapes_preparation_id: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "etapes_preparation",
          key: "id"
        }
      },
      /*personne_id: {
        allowNull: true,
        type: Sequelize.STRING(50),
        references: {
          model: "personnes",
          key: "id"
        }
      },*/
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
