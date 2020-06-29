let chai = require("chai"),
  chaiHttp = require("chai-http");
let expect = chai.expect;
let should = chai.should();
const { Bar, BarIngredient } = require("../src/models");
const existingUnitTestUserBarId = "38925fb2-2267-47c7-b62e-e134e41a51c7";
const existingUnitTestUser = "unit-testing@monbartender.com";
const unknownUnitTestUser = "unit-testing-unknown@monbartender.com";

const quantiteIngredient = [
  {
    ingredientId: "740367a4-dedf-4093-86d1-50eac62b2521",
    quantite: "8",
    unite: "feuilles"
  },
  {
    ingredientId: "c3fd98ec-cad4-49c9-9a74-63ca90489a0a",
    quantite: "5",
    unite: "gr"
  },
  {
    ingredientId: "bd799ef3-d7ae-4975-8be0-8f2397fa2b18",
    quantite: "6",
    unite: "cl"
  },
  {
    ingredientId: "38925fb2-2267-47c7-b62e-e134e41a51c7",
    quantite: "3",
    unite: "cl"
  },
  {
    ingredientId: "ad1d8a81-7ae6-4f5e-83a3-64889d390f8a",
    quantite: null,
    unite: null
  }
];

process.env.NODE_ENV = "test";
chai.use(chaiHttp);

