import mongoose from "mongoose"

// Function to connect to DB

export const connectionDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log(`Connnected to MongoDB database at uri: ${process.env.MONGO_URI}`)
  } catch (error) {
    console.log("Error connecting to database", error)
  }
}