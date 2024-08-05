const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { responseSucces, responseError } = require("../../utils/response");

const { getUser } = require("../../utils/helpers");

const listUser = async (req, res) => {
  const user = await prisma.user.findMany();

  return res.status(200).json({
    success: true,
    data: user,
  });
};

const changeProfile = async (req, res) => {
  let { userId } = getUser(req);
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });

  console.log(user);

  c;

  //   if (!user) {
  //     return responseError(
  //       res,
  //       422,
  //       `user unavailable|pengguna tidak ditersedia`
  //     );
  //   }
};

module.exports = {
  changeProfile,
};
