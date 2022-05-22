//js
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = 3000;

mongoose.connect("mongodb://localhost:27017", {useUnifiedTopology: true, useNewUrlParser: true })
.then(() => console.log('mongo connected'))
.catch(err => console.log(err));

app.set('view engine', 'ejs')
app.use
app.use('/assets/css', [
    express.static(__dirname + '/assets/css/')
    //require('./routes/login')
]);
app.use('/assets/js', [
    express.static(__dirname + '/node_modules/jquery/dist/'),
    express.static(__dirname + '/node_modules/inputmask/dist/'),
    //require('./routes/login')
]);
app.use('/assets/images/', [
    express.static(__dirname + '/assets/img/')
]);
app.use('/', require('./routes/User'));
/*app.get('/', function (req, res) {
  res.render('index', { title: 'Hey', message: 'Hello there!' })
});
app.get('/chats', function (req, res) {
  res.render('chats', { title: 'Hey', message: 'Hello there!' })
});
*/
app.use(function (err, req, res, next) {
  //
  //err.typeof()
  //console.log('Time:', Date.now())
  next();
})
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
});