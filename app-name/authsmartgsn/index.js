import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import nodemailer from "nodemailer";

// Initialize Firebase Admin SDK
admin.initializeApp();

// Configure the email transporter using your SMTP settings
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "yorkassurancecases@gmail.com",
    pass: "YorkAssuranceGSN2024",
  },
});

// Cloud Function to send an email when a user is created
exports.sendAccountCreationEmail = functions.auth.user().onCreate((user) => {
  const email = user.email;
  const mailOptions = {
    from: "yorkassurancecases@gmail.com",
    to: email,
    subject: "Welcome to SmartGSN!",
    text: `Hi ${email},\n\nThank you for signing up 
    for SmartGSN! We're excited to have you on board.\n\nBest 
    regards,\nSmartGSN Team`,
  };

  return transporter.sendMail(mailOptions)
      .then(() => {
        console.log("Welcome email sent to:", email);
      })
      .catch((error) => {
        console.error("Error sending welcome email:", error);
      });
});


// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
