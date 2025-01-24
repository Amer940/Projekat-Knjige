import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodeMailer from "nodemailer";
import {createRequire} from "module";
const require = createRequire(import.meta.url);

const {korisnici, organizacije, sequelize} = require("../models");

const router = express.Router();

const posaljiEmail = async (recipientEmail, subject, html) => {

    const transporter = nodeMailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'aamer.talo@gmail.com',
            pass: 'obkx hbqc ldpu omhx'
        }, 
    });

    const mailOptions = {
        from: 'aamer.talo@gmail.com',
        to: recipientEmail,
        subject: `${subject}`,
        html: `${html}`
    }

    try{
        await transporter.sendMail(mailOptions);
        console.log(`Uspjesno poslan mail na email: ${recipientEmail}`);
    }catch(err){
        console.log(err);
    }
}


router.get("/svi", (req, res) => {
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Niste prijavljeni");
    
    jwt.verify(token, "supertajnikljuc", (err, userInfo) => {
        if(err) return res.status(403).json("Token nije validan!");

        sequelize.query(
            `
            SELECT k.id, fullName, username, email, birthdate, o.name as organisation, role 
            FROM korisnici k
            JOIN organizacije o
            on k.organisation = o.id
                `).then(([results]) => {
                    res.status(200).json(results);
                }).catch((err) => {
                    console.log(err);
                    res.status(500).json("Greska u dohvatanju podataka")
                })
    })
})

router.get("/logged", (req, res) => {
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Niste prijavljeni");
    
    jwt.verify(token, "supertajnikljuc", (err, userInfo) => {
        if(err) return res.status(403).json("Token nije validan!");

        organizacije.findAll({
            attributes: ["id", "name"],
            where: {
                id: userInfo.organisation
            }
        }).then((organizacija) => {
            res.send([
                userInfo.admin,
                organizacija[0].name,
                userInfo.fullname,
                userInfo.email
            ]);
        })

        
    })
})

router.post("/dodaj", (req, res) => {
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Niste prijavljeni");
    
    jwt.verify(token, "supertajnikljuc", (err, userInfo) => {
        if(err) return res.status(403).json("Token nije validan!");
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    
        korisnici.findAll({
            attributes: ["id", "username", "email"],
            where: {
                username: req.body.username
            }
        }).then((svikorisnici) => {
            if(svikorisnici.length !== 0) return res.json("Korisnik s tim imenom vec postoji!");
            
            korisnici.create({
                fullName: req.body.fullName,
                username: req.body.username,
                password: hashedPassword,
                email: req.body.email,
                birthdate: req.body.birthdate,
                organisation: req.body.organisation,
                role: req.body.role
            }).then(() => {
                const naslov = "Profil sa vasom email adresom je upravo dodan u biblioteku.";
                const body = `
                    <p> ${req.body.fullName}, dodani ste u biblioteku! </p>
                    <p> Koristite vase podatke za prijavu: <br> <b>username: ${req.body.username}</b><br> <b>password: ${req.body.password}</b> </p>
                `
                posaljiEmail(req.body.email, naslov, body);
                res.status(200).json("Korisnik uspjesno dodan.");
            }).catch((err) => {
                console.log(err);
                res.status(500).json("Greska u dodavanju korisnika.");
            })
            
        }).catch((err) => {
            console.log(err);
        })
        
        
    })
})

router.put("/edit/:id", (req, res) => {
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Niste prijavljeni");
    
    jwt.verify(token, "supertajnikljuc", (err, userInfo) => {
        if(err) return res.status(403).json("Token nije validan!");
        if(userInfo.admin){
            const paramsId = req.params.id;
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    
            const updateFields = {};
            if(req.body.fullName) updateFields.fullName = req.body.fullName;
            if(req.body.username) updateFields.username = req.body.username;
            if(req.body.password) updateFields.password = hashedPassword;
            if(req.body.email) updateFields.email = req.body.email;
            if(req.body.birthdate) updateFields.birthdate = req.body.birthdate;
            if(req.body.organisation) updateFields.organisation = req.body.organisation;
            if(req.body.role) updateFields.role = req.body.role;
        
            korisnici.update(updateFields,
            {
                where: {
                    id: paramsId
                },
            }).then(() => {
                korisnici.findAll({
                    attributes: ["id", "fullName", "email"],
                    where: {
                        id: paramsId
                    }
                }).then((korisnik) => {
                    const naslov = "Profil sa vasom email adresom je upravo izmijenjen u biblioteci.";
                    const body = `
                    <p> ${korisnik[0].fullName}, vasi podaci su izmijenjeni! </p>
                    <p> Priupitajte admina za detaljnije informacije. </p>
                    `
                    posaljiEmail(korisnik[0].email, naslov, body);    
                })

                res.status(200).json("Korisnik uspjesno izmijenjen.");
            }).catch((err) => {
                console.log(err);
                res.status(500).json("Greska u mijenjanju korisnika.");
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
            korisnici.findAll({
                attributes: ["id", "fullName", "username", "email", "organisation", "role"],
                where: {
                    id: paramsId
                }
            }).then((svikorisnici) => {
                res.send(svikorisnici[0])
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

            korisnici.findAll({
                attributes: ["id", "fullName", "email"],
                where: {
                    id: paramsId
                }
            }).then((korisnik) => {
                const naslov = "Profil sa vasom email adresom je upravo izbrisan iz biblioteke.";
                const body = `
                <p> ${korisnik[0].fullName}, izbrisani ste iz biblioteke! </p>
                <p> Vidimo se neki drugi put. </p>
                `
                korisnici.destroy(
                {
                    where: {
                        id: paramsId
                    },
                }).then(() => {
                        res.status(200).json("Korisnik uspjesno izbrisan.");
                        posaljiEmail(korisnik[0].email, naslov, body); 
                }).catch((err) => {
                    console.log(err);
                    res.status(403).json("Korisnik ima iznajmljenu knjigu i ne moze biti obrisan!");
                })
                   
            }).catch((err) => {
                console.log(err);
                res.status(500).json("Greska pri brisanju korisnika.");
            });    
        }else{
            res.status(403).json("Nemate ovlastenje za ovaj request.");
        }
    })
})

export default router
