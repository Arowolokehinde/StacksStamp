const express = require('express');
const router = express.Router();
const stacksService = require('../services/stacksService');

/**
 * GET /api/events/:eventId
 * Get event details by ID
 */
router.get('/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await stacksService.getEvent(parseInt(eventId));

    res.json({
      success: true,
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/events
 * Get all events (paginated)
 */
router.get('/', async (req, res) => {
  try {
    const { offset = 0, limit = 50 } = req.query;
    const events = await stacksService.getAllEvents(parseInt(offset), parseInt(limit));

    res.json({
      success: true,
      data: events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/events/:eventId/check-ins
 * Get all check-ins for a specific event
 */
router.get('/:eventId/check-ins', async (req, res) => {
  try {
    const { eventId } = req.params;
    const { limit = 100 } = req.query;
    const checkIns = await stacksService.getEventCheckIns(parseInt(eventId), parseInt(limit));

    res.json({
      success: true,
      data: checkIns,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/events/creator/:address
 * Get events created by a specific address
 */
router.get('/creator/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const { limit = 50 } = req.query;
    const events = await stacksService.getEventsByCreator(address, parseInt(limit));

    res.json({
      success: true,
      data: events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
