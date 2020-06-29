module.exports = (sequelize, DataTypes) => {
  /**
   * @swagger
   * components:
   *   schemas:
   *     Verre:
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

  const Verre = sequelize.define(
    "Verre",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
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
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        validate: {
          isDate: true,
          notNull: true
        }
      },
      updateAt: {
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
      tableName: "verres"
    }
  );

  Verre.associate = models => {
    Verre.hasMany(models.Cocktail);
  };
  return Verre;
};
