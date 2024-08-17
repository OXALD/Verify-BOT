require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const bot = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

bot.once('ready', async () => {
    console.log('[BOT] Ready.');
    await bot.user.setStatus('online');
    await bot.user.setActivity('!verify', { type: 'PLAYING' });

    // Enviar un mensaje inicial con una imagen pequeña en el canal especificado
    const channel = bot.channels.cache.get('1274443859207655434');
    if (channel) {
        const initialEmbed = new EmbedBuilder()
            .setTitle('Verification')
            .setDescription('React with the checkmark to verify yourself!')
            .setColor('#00FF00')
            .setThumbnail('https://cdn.discordapp.com/attachments/933093366483267655/1257802712246911047/EVOS_SUPPORT.png'); // URL de la imagen pequeña

        try {
            const message = await channel.send({ embeds: [initialEmbed] });
            await message.react('✅'); // Emoji de verificación
        } catch (error) {
            console.error('Error sending message:', error);
        }
    } else {
        console.error('Channel not found');
    }
});

bot.on('messageCreate', async (msg) => {
    if (msg.content === '!verify') {
        const verifiedEmbed = new EmbedBuilder()
            .setTitle('**Verification successful!**')
            .setDescription('You have been verified!')
            .setColor('#00FF00')
            .setThumbnail('https://cdn.discordapp.com/attachments/933093366483267655/1257802712246911047/EVOS_SUPPORT.png'); // URL de la imagen pequeña

        const verifiedRole = msg.guild.roles.cache.get('1274445003669635204');
        if (msg.member && verifiedRole) {
            try {
                await msg.member.roles.add(verifiedRole);
                await msg.react('✅');
                await msg.author.send({ embeds: [verifiedEmbed] });
                console.log('[VERIFIED] Member verified.');
                await msg.delete({ timeout: 5000 });
            } catch (error) {
                console.error('Error processing verification:', error);
            }
        } else {
            console.error('Member or role not found');
        }
    }
});

bot.login(process.env.TOKEN);
