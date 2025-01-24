import express from "express";
import korisniciRoutes from "./routes/korisnici.js";
import loginRoutes from "./routes/auth.js";
import knjigeRoutes from "./routes/knjige.js";
import iznajmljenoRoutes from "./routes/iznajmljeno.js";
import organizacijeRoutes from "./routes/organizacije.js";
import db from "./models/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
import jwt from "jsonwebtoken";

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../client/public/upload/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname)
  }
})
  
const upload = multer({ storage: storage })
  
app.post("/api/upload", upload.single("file"), (req, res) => {
  const token = req.cookies.accessToken;
  if(!token) return res.status(401).json("Niste prijavljeni");
  
  jwt.verify(token, "supertajnikljuc", (err, userInfo) => {
    if(err) return res.status(403);
    if(userInfo.admin){
      const file = req.file;
      res.status(200).json(file.filename);
    }
  })
  
})
    
app.use("/api/korisnici", korisniciRoutes);
app.use("/api/auth", loginRoutes);
app.use("/api/knjige", knjigeRoutes);
app.use("/api/iznajmljeno", iznajmljenoRoutes);
app.use("/api/organizacije", organizacijeRoutes);
    
db.sequelize.sync().then((req) => {
    app.listen(8800, () => {
        console.log("API working!");
    })
})
