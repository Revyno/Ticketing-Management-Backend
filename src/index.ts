import app from "./app";
import connectDB from "./utils/database";

const PORT = 3000;

connectDB()
  .then(() => {
    console.log("Database connected");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`API docs on http://localhost:${PORT}/api/docs`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
  });
