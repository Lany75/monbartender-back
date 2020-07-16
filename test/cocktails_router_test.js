const chai = require("chai");
const chaiHttp = require("chai-http");

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

const ingredientsMojito = [
  {
    id: "740367a4-dedf-4093-86d1-50eac62b2521",
    nom: "menthe"
  },
  {
    id: "c3fd98ec-cad4-49c9-9a74-63ca90489a0a",
    nom: "sucre"
  },
  {
    id: "bd799ef3-d7ae-4975-8be0-8f2397fa2b18",
    nom: "rhum"
  },
  {
    id: "38925fb2-2267-47c7-b62e-e134e41a51c7",
    nom: "jus de citron vert"
  },
  {
    id: "ad1d8a81-7ae6-4f5e-83a3-64889d390f8a",
    nom: "eau gazeuse"
  }
];

const etapesPreparationMojito = [
  {
    id: "e132fd2a-56b7-4a13-91ad-d4883a970baf",
    numEtape: 1,
    texte: 'Recette réalisée directement dans un verre de type "Tumbler".'
  },
  {
    id: "aa00ab00-02de-44af-b5ab-cf808d18e82f",
    numEtape: 2,
    texte:
      "Placer les feuilles de menthe dans le verre, ajouter le sucre et le citron coupé en morceau. Piler l'ensemble."
  },
  {
    id: "ec0cfbb1-5911-46c1-a479-84fce3c62ddc",
    numEtape: 3,
    texte: "Ajouter les glacons pilés, puis le rhum à hauteur des glacons."
  },
  {
    id: "4528e3ec-be76-4202-ac1e-585a08f67dad",
    numEtape: 4,
    texte: "Compléter avec de l'eau gazeuse."
  },
  {
    id: "9bec4f6b-3516-4991-a888-540f3272694f",
    numEtape: 5,
    texte: "Décorer d'une feuille de menthe et servir avec une paille."
  }
];

process.env.NODE_ENV = "test";
chai.use(chaiHttp);

describe("MonBartender cocktails_router", () => {
  let server;

  // START NEW SERVER FOR EACH TEST
  beforeEach(async function() {
    delete require.cache[require.resolve("../src/server")];
    server = require("../src/server");
  });

  describe("Cocktails GET", () => {
    it("it should return a list of cocktails with status code 200 if everything is OK", () => {
      return chai
        .request(server)
        .get("/api/v1/cocktails?alcool=indifferent")
        .set("Content-Type", "application/json")
        .then(res => {
          res.should.have.status(200);
          res.body.should.be.eql(cocktailsList);
        });
    });

    it("it should return an error message with status code 400 if alcool variable is not defined", () => {
      return chai
        .request(server)
        .get("/api/v1/cocktails")
        .set("Content-Type", "application/json")
        .then(res => {
          res.should.have.status(400);
          res.text.should.be.contain("La variable alcool n'est pas définie");
        });
    });

    it("it should return an error message with status code 400 if alcool variable is not true, false or indifferent", () => {
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

  describe("Cocktails of the day GET", () => {
    it("it should return a list of cocktails of the day with status code 200 if everything is OK", () => {
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

  describe("Random Cocktail GET", () => {
    it("it should return a random cocktail with status code 200 if everything is OK", () => {
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

  describe("Recherche par nom GET", () => {
    it("it should return a list of cocktails whith status code 200 if the name match with the one provided", () => {
      return chai
        .request(server)
        .get("/api/v1/cocktails/rechercher-par-nom?nom=mojito")
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

    it("it should return an empty array with status code 200 if no cocktails match with the one provided", () => {
      return chai
        .request(server)
        .get("/api/v1/cocktails/rechercher-par-nom?nom=unknown")
        .set("Content-Type", "application/json")
        .then(res => {
          res.should.have.status(200);
          res.body.should.be.an("array").that.is.empty;
        });
    });

    it("it should return an error message with status code 400 if the name is not defined", () => {
      return chai
        .request(server)
        .get("/api/v1/cocktails/rechercher-par-nom")
        .set("Content-Type", "application/json")
        .then(res => {
          res.should.have.status(400);
          res.text.should.be.contain("Un nom de cocktail est obligatoire");
        });
    });
  });

  describe("Recherche par ingredients GET", () => {
    it("it should return a list of cocktails with status code 200 if one of ingredients provided is include", () => {
      return chai
        .request(server)
        .get(
          "/api/v1/cocktails/rechercher-par-ingredient?ingredient1=tabasco&alcool=indifferent"
        )
        .set("Content-Type", "application/json")
        .then(res => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.should.be.eql([
            {
              id: "b258592b-57ac-4bda-8e07-1d2697f20770",
              nom: "Bloody Mary",
              photo: "img_cocktail/bloodyMary.jpg"
            }
          ]);
        });
    });

    it("it should return an empty array with status code 200 if all ingredients are undefined", () => {
      return chai
        .request(server)
        .get("/api/v1/cocktails/rechercher-par-ingredient?alcool=true")
        .set("Content-Type", "application/json")
        .then(res => {
          res.should.have.status(200);
          res.body.should.be.an("array").that.is.empty;
        });
    });

    it("it should return an error message with status code 400 if alcool variable is not defined", () => {
      return chai
        .request(server)
        .get("/api/v1/cocktails/rechercher-par-ingredient?ingredient1=tabasco")
        .set("Content-Type", "application/json")
        .then(res => {
          res.should.have.status(400);
          res.text.should.be.contain("La variable alcool n'est pas définie");
        });
    });

    it("it should return an empty array with status code 200 if ingredients doesn't exist in the database", () => {
      return chai
        .request(server)
        .get(
          "/api/v1/cocktails/rechercher-par-ingredient?ingredient1=tomate&alcool=false"
        )
        .set("Content-Type", "application/json")
        .then(res => {
          res.should.have.status(200);
          res.body.should.be.an("array").that.is.empty;
        });
    });
  });

  describe("Specified cocktail recipe GET", () => {
    it("it should return a cocktail recipe with status code 200 if the id match with the one provided", () => {
      return chai
        .request(server)
        .get("/api/v1/cocktails/7f73cf2f-7ed7-4be4-8640-69dbbc1b2927")
        .set("Content-Type", "application/json")
        .then(res => {
          res.should.have.status(200);
          res.body.should.have
            .property("id")
            .eql("7f73cf2f-7ed7-4be4-8640-69dbbc1b2927");
          res.body.should.have.property("nom").eql("Mojito");
          res.body.should.have.property("photo").eql("img_cocktail/mojito.jpg");
          res.body.should.have.property("Verre").eql({
            id: "0ec43307-8523-48c6-8fd9-06be72e484bd",
            nom: "Tumbler"
          });
          res.body.should.have.property("Ingredients").eql(ingredientsMojito);
          res.body.should.have
            .property("EtapesPreparations")
            .eql(etapesPreparationMojito);
        });
    });

    it("it should return an empty array with status code 200 if no cocktails match with the id provided", () => {
      return chai
        .request(server)
        .get("/api/v1/cocktails/1f23cf4f-1ed2-1be2-1234-12dbbc3b4567")
        .set("Content-Type", "application/json")
        .then(res => {
          res.should.have.status(200);
          res.body.should.be.an("array").that.is.empty;
        });
    });

    it("it should return a message with status code 404 if the id does not match uuid definition", () => {
      return chai
        .request(server)
        .get("/api/v1/cocktails/test")
        .set("Content-Type", "application/json")
        .then(res => {
          res.should.have.status(404);
        });
    });
  });
});
