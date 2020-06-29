module.exports = (sequelize, DataTypes) => {
  const barIngredient = sequelize.define(
    "BarIngredient",
    {
      barId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUIDV4,
        defaultValue: DataTypes.UUIDV4,
        references: {
          model: "bars",
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
        type: DataTypes.UUIDV4,
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
      tableName: "bars_ingredients"
    }
  );
  return barIngredient;
};
