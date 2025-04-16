const db = require("./db/connection.js");

// function userQuery() {
//   return db
//     .query(`SELECT username FROM users`)
//     .then((result) => {
//       return result.rows;
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// }

// userQuery()
//   .then((users) => console.log(users))
//   .catch((err) => console.log(err));

// function codingArticles() {
//   return db
//     .query(`SELECT * FROM articles WHERE topic LIKE '%coding%'`)
//     .then((result) => {
//       return result.rows;
//     });
//   //     .catch((err) => {
//   //       console.log(err);
//   //     });
// }
// codingArticles().then((articles) => {
//   //   console.log(articles);
// });
// //   .catch((error) => console.log(error));

// function getCommentsWithNegativeVotes() {
//   return db.query(`SELECT * FROM comments WHERE votes < 0`).then((result) => {
//     return result.rows;
//   });
// }
// getCommentsWithNegativeVotes().then((result) => {
//   console.log(result);
// });

// function getTopics() {
//   return db.query(`SELECT * FROM topics`).then((result) => {
//     const topicHolder = result.rows.map((topic) => topic.slug);
//     return topicHolder;
//   });
// }
// getTopics().then((result) => {
//   console.log(result);
// });

// function getArticlesByUser() {
//   return db
//     .query(`SELECT * FROM articles WHERE author = 'grumpy19' `)
//     .then((result) => {
//       return result.rows;
//     });
// }
// getArticlesByUser().then((result) => {
//   console.log(result);
// });

function getCommentsWithOverTenVotes() {
  return db.query(`SELECT * FROM comments WHERE votes > 10`).then((result) => {
    return result.rows;
  });
}
getCommentsWithOverTenVotes().then((result) => {
  console.log(result);
});
