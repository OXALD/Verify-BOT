require('dotenv').config();
const { Client, GatewayIntentBits, Events, MessageEmbed } = require('discord.js');
const bot = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageContent] });

bot.on(Events.ClientReady, async () => {
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
            .setThumbnail('https://cdn.discordapp.com/attachments/933093366483267655/1257802712246911047/EVOS_SUPPORT.png') // URL de la imagen pequeña
            .setFooter('Bot Verification'); // Añadido pie de página

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
    if (reaction.emoji.name === '✅') {
        // Asegúrate de que el bot no se esté comprobando a sí mismo
        if (user.bot) return;

        // Asegúrate de que la reacción se está añadiendo al mensaje de verificación
        if (reaction.message.channel.id === '1274443859207655434') {
            const guild = reaction.message.guild;
            const member = await guild.members.fetch(user.id);
            const verifiedRole = guild.roles.cache.get('1274445003669635204');

            if (member && verifiedRole) {
                member.roles.add(verifiedRole)
                    .then(() => {
                        console.log('[VERIFIED] Member verified.');
                        user.send('You have been verified!')
                            .catch(console.error);
                    })
                    .catch(console.error);
            } else {
                console.error('Member or role not found');
            }
        }
    }
});

bot.login(process.env.TOKEN);
