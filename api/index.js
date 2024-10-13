const express = require("express");
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();

const corsOptions = {
    origin: [
        'https://touchcar.kiev.ua',
        'http://localhost:5173'
    ],
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

const TELEGRAM_API_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

const chatIds = [
    process.env.TELEGRAM_CHAT_ID_FIRST,
    process.env.TELEGRAM_CHAT_ID_SECOND,
    process.env.TELEGRAM_CHAT_ID_THIRD
];

app.get("/", (req, res) => res.send("Express on Vercel"));
app.post('/send-message', async (req, res) => {
    const {
        userName,
        userPhone,
        carEngineType,
        carBudgetType,
        selectedCarType,
        presentTypeForCar
    } = req.body;

    const message = `
        *Нове замовлення на автомобіль!*

*Тип кузова:* ${selectedCarType}
*Тип пального:* ${carEngineType}
*Бюджет:* ${carBudgetType}
*Подарунок:* ${presentTypeForCar}

*Контактна інформація:*
*Ім'я:* ${userName}
*Телефон:* ${userPhone}
    `;

    try {
        await Promise.all(chatIds.map(chatId =>
            axios.post(TELEGRAM_API_URL, {
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown'
            })
        ));

        res.status(200).send({ status: 'Message sent' });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).send({ status: 'Failed to send message' });
    }
});
app.listen(3000, () => console.log("Server ready on port 3000."));

module.exports = app;
