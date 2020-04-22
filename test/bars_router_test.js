let chai = require("chai"),
  chaiHttp = require("chai-http");
let expect = chai.expect;
let should = chai.should();
const { Bar, BarIngredient } = require("../src/models");
const existingUnitTestUserBarId = "38925fb2-2267-47c7-b62e-e134e41a51c7";
const existingUnitTestUser = "unit-testing@monbartender.com";
const unknownUnitTestUser = "unit-testing-unknown@monbartender.com";

process.env.NODE_ENV = "test";
chai.use(chaiHttp);

describe("MonBartender", function() {
  var server;

  // START NEW SERVER FOR EACH TEST
  beforeEach(async function() {
    delete require.cache[require.resolve("../src/server")];
    server = require("../src/server");
    await cleanDb();
  });

  async function cleanDb() {
    // Clean BAR Unknown User
    var bar = await Bar.findOne({
      where: { personne_id: unknownUnitTestUser },
      attributes: ["id"]
    });

    if (bar) {
      await BarIngredient.destroy({
        where: { bar_id: bar.id }
      });
      await Bar.destroy({
        where: { id: bar.id }
      });
    }

    // Clean BAR Known User
    await BarIngredient.destroy({
      where: { bar_id: existingUnitTestUserBarId }
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
      ingredientId: "b233195d-a090-4b96-a76d-f016c842c472" // JUS DE CITRON
    });
  }

  afterEach(async function() {
    await cleanDb();
  });

  // BAR Unit Testing
  describe("/GET /api/v1/bars authorized existing user", function() {
    it("it should GET an existing user's bar", function() {
      return chai
        .request(server)
        .get("/api/v1/bars")
        .set("Content-Type", "application/json")
        .set("Authorization", existingUnitTestUser)
        .then(res => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("id");
          res.body.should.have
            .property("personne_id")
            .eql(existingUnitTestUser);
          res.body.should.have.property("Ingredients");
        });
    });
  });
  describe("/GET /api/v1/bars authorized unexisting user", function() {
    it("it should GET an existing user's bar", function() {
      return chai
        .request(server)
        .get("/api/v1/bars")
        .set("Content-Type", "application/json")
        .set("Authorization", unknownUnitTestUser)
        .then(res => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("id");
          res.body.should.have.property("personne_id").eql(unknownUnitTestUser);
          res.body.should.have.property("Ingredients");
        });
    });
  });
  describe("/GET /api/v1/bars unauthorized", function() {
    it("it should return 401 Non autorisé", function() {
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
