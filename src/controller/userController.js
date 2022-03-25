const UserModel = require("../models/userModel")



const loginUser = async function (req, res) {
    try {
        let userName = req.body.email;
        let password = req.body.password;
        if (!userName || !password)
            return res.status(401).send({ status: false, msg: "Username or the password is not entered" });

        let user = await UserModel.findOne({ email: userName, password: password });
        if (!user)
            return res.status(400).send({ status: false, msg: "Username or the password is not corerct" });

        let token = jwt.sign({ userId: user._id.toString(), }, "group2");
        res.status(201).send({ status: true, data: token });
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

module.exports.createUser = createUser
module.exports.loginUser = loginUser;