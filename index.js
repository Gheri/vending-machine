import express from "express";
import bodyParser from 'body-parser';
import helmet from "helmet";
import mongoose from 'mongoose';
import productRoutes from "./routes/productRoutes.js"
import orderRoutes from "./routes/ordersRoutes.js"
import config from "config";

// mongoose connection
mongoose.Promise = global.Promise;
mongoose.connect(config.get("mongoConnectionString"), {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const app = express();
const v1 = express.Router();

// bodyparser setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// for security
// couple of other packages
app.use(helmet())

//TODO modify error Handler
app.use((err, req, res, next) => {
    // erro body has to be
    res.status(500).send();
})

process.on("uncaughtException", error => {
   console.log(error);
});
process.on("unhandledRejection", error => {
    console.log(error);
});
app.use("/v1", v1);
productRoutes(v1);
orderRoutes(v1);
const PORT = 4000;

app.get('/', (req, res) => {
    res.send(`vending server status: running`);
});

app.listen(PORT, (req, res) => {
    console.log(`server started and listening on ${PORT}`);
});