let chai = require("chai"),
  chaiHttp = require("chai-http");
let expect = chai.expect;
let should = chai.should();

const GlassesList = [
  {
    id: "0ec43307-8523-48c6-8fd9-06be72e484bd",
    nom: "Tumbler"
  },
  {
    id: "c69758d1-b4ad-4038-b157-205fd12d9ace",
    nom: "Verre à cocktail"
  },
  {
    id: "aac971dd-7329-4579-88e7-8ca7a7c0b026",
    nom: "Flute"
  },
  {
    id: "0e5bcbdc-2659-46d1-aa5a-9a6678f448c0",
    nom: "Coupe"
  },
  {
    id: "59a64053-f074-4068-a68a-b6ca1bcc34a0",
    nom: "Verre à Margarita"
  },
  {
    id: "2763d10c-50d3-4029-a3ea-b6c76a1ab9bf",
    nom: "Verre à whisky"
  },
  {
    id: "e375c137-77e9-4682-9d9d-f8b46a7147a6",
    nom: "Verre à shot"
  },
  {
    id: "4caf20ea-b7d4-468d-bdd8-cde6cb8e0623",
    nom: "Verre ballon"
  },
  {
    id: "06dcf3b1-6978-4575-8fe7-e2a35478ce24",
    nom: "Verre à bière"
  },
  {
    id: "351efe5d-c697-4e1a-a47c-ad555a800ed3",
    nom: "Chope"
  }
];

process.env.NODE_ENV = "test";
chai.use(chaiHttp);

describe("MonBarTender verres_router", function() {
  let server;

  // START NEW SERVER FOR EACH TEST
  beforeEach(async function() {
    delete require.cache[require.resolve("../src/server")];
    server = require("../src/server");
  });

  // VERRE Unit Testing

  describe("/GET /api/v1/verres succeed", function() {
    it("it should return status code 200 with a list of glasses", function() {
      return chai
        .request(server)
        .get("/api/v1/verres")
        .set("Content-Type", "application/json")
        .then(res => {
          res.should.have.status(200);
          res.body.should.be.eql(GlassesList);
        });
    });
  });
});
