const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════╗
║     StackStamp Backend API Server       ║
╚══════════════════════════════════════════╝

🚀 Server running on port ${PORT}
🌐 Network: ${process.env.NETWORK || 'mainnet'}
📝 Contract: ${process.env.CONTRACT_ADDRESS || 'SPVNRH0FC9XJP8J18C92J09MNBS2BS2TW55MYA15'}.${process.env.CONTRACT_NAME || 'StackStamp'}

Available endpoints:
  GET  /health
  GET  /api/events
  GET  /api/events/:eventId
  GET  /api/events/:eventId/check-ins
  GET  /api/events/creator/:address
  GET  /api/attendance/:eventId/:address
  GET  /api/attendance/:eventId/:address/status
  POST /api/transactions/create-event
  POST /api/transactions/check-in
  POST /api/transactions/close-event

Ready to accept requests! 🎉
  `);
});
