const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const axios = require('axios');

const client = new Client({
    authStrategy: new LocalAuth({ clientId: "client-one" }),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

let latestQr = null;

client.on('qr', qr => {
    latestQr = qr;
    console.log('📲 QR code updated');
});

app.get('/qr', async (req, res) => {
    if (!latestQr) return res.status(404).send('No QR yet');
    const qrImage = await qrcode.toDataURL(latestQr);
    res.send(`<img src="${qrImage}" />`);
});


client.on('ready', () => {
    console.log('✅ Client is ready and connected to WhatsApp');
});

client.on('auth_failure', msg => {
    console.error('❌ Authentication failed:', msg);
});

client.on('disconnected', reason => {
    console.warn('⚠️ Client was disconnected:', reason);
});

client.on('message', async msg => {
    console.log('📩 MESSAGE RECEIVED:', msg.body);

    if (msg.from.includes('@g.us')) {
        console.log('⚠️ Skipping group message');
        return;
    }

    try {
        await axios.post('https://your-api.com/api/new-order', {
            from: msg.from.replace(/\D/g, ''),
            message: msg.body
        });
        console.log('📤 Message forwarded to API');
    } catch (err) {
        console.error('❌ Failed to send to API:', err.message);
    }
});

client.initialize();

const app = express();
app.get('/', (_, res) => res.send('✅ WhatsApp Web.js API is running'));
app.listen(3000, () => console.log('🌐 Express server running at http://localhost:3000'));