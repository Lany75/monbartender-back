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
   *       - alcool
   *       - createdAt
   *       - updatedAt
   *       properties:
   *         id:
   *           type: string
   *         nom:
   *           type: string
   *         verreId:
   *           type: string
   *         alcool:
   *           type: boolean
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
      verreId: {
        allowNull: false,
        type: DataTypes.UUID
      },
      alcool: {
        allowNull: false,
        type: DataTypes.BOOLEAN
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
      foreignKey: {
        name: "verreId",
        allowNull: false
      }
    });
    Cocktail.belongsToMany(models.Ingredient, {
      through: "cocktails_ingredients",
      foreignKey: "cocktailId"
    });
    Cocktail.hasMany(models.EtapesPreparation, {
      foreignKey: {
        name: "cocktailId",
        allowNull: false
      }
    });
  };

  return Cocktail;
};
