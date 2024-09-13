import { Request, Response } from "express";
import { ObdQueueModel } from "../models/obdQueueModel";

export async function obdSetQueue(req: Request, res: Response) {
  console.log("| Payload data: ", req.body);

  try {
    await ObdQueueModel.create(req.body);
    console.log("| Queue set successful");
    console.log("+-------------- END -----------+");
    res.status(201).json({ status: 1, message: "Queue Set Successfully" });
  } catch (error) {
    console.log("| Queue set FAILED");
    console.log("+-------------- END -----------+");
    res.status(500).json({
      status: 0,
      message: "Queue Set Failure",
      error: (error as Error).message,
    });
  }
}
