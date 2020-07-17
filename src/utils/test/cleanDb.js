const { Bar, BarIngredient } = require("../../models");

const existingUnitTestUserBarId = "38925fb2-2267-47c7-b62e-e134e41a51c7";
const unknownUnitTestUser = "unit-testing-unknown@monbartender.com";

const cleanDb = async () => {
  // Clean BAR Unknown User
  var bar = await Bar.findOne({
    where: { personneId: unknownUnitTestUser },
    attributes: ["id"]
  });

  if (bar) {
    await BarIngredient.destroy({
      where: { barId: bar.id }
    });
    await Bar.destroy({
      where: { id: bar.id }
    });
  }

  // Clean BAR Known User
  await BarIngredient.destroy({
    where: { barId: existingUnitTestUserBarId }
  });
  await Bar.destroy({
    where: { id: existingUnitTestUserBarId }
  });
};

module.exports = cleanDb;
