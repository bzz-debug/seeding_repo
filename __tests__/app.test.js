const endpointsJson = require("../endpoints.json");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const db = require("../db/connection");
const app = require("../app");
const testData = require("../db/data/test-data/index");

beforeEach(() => seed(testData));

afterAll(() => db.end());

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
    return db
      .query(`DELETE FROM comments;`)
      .then(() => {
        return db.query(`DELETE FROM articles;`);
      })
      .then(() => {
        return db.query(`DELETE FROM topics;`);
      })
      .then(() => {
        return request(app)
          .get("/api/topics")
          .expect(404)
          .then((result) => {
            expect(result.body.message).toBe("No topics here!");
          });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  const articleShape = {
    author: expect.any(String),
    title: expect.any(String),
    article_id: expect.any(Number),
    body: expect.any(String),
    topic: expect.any(String),
    created_at: expect.any(String),
    author: expect.any(String),
    votes: expect.any(Number),
    article_img_url: expect.any(String),
  };

  test("200: Responds with an article object", () => {
    return request(app)
      .get("/api/articles/4")
      .expect(200)
      .then((result) => {
        expect(result.body.article).toMatchObject(articleShape);
        expect;
      });
  });
  test("404: Responds with an error when the ID does not match any in the database", () => {
    return request(app)
      .get("/api/articles/505")
      .expect(404)
      .then((result) => {
        expect(result.body.message).toBe("No article with ID: 505 found!");
      });
  });
  test("400: Responds with a bad request error when the user assigns a non-number to the id", () => {
    return request(app)
      .get("/api/articles/pizza")
      .expect(400)
      .then((result) => {
        expect(result.body.message).toBe("bad request");
      });
  });
});
describe("GET: api/articles", () => {
  const newArticleShape = {
    author: expect.any(String),
    title: expect.any(String),
    article_id: expect.any(Number),
    topic: expect.any(String),
    created_at: expect.any(String),
    author: expect.any(String),
    votes: expect.any(Number),
    article_img_url: expect.any(String),
    comment_count: expect.any(Number),
  };

  test("200: responds with an array of article objects, with body removed and a comment count added", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(13);
        expect(body.articles[9]).toMatchObject(newArticleShape);
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("404: Responds with an error when there are no articles in the database", () => {
    return db
      .query(`DELETE FROM comments;`)
      .then(() => {
        return db.query(`DELETE FROM articles;`);
      })
      .then(() => {
        return request(app)
          .get("/api/articles")
          .expect(404)
          .then(({ body }) => {
            expect(body.message).toBe("No articles found!");
          });
      });
  });
});
