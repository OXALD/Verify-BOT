require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();

bot.on('ready', async () => {
    console.log('[BOT] Ready.');
    await bot.user.setStatus('online');
    await bot.user.setActivity(`!verify`, { type: 'PLAYING' });
});

bot.on('messageCreate', (msg) => {
    if (msg.content === '!verify') {
        // Crear un mensaje embed con imagen pequeña
        const verifiedEmbed = new Discord.MessageEmbed()
            .setTitle('**Verification successful!**')
            .setDescription('You have been verified!')
            .setColor('#00FF00')
            .setThumbnail('https://cdn.discordapp.com/attachments/933093366483267655/1257802712246911047/EVOS_SUPPORT.png'); // URL de la imagen pequeña

        const verifiedRole = msg.guild.roles.cache.get('945395357926424576');
        if (msg.member && verifiedRole) {
            msg.member.roles.add(verifiedRole)
                .then(() => {
                    msg.react('✅');
                    msg.author.send({ embeds: [verifiedEmbed] })
                        .catch(console.error);
                    console.log('[VERIFIED] Member verified.');
                    msg.delete({ timeout: 5000 });
                })
                .catch(console.error);
        } else {
            console.error('Member or role not found');
        }
    }
});

bot.login(process.env.TOKEN);
