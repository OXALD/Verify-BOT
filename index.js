require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();

const VERIFICATION_CHANNEL_ID = '1274443859207655434';
const VERIFIED_ROLE_ID = '1274445003669635204';
const VERIFY_EMOJI = '✅'; // Cambia esto por el emoji que quieres usar para la verificación

bot.on('ready', async () => {
    console.log('[BOT] Ready.');
    await bot.user.setStatus('online');
    await bot.user.setActivity('!verify', { type: 'PLAYING' });

    const channel = bot.channels.cache.get(VERIFICATION_CHANNEL_ID);
    if (channel) {
        const verificationEmbed = new Discord.MessageEmbed()
            .setTitle('**Verification**')
            .setDescription(`Reacciona con ${VERIFY_EMOJI} para verificarte.`)
            .setColor('#00FF00');
        
        const message = await channel.send(verificationEmbed);
        await message.react(VERIFY_EMOJI);
        console.log('[BOT] Verification message sent.');
    } else {
        console.error('[ERROR] Verification channel not found.');
    }
});

bot.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.message.channel.id === VERIFICATION_CHANNEL_ID && reaction.emoji.name === VERIFY_EMOJI) {
        if (user.bot) return; // Ignorar reacciones de bots

        const member = await reaction.message.guild.members.fetch(user.id);
        if (member) {
            const verifiedRole = reaction.message.guild.roles.cache.get(VERIFIED_ROLE_ID);
            if (verifiedRole) {
                await member.roles.add(verifiedRole);
                console.log(`[VERIFIED] ${user.tag} has been verified.`);
                
                const verifiedEmbed = new Discord.MessageEmbed()
                    .setTitle('**Verification successful!**')
                    .setDescription('You have been verified!')
                    .setColor('#00FF00');
                
                await user.send(verifiedEmbed);
            } else {
                console.error('[ERROR] Verified role not found.');
            }
        }
    }
});

bot.login(process.env.TOKEN);
