import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import userRouter from "./router/userRouter.js"
import categoryRouter from "./router/categoryRouter.js"
import productRouter from "./router/productRouter.js"
import brandRouter from "./router/brandRouter.js"
import orderRouter from "./router/orderRouter.js"
import adminRouter from "./router/adminRouter.js"
import chatRouter from "./router/chatRouter.js"
import tempRouter from "./router/tempRouter.js"

app.get("/", (req, res) => {
    res.send("Welcome to HealthMate Backend");
});

app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);
app.use("/api/brand", brandRouter);
app.use("/api/order", orderRouter);
app.use("/api/admin", adminRouter);
app.use("/api/chat", chatRouter);
app.use("/api/temp", tempRouter);

app.use((err, req, res, next) => {
    res.status(500).json({
        success: false,
        error: err.message,
        message: "Server Error"
    });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log("Server is running on port", port);
});