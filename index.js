const { Client, Intents, MessageActionRow, MessageButton } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const CHANNEL_ID = '1274443859207655434'; // ID del canal
const ROLE_ID = '1274451737335300198'; // ID del rol para bots con permisos
const BOT_TOKEN = 'MTI3NDQ0ODgwNTk4MjM3NTk3Nw.GhBEZu.UKnVL4pgh6rxIjpswrWNywZqsGKxrhOp0B08ak'; // Token del bot

client.once('ready', () => {
    console.log('Bot online');

    const channel = client.channels.cache.get(CHANNEL_ID);
    if (!channel) {
        console.error(`Canal con ID ${CHANNEL_ID} no encontrado.`);
        return;
    }

    const embed = {
        title: "¡Bienvenido!",
        description: "Por favor, verifica haciendo clic en el botón de abajo.",
        color: '#38A800'
    };

    const verifyButton = new MessageButton()
        .setCustomId('verify_button')
        .setLabel('Verificar')
        .setStyle('PRIMARY')
        .setEmoji('✅');

    const row = new MessageActionRow()
        .addComponents(verifyButton);

    channel.send({
        embeds: [embed],
        components: [row]
    }).catch(console.error);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'verify_button') {
        const role = interaction.guild.roles.cache.get(ROLE_ID);
        const member = interaction.member;

        if (!role) {
            await interaction.reply({ content: 'Rol de verificación no encontrado.', ephemeral: true });
            return;
        }

        if (!member) {
            await interaction.reply({ content: 'Miembro no encontrado.', ephemeral: true });
            return;
        }

        try {
            if (!interaction.guild.me.permissions.has('MANAGE_ROLES')) {
                await interaction.reply({ content: 'No tengo permiso para asignar roles.', ephemeral: true });
                return;
            }

            await member.roles.add(role);
            await interaction.reply({ content: '¡Ahora estás verificado!', ephemeral: true });
        } catch (error) {
            await interaction.reply({ content: 'Hubo un error al asignar el rol.', ephemeral: true });
            console.error('Error al añadir el rol:', error);
        }
    }
});

client.login(BOT_TOKEN);
