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
    console.log(`Bot is ready as ${client.user.tag}`);
    const channelId = '1274443859207655434'; // Channel ID
    const roleId = '1274445003669635204'; // Role ID
    const channel = client.channels.cache.get(channelId);

    if (channel) {
        const message = await channel.send('Welcome to ViperHost! Click the checkmark to verify and gain access to the other channels! ✅');
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
                await user.send(`You have been verified and given access!`);
                // No message sent to the channel
            }
        });

        collector.on('remove', async (reaction, user) => {
            const member = await reaction.message.guild.members.fetch(user.id);
            const role = reaction.message.guild.roles.cache.get(roleId);

            if (role) {
                await member.roles.remove(role);
                await user.send(`You have revoked your verification and lost access.`);
                // No message sent to the channel
            }
        });
    } else {
        console.log('Channel not found.');
    }
});

client.login(process.env.DISCORD_TOKEN);
