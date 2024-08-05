const { PrismaClient, Prisma } = require("@prisma/client");

class ResponseApi {
  static responseSucces = (res, statusCode, data) => {
    return res.status(statusCode).json({
      statusCode,
      success: true,
      data: data,
    });
  };

  static responseError = (res, statusCode, error) => {
    //     if (error instanceof Prisma.PrismaClientKnownRequestError) {
    //       // The .code property can be accessed in a type-safe manner
    //       if (error.code === "P2002") {
    //         console.log(
    //           "There is a unique constraint violation, a new user cannot be created with this email"
    //         );
    //         return res.status(statusCode).json({
    //           statusCode,
    //           success: false,
    //           error: error,
    //         });
    //       }
    //     }
    //     throw error;

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known request errors
      switch (error.code) {
        case "P2002":
          // Unique constraint violation
          console.log(
            "There is a unique constraint violation, a new user cannot be created with this email or username"
          );
          return res.status(statusCode).json({
            statusCode,
            success: false,
            error: "Unique constraint violation, duplicate entry.",
          });

        case "P2025":
          // Record not found
          console.log("Record not found.");
          return res.status(statusCode).json({
            statusCode,
            success: false,
            error: "Record not found.",
          });

        // Add more case blocks for other known errors as needed
        default:
          console.log("An unknown error occurred:", error.message);
          return res.status(statusCode).json({
            statusCode,
            success: false,
            error: "An unknown error occurred.",
          });
      }
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      // Handle validation errors
      console.log("Validation error:", error.message);
      return res.status(statusCode).json({
        statusCode,
        success: false,
        error: "Validation error.",
      });
    } else if (error instanceof Prisma.PrismaClientInitializationError) {
      // Handle initialization errors
      console.log("Initialization error:", error.message);
      return res.status(statusCode).json({
        statusCode,
        success: false,
        error: "Initialization error.",
      });
    } else if (error instanceof Prisma.PrismaClientRustPanicError) {
      // Handle rust panic errors
      console.log("Rust panic error:", error.message);
      return res.status(statusCode).json({
        statusCode,
        success: false,
        error: "Rust panic error.",
      });
    } else {
      // Handle all other errors
      console.log("An unexpected error occurred:", error.message);
      return res.status(statusCode).json({
        statusCode,
        success: false,
        error: "An unexpected error occurred.",
      });
    }
  };
}
module.exports = ResponseApi;
