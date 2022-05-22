const mongoose = require('mongoose');
const errorHandler = require('./middlewares/errorHandler');
const { jsonExpressAuth, jsonSocketAuth } = require('./middlewares/authentication');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const http = require('http');
const model = require('./models/Model');
const cors = require('cors')

const express = require('express');

const app = express();
app.use(cors())
const { single, multipleArray, multipleObject, valErr, accessToken } = require('./wrappers/responseWrapper')(app);
app.response.single = single;
app.response.multipleArray = multipleArray;
app.response.multipleObject = multipleObject;
app.response.valErr = valErr;
app.response.accessToken = accessToken;

const jwtSecret = "09f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df6611";

app.locals.model = model;
app.locals.jwt = jwt;
app.locals.jwtkey = jwtSecret;

const router = express.Router();

app.set('view engine', 'ejs');

const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});

io.use((socket, next) => {
    socket.handshake.query.jwt = jwt;
    socket.handshake.query.jwtSecret = jwtSecret;
    next();
});
io.use(jsonSocketAuth);

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('join', (convID, callback) => {
        socket.join(convID);
        callback({
            status: "SOCKET.NEWCONV.OK"
        });
    });
    //sokette auth esnasında userid yönlendir
    socket.on('message', (message, convID) => {
        io.to(convID).emit("message", convID, socket.handshake.query.UserID, message);
    });
});
const conversationRoutes = require('./routes/Conversation');
const userRoutes = require('./routes/User');
const frontendRoutes = require('./routes/Frontend');

const port = 3000;

mongoose.connect("mongodb://localhost:27017/Eventset", { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => console.log('mongo connected'))
    .catch(err => console.log(err));

app.use('/assets/css', [
    express.static(__dirname + '/assets/css/')
]);
app.use('/assets/img', [
    express.static(__dirname + '/assets/img/')
]);
app.use('/assets/js', [
    express.static(__dirname + '/assets/js/')
]);


app.use(bodyParser.json());
app.use(cookieParser());

app.use("/conversation", conversationRoutes);

app.use("/users", userRoutes);
app.use("/", frontendRoutes);
app.use(errorHandler);


server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
