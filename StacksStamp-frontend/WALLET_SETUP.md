# Leather Wallet Setup for StackStamp

## Technical Implementation

StackStamp uses `@stacks/connect-react` v23.1.3 for modern React integration with Stacks wallets:
- **Authentication**: `useAuth()` hook for wallet connection state
- **Contract Calls**: `openContractCall` from `@stacks/connect` for transactions
- **Provider**: `Connect` component wraps the app for wallet context
- **No Deprecated APIs**: Uses modern hooks instead of deprecated `AppConfig` and `UserSession`

## Install Leather Wallet

1. **Install the browser extension:**
   - Chrome/Brave: https://chromewebstore.google.com/detail/leather/ldinpeekobnhjjdofggfgjlcehhmanlj
   - Firefox: https://addons.mozilla.org/en-US/firefox/addon/leather/

2. **Create or import a wallet:**
   - Open the Leather extension
   - Choose "Create new wallet" or "Import existing wallet"
   - Follow the setup instructions
   - **IMPORTANT**: Save your secret recovery phrase safely!

3. **Get some STX:**
   - You need STX for transaction fees (~0.001 STX per transaction)
   - Buy STX on exchanges like Binance, OKX, or use on-ramp services
   - Send STX to your Leather wallet address

## Connect to StackStamp

1. **Start the dev server:**
   ```bash
   cd StacksStamp-frontend
   npm run dev
   ```
   Visit the local URL shown (typically http://localhost:5173 or http://localhost:5175)

2. **Click "Connect Wallet"** button in the top right

3. **Leather popup will appear:**
   - Review the connection request
   - Click "Connect" to approve
   - Your address will now appear in the app

4. **You're connected!** ✅
   - Your wallet address will show in the header
   - You can now create events and check in

## Using the App

### Create an Event
1. Click "Create Event" tab
2. Enter event name
3. Click "Create Event"
4. **Leather popup** - Review and confirm transaction
5. Wait ~10 minutes for confirmation

### Check Into an Event
1. Click "Check In" tab
2. Enter event ID (e.g., 0, 1, 2...)
3. Click "Check In"
4. **Leather popup** - Review and confirm transaction
5. Wait ~10 minutes for confirmation

### View Events
- **All Events**: See all events created
- **My Events**: See events you created
- Click "View Attendees" to see who checked in

## Troubleshooting

### Wallet Won't Connect
1. Make sure Leather extension is installed
2. Refresh the page
3. Check browser console (F12) for errors
4. Try disconnecting and reconnecting

### Transaction Fails
1. **Check STX balance** - Need enough for gas fees
2. **Wait for previous transaction** - Only one pending tx at a time
3. **Network congestion** - Try again in a few minutes
4. **Wrong network** - Make sure you're on mainnet

### Console Logs
Open browser console (F12 → Console tab) to see:
- Transaction status logs
- Connection state updates
- Error messages if any issues occur

## Network Info

- **Network**: Stacks Mainnet
- **Contract**: `SPVNRH0FC9XJP8J18C92J09MNBS2BS2TW55MYA15.StackStamp`
- **Gas Fees**: ~0.001 STX per transaction
- **Confirmation Time**: ~10 minutes

## Supported Wallets

While this app is optimized for Leather, it also works with:
- **Hiro Wallet** (formerly Stacks Wallet)
- **Xverse Wallet**

All wallets use the same @stacks/connect-react integration for authentication.

## Security Tips

🔐 **Never share your secret recovery phrase**
🔐 **Verify contract address before transactions**
🔐 **Start with small transactions to test**
🔐 **Keep your wallet extension updated**

## Need Help?

- Check browser console for error messages
- Verify you have enough STX for gas
- Try disconnecting and reconnecting wallet
- Open an issue on GitHub

---

**Ready to use StackStamp with Leather!** 🎉
