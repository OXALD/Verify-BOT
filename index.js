require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers,
    ],
});

client.once('ready', async () => {
    console.log(`Bot está listo como ${client.user.tag}`);
    const channelId = '1274443859207655434'; // ID del canal
    const roleId = '1274445003669635204'; // ID del rol
    const channel = client.channels.cache.get(channelId);

    if (channel) {
        const message = await channel.send('¡Haz clic en el check para verificarse! ✅');
        await message.react('✅');

        const filter = (reaction, user) => {
            return reaction.emoji.name === '✅' && !user.bot;
        };

        const collector = message.createReactionCollector({ filter, dispose: true });

        collector.on('collect', async (reaction, user) => {
            const member = await reaction.message.guild.members.fetch(user.id);
            const role = reaction.message.guild.roles.cache.get(roleId);

            if (role) {
                await member.roles.add(role);
                await user.send(`¡Has sido verificado y se te ha asignado el rol!`);
                // No se envía el mensaje al canal
            }
        });

        collector.on('remove', async (reaction, user) => {
            const member = await reaction.message.guild.members.fetch(user.id);
            const role = reaction.message.guild.roles.cache.get(roleId);

            if (role) {
                await member.roles.remove(role);
                await user.send(`Has quitado tu verificación y se te ha removido el rol.`);
                // No se envía el mensaje al canal
            }
        });
    } else {
        console.log('Canal no encontrado.');
    }
});

client.login(process.env.DISCORD_TOKEN);
