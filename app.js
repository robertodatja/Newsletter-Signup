const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const configss = require("./Configs");//Secure
const app = express();

app.use(express.static(__dirname)); //2
app.use(bodyParser.urlencoded({
 extended: true
})); //3.1


app.get("/", function(req, res) {
 res.sendFile(__dirname + "/signup.html");
});


app.post("/", function(req, res) { //3.2
 const firstName = req.body.fname;
 const lastName = req.body.lname;
 const email = req.body.emaili;
 console.log(firstName, lastName, email);

 /*-------------------------------------------------------------------------*/
 /*STEP1  Create a JS object*/
 const data = {
  members: [{
   email_address: email,
   status: 'subscribed',
   merge_fields: {
    FNAME: firstName,
    LNAME: lastName
   }
  }]
 };

 const jsonData = JSON.stringify(data); // the data that we will sent to MailChimp's server


 /*-------------------------------------------------------------------------*/
 //STEP2  POST the data to external resource (MailChimp's Server)

 const url = "https://us" + configss.us_nr + ".api.mailchimp.com/3.0/lists/" + configss.list_id;
 console.log(url);
 const options = { //JS object
  method: "POST",
  auth: configss.us_name+":"+configss.API_Key
 };

 //ose   const options = { method: "POST",  headers:{Authorization: configss.us_name+":"+configss.API_Key} }


 const request = https.request(url, options, function(response) {

  //STEP3 Add success/failure
  if (response.statusCode === 200) {
   res.sendFile(__dirname + "/success.html");
  } else {
   res.sendFile(__dirname + "/failure.html");
  }

  response.on("data", function(data) {
   console.log(JSON.parse(data)); //back response data from MailChimp

  });
 });

 //pass data to MailChimp's Server
 request.write(jsonData);
 request.end();
});


//STEP3.5
app.post("/failure.html", function(req, res) {
 res.redirect("/");
})

/*-------------------------------------------------------------------------*/
//STEP4 Heroku
app.listen(process.env.PORT|| 3000, function() { //0
 console.log("The server is running on port 3000");
});




/*
STEP0
https://mailchimp.com/developer/marketing/guides/create-your-first-audience/
API Key   .....
Audeience ID or List ID   .....
List of my subscribed: https://usXX.admin.mailchimp.com/lists/members?id=.....
*/
