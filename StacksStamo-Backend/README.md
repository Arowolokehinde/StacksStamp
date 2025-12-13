# StackStamp Backend API

REST API for interacting with the StackStamp smart contract on Stacks blockchain.

## Features

- Query event details and attendance records
- Build unsigned transactions for frontend signing
- Fetch event check-ins and creator data
- CORS-enabled for frontend integration
- Mainnet contract integration ready

## Contract Details

- **Network**: Stacks Mainnet
- **Contract Address**: `SPVNRH0FC9XJP8J18C92J09MNBS2BS2TW55MYA15.StackStamp`

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
NETWORK=mainnet
STACKS_API_URL=https://api.hiro.so
CONTRACT_ADDRESS=SPVNRH0FC9XJP8J18C92J09MNBS2BS2TW55MYA15
CONTRACT_NAME=StackStamp
PORT=3000
NODE_ENV=production
```

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000` (or your configured PORT).

## API Endpoints

### Health Check

#### `GET /health`
Check server status and configuration.

**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2025-12-13T07:00:00.000Z",
  "network": "mainnet",
  "contract": "SPVNRH0FC9XJP8J18C92J09MNBS2BS2TW55MYA15.StackStamp"
}
```

---

### Events

#### `GET /api/events`
Get all events with pagination.

**Query Parameters:**
- `offset` (optional): Pagination offset (default: 0)
- `limit` (optional): Number of events to return (default: 50)

**Response:**
```json
{
  "success": true,
  "data": {
    "events": [
      {
        "txId": "0x...",
        "eventData": {
          "event": "event-created",
          "event-id": 0,
          "creator": "SP...",
          "name": "Conference Name",
          "block-time": 1734134400
        },
        "blockHeight": 123456,
        "timestamp": 1734134400
      }
    ],
    "total": 100,
    "offset": 0,
    "limit": 50
  }
}
```

#### `GET /api/events/:eventId`
Get specific event details by ID.

**Response:**
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

#### `GET /api/events/:eventId/check-ins`
Get all check-ins for a specific event.

**Query Parameters:**
- `limit` (optional): Max check-ins to return (default: 100)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "txId": "0x...",
      "attendee": "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
      "checkInData": {
        "event": "checked-in",
        "event-id": 0,
        "attendee": "SP...",
        "check-in-time": 1734134400
      },
      "blockHeight": 123457,
      "timestamp": 1734134400
    }
  ]
}
```

#### `GET /api/events/creator/:address`
Get events created by a specific address.

**Query Parameters:**
- `limit` (optional): Max events to return (default: 50)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "txId": "0x...",
      "eventData": { /* event details */ },
      "blockHeight": 123456,
      "timestamp": 1734134400
    }
  ]
}
```

---

### Attendance

#### `GET /api/attendance/:eventId/:address`
Check if address attended event and get timestamp.

**Response:**
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

#### `GET /api/attendance/:eventId/:address/status`
Simple boolean check if user attended.

**Response:**
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

### Transactions

These endpoints build unsigned transactions that your frontend can sign and broadcast.

#### `POST /api/transactions/create-event`
Build transaction for creating an event.

**Request Body:**
```json
{
  "eventName": "Bitcoin Conference 2025",
  "senderAddress": "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7"
}
```

**Response:**
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

#### `POST /api/transactions/check-in`
Build transaction for checking into an event.

**Request Body:**
```json
{
  "eventId": 0,
  "senderAddress": "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transaction": { /* transaction details */ },
    "message": "Transaction built successfully. Sign and broadcast on frontend."
  }
}
```

#### `POST /api/transactions/close-event`
Build transaction for closing an event.

**Request Body:**
```json
{
  "eventId": 0,
  "senderAddress": "SPVNRH0FC9XJP8J18C92J09MNBS2BS2TW55MYA15"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transaction": { /* transaction details */ },
    "message": "Transaction built successfully. Sign and broadcast on frontend."
  }
}
```

---

## Error Handling

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": "Error message description"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `400` - Bad request (invalid parameters)
- `404` - Route not found
- `500` - Server error

## Usage Examples

### JavaScript/TypeScript (Frontend)

```javascript
// Fetch all events
const response = await fetch('http://localhost:3000/api/events?limit=10');
const { data } = await response.json();
console.log(data.events);

// Check if user attended event
const eventId = 0;
const address = 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7';
const attendanceResponse = await fetch(`http://localhost:3000/api/attendance/${eventId}/${address}`);
const attendanceData = await attendanceResponse.json();
console.log(attendanceData.data.didAttend);

// Build create-event transaction
const txResponse = await fetch('http://localhost:3000/api/transactions/create-event', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    eventName: 'My Awesome Event',
    senderAddress: address,
  }),
});
const { data: txData } = await txResponse.json();
// Sign and broadcast txData.transaction on frontend
```

### cURL

```bash
# Health check
curl http://localhost:3000/health

# Get event details
curl http://localhost:3000/api/events/0

# Check attendance
curl http://localhost:3000/api/attendance/0/SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7

# Build create-event transaction
curl -X POST http://localhost:3000/api/transactions/create-event \
  -H "Content-Type: application/json" \
  -d '{
    "eventName": "Conference 2025",
    "senderAddress": "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7"
  }'
```

## Architecture

```
src/
├── config/
│   └── stacks.js          # Stacks network configuration
├── services/
│   └── stacksService.js   # Smart contract interaction logic
├── routes/
│   ├── events.js          # Event-related endpoints
│   ├── attendance.js      # Attendance query endpoints
│   └── transactions.js    # Transaction building endpoints
├── app.js                 # Express app setup
└── server.js              # Server entry point
```

## Frontend Integration

This API returns **unsigned transactions** that your frontend should:

1. Receive transaction data from API
2. Sign with user's wallet (Hiro Wallet, Xverse, etc.)
3. Broadcast to Stacks network
4. Poll for confirmation

See [Stacks.js documentation](https://stacks.js.org/) for signing and broadcasting.

## Security Considerations

- **No private keys stored**: All transactions are signed on frontend
- **CORS enabled**: Configure allowed origins in production
- **Read-only API**: No backend transaction broadcasting
- **Rate limiting**: Consider adding rate limiting for production

## Deployment

### Deploy to Production

1. Set environment variables on your hosting platform
2. Ensure `NETWORK=mainnet` and correct `CONTRACT_ADDRESS`
3. Run `npm start`

### Recommended Hosting
- Railway
- Render
- Heroku
- Digital Ocean
- AWS EC2

## Contributing

Pull requests welcome! Please ensure all endpoints are tested.

## License

ISC
