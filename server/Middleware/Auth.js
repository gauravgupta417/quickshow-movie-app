import { clerkClient, getAuth } from "@clerk/express";

export const protectAdmin = async (req, res, next) => {
  try {
    const { userId } = getAuth(req); // ✅ correct way

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const user = await clerkClient.users.getUser(userId);

    // ✅ role publicMetadata me hai
    if (user.publicMetadata?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not Authorized"
      });
    }

    // ✅ sirf admin hone par hi next()
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized"
    });
  }
};
