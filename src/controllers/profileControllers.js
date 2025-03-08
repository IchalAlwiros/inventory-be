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

const myProfile = async (req, res) => {
  try {
    let { userId } = getUser(req);

    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return responseSucces(res, 200, {
      id: user.id,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return responseError(res, 422, error);
  }
};

module.exports = {
  myProfile,
};
