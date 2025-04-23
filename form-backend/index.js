const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const multer = require("multer");
const app = express();
const PORT = process.env.PORT || 3000;

const upload = multer({ storage: multer.memoryStorage() });
app.use(cors());
app.use(express.json());

app.post("/submit", upload.single("file"), async (req, res) => {
  const { name, email, message } = req.body;
  const file = req.file;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // or use SMTP config for better reliability
      auth: {
        user: "your.email@gmail.com",
        pass: "your-app-password" // NOT your Gmail password
      },
    });

    const mailOptions = {
      from: "your.email@gmail.com",
      to: "destination@email.com",
      subject: "New Form Submission",
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      attachments: file ? [{
        filename: file.originalname,
        content: file.buffer
      }] : [],
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Email send error:", error);
    res.status(500).json({ success: false, error: "Email failed to send" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
