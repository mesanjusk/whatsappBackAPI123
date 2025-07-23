require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const Redis = require('ioredis');
const { createAdapter } = require('@socket.io/redis-adapter');
const WhatsAppService = require('./Services/WhatsAppService');
const { router: qrRouter } = require('./Routes/qr');

const app = express();
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use('/qr', qrRouter);

async function start() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Mongo connected');

  let redis;
  if (process.env.REDIS_URI) {
    redis = new Redis(process.env.REDIS_URI);
    redis.on('error', err => console.error('Redis error', err));
    const sub = new Redis(process.env.REDIS_URI);
    io.adapter(createAdapter(redis, sub));
  }

  const wa = new WhatsAppService(io);
  await wa.init();

  const port = process.env.PORT || 3000;
  server.listen(port, () => console.log(`🌐 Server running on port ${port}`));
}

start().catch(err => {
  console.error(err);
  process.exit(1);
});
