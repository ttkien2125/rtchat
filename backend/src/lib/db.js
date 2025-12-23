import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const { MONGO_URI } = process.env;
        if (!MONGO_URI) throw new Error("MONGO_URI is not set");

        const mon = await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB: ", mon.connection.host);
    } catch (error) {
        console.error("Error connecting to MongoDB: ", error);
        process.exit(1);
    }
};
