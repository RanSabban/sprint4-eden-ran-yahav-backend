import http from 'http'
import express from 'express'
import path, { dirname } from 'path'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { fileURLToPath } from 'url'
import multer from 'multer'
import bodyParser from 'body-parser'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

import { logger } from './services/logger.service.js'
logger.info('server.js loaded...')

const app = express()
const server = http.createServer(app)

// Configure Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads'))  // Directory where files will be saved
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        cb(null, `${Date.now()}${ext}`)  // Generate a unique filename
    }
})

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }  // Limit file size to 10 MB
})

// Enable CORS for development
const corsOptions = {
    origin: ['http://127.0.0.1:5173', 'http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:3000', 'http://localhost:3000'],
    credentials: true
}

// Apply CORS middleware
app.use(cors(corsOptions))

// Express App Config
app.use(cookieParser())
app.use(express.json())
app.use(express.static('public'))
app.use(bodyParser.json({ limit: '10mb' }))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'public')))
    console.log('__dirname: ', __dirname)
}

// File Upload Route
app.post('/upload', upload.single('file'), (req, res) => {
    try {
        res.status(200).json({ message: 'File uploaded successfully', file: req.file })
    } catch (error) {
        res.status(400).json({ message: 'Error uploading file', error })
    }
})

// Serve static files from 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes
import { authRoutes } from './api/auth/auth.routes.js'
import { userRoutes } from './api/user/user.routes.js'
import { boardRoutes } from './api/board/board.routes.js'
import { reviewRoutes } from './api/review/review.routes.js'
import { setupSocketAPI } from './services/socket.service.js'
import { setupAsyncLocalStorage } from './middlewares/setupAls.middleware.js'

app.all('*', setupAsyncLocalStorage)

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/board', boardRoutes)
app.use('/api/review', reviewRoutes)
setupSocketAPI(server)

// Make every unmatched server-side route fall back to index.html
app.get('/**', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'))
})

const port = process.env.PORT || 3040

server.listen(port, () => {
    logger.info('Server is running on port: ' + port)
})


// import dotenv from 'dotenv';
// import express from 'express';
// import http from 'http';
// import path from 'path';
// import cookieParser from 'cookie-parser';
// import cors from 'cors';
// import { fileURLToPath } from 'url';
// import pkg from '@slack/bolt';
// const { App: SlackApp } = pkg;

// dotenv.config();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// import { logger } from './services/logger.service.js';
// logger.info('server.js loaded...');

// const expressApp = express();
// const server = http.createServer(expressApp);

// const slackApp = new SlackApp({
//     signingSecret: process.env.SLACK_SIGNING_SECRET,
//     token: process.env.SLACK_BOT_TOKEN,
//     socketMode: false,  // Set true if you're using Socket Mode
//     port: process.env.PORT || 3000 // Slack app may use its own port or share with Express
// });

// expressApp.locals.slackApp = slackApp;

// console.log(slackApp);

// expressApp.use(cookieParser());
// expressApp.use(express.json());
// expressApp.use(express.static('public'));

// if (process.env.NODE_ENV === 'production') {
//     expressApp.use(express.static(path.resolve(__dirname, 'public')));
//     console.log('__dirname: ', __dirname);
// } else {
//     const corsOptions = {
//         origin: ['http://127.0.0.1:5173', 'http://localhost:5173', 'http://127.0.0.1:3040', 'http://localhost:3040'],
//         credentials: true
//     };
//     expressApp.use(cors(corsOptions));
// }

// expressApp.post('/slack/events', (req, res) => {
//     console.log(req.body);  // Log the incoming request body

//     if (req.body.type === 'url_verification') {
//         res.status(200).send(req.body.challenge);
//     } else {
//         res.status(200).json({ message: 'Event received' });
//     }
// });


// slackApp.message('hello', async ({ message, say }) => {
//     await say(`Hello there, <@${message.user}>!`);
// });

// (async () => {
//     try {
//         await slackApp.start();
//         console.log('Slack app is running!');
//         // Post a message after the app has started
//         await slackApp.client.chat.postMessage({
//             token: process.env.SLACK_BOT_TOKEN,
//             channel: process.env.SLACK_CHANNEL,
//             text: 'המון בהצלחה לכולם מצוות oneday!'
//         });
//     } catch (error) {
//         console.error('Error starting Slack app:', error);
//     }
// })();
// console.log('Posting to channel ID:', process.env.SLACK_CHANNEL);

// // Now, attempt to post the message
// // await slackApp.client.chat.postMessage({
// //     token: process.env.SLACK_BOT_TOKEN,
// //     channel: process.env.SLACK_CHANNEL,
// //     text: 'Eden is stuck on Task: Sound Bug!'
// // }).catch((error) => {
// //     console.error('Failed to post message:', error);
// // });

// import { authRoutes } from './api/auth/auth.routes.js';
// import { userRoutes } from './api/user/user.routes.js';
// import { boardRoutes } from './api/board/board.routes.js';
// import { reviewRoutes } from './api/review/review.routes.js';
// import { slackRoutes } from './api/slack/slack.routes.js';

// expressApp.use('/api/auth', authRoutes);
// expressApp.use('/api/user', userRoutes);
// expressApp.use('/api/board', boardRoutes);
// expressApp.use('/api/review', reviewRoutes);
// expressApp.use('/api/slack', slackRoutes);

// expressApp.get('/**', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public/index.html'));
// });

// const port = process.env.PORT || 3040;
// server.listen(port, () => {
//     logger.info(`Server is running on port: ${port}`);
// });