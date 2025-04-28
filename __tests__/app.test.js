const endpointsJson = require("../endpoints.json");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const db = require("../db/connection");
const app = require("../app");
const testData = require("../db/data/test-data/index");

/* Set up your test imports here */

beforeEach(() => seed(testData));

afterAll(() => db.end());
/* Set up your beforeEach & afterAll functions here */

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

const topicShape = {
  slug: expect.any(String),
  description: expect.any(String),
};

describe("GET /api/topics", () => {
  test("200: Responds with an array of topic objects, containing slug and description properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics.length).toBe(3);
        expect(
          body.topics.forEach((topic) => {
            expect(topic).toMatchObject(topicShape);
          })
        );
      });
  });
  test("404: Responds with an error when there are no topics in the database", () => {
    return db.query(`DELETE FROM comments;`).then(() => {
      return db.query(`DELETE FROM articles;`).then(() => {
        return db.query(`DELETE FROM topics;`).then(() => {
          return request(app)
            .get("/api/topics")
            .expect(404)
            .then((result) => {
              expect(result.body.message).toBe("No topics here!");
            });
        });
      });
    });
  });
});
