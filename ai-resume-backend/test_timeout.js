const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: '10.255.255.1', // A blackhole IP that won't respond
    port: 465,
    secure: true,
    connectionTimeout: 5000, // 5 seconds
    greetingTimeout: 5000,
    socketTimeout: 5000,
});

async function test() {
    console.log("Starting send...");
    const start = Date.now();
    try {
        await transporter.sendMail({
            from: "test@example.com",
            to: "test@example.com",
            subject: "test",
            text: "test"
        });
        console.log("Sent successfully.");
    } catch (e) {
        console.log("Failed after", Date.now() - start, "ms. Error:", e.message);
    }
}

test();
