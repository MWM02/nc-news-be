const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const app = require("../app");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
require("jest-sorted");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

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

describe("GET /api/topics", () => {
  test("200: Responds with an array of topic objects, each should contain a slug property and a description property", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with an article object that will contain the properties: author, title, article_id, body, topic, created_at, votes, article_img_url", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });

  test("400: Responds with an object containing an error message when the requested article_id is of an invalid data type", () => {
    return request(app)
      .get("/api/articles/two")
      .expect(400)
      .then(({ body: { error } }) => {
        expect(error.message).toBe("Invalid text representation");
      });
  });

  test("404: Responds with an object containing an error message when the requested article_id of valid data type does not exist", () => {
    return request(app)
      .get("/api/articles/99999")
      .expect(404)
      .then(({ body: { error } }) => {
        expect(error.message).toBe("Resource not found");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: Responds with an array of articles objects sorted by created_at in descending order containing the properties: author, title, article_id, topic, created_at, votes, article_img_url", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("GET /api/articles/:articles/comments", () => {
  test("200: Responds with an array of comment objects for a given article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { commentsByArticleId } }) => {
        expect(commentsByArticleId.length).toBe(11);
        commentsByArticleId.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(comment.article_id).toBe(1);
        });
        expect(commentsByArticleId).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });

  test("200 Responds with an empty array for an article_id that exists in the articles table but does not have any comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body: { commentsByArticleId } }) => {
        expect(commentsByArticleId.length).toBe(0);
      });
  });

  test("400: Responds with an object containing an error message when the requested article_id is of an invalid data type", () => {
    return request(app)
      .get("/api/articles/two/comments")
      .expect(400)
      .then(({ body: { error } }) => {
        expect(error.message).toBe("Invalid text representation");
      });
  });

  test("404: Responds with an error object containing an error message when the request article_id is of valid data type but does not exist", () => {
    return request(app)
      .get("/api/articles/99/comments")
      .expect(404)
      .then(({ body: { error } }) => {
        expect(error.message).toBe("Resource not found");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Responds with an object containing the inserted comment", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({ username: "lurker", body: "This is a test" })
      .expect(201)
      .then(({ body: { postedComment } }) => {
        expect(postedComment.author).toBe("lurker");
        expect(postedComment.body).toBe("This is a test");
        expect(postedComment.article_id).toBe(2);
        expect(postedComment.votes).toBe(0);
        expect(postedComment.comment_id).toBe(19);
        expect(typeof postedComment.created_at).toBe("string");
      });
  });

  test("404: Responds with an error object containing an error message when article_id is of valid data type but does not exist", () => {
    return request(app)
      .post("/api/articles/99/comments")
      .send({ username: "lurker", body: "This is a test" })
      .expect(404)
      .then(({ body: { error } }) => {
        expect(error.message).toBe("Resource not found");
      });
  });

  test("400: Responds with an error object containing an error message when the article_id is of invalid data type", () => {
    return request(app)
      .post("/api/articles/two/comments")
      .send({ username: "lurker", body: "This is a test" })
      .expect(400)
      .then(({ body: { error } }) => {
        expect(error.message).toBe("Invalid text representation");
      });
  });

  test("400: Responds with an error object containing an error message when the request body is lacks necessary properties (username or body)", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({ body: "This is a test" })
      .expect(400)
      .then(({ body: { error } }) => {
        expect(error.message).toBe("Invalid request body");
      });
  });

  test("400: Responds with an error object containing an error message when the request body's username property contains a username that does not exist in users table", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({ username: "fake_user", body: "234" })
      .expect(400)
      .then(({ body: { error } }) => {
        expect(error.message).toBe("foreign key violation");
      });
  });

  test("400: Responds with an error object containing an error message when the request body's body property contains an empty string", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({ username: "lurker", body: "" })
      .expect(400)
      .then(({ body: { error } }) => {
        expect(error.message).toBe("Invalid request body");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: Responds with an article object with the updated votes", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -100 })
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.article_id).toBe(1);
        expect(article.votes).toBe(0);
        expect(typeof article.title).toBe("string");
        expect(typeof article.topic).toBe("string");
        expect(typeof article.author).toBe("string");
        expect(typeof article.body).toBe("string");
        expect(typeof article.created_at).toBe("string");
        expect(typeof article.article_img_url).toBe("string");
      });
  });

  test("404: Responds with an error object containing an error message when article_id is of valid data type but does not exist", () => {
    return request(app)
      .patch("/api/articles/99")
      .send({ inc_votes: 100 })
      .expect(404)
      .then(({ body: { error } }) => {
        expect(error.message).toBe("Resource not found");
      });
  });

  test("400: Responds with an error object containing an error message when the article_id is of invalid data type", () => {
    return request(app)
      .patch("/api/articles/two")
      .send({ inc_votes: 100 })
      .expect(400)
      .then(({ body: { error } }) => {
        expect(error.message).toBe("Invalid text representation");
      });
  });

  test("400: Responds with an object containing an error message when request body does not contain the correct property", () => {
    return request(app)
      .patch("/api/articles/2")
      .send({ votes: 2 })
      .expect(400)
      .then(({ body: { error } }) => {
        expect(error.message).toBe("Invalid request body");
      });
  });

  test("400: Responds with an object containing an error message when the request body contains the required properties but not the valid data types for the values", () => {
    return request(app)
      .patch("/api/articles/2")
      .send({ inc_votes: "two" })
      .expect(400)
      .then(({ body: { error } }) => {
        expect(error.message).toBe("Invalid text representation");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: Responds with no content and the row relating to the comment_id should be removed from the comments table", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
        db.query(`SELECT * FROM comments WHERE comment_id = 1`).then(
          ({ rows }) => {
            expect(rows.length).toBe(0);
          }
        );
      });
  });

  test("404: Responds with an error object containing an error message when comment_id is of valid data type but does not exist", () => {
    return request(app)
      .delete("/api/comments/50")
      .expect(404)
      .then(({ body: { error } }) => {
        expect(error.message).toBe("Resource not found");
      });
  });

  test("400: Responds with an error object containing an error message when the comment_id is of invalid data type", () => {
    return request(app)
      .delete("/api/comments/L")
      .expect(400)
      .then(({ body: { error } }) => {
        expect(error.message).toBe("Invalid text representation");
      });
  });
});

describe("Other errors", () => {
  test("404: Responds with an object containing an error message and error code when the requested endpoint doesn't match to any api endpoint", () => {
    return request(app)
      .get("/api/top1cs")
      .expect(404)
      .then(({ body: { error } }) => {
        expect(error.message).toBe("Resource not found");
      });
  });
});
