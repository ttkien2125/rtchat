import jwt from "jsonwebtoken";

export const generateToken = (userID, res) => {
    const { NODE_ENV, JWT_SECRET } = process.env;
    if (!JWT_SECRET) throw new Error("JWT_SECRET is not set");

    const token = jwt.sign({ userID }, JWT_SECRET, { expiresIn: "7d" });

    res.cookie("jwt", token, {
        maxAge: 7 * 86400000,
        httpOnly: true,
        sameSite: "strict",
        secure: NODE_ENV === "production",
    });

    return token;
};
