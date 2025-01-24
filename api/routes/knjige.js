import express from "express";
import jwt from "jsonwebtoken";
import {createRequire} from "module";
const require = createRequire(import.meta.url);

const {knjige, sequelize} = require("../models");
const router = express.Router();

router.get("/sve", (req, res) => {
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Niste prijavljeni");

    jwt.verify(token, "supertajnikljuc", (err, userInfo) => {
        if(err) return res.status(403).json("Token nije validan!");

        knjige.findAll({
            attributes: ["id", "name", "quantity", "image", "rentedNum"],
        }).then((sveknjige) => {
            res.send(sveknjige)
        }).catch((erro) => {
            console.log(erro);
        })
    })
})

router.post("/dodaj", (req, res) => {
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Niste prijavljeni");

    jwt.verify(token, "supertajnikljuc", (err, userInfo) => {
        if(err) return res.status(403).json("Token nije validan!");
        if(userInfo.admin){
            knjige.findAll({
                attributes: ["id", "name"],
                where: {
                    name: req.body.knjiga.name
                }
            }).then((svikorisnici) => {
                
                if(svikorisnici.length !== 0) return res.json("Knjiga s tim imenom vec postoji!");
                    knjige.create({
                        name: req.body.knjiga.name,
                        quantity: req.body.knjiga.quantity,
                        image: req.body.knjigaUrl,
                        rentedNum: 0
                    }).then(() => {
                        res.status(200).json("Knjiga uspjesno dodana.");
                    }).catch((err) => {
                        console.log(err);
                        res.status(500).json("Greska u dodavanju knjige.");
                    })
            }).catch((err) => {
                console.log(err);
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
            console.log(req.body)
            if(req.body.knjiga.name) updateFields.name = req.body.knjiga.name;
            if(req.body.knjiga.quantity) updateFields.quantity = req.body.knjiga.quantity;
            if(req.body.knjigaUrl) updateFields.image = req.body.knjigaUrl;
        
            knjige.update(updateFields,
            {
                where: {
                    id: paramsId
                },
            }).then(() => {
                res.status(200).json("Knjiga uspjesno izmijenjena.");
            }).catch((err) => {
                console.log(err);
                res.status(500).json("Greska u mijenjanju knjige.");
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
            knjige.findAll({
                attributes: ["id", "name", "quantity"],
                where: {
                    id: paramsId
                }
            }).then((sveknjige) => {
                res.send(sveknjige[0])
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
            knjige.destroy(
            {
                where: {
                    id: paramsId
                },
            }).then(() => {
                res.status(200).json("Knjiga uspjesno izbrisana.");
            }).catch((err) => {
                console.log(err);
                res.status(500).json("Greska pri brisanju knjige. Knjiga ne smije biti iznajmljena ukoliko je zelite izbrisati.");
            });
        }else{
            res.status(403).json("Nemate ovlastenje za ovaj request.");
        }
    })
})

router.get("/mojeknjige", (req, res) => {
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Niste prijavljeni");
    
    jwt.verify(token, "supertajnikljuc", (err, userInfo) => {
        if(err) return res.status(403).json("Token nije validan!");

        sequelize.query(
            `
            SELECT k.name, i.rentDate, i.rentExpireDate 
            FROM iznajmljeno i
            JOIN knjige k
            ON i.bookid = k.id
            JOIN korisnici ko
            ON ko.id = i.userid
            where ko.id = ?
                `, {
                    replacements: [userInfo.id]
                }).then(([results]) => {
                    res.status(200).json(results);
                }).catch((err) => {
                    console.log(err);
                    res.status(500).json("Greska u dohvatanju podataka")
                })
    })
})

export default router