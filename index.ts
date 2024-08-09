import express from "express";
import { connectDB } from "./src/db/connectDB";
import { GdSetQueueRouter } from "./src/routes/gdSetQueueRouter";
import { GdQueueProcessorRouter } from "./src/routes/gdQueueProcessorRouter";
import { processQueue } from "./src/services/processQueue";

const app = express();
app.use(express.json());

const port = 6969;

connectDB();

app.get("/", (req, res) => {
  res.send("Welcome to Gender Detection Service");
});

app.use("/gd-set-queue", GdSetQueueRouter);
app.use("/gd-queue-processor", GdQueueProcessorRouter);

// app.post("/mock-test", (req, res) => {
//   console.log("Received data:", req.body);

//   setTimeout(() => {
//     res
//       .status(200)
//       .json({ status: 0, error_type: "timeout", detail: "process timeout" });
//   }, 5000);
// });

app.post("/mock-test", (req, res) => {
  console.log("Received data:", req.body);

  setTimeout(() => {
    res
      .status(200)
      .json({
        status: 1,
        data: {
          max_person_count: 2,
          male_percentage: 55.56,
          female_percentage: 44.44,
          total_frame_count: 427,
          video_duration: "0h 1m 25s",
        },
      });
  }, 5000);
});

app.listen(port, () => {
  console.log(`Server has started on port http://localhost:${port}/`);
});
