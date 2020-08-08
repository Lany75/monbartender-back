const chai = require("chai");
const chaiHttp = require("chai-http");
let should = chai.should();

const cleanDb = require("../src/utils/test/cleanDb");
const createBarBefore = require("../src/utils/test/createBarBefore");

const existingUnitTestUserBarId = "38925fb2-2267-47c7-b62e-e134e41a51c7";
const existingUnitTestUser = "unit-testing@monbartender.com";
const unknownUnitTestUser = "unit-testing-unknown@monbartender.com";

process.env.NODE_ENV = "test";
chai.use(chaiHttp);

describe("MonBartender ingredient_router", () => {
  let server;

  // START NEW SERVER FOR EACH TEST
  beforeEach(async function() {
    delete require.cache[require.resolve("../src/server")];
    server = require("../src/server");
    await cleanDb();
    await createBarBefore();
  });

  afterEach(async function() {
    await cleanDb();
  });

  describe("Ingredients GET", () => {
    it("it should return a list of ingredients with status code 200 if everything is ok", () => {
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

  describe("ingredient in bar POST", () => {
    it("it should return user's bar after adding ingredient provided with status code 201 if everything is ok", () => {
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

    it("it should return a message with status code 401 if unauthorized access", () => {
      return chai
        .request(server)
        .post("/api/v1/ingredients/vodka")
        .set("Content-Type", "application/json")
        .then(res => {
          res.should.have.status(401);
          res.text.should.be.contain("Non autorisé");
        });
    });

    it("it should return a message with status code 404 if ingredient doesn't exist in database", () => {
      return chai
        .request(server)
        .post("/api/v1/ingredients/unknownIngredient")
        .set("Content-Type", "application/json")
        .set("Authorization", existingUnitTestUser)
        .then(res => {
          res.should.have.status(404);
          res.text.should.contain(
            "Aucun ingrédient n'a été trouvé avec le nom : unknownIngredient"
          );
        });
    });
  });

  describe("ingredient in bar DELETE", () => {
    it("it should return user's bar after deleting ingredient provided with status code 200 if everything is ok", () => {
      return chai
        .request(server)
        .delete("/api/v1/ingredients/sel%20de%20celeri")
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

    it("it should return a message with status code 401 if unauthorized access", () => {
      return chai
        .request(server)
        .delete("/api/v1/ingredients/sel%20de%20celeri")
        .set("Content-Type", "application/json")
        .then(res => {
          res.should.have.status(401);
          res.text.should.be.contain("Non autorisé");
        });
    });

    it("it should return a message with status code 404 if user's bar doesn't exist", () => {
      return chai
        .request(server)
        .delete("/api/v1/ingredients/sel%20de%20celeri")
        .set("Content-Type", "application/json")
        .set("Authorization", unknownUnitTestUser)
        .then(res => {
          res.should.have.status(404);
          res.text.should.be.contain(
            `Aucun bar n'a été trouvé pour l'utilisateur : ${unknownUnitTestUser}`
          );
        });
    });

    it("it should return a message with status code 404 if ingredient doesn't exist in database", () => {
      return chai
        .request(server)
        .delete("/api/v1/ingredients/unknownIngredient")
        .set("Content-Type", "application/json")
        .set("Authorization", existingUnitTestUser)
        .then(res => {
          res.should.have.status(404);
          res.text.should.contain(
            "ingredient unknownIngredient inexistant dans la base de données"
          );
        });
    });
  });
});
