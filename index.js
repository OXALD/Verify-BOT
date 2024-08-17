require('dotenv').config();
const { Client, GatewayIntentBits, Events, MessageEmbed } = require('discord.js');
const bot = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] });

bot.once(Events.ClientReady, async () => {
    console.log('[BOT] Ready.');
    await bot.user.setStatus('online');
    await bot.user.setActivity(`!verify`, { type: 'PLAYING' });

    // Enviar un mensaje inicial con una imagen pequeña en el canal especificado
    const channel = bot.channels.cache.get('1274443859207655434');
    if (channel) {
        const initialEmbed = new MessageEmbed()
            .setTitle('Verification')
            .setDescription('React with the checkmark to verify yourself!')
            .setColor('#00FF00')
            .setThumbnail('https://cdn.discordapp.com/attachments/933093366483267655/1257802712246911047/EVOS_SUPPORT.png')
            .setFooter('Bot Verification');

        channel.send({ embeds: [initialEmbed] })
            .then(message => {
                message.react('✅'); // Emoji de verificación
            })
            .catch(console.error);
    } else {
        console.error('Channel not found');
    }
});

bot.on(Events.MessageReactionAdd, async (reaction, user) => {
    // Asegúrate de que el bot no se esté comprobando a sí mismo
    if (user.bot) return;

    // Verifica si la reacción es en el mensaje correcto
    if (reaction.emoji.name === '✅' && reaction.message.channel.id === '1274443859207655434') {
        try {
            // Asegúrate de que la reacción se ha añadido en el mensaje correcto
            const message = reaction.message;
            if (!message) {
                console.error('Message not found');
                return;
            }

            // Obtén el miembro que reaccionó
            const guild = message.guild;
            if (!guild) {
                console.error('Guild not found');
                return;
            }

            const member = await guild.members.fetch(user.id);
            if (!member) {
                console.error('Member not found');
                return;
            }

            // Obtén el rol de verificación
            const verifiedRole = guild.roles.cache.get('1274445003669635204');
            if (!verifiedRole) {
                console.error('Verified role not found');
                return;
            }

            // Agrega el rol al miembro
            if (!member.roles.cache.has(verifiedRole.id)) {
                await member.roles.add(verifiedRole);
                console.log('[VERIFIED] Member verified.');
                user.send('You have been verified!')
                    .catch(console.error);
            } else {
                console.log('[VERIFIED] Member already has the role.');
            }

        } catch (error) {
            console.error('Error in reaction handler:', error);
        }
    }
});

bot.login(process.env.TOKEN);
