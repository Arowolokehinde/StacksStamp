# StackStamp Backend API - Quick Start Guide

## Step 1: Start the Backend Server

### Navigate to the backend directory
```bash
cd StacksStamo-Backend
```

### Start the server
```bash
npm start
```

You should see this output:
```
╔══════════════════════════════════════════╗
║     StackStamp Backend API Server       ║
╚══════════════════════════════════════════╝

🚀 Server running on port 3000
🌐 Network: mainnet
📝 Contract: SPVNRH0FC9XJP8J18C92J09MNBS2BS2TW55MYA15.StackStamp

Ready to accept requests! 🎉
```

**Keep this terminal window open!** The server needs to stay running.

---

## Step 2: Test the API (Open a New Terminal)

Open a **new terminal window** and try these commands:

### 1. Health Check (Verify Server is Running)

```bash
curl http://localhost:3000/health
```

**Expected Response:**
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2025-12-13T07:00:00.000Z",
  "network": "mainnet",
  "contract": "SPVNRH0FC9XJP8J18C92J09MNBS2BS2TW55MYA15.StackStamp"
}
```

✅ If you see this, your API is working!

---

## Step 3: Query Event Data

### Get All Events

```bash
curl http://localhost:3000/api/events
```

**What this does:** Fetches all events created on the contract with pagination (default limit: 50)

**With pagination:**
```bash
curl "http://localhost:3000/api/events?limit=10&offset=0"
```

---

### Get Specific Event Details

```bash
curl http://localhost:3000/api/events/0
```

**What this does:** Gets the creator and active status for event ID 0

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "value": {
      "creator": "SPVNRH0FC9XJP8J18C92J09MNBS2BS2TW55MYA15",
      "active": true
    }
  }
}
```

**Try different event IDs:**
```bash
curl http://localhost:3000/api/events/1
curl http://localhost:3000/api/events/2
```

---

### Get Events by Creator Address

```bash
curl "http://localhost:3000/api/events/creator/SPVNRH0FC9XJP8J18C92J09MNBS2BS2TW55MYA15"
```

**What this does:** Shows all events created by a specific Stacks address

**Replace with any Stacks address:**
```bash
curl "http://localhost:3000/api/events/creator/YOUR_STACKS_ADDRESS_HERE"
```

---

### Get Event Check-Ins (Attendees List)

```bash
curl http://localhost:3000/api/events/0/check-ins
```

**What this does:** Lists all users who checked into event ID 0

**With limit:**
```bash
curl "http://localhost:3000/api/events/0/check-ins?limit=50"
```

---

## Step 4: Check Attendance

### Check if User Attended Event (Full Details)

```bash
curl http://localhost:3000/api/attendance/0/SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7
```

**Format:** `/api/attendance/{eventId}/{stacksAddress}`

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "eventId": 0,
    "attendee": "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
    "didAttend": true,
    "timestamp": {
      "value": 1734134400
    }
  }
}
```

---

### Check if User Attended (Simple Boolean)

```bash
curl http://localhost:3000/api/attendance/0/SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7/status
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "eventId": 0,
    "attendee": "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
    "attended": true
  }
}
```

---

## Step 5: Build Transactions (For Frontend Integration)

These endpoints help your frontend build transactions that users will sign with their wallets.

### Build Create-Event Transaction

```bash
curl -X POST http://localhost:3000/api/transactions/create-event \
  -H "Content-Type: application/json" \
  -d '{
    "eventName": "Bitcoin Conference 2025",
    "senderAddress": "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7"
  }'
```

**What this does:** Prepares an unsigned transaction for creating an event

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "transaction": {
      "contractAddress": "SPVNRH0FC9XJP8J18C92J09MNBS2BS2TW55MYA15",
      "contractName": "StackStamp",
      "functionName": "create-event",
      "functionArgs": [...],
      "network": "mainnet"
    },
    "message": "Transaction built successfully. Sign and broadcast on frontend."
  }
}
```

**Note:** Your frontend will take this transaction data, have the user sign it with their wallet (Hiro Wallet, Xverse, etc.), and broadcast it to the Stacks network.

---

### Build Check-In Transaction

```bash
curl -X POST http://localhost:3000/api/transactions/check-in \
  -H "Content-Type: application/json" \
  -d '{
    "eventId": 0,
    "senderAddress": "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7"
  }'
```

