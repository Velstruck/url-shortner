import express from 'express';
import asyncHandler from 'express-async-handler';
import UAParser from 'ua-parser-js';
import Url from '../models/Url.js';
import Analytics from '../models/Analytics.js';

const router = express.Router();

// This will catch /abc123, /custom-alias, etc.
router.get('/:shortId', asyncHandler(async (req, res) => {
  const { shortId } = req.params;

  const url = await Url.findOne({
    $or: [{ shortId }, { customAlias: shortId }]
  });

  if (!url) return res.status(404).send('URL not found');

  if (url.expirationDate && new Date() > url.expirationDate) {
    return res.status(410).send('URL has expired');
  }

  const parser = new UAParser(req.headers['user-agent']);
  const ua = parser.getResult();

  Analytics.create({
    url: url._id,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    device: ua.device.type || 'desktop',
    browser: ua.browser.name,
    os: ua.os.name
  }).catch(err => console.error('Analytics error:', err));

  url.clicks += 1;
  await url.save();

  res.redirect(url.longUrl);
}));

export default router;
