const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// SIGN UP

exports.signUp = async (req, res) => {
  try {
    const { name, email_primary, mobile, password, confirm_password } =
      req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    // req.body.password = hashedPassword;
    // console.log(re);
    const user = new User({
      name,
      email_primary,
      mobile,
      password: hashedPassword,
      confirm_password,
    });

    await user.save();
    return res.status(201).json({
      status: "success",
      data: user,
      message: "user sign-up successfully!",
    });
  } catch (err) {
    return res.status(404).json({
      status: "fail",
      data: err,
      message: err.message,
    });
  }
};

// LOG IN

exports.login = async (req, res) => {
  try {
    const { email_primary, password } = req.body;

    if (!email_primary || !password) {
      return res.status(404).json({
        status: "fail",
        data: "",
        message: "please provide your email and password",
      });
    }
    const user = await User.findOne({ email_primary });
    if (user) {
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) {
        const data = {
          data: user,
        };
        const token = jwt.sign(data, process.env.SECREK_KEY, {
          expiresIn: "30d",
        });
        res.cookie("jwt", token, { httpOnly: true });

        // Send a response with the user object
        res.status(200).json({
          statu: "success",
          data: token,
          message: "user log in successfully",
        });
      } else {
        return res.status(404).json({
          status: "fail",
          data: "",
          message: "password is not match!",
        });
      }
      console.log(res.cookies.token);
    } else {
      return res.status(404).json({
        status: "fail",
        data: "",
        message: "user is not found!",
      });
    }
  } catch (err) {
    return res.status(404).json({
      status: "fail",
      data: err,
      message: err.message,
    });
  }
};

// USER UPDATE
