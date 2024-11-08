const express = require("express");
const cors = require("cors");
const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const categoryRouter = require("./router/categoryRouter");
const productRouter = require("./router/productRouter");
const userRouter = require("./router/userRouter");

app.get("/", (req, res) => {
    res.send("Welcome to HealthMate Backend");
});

app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);
app.use("/api/user", userRouter);

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