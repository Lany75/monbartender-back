module.exports = (sequelize, DataTypes) => {
  /**
   * @swagger
   * components:
   *   schemas:
   *     CocktailIngredient:
   *       type: object
   *       required:
   *       - cocktailId
   *       - ingredientId
   *       - quantite
   *       - unite
   *       - createdAt
   *       - updatedAt
   *       properties:
   *         cocktailId:
   *           type: string
   *         ingredientId:
   *           type: string
   *         quantite:
   *           type: float
   *         unite:
   *           type: string
   *         createdAt:
   *           type: string
   *         updatedAt:
   *           type: string
   */
  const CocktailIngredient = sequelize.define(
    "CocktailIngredient",
    {
      cocktailId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        references: {
          model: "cocktails",
          key: "id"
        },
        validate: {
          isUUID: 4,
          notNull: true
        }
      },
      ingredientId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        references: {
          model: "ingredients",
          key: "id"
        },
        validate: {
          isUUID: 4,
          notNull: true
        }
      },
      quantite: {
        allowNull: true,
        type: DataTypes.DECIMAL
      },
      unite: {
        allowNull: true,
        type: DataTypes.STRING,
        validate: {
          len: [1, 30]
        }
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
      tableName: "cocktails_ingredients"
    }
  );

  return CocktailIngredient;
};
