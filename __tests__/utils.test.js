const {
  convertTimestampToDate,
  lookupAndFormat,
} = require("../db/seeds/utils");

describe("Tests for convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts a created_at property to a date", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no created_at property", () => {
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    expect(result).toEqual(expected);
  });
});

describe("Tests for lookupAndFormat", () => {
  test("When lookupAndFormat is invoked with articleData (an array of objects containing data from article table) along with an commentData (an array of with a single object) it will return a copy of commentData but article_title will be replaced with article_id instead", () => {
    const articleData = [
      {
        article_id: 1,
        title: "They're not exactly dogs, are they?",
      },
    ];
    const commentData = [
      {
        article_title: "They're not exactly dogs, are they?",
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        author: "butter_bridge",
        created_at: 1586179020000,
      },
    ];
    const result = lookupAndFormat(articleData, commentData);
    expect(result).toEqual([
      [
        new Date(1586179020000),
        "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        16,
        "butter_bridge",
        1,
      ],
    ]);
  });

  test("When lookupAndFormat is invoked with articleData (an array of objects containing data from article table) along with an commentData (an array of objects) it will return a copy of commentData but article_title will be replaced with article_id instead for all objects in the returning array", () => {
    const articleData = [
      {
        article_id: 1,
        title: "They're not exactly dogs, are they?",
      },
      {
        article_id: 2,
        title: "They're not exactly cats, are they?",
      },
      {
        article_id: 32,
        title: "They're not exactly something, are they?",
      },
    ];
    const commentData = [
      {
        article_title: "They're not exactly dogs, are they?",
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        author: "butter_bridge",
        created_at: 1586179020000,
      },
      {
        article_title: "They're not exactly cats, are they?",
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        author: "butter_bridge",
        created_at: 1586179020000,
      },
      {
        article_title: "They're not exactly something, are they?",
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        author: "butter_bridge",
        created_at: 1586179020000,
      },
    ];
    const result = lookupAndFormat(articleData, commentData);
    expect(result).toEqual([
      [
        new Date(1586179020000),
        "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        16,
        "butter_bridge",
        1,
      ],
      [
        new Date(1586179020000),
        "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        16,
        "butter_bridge",
        2,
      ],
      [
        new Date(1586179020000),
        "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        16,
        "butter_bridge",

        32,
      ],
    ]);
  });
  test("The function should not mutate the inputs", () => {
    const articleData = [
      {
        article_id: 1,
        article_title: "They're not exactly dogs, are they?",
      },
      {
        article_id: 2,
        article_title: "They're not exactly cats, are they?",
      },
      {
        article_id: 32,
        article_title: "They're not exactly something, are they?",
      },
    ];
    const commentData = [
      {
        article_title: "They're not exactly dogs, are they?",
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        author: "butter_bridge",
        created_at: 1586179020000,
      },
      {
        article_title: "They're not exactly cats, are they?",
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        author: "butter_bridge",
        created_at: 1586179020000,
      },
      {
        article_title: "They're not exactly something, are they?",
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        author: "butter_bridge",
        created_at: 1586179020000,
      },
    ];
    lookupAndFormat(articleData, commentData);
    expect(articleData).toEqual([
      {
        article_id: 1,
        article_title: "They're not exactly dogs, are they?",
      },
      {
        article_id: 2,
        article_title: "They're not exactly cats, are they?",
      },
      {
        article_id: 32,
        article_title: "They're not exactly something, are they?",
      },
    ]);
    expect(commentData).toEqual([
      {
        article_title: "They're not exactly dogs, are they?",
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        author: "butter_bridge",
        created_at: 1586179020000,
      },
      {
        article_title: "They're not exactly cats, are they?",
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        author: "butter_bridge",
        created_at: 1586179020000,
      },
      {
        article_title: "They're not exactly something, are they?",
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        author: "butter_bridge",
        created_at: 1586179020000,
      },
    ]);
  });

  test("The output array should have a different reference in memory that is not shared by the two input arrays", () => {
    const articleData = [
      {
        article_id: 1,
        article_title: "They're not exactly dogs, are they?",
      },
      {
        article_id: 2,
        article_title: "They're not exactly cats, are they?",
      },
      {
        article_id: 32,
        article_title: "They're not exactly something, are they?",
      },
    ];
    const commentData = [
      {
        article_title: "They're not exactly dogs, are they?",
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        author: "butter_bridge",
        created_at: 1586179020000,
      },
      {
        article_title: "They're not exactly cats, are they?",
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        author: "butter_bridge",
        created_at: 1586179020000,
      },
      {
        article_title: "They're not exactly something, are they?",
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        author: "butter_bridge",
        created_at: 1586179020000,
      },
    ];
    const result = lookupAndFormat(articleData, commentData);
    expect(result).not.toBe(articleData);
    expect(result).not.toBe(commentData);
  });
});
