import mongoose from "mongoose";

const connectionString = 'mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@cluster0.wykivak.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';


if (!connectionString) {
    throw new Error("Please provide a valid connection string");
}

const connectDB = async () => {
    if (mongoose.connection?.readyState >= 1) {
        console.log("Already connected to Mongo DB");
        return
    }

    try {
        console.log("----- Connecting to MongoDB -----");
        await mongoose.connect(connectionString);
    } catch(error) {
        console.log("Error connecting to MongoDB", error);
    }
    
};

export default connectDB