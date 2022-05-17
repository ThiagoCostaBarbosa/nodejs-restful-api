var jwt = require('jsonwebtoken');
var config = require('../config');

function verifyToken(req, res, next) {
  var token = req.headers['x-access-token'];
  if (!token)
    return res.status(403).send({ auth: false, message: 'Nenhum token informado.' });
    
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err)
    return res.status(500).send({ auth: false, message: 'Falha ao autenticar o token.' });
      
    // se tudo der certo, salve para o request para uso em outras rotas
    req.userId = decoded.id;
    next();
  });
}

module.exports = verifyToken;