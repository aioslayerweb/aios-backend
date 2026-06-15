import express from "express";
import { processEvent } from "../intelligence/eventProcessor";

const router = express.Router();

/**
 * Incoming event endpoint
 * This is the "brain entry point"
 */
router.post("/event", async (req, res) => {
  try {
    const result = await processEvent(req.body);

    return res.json({
      status: "ok",
      ...result,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      status: "error",
      message: "Failed to process event",
    });
  }
});

export default router;
