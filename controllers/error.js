module.exports = {

  notFound404: (req, res) => {
    res.status(404).send('<h1> Not Found </h1>');
  },

};
