module.exports = (sequelize, DataTypes) => {
  const cocktailEtape = sequelize.define(
    "CocktailEtape",
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
      etapeId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        references: {
          model: "etapes_preparation",
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
      tableName: "cocktails_etapes"
    }
  );

  return cocktailEtape;
};
