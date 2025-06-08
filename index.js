const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const express = require('express');
const axios = require('axios');

const app = express(); // ✅ DECLARE app BEFORE using app.get

let latestQr = null;

// Serve QR via browser
app.get('/qr', async (req, res) => {
    if (!latestQr) return res.status(404).send('No QR yet');
    const qrImage = await qrcode.toDataURL(latestQr);
    res.send(`<img src="${qrImage}" />`);
});

app.get('/', (_, res) => res.send('✅ WhatsApp Web.js API is running'));
app.listen(3000, () => console.log('🌐 Express server running at http://localhost:3000'));

const client = new Client({
    authStrategy: new LocalAuth({ clientId: "client-one" }),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', qr => {
    latestQr = qr;
    console.log('📲 QR code updated');
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

    // Auto reply logic
    if (msg.body.toLowerCase() === 'hi') {
        await msg.reply('hello');
        console.log('🤖 Replied with "hello"');
    }

    // Optional: forward to your backend API
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
