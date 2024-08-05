const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const { responseSucces, responseError } = require("../../utils/response");

const { getUser } = require("../../utils/helpers");

const register = async (req, res) => {
  let { username, email, role, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        username: username,
        email: email,
        role: role,
        password: hashedPassword,
      },
    });
    const expiriedIn = 2 * 24 * 3600;

    const token = jwt.sign(
      { userId: user.id, username, email },
      process.env.TOKEN_SECRET,
      { expiresIn: expiriedIn }
    );

    return res.json({ user: { id: user.id, username, email }, token });
  } catch (error) {
    if (error.code == "P2002") {
      var err = " username and email already exist ";
      return res.status(400).json({ email: err, error });
    }
    return res.status(400).json(error);
  }
};

const login = async (req, res) => {
  let { username, password } = req.body;

  // Check if the input is an email
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username);

  try {
    const user = await prisma.user.findFirstOrThrow({
      where: isEmail ? { email: username } : { username: username },
    });

    const valid = bcrypt.compareSync(password, user.password);

    if (!valid) {
      return res.status(400).json("wrong login user credential ");
    }
    // const expiriedIn = 2 * 24 * 3600;

    const token = jwt.sign(
      { userId: user.id, username: user.username, email: user.email },
      process.env.TOKEN_SECRET
      //   { expiresIn: expiriedIn }
    );

    createProfile(user);

    return responseSucces(res, 200, {
      email: user.email,
      username: user.username,
      updatedAt: user.updatedAt,
      createdAt: user.createdAt,
      token: token,
    });
  } catch (error) {
    return responseError(res, 422, error);
  }
};

const createProfile = async (user) => {
  const getProfile = await prisma.profile.findMany({
    where: {
      id: user.id,
    },
  });
  console.log(`ini user id${user.id}`);

  if (getProfile.length === 0) {
    try {
      const profile = await prisma.profile.create({
        data: {
          user_id: user.id,
        },
      });
    } catch (err) {
      console.log(err);
    }
  }
};

const listUser = async (req, res) => {
  const user = await prisma.user.findMany();

  return res.status(200).json({
    success: true,
    data: user,
  });
};

const changepassword = async (req, res) => {
  let { userId } = getUser(req);
  const user = await prisma.user.findFirstOrThrow({
    where: {
      OR: [{ id: userId }],
    },
  });

  console.log(`get user ${userId} get id ${user.email} ${user.password}`);

  if (user) {
    let { oldpassword, newpassword, confirmpassword } = req.body;
    const valid1 = bcrypt.compareSync(oldpassword, user.password);
    const valid2 = bcrypt.compareSync(newpassword, confirmpassword);
    // console.log(valid1);
    console.log(valid2);
    console.log(` ${newpassword} ${confirmpassword}`);
    if (!valid1 && newpassword != confirmpassword) {
      return res.status(400).json("Old password and Confirm password Invalid");
    } else if (!valid1) {
      return res.status(400).json("Invalid Old Password");
    } else if (newpassword != confirmpassword) {
      return res.status(400).json("Invalid Password Confirm");
    } else {
      let { id, password } = user;
      password = confirmpassword;
      const hashedPassword = await bcrypt.hash(password, 10);
      const userupdate = await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          password: hashedPassword,
        },
      });
      return res.json({
        message: "successfully changed password",
        user: { username: user.username, email: user.email },
      });
    }
  }
};

module.exports = {
  register,
  login,
  changepassword,
  listUser,
};
