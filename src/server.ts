import express from "express"

import intelligenceRouter from "./api/intelligence"
import replayRouter from "./api/replay"

const app = express()

app.use(express.json())

// =========================
// AIOS CORE ROUTES
// =========================

app.use("/intelligence", intelligenceRouter)

// =========================
// AIOS OBSERVABILITY LAYER (REPLAY SYSTEM)
// =========================

app.use("/aios", replayRouter)

// =========================
// SERVER BOOT
// =========================

const port = Number(process.env.PORT || 3001)

app.listen(port, () => {
  console.log(`AIOS intelligence server listening on port ${port}`)
  console.log(`AIOS replay system active at /aios`)
})