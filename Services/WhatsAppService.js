const { default: makeWASocket, useMultiFileAuthState } = require('@adiwajshing/baileys');
const fs = require('fs');
const path = require('path');
const Session = require('../Models/Session');
const { setLatest } = require('../Routes/qr');

class WhatsAppService {
  constructor(io) {
    this.io = io;
    this.sock = null;
  }

  async init() {
    const { state, save } = await this._initAuth();
    this.sock = makeWASocket({ auth: state, printQRInTerminal: false });

    this.sock.ev.on('creds.update', save);

    this.sock.ev.on('connection.update', ({ connection, qr }) => {
      if (qr) {
        setLatest(qr);
        this.io.emit('qr', qr);
      }
      if (connection === 'open') {
        console.log('✅ WhatsApp connected');
      }
    });

    this.sock.ev.on('messages.upsert', async ({ messages }) => {
      const msg = messages[0];
      if (!msg.key.fromMe && msg.message?.conversation) {
        console.log('📩', msg.message.conversation);
      }
    });
  }

  async _initAuth() {
    const authFolder = './auth_info';
    if (!fs.existsSync(authFolder)) fs.mkdirSync(authFolder, { recursive: true });

    const doc = await Session.findById('auth');
    if (doc) {
      fs.writeFileSync(path.join(authFolder, 'creds.json'), JSON.stringify(doc.data.creds));
      fs.writeFileSync(path.join(authFolder, 'keys.json'), JSON.stringify(doc.data.keys));
    }

    const { state, saveState } = await useMultiFileAuthState(authFolder);

    const saveToMongo = async () => {
      const data = {
        creds: JSON.parse(fs.readFileSync(path.join(authFolder, 'creds.json'))),
        keys: JSON.parse(fs.readFileSync(path.join(authFolder, 'keys.json')))
      };
      await Session.findByIdAndUpdate('auth', { data }, { upsert: true });
    };

    const save = async () => {
      await saveState();
      await saveToMongo();
    };

    return { state, save };
  }
}

module.exports = WhatsAppService;
