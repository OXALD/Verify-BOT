require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

// Mensaje de bienvenida
const welcomeMessage = `
Welcome to EvosHosting! 🎉

With EvosHosting, you get more than just hosting. We guarantee transparency and unlimited bandwidth for your online success. Choose EvosHosting for an exceptional digital experience.

**Useful Links:**
- **Website:** [EvosHosting](https://evoshosting.com/)
- **Client Area:** [Manage your account](https://billing.evoshosting.com/)
- **Game Panel:** [Game server management](https://game.evoshosting.com/)
- **Status:** [Check infrastructure status](https://status.evoshosting.com/)

Feel free to explore and ask any questions!
`;

client.on('guildMemberAdd', async (member) => {
    console.log(`New member joined: ${member.user.tag}`);
    const channel = member.guild.channels.cache.get('1274438907223867433'); // ID del canal
    
    if (channel) {
        console.log('Channel found, sending message...');
        try {
            await channel.send(welcomeMessage);
            console.log('Message sent successfully!');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    } else {
        console.log('Channel not found.');
    }
});

client.once('ready', () => {
    console.log(`Bot is ready as ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);
