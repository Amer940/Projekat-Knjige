import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {createRequire} from "module";
const require = createRequire(import.meta.url);

const {korisnici} = require("../models");

const router = express.Router();

router.post("/login", (req, res) => {
    korisnici.findAll({
        attributes: ["id", "fullName", "password", "email", "organisation", "role"],
        where: {
            username: req.body.username,
        },
    }).then((korisnik) => {
        const checkPassword = bcrypt.compareSync(req.body.password, korisnik[0].password)
        if(!checkPassword) res.status(422).json("Pogresno ime ili sifra");
        
        const token = jwt.sign({
            id: korisnik[0].id,
            admin: korisnik[0].role === "admin",
            fullname: korisnik[0].fullName,
            email: korisnik[0].email,
            organisation: korisnik[0].organisation,
        }, "supertajnikljuc");      

        res.cookie("accessToken", token, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000,
        }).status(200).json(token);
        

    }).catch((err) => {
        console.log(err);
        res.status(500).json("Greska u pronalazenju korisnika.");
    })

})

router.post("/logout", (req, res) => {
    res.clearCookie("accessToken").json("User logged out successfully!");
})

export default router