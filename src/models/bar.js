module.exports = (sequelize, DataTypes) => {
  /**
   * @swagger
   * components:
   *   schemas:
   *     Bar:
   *       type: object
   *       required:
   *       - id
   *       - personneId
   *       - droits
   *       - createdAt
   *       - updatedAt
   *       properties:
   *         id:
   *           type: string
   *         personneId:
   *           type: string
   *         droits:
   *           type: boolean
   *         createdAt:
   *           type: string
   *         updatedAt:
   *           type: string
   */
  const Bar = sequelize.define(
    "Bar",
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
      personneId: {
        field: "personne_id",
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          notNull: true,
          len: [2, 50]
        }
      },
      droits: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        validate: {
          notNull: true
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
      tableName: "bars"
    }
  );

  Bar.associate = models => {
    Bar.belongsToMany(models.Ingredient, {
      through: "bars_ingredients",
      foreignKey: "bar_id"
    });
  };

  return Bar;
};
