const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

// Reemplaza con el ID del canal donde quieres enviar las bienvenidas
const welcomeChannelId = 'TU_CANAL_ID';

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.cache.get(welcomeChannelId);
    if (!channel) return;

    const welcomeMessage = `
**Welcome in EvosHosting**
With EvosHosting, you get more than just hosting. We guarantee transparency and unlimited bandwidth for your online success. Choose EvosHosting for an exceptional digital experience.

**Useful Links**

**Website:** https://evoshosting.com/
Check our plans and find the best solution.

**Client Area:** https://billing.evoshosting.com/
Manage bills, payments, renewals, and your servers.

**Game Panel:** https://game.evoshosting.com/
Manage panel for games servers.

**Status:** https://status.evoshosting.com/
Check the status of our infrastructure in real-time.
`;

    channel.send(`${member}, ${welcomeMessage}`);
});

client.login('YOUR_BOT_TOKEN');
