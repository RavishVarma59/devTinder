
const authAdmin = (req, res, next) => {
    console.log("Admin authentication");
    const token = "xyz";
    const isAuth = token === "xyz";
    if (isAuth) {
        next();
    } else {
        res.status(401).send("Unauthorized access");
    }
}
const userAdmin = (req, res, next) => {
    console.log("user  authentication success fully done");
    const token = "xyz";
    const isAuth = token === "xyz";
    if (isAuth) {
        next();
    } else {
        res.status(401).send("Unauthorized access");
    }
}
// console.log("hi",authAdmin);
module.exports = {
    authAdmin,
    userAdmin
};