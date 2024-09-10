import express, { Request, Response } from "express";
import { connectDB } from "./src/db/connectDB";
import { ObdSetQueueRouter } from "./src/routes/obdSetQueue";
import { ObdProcessor } from "./src/routes/obdProcessor";
import { ObdPublisher } from "./src/routes/obdPublisher";
import { QueueAdjustment } from "./src/routes/obdQueueAdjustment";

const app = express();
app.use(express.json());

const port = 6969;

connectDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Object Detection Service");
});

app.use("/obd-set-queue", ObdSetQueueRouter);
app.use("/obd-processor", ObdProcessor);
app.use("/obd-publisher", ObdPublisher);
app.use("/queue-adjustment", QueueAdjustment);

app.listen(port, () => {
  console.log(
    `Object Detection Micro Service has started on port http://localhost:${port}/`
  );
});
