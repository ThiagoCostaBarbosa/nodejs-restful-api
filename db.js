var mongoose = require('mongoose');

var dbstring ='mongodb+srv://<user>:<password>@cluster0.fsosl.mongodb.net/<collection>'; 

mongoose.connect(dbstring, { useUnifiedTopology: true, useNewUrlParser: true });