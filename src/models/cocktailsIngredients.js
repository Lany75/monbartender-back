module.exports = (sequelize, DataTypes) => {
  const cocktailIngredient = sequelize.define(
    "CocktailIngredient",
    {
      cocktailId: {
        field: "cocktail_id",
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
        field: "ingredient_id",
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
      createdAt: {
        field: "createdAt",
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        validate: {
          isDate: true,
          notNull: true
        }
      },
      updatedAt: {
        field: "updatedAt",
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

  return cocktailIngredient;
};
