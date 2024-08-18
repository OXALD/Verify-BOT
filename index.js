const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMembers, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent
    ] 
});

// Reemplaza con el ID del canal donde quieres enviar las bienvenidas
const welcomeChannelId = 'TU_CANAL_ID';
// Opcional: Reemplaza con el ID del servidor si deseas limitar el bot a un servidor específico
const serverId = 'TU_SERVER_ID';  // Opcional

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    
    // Lista los servidores a los que está conectado el bot
    client.guilds.cache.forEach(guild => {
        console.log(`Connected to server: ${guild.name} (ID: ${guild.id})`);
    });

    // Verifica si el ID del canal es correcto
    console.log(`Welcome channel ID: ${welcomeChannelId}`);
});

client.on('guildMemberAdd', member => {
    // Opcional: Verifica que el bot esté en el servidor correcto
    if (serverId && member.guild.id !== serverId) return;

    console.log(`New member joined: ${member.user.tag}`);

    // Obtén el canal por ID
    const channel = member.guild.channels.cache.get(welcomeChannelId);
    if (!channel) {
        console.log('Channel not found or bot lacks access');
        return;
    } else {
        console.log(`Channel found: ${channel.name}`);
    }

    // Mensaje de bienvenida
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

    // Envía el mensaje de bienvenida
    channel.send(`${member}, ${welcomeMessage}`).then(() => {
        console.log('Welcome message sent');
    }).catch(err => {
        console.error('Failed to send message:', err);
    });
});

// Reemplaza con el token de tu bot
client.login('YOUR_BOT_TOKEN');
