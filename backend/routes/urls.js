import express from 'express';
import asyncHandler from 'express-async-handler';
import UAParser from 'ua-parser-js';
import { protect } from '../middleware/auth.js';
import Url from '../models/Url.js';
import Analytics from '../models/Analytics.js';

const router = express.Router();

// @desc    Create short URL
// @route   POST /api/urls
// @access  Private
router.post('/', protect, asyncHandler(async (req, res) => {
  const { longUrl, customAlias, expirationDate } = req.body;

  // Check if custom alias is already taken
  if (customAlias) {
    const existingUrl = await Url.findOne({ customAlias });
    if (existingUrl) {
      res.status(400);
      throw new Error('Custom alias is already taken');
    }
  }

  const url = await Url.create({
    user: req.user._id,
    longUrl,
    customAlias,
    expirationDate: expirationDate || null
  });

  res.status(201).json(url);
}));

// @desc    Get all URLs for a user
// @route   GET /api/urls
// @access  Private
router.get('/', protect, asyncHandler(async (req, res) => {
  const urls = await Url.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(urls);
}));

// @desc    Get URL analytics
// @route   GET /api/urls/:shortId/analytics
// @access  Private
router.get('/:shortId/analytics', protect, asyncHandler(async (req, res) => {
  const url = await Url.findOne({
    $or: [{ shortId: req.params.shortId }, { customAlias: req.params.shortId }],
    user: req.user._id
  });

  if (!url) {
    res.status(404);
    throw new Error('URL not found');
  }

  const analytics = await Analytics.find({ url: url._id });

  // Process analytics data
  const clicksByDate = {};
  const deviceStats = {};
  const browserStats = {};

  // Initialize last 7 days with 0 clicks
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    clicksByDate[dateStr] = 0;
  }

  analytics.forEach(click => {
    // Group by date (only count clicks within last 7 days)
    const date = click.timestamp.toISOString().split('T')[0];
    if (clicksByDate.hasOwnProperty(date)) {
      clicksByDate[date] += 1;
    }

    // Group by device (initialize with 0 if not present)
    const device = click.device || 'unknown';
    deviceStats[device] = (deviceStats[device] || 0) + 1;

    // Group by browser (initialize with 0 if not present)
    const browser = click.browser || 'unknown';
    browserStats[browser] = (browserStats[browser] || 0) + 1;
  });

  // Convert clicksByDate to sorted array for chart
  const clicksOverTime = Object.entries(clicksByDate)
    .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
    .map(([date, clicks]) => ({ date, clicks }));

  // Convert device stats to array for chart
  const deviceDistribution = Object.entries(deviceStats)
    .map(([device, count]) => ({ device, count }))
    .sort((a, b) => b.count - a.count);

  res.json({
    url,
    analytics: {
      totalClicks: url.clicks,
      clicksOverTime,
      deviceDistribution,
      browserStats
    }
  });
}));

// @desc    Redirect to original URL and log analytics
// @route   GET /api/urls/:shortId
// @access  Public
router.get('/:shortId', asyncHandler(async (req, res) => {
  const url = await Url.findOne({
    $or: [{ shortId: req.params.shortId }, { customAlias: req.params.shortId }]
  });

  if (!url) {
    res.status(404);
    throw new Error('URL not found');
  }

  // Check if URL has expired
  if (url.expirationDate && new Date() > url.expirationDate) {
    res.status(410);
    throw new Error('URL has expired');
  }

  // Parse user agent
  const parser = new UAParser(req.headers['user-agent']);
  const userAgent = parser.getResult();

  // Log analytics asynchronously
  Analytics.create({
    url: url._id,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    device: userAgent.device.type || 'desktop',
    browser: userAgent.browser.name,
    os: userAgent.os.name
  }).catch(error => console.error('Error logging analytics:', error));

  // Increment click count
  url.clicks += 1;
  await url.save();

  res.redirect(url.longUrl);
}));

export default router;