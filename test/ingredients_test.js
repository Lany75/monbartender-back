const chai = require("chai");
const chaiHttp = require("chai-http");

const cleanDb = require("../src/utils/test/cleanDb");
const createBarBefore = require("../src/utils/test/createBarBefore");

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

  describe("Quantite ingredient GET", () => {
    it("it should return a list of ingredients with his quantity for cocktail whose id is provided", () => {
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

    it("it should return a message with status code 404 if the cocktail id does not match with uuid definition", () => {
      return chai
        .request(server)
        .get("/api/v1/ingredients/quantite?cocktailId=notUuid")
        .set("Content-Type", "application/json")
        .then(res => {
          res.should.have.status(404);
          res.text.should.be.contain(`notUuid n'est pas un uuid`);
        });
    });

    it("it should return a message with status code 400 if the cocktail id is not defined", () => {
      return chai
        .request(server)
        .get("/api/v1/ingredients/quantite")
        .set("Content-Type", "application/json")
        .then(res => {
          res.should.have.status(400);
          res.text.should.be.contain(`L'id du cocktail n'est pas définie`);
        });
    });

    it("it should return a message with status code 404 if cocktail with id provided does not exist", () => {
      return chai
        .request(server)
        .get(
          "/api/v1/ingredients/quantite?cocktailId=1a23bc4d-7ed7-4be4-9640-79dbbc1b2927"
        )
        .set("Content-Type", "application/json")
        .then(res => {
          res.should.have.status(404);
          res.text.should.be.contain("Aucun cocktail avec cet id n'existe");
        });
    });
  });
});
