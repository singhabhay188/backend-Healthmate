const express = require("express");
const cors = require("cors");
const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const categoryRouter = require("./router/categoryRouter");
const productRouter = require("./router/productRouter");
const userRouter = require("./router/userRouter");
const brandRouter = require("./router/brandRouter");
const orderRouter = require("./router/orderRouter");
const adminRouter = require("./router/adminRouter");
const chatRouter = require("./router/chatRouter");

app.get("/", (req, res) => {
    res.send("Welcome to HealthMate Backend");
});

app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);
app.use("/api/user", userRouter);
app.use("/api/brand", brandRouter);
app.use("/api/order", orderRouter);
app.use("/api/admin", adminRouter);
app.use("/api/chat", chatRouter);

app.use((err, req, res, next) => {
    res.status(500).json({
        success: false,
        error: err.message,
        message: "Server Error"
    });
});


app.listen(3001, () => {
  console.log("Server is running on port 3001");
});