module.exports = (sequelize, DataTypes) => {
  /**
   * @swagger
   * components:
   *   schemas:
   *     Ingredient:
   *       type: object
   *       required:
   *       - id
   *       - nom
   *       - createdAt
   *       - updatedAt
   *       properties:
   *         id:
   *           type: string
   *         nom:
   *           type: string
   *         createdAt:
   *           type: string
   *         updatedAt:
   *           type: string
   */
  const Ingredient = sequelize.define(
    "Ingredient",
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
          len: [2, 30]
        }
      },
      createdAt: {
        field: "created_at",
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        validate: {
          isDate: true,
          notNull: true
        }
      },
      updatedAt: {
        field: "updated_at",
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
      tableName: "ingredients"
    }
  );

  Ingredient.associate = models => {
    Ingredient.belongsToMany(models.Cocktail, {
      through: "cocktails_ingredients",
      foreignKey: "ingredient_id"
    });
    Ingredient.belongsToMany(models.Bar, {
      through: "bars_ingredients",
      foreignKey: "ingredient_id"
    });
  };

  return Ingredient;
};
