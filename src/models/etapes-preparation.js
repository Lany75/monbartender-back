module.exports = (sequelize, DataTypes) => {
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
