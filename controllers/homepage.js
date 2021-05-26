module.exports = {

  homepage: (req, res) => {
    res.render('index', {});
  },

  testing: (req, res) => {
    res.render('test', {});
  },
};
