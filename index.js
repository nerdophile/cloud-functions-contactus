const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const gmailEmail = encodeURIComponent(functions.config().gmail.email);
const gmailPassword = encodeURIComponent(functions.config().gmail.password);
const mailTransport = nodemailer.createTransport(
	`smtps://${gmailEmail}:${gmailPassword}@smtp.gmail.com`
);
const admin = require("firebase-admin");
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.sendContactMessage = functions.database
	.ref("/messages/{pushKey}")
	.onWrite((change, context) => {
		console.log("reached");

		const snapshot = change.data;
		console.log(snapshot);
		console.log(change);
		console.log(change.after.data, "data");
		console.log(change.after._data, "_data");

		// Only send email for new messages.
		// if (snapshot.previous.val() || !snapshot.val().name) {
		// 	return;
		// }

		const val = change.after._data;

		const mailOptions = {
			to: "admin@remics.in",
			subject: `${val.subject}`,
			html: val.html
		};
		return mailTransport.sendMail(mailOptions).then(() => {
			return console.log("Mail sent to: test@example.com");
		});
	});
