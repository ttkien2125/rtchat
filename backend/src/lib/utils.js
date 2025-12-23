import jwt from "jsonwebtoken";

export const generateToken = (userID, res) => {
    const token = jwt.sign(
        { userID },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.cookie("jwt", token, {
        maxAge: 7 * 86400000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
    });

    return token;
};
