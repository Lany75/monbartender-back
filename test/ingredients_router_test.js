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

  
});
