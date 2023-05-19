/**
 * Useful links : 
 * 1.https://www.youtube.com/watch?v=OCZscohrv1s
 * 2.https://www.youtube.com/watch?v=Kb8_LSbWBaA
 * 3.https://www.section.io/engineering-education/compile-your-nodejs-application-into-a-exe-file/#nexe
 * 4.https://github.com/nexe/nexe
 */
const express = require('express');
const fileupload = require('express-fileupload');
const converter = require('./index.js');
const open = require('open');

const app = express();

app.use(fileupload());

app.post("/upload", function(req, res) {
    //get the file
    const file = req.files.fichierpnm;
    console.log(file);

    const uploadPath = __dirname + "/" + file.name;
    console.log(uploadPath);

    file.mv(uploadPath, function(err){
        if(err){
            return res.status(500).send(err);
        } else {
            // res.status(200).send("Fichier uploadé avec succés !");
            res.status(200).sendFile(__dirname + "../html/result.html");
            converter(uploadPath);
            setTimeout(() => res.download(__dirname + "/results.xml"), 500);
        }
    });

});

app.get("/download-file", (req, res)=>{
    res.download(__dirname + "/results.xml");
});

app.get("*", (req, res)=>{
    res.sendFile(__dirname + "../html/base.html");
});

app.listen(5000, ()=>{
    console.log("http://localhost:5000/");
    open("http://localhost:5000/");
});