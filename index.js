const express = require('express')
const fileUpload = require('express-fileupload')
const nodemailer = require('nodemailer')
const app = express();
const uuid = require('uuid');
const fs = require('fs')

app.use(fileUpload());
const port = process.env.PORT || 3000;
const DELAY = 1 * 10 * 1000 // min * secs * milliseconds
const DELAY2 = 1 * 5 * 1000

app.get('/', (req, res) => {
    res.status(200).send("Welcome Sir Burn");
})

//upload multiple file
app.post('/upload', (req, res) => {
    const filess = req.files.file
    if (filess.length >= 3) {
        for (let i = 0; i < filess.length; i++) {
            filess[i].name = uuid.v4(filess.name) + ".pdf"
            console.log(filess[i])
            filess[i].mv("./uploads/" + filess[i].name, function (err, result) {
                if (err)
                    throw err;
                res.status(200).json(console.log({
                    success: true,
                    message: "file uploaded"
                }))
            })
        }
    }else{
        res.send({
            status : false,
            message : "Minimum 3 File uploaded"
        })
    }


    /*try {
        let promises = []

        filess.forEach((file) => {
            const idName = uuid.v4(filess.name) + ".png"
            const savePath = `./uploads/${idName}`
            promises.push(file.mv(savePath))
        })

        res.json({
            success :  true,
            message : "uploaded!"
        })

        Promise.all(promises)

    } catch (error) {
        console.log(error)
        res.json({
            Error :  "Can't send this file",
            message : `${error}`
        })
    }*/

    const transpoter = nodemailer.createTransport({
        sevice: "outlook",
        host: "smtp-mail.outlook.com",
        port: 587,
        auth: {
            user: "",
            pass: ""
        }
    });
    const transpoter2 = nodemailer.createTransport({
        sevice: "outlook",
        host: "smtp-mail.outlook.com",
        port: 587,
        auth: {
            user: "",
            pass: ""
        }
    });

    const htmlBody = `
      <h1>Apply for jobs Xplode Media</h3>
      <ul>
        <h5>Personal Information</h5>
        <li>Full Name: Lorem ipsum</li>
        <li>Email Address: Lorem ipsum</li>
        <li>Phone Number : Lorem ipsum</li>
        <li>Age : Lorem ipsum</li>
        <br/>
        <li>Address: Lorem ipsum</li>
        <li>City: Lorem ipsum</li>
        <li>Postcode: Lorem ipsum</li>
        <li>State: Lorem ipsum</li>
        <br/><br/><br/>
        Lorem ipsum
      </ul>
      `
    const attachments = filess.map((file) => {
        return { filename: file.name, path: `./uploads/${file.name}` };
    });

    const options = {
        from: "",
        to: "",
        subject: "Sending email with node js testing",
        html: htmlBody,
        attachments: attachments
    };

    const options2 = {
        from: "",
        to: "",
        subject: "Sending email with node js testing",
        text: "Thank you for your submission, we will be in Touhc!"
    };
    setTimeout(function () {
        transpoter2.sendMail(options2, function (err, info) {
            if (err) {
                console.log(err);
            } else {
                console.log("<------Sent Succesfully (User)------>")
                console.log("Sent : " + info.response);
            }
        })
    }, DELAY)

    transpoter.sendMail(options, function (err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log("<------Sent Succesfully (outlook)------>")
            console.log("Sent : " + info.response);
            setTimeout(function () {
                try {
                    for (let i = 0; i < filess.length; i++) {
                        fs.unlinkSync(`./uploads/${filess[i].name}`)
                    }
                    console.log("\n***File Deleted\n")
                    //file removed
                } catch (err) {
                    console.error(err)
                }
            }, DELAY2)
        }
    })
})

app.listen(port, () => console.log(`Listening on port ${port}...`))