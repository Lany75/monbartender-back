const chai = require("chai");
const chaiHttp = require("chai-http");

const existingUnitTestUser = "unit-testing@monbartender.com";
const unknownUnitTestUser = "unit-testing-unknown@monbartender.com";

const cocktailsList = [
  {
    id: "b258592b-57ac-4bda-8e07-1d2697f20770",
    nom: "Bloody Mary",
    photo: "img_cocktail/bloodyMary.jpg",
    verreId: "0ec43307-8523-48c6-8fd9-06be72e484bd",
    alcool: true
  },
  {
    id: "7e124810-e9a7-4724-ad48-c6a24bfaa1a5",
    nom: "Margarita",
    photo: "img_cocktail/margarita.jpg",
    verreId: "c69758d1-b4ad-4038-b157-205fd12d9ace",
    alcool: true
  },
  {
    id: "7f73cf2f-7ed7-4be4-8640-69dbbc1b2927",
    nom: "Mojito",
    photo: "img_cocktail/mojito.jpg",
    verreId: "0ec43307-8523-48c6-8fd9-06be72e484bd",
    alcool: true
  },
  {
    id: "f3714a47-8359-4552-850c-277b3b56fdd0",
    nom: "Virgin Mojito",
    photo: "img_cocktail/virgin-mojito.jpg",
    verreId: "0ec43307-8523-48c6-8fd9-06be72e484bd",
    alcool: false
  }
];

process.env.NODE_ENV = "test";
chai.use(chaiHttp);

describe("MonBartender cocktails_router", function() {
  let server;

  // START NEW SERVER FOR EACH TEST
  beforeEach(async function() {
    delete require.cache[require.resolve("../src/server")];
    server = require("../src/server");
  });
  afterEach(async function() {
    //
  });

  describe("Cocktails GET", function() {
    it("it should return a list of cocktails with status code 200 if everything is OK", function() {
      return chai
        .request(server)
        .get("/api/v1/cocktails?alcool=indifferent")
        .set("Content-Type", "application/json")
        .then(res => {
          res.should.have.status(200);
          res.body.should.be.eql(cocktailsList);
        });
    });

    it("it should return an error message with status code 400 if alcool variable is not defined", function() {
      return chai
        .request(server)
        .get("/api/v1/cocktails")
        .set("Content-Type", "application/json")
        .then(res => {
          res.should.have.status(400);
          res.text.should.be.contain("La variable alcool n'est pas définie");
        });
    });

    it("it should return an error message with status code 400 if alcool variable is not true, false or indifferent", function() {
      return chai
        .request(server)
        .get("/api/v1/cocktails?alcool=toto")
        .set("Content-Type", "application/json")
        .then(res => {
          res.should.have.status(400);
          res.text.should.be.contain(
            "La valeur de la variable alcool n'est pas celle attendue"
          );
        });
    });
  });

  describe("Cocktails of the day GET", function() {
    it("it should return a list of cocktails of the day with status code 200 if everything is OK", function() {
      return chai
        .request(server)
        .get("/api/v1/cocktails/cocktail-du-moment")
        .set("Content-Type", "application/json")
        .then(res => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          var array = Array.from(res.body);
          array.forEach(element => {
            element.should.have.property("id");
            element.should.have.property("nom");
            element.should.have.property("photo");
          });
        });
    });
  });

  describe("Random Cocktail GET", function() {
    it("it should return a random cocktail with status code 200 if everything is OK", function() {
      return chai
        .request(server)
        .get("/api/v1/cocktails/aleatoire")
        .set("Content-Type", "application/json")
        .then(res => {
          res.should.have.status(200);
          res.body.should.have.property("id");
          res.body.should.have.property("nom");
          res.body.should.have.property("photo");
        });
    });
  });
});
