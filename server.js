const { Telegraf } = require('telegraf');
const express = require('express');
const path = require('path');

const BOT_TOKEN = '8992341263:AAGTu6G2BnaiWMhyz9w4XdpRpEMoQlW4124';
const ADMIN_UID = 5957632735; // আপনার টেলিগ্রাম UID

const bot = new Telegraf(BOT_TOKEN);
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// টেলিগ্রাম বট স্টার্ট কমান্ড
bot.start((ctx) => {
    const webAppUrl = `${ctx.update.message.from ? 'https://' : ''}${ctx.req?.headers?.host || 'yourdomain.com'}`; // আপনার ডোমেইন বা লোকালহোস্ট
    ctx.reply('Welcome to ST Coin Earning Bot! Click the button below to open the Mini App.', {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🚀 Open Mini App', web_app: { url: 'https://your-deployed-domain.com' } }] // এখানে আপনার হোস্টেড ইউআরএল বসাবেন
            ]
        }
    });
});

// উইথড্র রিকোয়েস্ট রিসিভ করার API
app.post('/api/withdraw', async (req, res) => {
    const { username, amount, wallet } = req.body;
    
    if (!username || !amount || !wallet) {
        return res.status(400).json({ success: false, message: 'Invalid data!' });
    }

    try {
        const message = `🔔 **New Withdrawal Request!**\n\n👤 **User:** @${username}\n💰 **Amount:** $${amount} USDT\n📍 **BEP-20 Wallet:** \`${wallet}\``;
        
        await bot.telegram.sendMessage(ADMIN_UID, message, { parse_mode: 'Markdown' });
        res.json({ success: true, message: 'Withdrawal request sent successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to send request.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    bot.launch();
});
