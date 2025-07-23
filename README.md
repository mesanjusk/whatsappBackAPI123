# Baileys Enterprise Boilerplate

This project provides a scalable WhatsApp automation setup using the [Baileys](https://github.com/adiwajshing/Baileys) library.

## Features

- Express server with Socket.IO for real-time events
- MongoDB persistence for WhatsApp credentials
- Optional Redis adapter for horizontal Socket.IO scaling
- PM2 ready and Docker ready

## Folder Structure

```
baileys-enterprise/
├── Services/
│   └── WhatsAppService.js
├── Models/
│   └── Session.js
├── Routes/
│   └── qr.js
├── server.js
├── .env.example
├── package.json
```

## Getting Started

1. Copy `.env.example` to `.env` and update the variables.
2. Install dependencies:

```bash
npm install
```

3. Start the server in development:

```bash
npm run dev
```

The server exposes `/qr` to fetch the latest QR code and broadcasts QR events via WebSocket.

### Docker

Build and run using Docker:

```bash
docker build -t baileys-enterprise .
docker run --env-file .env -p 3000:3000 baileys-enterprise
```

### PM2

For production, use the provided `ecosystem.config.js`:

```bash
pm install pm2 -g
pm run build  # optional build steps
pm2 start ecosystem.config.js
```

