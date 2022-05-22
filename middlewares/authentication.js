var jsonExpressAuth = function (req, res, next) {
    const checkBody = req.body.token == null;
    const checkCookie = req.cookies.accessToken == null;
    if (checkBody && checkCookie) return res.single(false, "ERR.AUTH.FAILED");
    let accessToken;
    if (!checkBody) accessToken = req.body.token;
    else accessToken = req.cookies.accessToken;

    req.app.locals.jwt.verify(accessToken, req.app.locals.jwtkey, async (err, data) => {
        if (err) return res.single(false, "ERR.AUTH.FAILED");
        else {
            if (data.customExp < Math.floor(Date.now() / 1000)) {
                const User = await req.app.locals.model.User.findById(data.UserID).exec();
                if (User != null && Object.keys(User).length > 0) { // User.isActive == true
                    const expDate = Math.floor(Date.now() / 1000) + (60 * 60 * 1);
                    const accessToken = req.app.locals.jwt.sign({ UserID: User._id, Email: User.Email, customExp: expDate }, req.app.locals.jwtkey);
                    return res.accessToken(accessToken, expDate);
                } else {
                    return res.single(false, "ERR.USER.ACCESS.RESTRICTED");
                }
            } else {
                res.locals.UserID = data.UserID;
                res.locals.Email = data.Email;
                res.locals.customExp = data.customExp;
                next();
            }
        }
    });
}
var jsonSocketAuth = function (socket, next) {
    if (socket.handshake.auth == null || socket.handshake.auth.token == null) {
        let err = new Error("ERR.AUTH.FAILED");
        return next(err);
    }

    socket.handshake.query.jwt.verify(socket.handshake.auth.token, socket.handshake.query.jwtSecret, async (err, data) => {
        if (err) {
            let err = new Error("ERR.AUTH.FAILED");
            return next(err);
        }

        if (data.customExp < Math.floor(Date.now() / 1000)) {
            const User = await req.app.locals.model.User.findById(data.UserID).exec();
            if (User != null && Object.keys(User).length > 0) { // User.isActive == true
                const expDate = Math.floor(Date.now() / 1000) + (60 * 60 * 1);
                const accessToken = req.app.locals.jwt.sign({ UserID: User._id, Email: User.Email, customExp: expDate }, req.app.locals.jwtkey);
                let err = new Error("SOCKET.NEW.TOKEN");
                err.data = {
                    expDate: expDate,
                    token: token
                }
                return next(err);
            } else {
                let err = new Error("ERR.USER.ACCESS.RESTRICTED");
                return next(err);
            }
        } else {            
            socket.handshake.query.UserID = data.UserID;
            socket.handshake.query.Email = data.Email;
            socket.handshake.query.customExp = data.customExp;
            next();
        }
    });
}
module.exports = { jsonExpressAuth, jsonSocketAuth };