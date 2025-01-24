import express from "express";
import jwt from "jsonwebtoken";
import moment from "moment";
import nodeMailer from "nodemailer";
import schedule from "node-schedule";
import {createRequire} from "module";
const require = createRequire(import.meta.url);

const {iznajmljeno, sequelize, knjige} = require("../models");

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

const posaljiPodsjetnike = async () => {
    try{
        const sutra = moment().add(1, 'day').startOf('day').toDate();
        const sutraFormat = moment(sutra).format('YYYY-MM-DD');
        sequelize.query(
            `
            select k.fullName, k.email, kn.name, i.rentDate, i.rentExpireDate 
            from
            iznajmljeno i
            JOIN korisnici k ON i.userid = k.id
            JOIN knjige kn ON kn.id = i.bookid
            WHERE
            i.rentExpireDate = ?
            `, {
                replacements: [sutraFormat]
            }).then(([results]) => {
                if(results.length === 0) return console.log("Sutra niko ne mora vratiti knjigu!");
                const naseSutra = moment(sutra).format('DD-MM-YYYY');
                for(const rental of results){
                    const datum = moment(rental.rentDate).format('DD-MM-YYYY');
                    const naslov = `${rental.fullName}, podsjecamo vas na vracanje knjige.`;
                    const body = `
                    <p> Hvala vam na iznajmljivanju knjige ${rental.name}! </p>
                    <p> Iznajmili ste knjigu na datum: ${datum}. </p>
                    <p> Krajnji rok kada bi trebali vratiti vasu knjigu je sutra, tacnije ${naseSutra} </p>
                    <p> Hvala vam na razumijevanju! </p>
                    `
                    posaljiEmail(rental.email, naslov, body);
                }
            }).catch((err) => {
                console.log(err);
            })    
    }catch(err){
        console.log(err);
    }
}

schedule.scheduleJob('0 13 * * *', async () => {
    console.log('Pokrecem podsjetnik funkciju');
    await posaljiPodsjetnike();
});


router.get("/sve", (req, res) => {
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Niste prijavljeni");
    
    jwt.verify(token, "supertajnikljuc", (err, userInfo) => {
        if(err) return res.status(403).json("Token nije validan!");
        if(userInfo.admin){
            sequelize.query(
                `
                SELECT i.id, ko.fullName, k.name, i.rentDate, i.rentExpireDate  
                FROM iznajmljeno i
                JOIN knjige k ON i.bookid = k.id
                JOIN korisnici ko ON ko.id = i.userid;
                `).then(([results]) => {
                    res.status(200).json(results);
                }).catch((err) => {
                    console.log(err);
                    res.status(500).json("Greska u dohvatanju podataka")
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
        knjige.findAll({
            attributes: ["id", "name",  "quantity"],
            where: {
                id: req.body.bookid
            }
        }).then((sveknjige) => {
            if(sveknjige[0].quantity == 0) return res.json("Knjiga vise nije na stanju!");

            const rentDate = moment().format("YYYY-MM-DD");
            const rentExpireDate = moment().add(req.body.dayDuration, 'days').format("YYYY-MM-DD");
                iznajmljeno.create({
                    userid: userInfo.id,
                    bookid: req.body.bookid,
                    rentDate: rentDate,
                    rentExpireDate: rentExpireDate
                }).then(() => {
                    const modifikovaniExpire = moment().add(req.body.dayDuration, 'days').format("DD-MM-YYYY");
                    const naslov = `Uspjesno ste iznajmili knjigu ${sveknjige[0].name}.`;
                    const body = `
                    <p> ${userInfo.fullname}, hvala na iznajmljivanju knjige! </p>
                    <p> Krajnji rok kada bi trebali vratiti vasu knjigu je ${modifikovaniExpire} </p>
                    `
                    posaljiEmail(userInfo.email, naslov, body);
                    res.status(200).json("Uspjesno ste iznajmili knjigu.");
                }).catch((err) => {
                    console.log(err);
                    res.status(500).json("Greska u iznajmljivanju knjige.");
                })
        }).catch((err) => {
            console.log(err);
        })
    })
})

router.delete("/obrisi/:id", (req, res) => {
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Niste prijavljeni");
    
    jwt.verify(token, "supertajnikljuc", (err, userInfo) => {
        if(err) return res.status(403).json("Token nije validan!");
        if(userInfo.admin){
            const paramsId = req.params.id;
        
            iznajmljeno.destroy(
            {
                where: {
                    id: paramsId
                },
            }).then(() => {
                res.status(200).json("Iznajmljeni termin uspjesno izbrisan.");
            }).catch((err) => {
                console.log(err);
                res.status(500).json("Greska pri brisanju iznajmljenog termina.");
            });    
        }else{
            res.status(403).json("Nemate ovlastenje za ovaj request.");
        }
    })
})

export default router