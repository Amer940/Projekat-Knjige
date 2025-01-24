import express from "express";
import jwt from "jsonwebtoken";
import {createRequire} from "module";
const require = createRequire(import.meta.url);

const {organizacije, korisnici} = require("../models");

const router = express.Router();

router.get("/sve", (req, res) => {
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Niste prijavljeni");
    
    jwt.verify(token, "supertajnikljuc", (err, userInfo) => {
        if(err) return res.status(403).json("Token nije validan!");
        if(userInfo.admin){
            organizacije.findAll({
                attributes: ["id", "name"],
            }).then((sveorganizacije) => {
                res.send(sveorganizacije)
            }).catch((err) => {
                console.log(err);
            })    
        }else{
            res.status(403).json("Nemate ovlastenje za ovaj request.");
        }
    })
})

router.post("/dodaj", (req, res) => {
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Niste prijavljeni");
    
    jwt.verify(token, "supertajnikljuc", (err, userInfo) => {
        if(err) return res.status(403).json("Token nije validan!");
        if(userInfo.admin){
            organizacije.create({
                name: req.body.name
            }).then(() => {
                res.status(200).json("Organizacija uspjesno dodana.");
            }).catch((err) => {
                console.log(err);
                res.status(500).json("Greska u dodavanju organizacije.");
            })    
        }else{
            res.status(403).json("Nemate ovlastenje za ovaj request.");
        }
    })
})

router.put("/edit/:id", (req, res) => {
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Niste prijavljeni");
    
    jwt.verify(token, "supertajnikljuc", (err, userInfo) => {
        if(err) return res.status(403).json("Token nije validan!");
        if(userInfo.admin){
            const paramsId = req.params.id;
            const updateFields = {};
            if(req.body.name) updateFields.name = req.body.name;
    
            organizacije.update(updateFields,
            {
                where: {
                    id: paramsId
                },
            }).then(() => {
                res.status(200).json("Organizacija uspjesno izmijenjena.");
            }).catch((err) => {
                console.log(err);
                res.status(500).json("Greska u mijenjanju organizacije.");
            });    
        }else{
            res.status(403).json("Nemate ovlastenje za ovaj request.");
        }
    })
})

router.get("/dohvati/:id", (req, res) => {
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Niste prijavljeni");
    
    jwt.verify(token, "supertajnikljuc", (err, userInfo) => {
        if(err) return res.status(403).json("Token nije validan!");
        if(userInfo.admin){
            const paramsId = req.params.id;
            organizacije.findAll({
                attributes: ["id", "name"],
                where: {
                    id: paramsId
                }
            }).then((sveorganizacije) => {
                res.send(sveorganizacije[0])
            }).catch((err) => {
                console.log(err);
            })    
        }else{
            res.status(403).json("Nemate ovlastenje za ovaj request.");
        }
    })
})

router.delete("/obrisi/:id", (req, res) => {
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Niste prijavljeni");
    
    jwt.verify(token, "supertajnikljuc", (err, userInfo) => {
        if(err) return res.status(403).json("Token nije validan!");
        if(userInfo.admin){
            const paramsId = req.params.id;
    
            organizacije.destroy(
            {
                where: {
                    id: paramsId
                },
            }).then(() => {
                res.status(200).json("Organizacija uspjesno izbrisana.");
            }).catch((err) => {
                console.log(err);
                res.status(500).json("Greska pri brisanju organizacije.");
            });   
        }else{
            res.status(403).json("Nemate ovlastenje za ovaj request.");
        }
    })
})

export default router