module.exports = (sequelize, DataType) => {
  const Ingredient = sequelize.define(
    "Ingredient",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataType.UUIDV4,
        validate: {
          isUUID: 4,
          notNull: true
        }
      },
      nom: {
        allowNull: false,
        type: DataType.STRING,
        validate: {
          notNull: true,
          len: [2, 30]
        }
      },
      createdAt: {
        field: "created_at",
        allowNull: false,
        type: DataType.DATE,
        defaultValue: DataType.NOW,
        validate: {
          isDate: true,
          notNull: true
        }
      },
      updatedAt: {
        field: "updated_at",
        allowNull: false,
        type: DataType.DATE,
        defaultValue: DataType.NOW,
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
      through: "cocktailsingredients"
    });
  };

  return Ingredient;
};
