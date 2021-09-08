module.exports = (sequelize, DataTypes) => {
  /**
   * @swagger
   * components:
   *   schemas:
   *     EtapesPreparation:
   *       type: object
   *       required:
   *       - id
   *       - numEtape
   *       - texte
   *       - createdAt
   *       - updatedAt
   *       properties:
   *         id:
   *           type: string
   *         numEtape:
   *           type: integer
   *         texte:
   *           type: text
   *         createdAt:
   *           type: string
   *         updatedAt:
   *           type: string
   */

  const EtapesPreparation = sequelize.define(
    "EtapesPreparation",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUIDV4,
        defaultValue: DataTypes.UUIDV4,
        validate: {
          isUUID: 4,
          notNull: true
        }
      },
      numEtape: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      texte: {
        allowNull: false,
        type: DataTypes.TEXT
      },
      cocktailId: {
        allowNull: false,
        type: DataTypes.UUID
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        validate: {
          isDate: true,
          notNull: true
        }
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        validate: {
          isDate: true,
          notNull: true
        }
      }
    },
    {
      tableName: "etapes_preparation"
    }
  );

  EtapesPreparation.associate = models => {
    EtapesPreparation.belongsTo(models.Cocktail, {
      foreignKey: {
        name: "cocktailId",
        allowNull: false
      }
    });
  };

  return EtapesPreparation;
};
