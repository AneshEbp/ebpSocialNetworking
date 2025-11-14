// import nodemailer from "nodemailer";
// import hbs from "nodemailer-express-handlebars";
// export const sendMail = async (
//   to: string,
//   subject: string,
//   template: string,
//   context: {}
// ) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       // port: 465,
//       // secure: true,
//       port: 587,
//       secure: false,
//       auth: {
//         user: process.env.APP_EMAIL,
//         pass: process.env.APP_PASS,
//       },
//     });
//     const hbsOptions = {
//       viewEngine: {
//         extname: ".hbs",
//         partialsDir: "./views/partials",
//         layoutsDir: "./views/layouts",
//       },
//       viewPath: "./views",
//       extName: ".handlebars",
//     };
//     transporter.use("compile", hbs(hbsOptions));
//     const mailOptions = {
//       from: process.env.APP_EMAIL,
//       to,
//       subject,
//       template: `${template}`,
//       context: context,
//     };
//     await transporter.sendMail(mailOptions);
//     console.log("Email sent successfully");
//   } catch (error) {
//     console.error("Error sending email:", error);
//   }
// };
import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
export const sendMail = async (to, subject, template, context) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.sendgrid.net",
            port: 587, // recommended by SendGrid
            secure: false, // must be false for port 587
            auth: {
                user: "apikey", // literally the word 'apikey'
                pass: process.env.SG_APIKEY, // your SendGrid API key
            },
        });
        const hbsOptions = {
            viewEngine: {
                extname: ".hbs",
                partialsDir: "./views/partials",
                layoutsDir: "./views/layouts",
            },
            viewPath: "./views",
            extName: ".handlebars",
        };
        transporter.use("compile", hbs(hbsOptions));
        const mailOptions = {
            from: process.env.SENDGRID_FROM_EMAIL, // MUST be a verified sender in SendGrid
            to,
            subject,
            template,
            context,
        };
        await transporter.sendMail(mailOptions);
        // console.log("Email sent successfully (SendGrid)");
    }
    catch (error) {
        console.error("Error sending email:", error);
    }
};
//# sourceMappingURL=sendMail.js.map