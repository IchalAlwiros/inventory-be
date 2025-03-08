const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { responseSucces, responseError } = require("../../utils/response");

const { getUser } = require("../../utils/helpers");

const createSubmission = async (req, res) => {
  let { code, description } = req.body;

  try {
    let { userId } = getUser(req);

    await prisma.submission
      .create({
        data: {
          code: code,
          description: description,
          createdBy: userId,
        },
      })
      .then(async (resp) => {
        await prisma.submission_log.create({
          data: {
            status_code: resp.status_code,
            createdBy: userId,
            sub_id: resp.id,
          },
        });
      });

    return responseSucces(res, 200, { code: code });
  } catch (error) {
    console.error("Error created submission:", error);
    return responseError(res, 422, error);
  }
};

const listSubmission = async (req, res) => {
  try {
    // let { userId } = getUser(req);

    const page = parseInt(req.query.page) || 1; // Nomor halaman saat ini
    const limit = parseInt(req.query.limit) || 10; // Jumlah item per halaman

    let submission = await prisma.submission.findMany({
      skip: (page - 1) * limit, // Mengabaikan item untuk halaman sebelumnya
      take: limit, // Menga
      orderBy: {
        id: "desc",
      },
    });

    let record = await prisma.submission.findMany();
    let submission_susscess = await prisma.submission.findMany({
      where: { status_code: "FINISH" },
    });

    return responseSucces(res, 200, submission, {
      total_pengajuan: record.length,
      pengajuan_success: submission_susscess.length,
    });
  } catch (error) {
    console.error("Error created submission:", error);
    return responseError(res, 422, error);
  }
};

const viewSubmission = async (req, res) => {
  try {
    // let { userId } = getUser(req);

    let { id } = req.params;

    id = parseInt(id);

    let submission = await prisma.submission.findFirstOrThrow({
      where: { id: id },
      include: {
        sub_log: true,
      },
    });

    console.log(id);
    console.log(submission);

    return responseSucces(res, 200, submission);
  } catch (error) {
    console.error("Error created submission:", error);
    return responseError(res, 422, error);
  }
};

const updateSubmission = async (req, res) => {
  try {
    let { userId } = getUser(req);

    let { id, description } = req.body;

    id = parseInt(id);

    let submission = await prisma.submission.findFirstOrThrow({
      where: { id: id },
    });

    if (!submission) {
      return responseError(res, 422, `submission unavailable`);
    }

    const submission_update = await prisma.submission
      .update({
        where: {
          id: id,
        },
        data: {
          status_code: "FINISH",
          updatedBy: userId,
        },
      })
      .then(async (resp) => {
        await prisma.submission_log.create({
          data: {
            status_code: resp.status_code,
            description: description,
            createdBy: userId,
            sub_id: resp.id,
          },
        });
      });

    return responseSucces(res, 200, submission);
  } catch (error) {
    console.error("Error created submission:", error);
    return responseError(res, 422, error);
  }
};

module.exports = {
  createSubmission,
  listSubmission,
  viewSubmission,
  updateSubmission,
};