**What this does:** Prepares an unsigned check-in transaction for event ID 0

---

### Build Close-Event Transaction

```bash
curl -X POST http://localhost:3000/api/transactions/close-event \
  -H "Content-Type: application/json" \
  -d '{
    "eventId": 0,
    "senderAddress": "SPVNRH0FC9XJP8J18C92J09MNBS2BS2TW55MYA15"
  }'
```

**What this does:** Prepares an unsigned transaction to close event ID 0 (only event creator can do this)

---

## Step 6: Using with JavaScript/Frontend

### Fetch Events (JavaScript)

```javascript
// Get all events
const response = await fetch('http://localhost:3000/api/events?limit=10');
const { success, data } = await response.json();

if (success) {
  console.log('Events:', data.events);
  data.events.forEach(event => {
    console.log(`Event ID: ${event.eventData['event-id']}`);
    console.log(`Name: ${event.eventData.name}`);
    console.log(`Creator: ${event.eventData.creator}`);
  });
}
```

### Check Attendance (JavaScript)

```javascript
const eventId = 0;
const userAddress = 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7';

const response = await fetch(
  `http://localhost:3000/api/attendance/${eventId}/${userAddress}`
);
const { success, data } = await response.json();

if (success) {
  if (data.didAttend) {
    console.log('User attended! Check-in time:', data.timestamp.value);
  } else {
    console.log('User did not attend');
  }
}
```

### Build Transaction (JavaScript)

```javascript
// Build create-event transaction
const response = await fetch('http://localhost:3000/api/transactions/create-event', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    eventName: 'My Awesome Event',
    senderAddress: userWalletAddress,
  }),
});

const { success, data } = await response.json();

if (success) {
  const txData = data.transaction;

  // Now use Stacks.js to sign and broadcast
  // (Your frontend wallet integration code goes here)
  // Example with @stacks/connect:
  // await openContractCall({ ...txData });
}
```

---

## Step 7: Testing Error Handling

### Try Invalid Event ID

```bash
curl http://localhost:3000/api/events/999999
```

**Expected:** Returns event data or `null` if doesn't exist

### Try Empty Event Name

```bash
curl -X POST http://localhost:3000/api/transactions/create-event \
  -H "Content-Type: application/json" \
  -d '{
    "eventName": "",
    "senderAddress": "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7"
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "error": "Event name cannot be empty"
}
```

### Try Missing Parameters

```bash
curl -X POST http://localhost:3000/api/transactions/check-in \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected Response:**
```json
{
  "success": false,
  "error": "eventId and senderAddress are required"
}
```

---

## Step 8: Stop the Server

When you're done testing, go back to the terminal running the server and press:

```
Ctrl + C
```

This will stop the backend API.

---

## Quick Reference: All Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/health` | Server health check |
| GET | `/api/events` | Get all events |
| GET | `/api/events/:id` | Get event details |
| GET | `/api/events/:id/check-ins` | Get event attendees |
| GET | `/api/events/creator/:address` | Get events by creator |
| GET | `/api/attendance/:eventId/:address` | Check attendance with timestamp |
| GET | `/api/attendance/:eventId/:address/status` | Check attendance (boolean) |
| POST | `/api/transactions/create-event` | Build create-event tx |
| POST | `/api/transactions/check-in` | Build check-in tx |
| POST | `/api/transactions/close-event` | Build close-event tx |

---

## Troubleshooting

### Port Already in Use

If you see: `Error: listen EADDRINUSE: address already in use :::3000`

**Solution:**
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or change the port in .env file
# Edit .env and change PORT=3000 to PORT=3001
```

### Cannot Connect to API

**Check:**
1. Is the server running? (You should see the ASCII art banner)
2. Are you using the correct URL? (`http://localhost:3000`)
3. Check firewall settings if accessing from another device

### "Failed to get event" Error

**Possible causes:**
- Stacks API is down (check https://api.hiro.so)
- Invalid event ID
- Network connectivity issues

---

## Next Steps

1. ✅ **Test all endpoints** using the curl commands above
2. 🎨 **Build a frontend** to interact with these APIs
3. 🔗 **Integrate wallet connection** (Hiro Wallet/Xverse) for transaction signing
4. 🚀 **Deploy to production** (Railway, Render, Heroku, etc.)

Need help with frontend integration? Let me know!