describe("MonBartender ingredient_router", function() {
  var server;

  // START NEW SERVER FOR EACH TEST
  beforeEach(async function() {
    delete require.cache[require.resolve("../src/server")];
    server = require("../src/server");
    await cleanDbBefore();
  });

  async function cleanDbBefore() {
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

    // Create a bar with an ingredient
    await Bar.create({
      id: existingUnitTestUserBarId,
      personneId: existingUnitTestUser,
      droits: true
    });
    await BarIngredient.create({
      barId: existingUnitTestUserBarId,
      ingredientId: "6793d13b-e38c-4183-825b-df2ca8957fca" // Tabasco
    });
  }

  afterEach(async function() {
    await cleanDbAfter();
  });

  async function cleanDbAfter() {
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
  }

  // INGREDIENTS Unit Testing
  describe("/GET /api/v1/ingredients succeed", function() {
    it("it should return 200 with a list of ingredients", function() {
      return chai
        .request(server)
        .get("/api/v1/ingredients")
        .set("Content-Type", "application/json")
        .then(res => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          var array = Array.from(res.body);
          array.forEach(element => {
            element.should.have.property("id");
            element.should.have.property("nom");
          });
        });
    });
  });

  describe("/POST /api/v1/ingredients/:nomNouvelIngredient authorized existing user", function() {
    it("it should add an ingredient to an existing user's bar", function() {
      return chai
        .request(server)
        .post("/api/v1/ingredients/vodka")
        .set("Content-Type", "application/json")
        .set("Authorization", existingUnitTestUser)
        .then(res => {
          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.should.have.property("id");
          res.body.should.have.property("personneId").eql(existingUnitTestUser);
          res.body.should.have.property("droits");
          res.body.should.have.property("Ingredients");
        });
    });
  });

  describe("/POST /api/v1/ingredients/:nomNouvelIngredient authorized unexisting user", function() {
    it("it should return 400 and Aucun bar n'a été trouvé pour l'utilisateur:unit-testing-unknown@monbartender.com", function() {
      return chai
        .request(server)
        .post("/api/v1/ingredients/vodka")
        .set("Content-Type", "application/json")
        .set("Authorization", unknownUnitTestUser)
        .then(res => {
          res.should.have.status(400);
          res.body.should.be.contain(
            `Aucun bar n'a été trouvé pour l'utilisateur:${unknownUnitTestUser}`
          );
        });
    });
  });

  describe("/POST /api/v1/ingredients/:nomNouvelIngredient authorized existing user but ingredient does not exist", function() {
    it("it should return 400 and Aucun ingrédient n'a été trouvé avec le nom:unknownIngredient", function() {
      return chai
        .request(server)
        .post("/api/v1/ingredients/unknownIngredient")
        .set("Content-Type", "application/json")
        .set("Authorization", existingUnitTestUser)
        .then(res => {
          res.should.have.status(400);
          res.text.should.contain(
            "Aucun ingrédient n'a été trouvé avec le nom:unknownIngredient"
          );
        });
    });
  });

  describe("/POST /api/v1/ingredients/:nomNouvelIngredient user is unauthorized", function() {
    it("it should return 401 Non autorisé", function() {
      return chai
        .request(server)
        .post("/api/v1/ingredients/vodka")
        .set("Content-Type", "application/json")
        .then(res => {
          res.should.have.status(401);
          res.text.should.be.contain("Non autorisé");
        });
    });
  });

  describe("/DELETE /api/v1/ingredients/:nomIngredientSupprime authorized existing user", function() {
    it("it should delete an ingredient from an existing user's bar", function() {
      return chai
        .request(server)
        .delete("/api/v1/ingredients/tabasco")
        .set("Content-Type", "application/json")
        .set("Authorization", existingUnitTestUser)
        .then(res => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("id");
          res.body.should.have.property("personneId").eql(existingUnitTestUser);
          res.body.should.have.property("droits");
          res.body.should.have.property("Ingredients").that.is.empty;
        });
    });
  });

  describe("/DELETE /api/v1/ingredients/:nomIngredientSupprime authorized unexisting user", function() {
    it("it should return 400 and Aucun bar n'a été trouvé pour l'utilisateur:unit-testing-unknown@monbartender.com", function() {
      return chai
        .request(server)
        .delete("/api/v1/ingredients/tabasco")
        .set("Content-Type", "application/json")
        .set("Authorization", unknownUnitTestUser)
        .then(res => {
          res.should.have.status(400);
          res.body.should.be.contain(
            `Aucun bar n'a été trouvé pour l'utilisateur:${unknownUnitTestUser}`
          );
        });
    });
  });

  describe("/DELETE /api/v1/ingredients/:nomIngredientSupprime user is unauthorized", function() {
    it("it should return 401 Non autorisé", function() {
      return (
        chai
          .request(server)
          .delete("/api/v1/ingredients/tabasco")
          .set("Content-Type", "application/json")
          //.set("Authorization", unknownUnitTestUser)
          .then(res => {
            res.should.have.status(401);
            res.text.should.be.contain("Non autorisé");
          })
      );
    });
  });

  describe("/DELETE /api/v1/ingredients/:nomIngredientSupprime authorized existing user but ingredient does not exist", function() {
    it("it should return 400 and Aucun ingrédient n'a été trouvé avec le nom:unknownIngredient", function() {
      return chai
        .request(server)
        .delete("/api/v1/ingredients/unknownIngredient")
        .set("Content-Type", "application/json")
        .set("Authorization", existingUnitTestUser)
        .then(res => {
          res.should.have.status(400);
          res.text.should.contain(
            "Aucun ingrédient n'a été trouvé avec le nom:unknownIngredient"
          );
        });
    });
  });

  describe("/GET /api/v1/ingredients/quantite succed, with cocktailId whitch exist", function() {
    it("it should return status code 200 with an array of ingredient and quantity for each", function() {
      return chai
        .request(server)
        .get(
          "/api/v1/ingredients/quantite?cocktailId=7f73cf2f-7ed7-4be4-8640-69dbbc1b2927"
        )
        .set("Content-Type", "application/json")
        .then(res => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          var array = Array.from(res.body);
          array.forEach(element => {
            element.should.have.property("ingredientId");
            element.should.have.property("quantite");
            element.should.have.property("unite");
          });
          res.body.should.be.eql(quantiteIngredient);
        });
    });
  });

  describe("/GET /api/v1/ingredients/quantite, with cocktailId whitch doesn't exist", function() {
    it("it should return status code 404 stating that no cocktail has been found", function() {
      return chai
        .request(server)
        .get(
          "/api/v1/ingredients/quantite?cocktailId=8f73cf2f-7ed7-4be4-9640-79dbbc1b2927"
        )
        .set("Content-Type", "application/json")
        .then(res => {
          res.should.have.status(404);
          res.text.should.be.contain("Aucun cocktail avec cet id n'existe");
        });
    });
  });

  describe("/GET /api/v1/ingredients/quantite, with cocktailId does not match with uuid definition", function() {
    it("it should return status code 404 stating that no resources has been found", function() {
      return chai
        .request(server)
        .get("/api/v1/ingredients/quantite?cocktailId=test")
        .set("Content-Type", "application/json")
        .then(res => {
          res.should.have.status(404);
          res.text.should.be.contain(`test is not an uuid`);
        });
    });
  });
});
