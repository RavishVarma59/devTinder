const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {

    try {
        const cookie = req.cookies;

        const { TOKEN } = cookie;
        if (!TOKEN) {
           return res.status(401).send("Token not valid !")
        }

        const decodedObj = await jwt.verify(TOKEN, process.env.JWT_TOKEN);

        const { id } = decodedObj;
        const user = await User.findById(id);
        if (!user) {
            throw new Error("user not found");
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(400).send("error : " + error.message);
    }
  

}
// console.log("hi",authAdmin);
module.exports = {
    userAuth
};