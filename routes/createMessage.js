var Intercom = require('intercom-client');

var client = new Intercom.Client({ token: process.env.intercomToken });
// First let's send an email with some example HTML format in the body

// var message = {
//     message_type: "inapp",
//     // subject: "Test HTML email messages",
//     // template: 'personal',
//     "body": "this is a test",
//     from: {
//         type: "admin",
//         id: "2674850"
//     },
//     to: {
//         type: "contact",
//         id: "599d6aeeda850883ed8ba7c2"
//     }
// }

function adminEmailMsg() {
    console.log("Send an admin initiated email message to a lead")
    client.messages.create(message, function (rsp){
        console.log(rsp.body)
    });
}

function listUsers(){
    console.log("create users started");
    client.users.create({
        email: 'ashleytest@gmail.com',
        custom_attributes: {
          foo: 'bar'
        }
      }, callback);      
}