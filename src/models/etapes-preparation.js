module.exports = (sequelize, DataTypes) => {
  /**
   * @swagger
   * components:
   *   schemas:
   *     EtapesPreparation:
   *       type: object
   *       required:
   *       - id
   *       - createdAt
   *       - updatedAt
   *       properties:
   *         id:
   *           type: string
   *         etape1:
   *           type: text
   *         etape2:
   *           type: text
   *         etape3:
   *           type: text
   *         etape4:
   *           type: text
   *         etape5:
   *           type: text
   *         etape6:
   *           type: text
   *         createdAt:
   *           type: string
   *         updatedAt:
   *           type: string
   */

  const EtapesPreparation = sequelize.define(
    "EtapesPreparation",
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
      etape1: {
        field: "etape_1",
        allowNull: true,
        type: DataTypes.TEXT
      },
      etape2: {
        field: "etape_2",
        allowNull: true,
        type: DataTypes.TEXT
      },
      etape3: {
        field: "etape_3",
        allowNull: true,
        type: DataTypes.TEXT
      },
      etape4: {
        field: "etape_4",
        allowNull: true,
        type: DataTypes.TEXT
      },
      etape5: {
        field: "etape_5",
        allowNull: true,
        type: DataTypes.TEXT
      },
      etape6: {
        field: "etape_6",
        allowNull: true,
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
      tableName: "etapes_preparation"
    }
  );

  return EtapesPreparation;
};
