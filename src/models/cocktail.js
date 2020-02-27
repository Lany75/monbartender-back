module.exports = (sequelize, DataTypes) => {
  const Cocktail = sequelize.define(
    "Cocktail",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUIDV4,
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
        field: "verre_id",
        allowNull: false,
        type: DataTypes.UUID
      },
      etapesPreparation: {
        field: "etapes_preparation",
        allowNull: false,
        type: DataTypes.TEXT
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
      through: "cocktailsingredients"
    });
  };

  return Cocktail;
};
