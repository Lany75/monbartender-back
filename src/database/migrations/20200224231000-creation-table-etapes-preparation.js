module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("etapes_preparation", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      etape_1: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      etape_2: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      etape_3: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      etape_4: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      etape_5: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      etape_6: {
        allowNull: true,
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
    return queryInterface.dropTable("etapes_preparation");
  }
};
