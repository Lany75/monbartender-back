const chai = require("chai");
const chaiHttp = require("chai-http");
let should = chai.should();

const { Bar, BarIngredient } = require("../src/models");
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
            .eql([{ nom: "sel de celeri" }]);
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
});
