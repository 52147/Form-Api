// inlcude express 
const express = require("express");

//googleapis
const { google } = require("googleapis");

//initilize express
const app = express();

//set app view engine
app.set("view engine", "ejs");

app.get('/', function (req, res) {
  res.render('form', {});
});

app.post("/", async (req, res) => {
    // const { request, name } = req.body;
    const auth = new google.auth.GoogleAuth({
        keyFile: "keys.json", //the key file
        //url to spreadsheets API
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    //Auth client Object
    const authClientObject = await auth.getClient();

    //Google sheets instance
    const googleSheetsInstance = google.sheets({ version: "v4", auth: authClientObject });

    // spreadsheet id : 要从Google表单的URL中获取电子表格ID。它是你的电子表格的URL中/d/ 和/edit 之间的字母数字值。
    const spreadsheetId = "1LdT4qowdgj_Kofr-37uV8Nj5vgjFUrhxbH7A3jCWL7Q";

    //write data into the google sheets
    await googleSheetsInstance.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: "Sheet1!A:B",
        valueInputOption: "USER_ENTERED",
        resource: {
            values: [["Git followers tutorial", "Mia Roberts"]],
        },
    });

    //Read front the spreadsheet
    const readData = await googleSheetsInstance.spreadsheets.values.get({
        auth, //auth object
        spreadsheetId, // spreadsheet id
        range: "Sheet1!A:A", //range of cells to read from.
    })

    //send the data reae with the response
    res.send(readData.data)
    // res.render('form', {});
    
    // res.redirect("/");
    
})


const port = 3000;
app.listen(port, () => {
    console.log(`server started on ${port}`)
});