const express = require('express');
const router = express.Router();
const stacksService = require('../services/stacksService');

/**
 * POST /api/transactions/create-event
 * Build unsigned transaction for creating an event
 * Frontend will sign and broadcast
 */
router.post('/create-event', async (req, res) => {
  try {
    const { eventName, senderAddress } = req.body;

    if (!eventName || !senderAddress) {
      return res.status(400).json({
        success: false,
        error: 'eventName and senderAddress are required',
      });
    }

    if (eventName.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Event name cannot be empty',
      });
    }

    if (eventName.length > 100) {
      return res.status(400).json({
        success: false,
        error: 'Event name cannot exceed 100 characters',
      });
    }

    const txData = stacksService.buildCreateEventTx(eventName, senderAddress);

    res.json({
      success: true,
      data: {
        transaction: txData,
        message: 'Transaction built successfully. Sign and broadcast on frontend.',
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
 * POST /api/transactions/check-in
 * Build unsigned transaction for checking into an event
 */
router.post('/check-in', async (req, res) => {
  try {
    const { eventId, senderAddress } = req.body;

    if (eventId === undefined || !senderAddress) {
      return res.status(400).json({
        success: false,
        error: 'eventId and senderAddress are required',
      });
    }

    const txData = stacksService.buildCheckInTx(parseInt(eventId), senderAddress);

    res.json({
      success: true,
      data: {
        transaction: txData,
        message: 'Transaction built successfully. Sign and broadcast on frontend.',
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
 * POST /api/transactions/close-event
 * Build unsigned transaction for closing an event
 */
router.post('/close-event', async (req, res) => {
  try {
    const { eventId, senderAddress } = req.body;

    if (eventId === undefined || !senderAddress) {
      return res.status(400).json({
        success: false,
        error: 'eventId and senderAddress are required',
      });
    }

    const txData = stacksService.buildCloseEventTx(parseInt(eventId), senderAddress);

    res.json({
      success: true,
      data: {
        transaction: txData,
        message: 'Transaction built successfully. Sign and broadcast on frontend.',
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
