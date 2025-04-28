const db = require("../../db/connection");

const selectTopics = () => {
  return db.query(`SELECT slug, description FROM topics`).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, message: "No topics here!" });
    }
    return result.rows;
  });
};

module.exports = { selectTopics };
