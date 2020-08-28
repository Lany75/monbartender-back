const chai = require("chai");
const chaiHttp = require("chai-http");
let should = chai.should();

const cleanDb = require("../src/utils/test/cleanDb");
const createBarBefore = require("../src/utils/test/createBarBefore");

const existingUnitTestUser = "unit-testing@monbartender.com";
const unknownUnitTestUser = "unit-testing-unknown@monbartender.com";

process.env.NODE_ENV = "test";
chai.use(chaiHttp);

describe("MonBartender bars_router", () => {
  let server;

  // START NEW SERVER FOR EACH TEST
  beforeEach(async () => {
    delete require.cache[require.resolve("../src/server")];
    server = require("../src/server");
    await cleanDb();
    await createBarBefore();
  });

  afterEach(async () => {
    await cleanDb();
  });

  describe("Bars GET", () => {
    it("it should return a bar with status code 200 if user exist", () => {
      return chai
        .request(server)
        .get("/api/v1/bars")
        .set("Content-Type", "application/json")
        .set("Authorization", existingUnitTestUser)
        .then(res => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("id");
          res.body.should.have.property("personneId").eql(existingUnitTestUser);
          res.body.should.have.property("droits");
          res.body.should.have
            .property("Ingredients")
            .eql([{ nom: "Sel De Celeri" }]);
        });
    });

    it("should return a bar with status code 200 after creating it if user doesn't exist", () => {
      return chai
        .request(server)
        .get("/api/v1/bars")
        .set("Content-Type", "application/json")
        .set("Authorization", unknownUnitTestUser)
        .then(res => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("id");
          res.body.should.have.property("personneId").eql(unknownUnitTestUser);
          res.body.should.have.property("droits");
        });
    });

    it("should return an error message with status code 401 if unauthorized access", () => {
      return chai
        .request(server)
        .get("/api/v1/bars")
        .set("Content-Type", "application/json")
        .then(res => {
          res.should.have.status(401);
          res.text.should.be.contain("Non autorisé");
        });
    });
  });

  describe("ingredient in bar POST", () => {
    it("it should return user's bar after adding ingredient provided with status code 201 if everything is ok", () => {
      return chai
        .request(server)
        .post("/api/v1/bars/Vodka")
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
        .post("/api/v1/bars/Vodka")
        .set("Content-Type", "application/json")
        .then(res => {
          res.should.have.status(401);
          res.text.should.be.contain("Non autorisé");
        });
    });

    it("it should return a message with status code 404 if ingredient doesn't exist in database", () => {
      return chai
        .request(server)
        .post("/api/v1/bars/unknownIngredient")
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
        .delete("/api/v1/bars/Sel%20De%20Celeri")
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
        .delete("/api/v1/bars/Sel%20De%20Celeri")
        .set("Content-Type", "application/json")
        .then(res => {
          res.should.have.status(401);
          res.text.should.be.contain("Non autorisé");
        });
    });

    it("it should return a message with status code 404 if user's bar doesn't exist", () => {
      return chai
        .request(server)
        .delete("/api/v1/bars/Sel%20De%20Celeri")
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
        .delete("/api/v1/bars/unknownIngredient")
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
