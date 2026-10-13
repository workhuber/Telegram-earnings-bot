const { Telegraf } = require('telegraf');
const express = require('express');
const path = require('path');

const BOT_TOKEN = '8992341263:AAGTu6G2BnaiWMhyz9w4XdpRpEMoQlW4124';
const ADMIN_UID = 5957632735;

const bot = new Telegraf(BOT_TOKEN);
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// টেলিগ্রাম বট স্টার্ট কমান্ড
bot.start((ctx) => {
    const startPayload = ctx.payload; // যেমন: ref_123456

    // যদি ইউজার কারো রেফারেল লিংক দিয়ে জয়েন করে
    if (startPayload && startPayload.startsWith('ref_')) {
        const referrerId = startPayload.replace('ref_', '');
        
        // রেফারকারী ইউজারকে টেলিগ্রামে মেসেজ পাঠানো
        bot.telegram.sendMessage(
            referrerId,
            `🎉 **New Referral!**\n\nSomeone joined using your referral link. You earned **50 ST Coins**!`
        ).catch(err => console.log("Failed to send referral message:", err));
    }

    ctx.reply('Welcome to ST Coin Earning Bot! Click below to open the Mini App and start earning.', {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🚀 Open Mini App', web_app: { url: 'https://your-deployed-domain.com' } }]
            ]
        }
    });
});

// উইথড্র রিকোয়েস্ট API
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
    console.log(`Server running on port ${PORT}`);
    bot.launch();
});
