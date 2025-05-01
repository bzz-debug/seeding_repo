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

  test("200: responds with an array of article objects, with body removed and a comment count added, sorted by descending date", () => {
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
  describe("GET /api/articles (sorting queries)", () => {
    test("200: Responds with all articles sorted by the specified property, defaulting to created_at", () => {
      return request(app)
        .get("/api/articles?sort_by=topic")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("topic", { descending: true });
        });
    });
    test("200: Responds with all articles ordered by the specified property, defaulting to descending", () => {
      return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("created_at", {
            descending: false,
          });
        });
    });
    test("400: Responds with a bad request error when an invalid sort_by instruction is given", () => {
      return request(app)
        .get("/api/articles?sort_by=jalepeno")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("invalid sort_by request");
        });
    });
    test("400: Responds with a bad request error when an invalid order_by instruction is given", () => {
      return request(app)
        .get("/api/articles?order=sideways")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("invalid order request");
        });
    });
  });
  describe("GET /api/articles (topic query)", () => {
    test("200: returns the only the topics represented by the passed query", () => {
      return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(({ body }) => {
          expect(body.filteredArticles.length).toBe(1);
          expect(body.filteredArticles).toEqual([
            {
              article_id: expect.any(Number),
              title: "UNCOVERED: catspiracy to bring down democracy",
              topic: "cats",
              author: "rogersop",
              body: "Bastet walks amongst us, and the cats are taking arms!",
              created_at: expect.any(String),
              votes: 0,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            },
          ]);
        });
    });
    test("400: Responds with bad request error when the queried topic is invalid", () => {
      return request(app)
        .get("/api/articles?topic=balloons")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("bad request - invalid topic");
        });
    });
    test("404: Responds with an error when no articles exist with the queried topic", () => {
      return db
        .query(`DELETE FROM comments;`)
        .then(() => {
          return db.query(`DELETE FROM articles WHERE articles.topic = 'cats'`);
        })
        .then(() => {
          return request(app)
            .get("/api/articles?topic=cats")
            .expect(404)
            .then(({ body }) => {
              expect(body.message).toBe("No articles found!");
            });
        });
    });

    // put in api/aarticles section
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  const commentShape = {
    comment_id: expect.any(Number),
    votes: expect.any(Number),
    created_at: expect.any(String),
    author: expect.any(String),
    body: expect.any(String),
    article_id: expect.any(Number),
  };

  test("200: Returns an array of comments including the required properties", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments[0]).toMatchObject(commentShape);
      });
  });
  test("array is sorted by date descending", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("404: Responds with an error when no comments found at stipulated ID", () => {
    return request(app)
      .get("/api/articles/30/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("No comments found");
      });
  });

  test("400: Responds with a bad request error when  the user assigns a non-number to the id", () => {
    return request(app)
      .get("/api/articles/blahblahblah/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("bad request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Responds with the posted comment", () => {
    return request(app)
      .post("/api/articles/3/comments")
      .send({
        body: "shoobydowop",
        username: "butter_bridge",
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.postedComment).toEqual({
          username: "butter_bridge",
          body: "shoobydowop",
        });
      });
  });

  test("400: Responds with a bad request error when an invalid username is provided & no comment", () => {
    return request(app)
      .post("/api/articles/3/comments")
      .send({
        body: "who am i",
        username: "butter_bridge2",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("invalid username");
      });
  });
  test("400: invalid article ID", () => {
    return request(app)
      .post("/api/articles/string/comments")
      .send({
        body: "who am i",
        username: "butter_bridge",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("bad request");
      });
  });
  test("404: nonexistent article ID", () => {
    return request(app)
      .post("/api/articles/99999/comments")
      .send({
        body: "who am i",
        username: "butter_bridge",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("No article with ID: 99999 found!");
      });
  });
});
describe("PATCH /api/articles/:article_id", () => {
  test("200: Returns the updated article with new amount of votes", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({ inc_votes: 17 })
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedArticle).toMatchObject({
          article_id: 3,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: 17,
          article_img_url: expect.any(String),
        });
      });
  });
  test("400: Returns an error when passed an invalid data type for the votes", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({ inc_votes: "dum dum" })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("bad request");
      });
  });
  test("400: Returns an error when passed an empty object", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("bad request");
      });
  });
  test("404: Returns an error when passed a valid but non-existent id", () => {
    return request(app)
      .patch("/api/articles/300")
      .send({ inc_votes: 17 })
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("No articles found");
      });
  });
  test("400: Returns an error when passed an invalid  id", () => {
    return request(app)
      .patch("/api/articles/potatoes")
      .send({ inc_votes: 17 })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("bad request");
      });
  });
});
describe("DELETE /api/comments/:comment_id", () => {
  test("204: Deletes the comment at the given id ", () => {
    return request(app).delete("/api/comments/5").expect(204);
  });
  test("400: Returns an error when the given id is not a number", () => {
    return request(app)
      .delete("/api/comments/hi")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("bad request");
      });
  });
  test("404: Returns an error when there is no comment at the given id ", () => {
    return request(app)
      .delete("/api/comments/900")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("no comment found");
      });
  });
});
describe("GET /api/users", () => {
  test("200: Responds with an array of topic objects, containing slug and description properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).toBe(4);
        expect(
          body.users.forEach((topic) => {
            expect(topic).toMatchObject({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            });
          })
        );
      });
  });
  test("404: Responds with an error when there are no users in the database", () => {
    return db
      .query(`DELETE FROM comments;`)
      .then(() => {
        return db.query(`DELETE FROM articles;`);
      })
      .then(() => {
        return db.query(`DELETE FROM topics;`);
      })
      .then(() => {
        return db.query(`DELETE FROM users;`);
      })
      .then(() => {
        return request(app)
          .get("/api/users")
          .expect(404)
          .then((result) => {
            expect(result.body.message).toBe("No users here!");
          });
      });
  });
});
