const asyncWrapper = require('../../wrappers/asyncWrapper');
const bcrypt = require('bcrypt');

module.exports = {
    createUser: asyncWrapper(async (req, res) => {
        const isExist = await req.app.locals.model.User.findOne({ Email: req.body.Email });
        if(isExist){ // sendmail
            return res.single(true, "SUCC.CONT.USER.CREATE");
        }
        await req.app.locals.model.User.create({ Email: req.body.Email, Password: "000000" });
        // sendmail
        res.single(true, "SUCC.CONT.USER.CREATE");
    }),
    searchUser: asyncWrapper(async function (req, res) {
        const User = await req.app.locals.model.User.find(
            {
                $or: [
                    { Email: { $regex: req.body.searchData, $options: 'i' } },
                    { Username: { $regex: req.body.searchData, $options: 'i' } }
                ]
            }, '_id Email Username Biography Image').exec();
        if (User != null && User.length > 0) {
            res.multipleArray(true, User);
        } else {
            res.single(false, "ERR.CONT.USER.SEARCH.NOTFOUND");
        }
    }),
    loginUser: asyncWrapper(async function (req, res) {
        const User = await req.app.locals.model.User.findOne({ Email: req.body.Email }).exec();
        if (User != null && typeof User == "object" && Object.keys(User).length > 0 && await bcrypt.compare(req.body.Password, User.Password)) { // User.isActive == true
            const expDate = Math.floor(Date.now() / 1000) + (60 * 60 * 1);
            res.accessToken(req.app.locals.jwt.sign({ UserID: User._id, Email: User.Email, customExp: expDate }, req.app.locals.jwtkey), User._id, expDate);
        } else {
            res.single(false, "ERR.CONT.USER.LOGIN.EMAILORPASSINVALID");
        }
    }),
    accessUser: (req, res) => {
        res.single(true, req.Email + " - " + req.UserID);
    },
    getUser: asyncWrapper(async function (req, res) {
        const User = await req.app.locals.model.User.findOne({ _id: req.body.UserID }).exec();
        if (User != null && typeof User == "object" && Object.keys(User).length > 0) { // User.isActive == true
            res.multipleObject(true, User)
        } else {
            res.single(false, "ERR.CONT.USER.LOGIN.EMAILORPASSINVALID");
        }
    }),
    /*update: async function(req,res,model){

    }
    */
}
