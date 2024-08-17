require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();

bot.on('ready', async () => {
    console.log('[BOT] Ready.');
    await bot.user.setStatus('online');
    await bot.user.setActivity(`!verify`, { type: 'PLAYING' });

    // Enviar un mensaje inicial con una imagen pequeña en el canal especificado
    const channel = bot.channels.cache.get('1274443859207655434');
    if (channel) {
        const initialEmbed = new Discord.MessageEmbed()
            .setTitle('Verification')
            .setDescription('React with the checkmark to verify yourself!')
            .setColor('#00FF00')
            .setThumbnail('https://example.com/your-image.png'); // URL de la imagen pequeña

        channel.send({ embeds: [initialEmbed] })
            .then(message => {
                message.react('✅'); // Emoji de verificación
            })
            .catch(console.error);
    } else {
        console.error('Channel not found');
    }
});

bot.on('messageCreate', async (msg) => {
    if (msg.content === '!verify') {
        const verifiedEmbed = new Discord.MessageEmbed()
            .setTitle('**Verification successful!**')
            .setDescription('You have been verified!')
            .setColor('#00FF00')
            .setThumbnail('https://example.com/your-image.png'); // URL de la imagen pequeña

        const verifiedRole = msg.guild.roles.cache.get('1274445003669635204');
        if (msg.member && verifiedRole) {
            msg.member.roles.add(verifiedRole);
            msg.react('✅');
            msg.author.send({ embeds: [verifiedEmbed] });
            console.log('[VERIFIED] Member verified.');
            msg.delete({ timeout: 5000 });
        } else {
            console.error('Member or role not found');
        }
    }
});

bot.login(process.env.TOKEN);
