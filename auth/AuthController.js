var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var User = require("../user/User");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var config = require("../config");
var VerifyToken = require("./VerifyToken");

router.post("/register", function (req, res) {
  var hashedPassword = bcrypt.hashSync(req.body.password, 8);

  User.create(
    {
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    },
    function (err, user) {
      if (err)
        return res
          .status(500)
          .send("Ocorreu um problema ao registrar o usuário.");
      // criar o token
      var token = jwt.sign({ id: user._id }, config.secret, {
        expiresIn: 86400, // expira em 24 horas
      });
      res.status(200).send({ auth: true, token: token });
    }
  );
});

router.get("/me", VerifyToken, function (req, res, next) {
  User.findById(req.userId, { password: 0 }, function (err, user) {
    if (err)
      return res
        .status(500)
        .send("Ocorreu um problema ao encontrar o usuário.");
    if (!user) return res.status(404).send("Usuário não encontrado.");

    res.status(200).send(user);
  });
});

router.post("/login", function (req, res) {
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) return res.status(500).send("Erro no servidor.");
    if (!user) return res.status(404).send("Usuário não encontrado.");

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid)
      return res.status(401).send({ auth: false, token: null });

    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400, // expira em 24 horas
    });

    res.status(200).send({ auth: true, token: token });
  });
});

router.get("/logout", function (req, res) {
  res.status(200).send({ auth: false, token: null });
});

module.exports = router;
