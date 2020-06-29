module.exports = (sequelize, DataTypes) => {
  /**
   * @swagger
   * components:
   *   schemas:
   *     Cocktail:
   *       type: object
   *       required:
   *       - id
   *       - nom
   *       - verreId
   *       - createdAt
   *       - updatedAt
   *       properties:
   *         id:
   *           type: string
   *         nom:
   *           type: string
   *         photo:
   *           type: string
   *         note:
   *           type: integer
   *         verreId:
   *           type: string
   *         createdAt:
   *           type: string
   *         updatedAt:
   *           type: string
   */

  const Cocktail = sequelize.define(
    "Cocktail",
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
      nom: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          notNull: true,
          len: [2, 50]
        }
      },
      photo: {
        allowNull: true,
        type: DataTypes.STRING,
        validate: {
          len: [0, 150]
        }
      },
      note: {
        allowNull: true,
        type: DataTypes.INTEGER
      },
      verreId: {
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
      tableName: "cocktails"
    }
  );

  Cocktail.associate = models => {
    Cocktail.belongsTo(models.Verre, {
      onDelete: "CASCADE",
      foreignKey: {
        name: "verreId",
        allowNull: false
      }
    });
    Cocktail.belongsToMany(models.Ingredient, {
      through: "cocktails_ingredients",
      foreignKey: "cocktailId"
    });
    Cocktail.belongsToMany(models.EtapesPreparation, {
      through: "cocktails_etapes",
      foreignKey: "cocktailId"
    });
  };

  return Cocktail;
};
