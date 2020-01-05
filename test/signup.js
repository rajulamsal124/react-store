const assert = require("chai").assert;
const app = require("../server/index");
var chai = require("chai"),
  chaiHttp = require("chai-http");
var expect = require("chai").expect;
const db = require("../server/db/client");
const auth = require("../server/controllers/auth");

chai.use(chaiHttp);

describe("Sign up", function(done) {
  beforeEach(function(done) {
    // Clear the users table
    db.clear(function(err) {
      if (err) {
        console.log("USERS TABLE NOT CLEARED");
        console.log(err);
      } else {
        done();
      }
    });
  });

  after(function(done) {
    // Clear the users table...again. Once before EACH test, and once after ALL tests.
    db.clear(function(err) {
      if (err) {
        console.log("USERS TABLE NOT CLEARED");
        console.log(err);
      } else {
        done();
        // process.exit();
      }
    });
  });

  it("Returns a new user when one signs up", function(done) {
    chai
      .request(app)
      .post("/signup")
      .send({ username: "test123", password: "password" })
      .then(res => {
        expect(res.body).to.not.eq(null);
        expect(res.body.password).to.not.eq("password");
        expect(Object.keys(res.body).length).to.eq(1);
        done();
      });
  });

  it("returns an error if a username is already taken", function(done) {
    chai
      .request(app)
      .post("/signup")
      .send({ username: "test123", password: "password" })
      .then(res => {
        chai
          .request(app)
          .post("/signup")
          .send({ username: "test123", password: "password" })
          .then(res => {
            expect(res.body.error.message).to.eq("Username is taken");
            done();
          });
      })
      .catch(err => {
        console.log(`ERROR: ${err}`);
        done();
      });
    });
});