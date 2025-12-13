# StackStamp Frontend

React frontend for StackStamp on-chain attendance verification system.

## Quick Start

```bash
npm install
npm run dev
```

Visit `http://localhost:5173`

## Features

- 🔐 Stacks wallet integration
- 📝 Create events on-chain
- ✅ Check into events
- 📊 View all events and attendees
- 👤 Track your created events

## Prerequisites

- Node.js v18+
- Stacks wallet (Hiro/Xverse)
- Backend API running

## Setup

```bash
# Install dependencies
npm install

# Create .env file
cat > .env << EOF
VITE_BACKEND_API_URL=http://localhost:3000
VITE_CONTRACT_ADDRESS=SPVNRH0FC9XJP8J18C92J09MNBS2BS2TW55MYA15
VITE_CONTRACT_NAME=StackStamp
VITE_NETWORK=mainnet
EOF

# Start dev server
npm run dev
```

## Usage

1. **Connect Wallet** - Click connect button
2. **Create Event** - Enter name and confirm
3. **Check In** - Enter event ID and confirm
4. **View Events** - See all events and attendees

## Contract

**Mainnet**: `SPVNRH0FC9XJP8J18C92J09MNBS2BS2TW55MYA15.StackStamp`

## License

ISC
