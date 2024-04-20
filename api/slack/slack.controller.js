// api/slack/slack.controller.js
export async function sendMessage(req, res) {
    try {
        const { message, channel } = req.body;
        // Access slackApp from app.locals
        const result = await req.app.locals.slackApp.client.chat.postMessage({
            channel: channel || process.env.SLACK_CHANNEL, 
            text: message,
            token: process.env.SLACK_BOT_TOKEN  // Token can also be omitted if using single token mode
        });
        res.json({ success: true, data: result });
    } catch (error) {
        console.error('Failed to send message:', error);
        res.status(500).json({ success: false, error: 'Failed to send message to Slack' });
    }
}


// await slackApp.client.chat.postMessage({
//     token: process.env.SLACK_BOT_TOKEN,
//     channel: process.env.SLACK_CHANNEL,
//     text: 'Eden is stuck on Task: Sound Bug!'
// });