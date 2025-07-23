const express = require('express');
const router = express.Router();

let latestQr = null;

function setLatest(qr) {
  latestQr = qr;
}

router.get('/', (req, res) => {
  if (!latestQr) return res.status(404).json({ message: 'No QR yet' });
  res.json({ qr: latestQr });
});

module.exports = { router, setLatest };
