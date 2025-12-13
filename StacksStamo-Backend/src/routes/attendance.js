const express = require('express');
const router = express.Router();
const stacksService = require('../services/stacksService');

/**
 * GET /api/attendance/:eventId/:address
 * Check if address attended event and get timestamp
 */
router.get('/:eventId/:address', async (req, res) => {
  try {
    const { eventId, address } = req.params;

    const [didAttend, attendance] = await Promise.all([
      stacksService.didAttend(parseInt(eventId), address),
      stacksService.getAttendance(parseInt(eventId), address),
    ]);

    res.json({
      success: true,
      data: {
        eventId: parseInt(eventId),
        attendee: address,
        didAttend,
        timestamp: attendance,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/attendance/:eventId/:address/status
 * Simple boolean check if user attended
 */
router.get('/:eventId/:address/status', async (req, res) => {
  try {
    const { eventId, address } = req.params;
    const didAttend = await stacksService.didAttend(parseInt(eventId), address);

    res.json({
      success: true,
      data: {
        eventId: parseInt(eventId),
        attendee: address,
        attended: didAttend,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
