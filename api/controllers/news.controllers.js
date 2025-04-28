const {} = require("");
const endpoints = require("../../endpoints.json");

const getApi = (req, res) => {
  const endpointsObj = req.body;
  console.log(endpointsObj);
  res.status(200).send({ endpoints });
};

module.exports = { getApi };
