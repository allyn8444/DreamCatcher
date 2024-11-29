const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const path = require('path');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const app = express();
const server = createServer(app);
const io = new Server(server);
const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config(); // Load .env file


// ############################## TELEGRAM NOTIFICATION #########################


const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });
// console.log("TOKEN: " + token);



// Array to store chat IDs of users who have interacted with the bot
const chatIDsFile = './chatIDs.json';
let chatIDs = [];

// Load existing chat IDs from file
if (fs.existsSync(chatIDsFile)) {
    try {
        chatIDs = JSON.parse(fs.readFileSync(chatIDsFile));
        console.log('Loaded chat IDs:\n', chatIDs);
    } catch (err) {
        console.error('Error reading chatIDs.json:', err.message);
        chatIDs = [];
    }
}

// Save chat IDs to file
function saveChatIDs() {
    fs.writeFileSync(chatIDsFile, JSON.stringify(chatIDs, null, 2), (err) => {
        if (err) {
            console.error('Error saving chat IDs:', err.message);
        } else {
            console.log('Chat IDs saved to file.');
        }
    });
}


// Telegram bot - Handle /start command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;

    // Register chat ID if not already stored
    if (!chatIDs.includes(chatId)) {
        chatIDs.push(chatId);
        console.log(`Registered new chatId: ${chatId}`);
        saveChatIDs();
    }

    // Send a welcome message
    bot.sendMessage(chatId, 'Welcome! You will now receive DreamCatcher updates.');
});

//  #################################################################


// Middleware to serve static assets (CSS, JS, Images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Serve chart.umd.js file from node_modules
app.get('/chart.umd.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'node_modules', 'chart.js', 'dist', 'chart.umd.js'));
});

// Serve index.html for the root route
app.get('/', (req, res) => {

    res.sendFile(path.join(__dirname, 'register.html'));
});


// Serve profile.html
app.get('/profile.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'profile.html'));
});

// Serve settings.html
app.get('/settings.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'settings.html'));
});

// Serve index.html
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/register.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});


// Handle WebSocket connection
io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });


    // Variables to track notifications and avoid spamming
    let lastTempNotification = null;
    let lastMotionNotification = null;
    const notificationCooldown = 60000; // 1 minute in milliseconds

    // Receive temperature updates from client
    socket.on('temperature', (temp_val) => {
        console.log("Received temperature via WebSocket:", temp_val);

        // Determine temperature state
        let warningMessage = null;

        if (temp_val >= 23) {
            warningMessage = "Warning: The environment is too hot for the baby! Please cool the room.\n";
        } else if (temp_val <= 19) {
            warningMessage = "Warning: The environment is too cold for the baby! Please warm the room.\n";
        }

        if (warningMessage) {
            const now = Date.now();

            // Send notification if cooldown has passed
            if (!lastTempNotification || now - lastTempNotification > notificationCooldown) {
                lastTempNotification = now;

                // Broadcast the warning to all registered Telegram users
                chatIDs.forEach((chatId) => {
                    bot.sendMessage(chatId, `${warningMessage}Current temperature: ${temp_val}°C`).catch((err) => {
                        console.error(`Failed to send temperature message to chatId ${chatId}:`, err.message);
                    });
                });
            }
        }
    });

    // Variables to track motion count
    let motionCount = 0;
    let motionStartTime = Date.now();

    // Receive motion updates from client
    socket.on('motion', () => {
        console.log("Motion detected via WebSocket.");

        // Increment motion count and check for 1-minute interval
        motionCount++;
        const now = Date.now();
        const elapsedTime = now - motionStartTime;


        if (elapsedTime >= 60000) {
            // Check if motion count exceeds the threshold
            if (motionCount >= 3) {
                if (!lastMotionNotification || now - lastMotionNotification > notificationCooldown) {
                    lastMotionNotification = now;

                    // Broadcast the motion warning to all registered Telegram users
                    chatIDs.forEach((chatId) => {
                        bot.sendMessage(chatId, `Alert: The baby may be waking up! ${motionCount} movements detected in the last minute.`).catch((err) => {
                            console.error(`Failed to send motion message to chatId ${chatId}:`, err.message);
                        });
                    });
                }
            }

            // Reset motion tracking for the next minute
            motionCount = 0;
            motionStartTime = now;
        }
    });

});


// Arduino serial connection setup
const port = new SerialPort({

    path: process.env.SERIAL_PORT || 'COM4',  // Use environment variable or default to 'COM4'
    baudRate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

// Handle incoming serial data and emit to connected clients
parser.on('data', (data) => {
    console.log(data);  // You can improve the log formatting here for clarity
    io.emit('data', data);  // Emit the data to all connected clients
});

// Handle serial port errors
port.on('error', (err) => {
    console.error('Error with SerialPort:', err.message);
});

// Start the server
server.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
