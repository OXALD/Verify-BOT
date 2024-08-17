const { Client, Intents, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_CONTENT] });

const CHANNEL_ID = '1274443859207655434'; // ID del canal
const VERIFY_ROLE_ID = '1274192724073119774'; // ID del rol para verificación exitosa
const ERROR_ROLE_ID = '1274448805982375977'; // ID del rol que causa error
const BOT_ROLE_ID = '1274448949885014100'; // ID del rol que el bot debe tener al iniciar

client.once('ready', async () => {
    console.log('Bot online');
    client.user.setActivity('Verificando usuarios');

    const guild = client.guilds.cache.first();
    if (!guild) {
        console.error('No se pudo encontrar el servidor.');
        return;
    }

    // Asignar rol al bot
    const botRole = guild.roles.cache.get(BOT_ROLE_ID);
    if (!botRole) {
        console.error(`Rol con ID ${BOT_ROLE_ID} no encontrado.`);
    } else {
        try {
            await guild.me.roles.add(botRole);
            console.log('Rol asignado al bot.');
        } catch (error) {
            console.error('Error al asignar el rol al bot:', error);
        }
    }

    const channel = client.channels.cache.get(CHANNEL_ID);
    if (!channel) {
        console.error(`Canal con ID ${CHANNEL_ID} no encontrado.`);
        return;
    }

    const embed = new MessageEmbed()
        .setTitle("¡Bienvenido!")
        .setDescription("Por favor, verifica haciendo clic en el botón de abajo.")
        .setColor('#38A800');

    const verifyButton = new MessageButton()
        .setLabel('Verificar')
        .setStyle('PRIMARY')
        .setEmoji('✅')
        .setCustomId('verify_button');

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
        const role = interaction.guild.roles.cache.get(VERIFY_ROLE_ID);
        const member = interaction.member;

        if (!role) {
            await interaction.reply('Rol de verificación no encontrado.', { ephemeral: true });
            return;
        }

        if (!member) {
            await interaction.reply('Miembro no encontrado.', { ephemeral: true });
            return;
        }

        try {
            // Verificar si el bot tiene el permiso para gestionar roles
            if (!interaction.guild.me.permissions.has('MANAGE_ROLES')) {
                await interaction.reply('No tengo permiso para asignar roles.', { ephemeral: true });
                return;
            }

            // Intentar añadir el rol de verificación
            await member.roles.add(role);
            await interaction.reply('¡Ahora estás verificado!', { ephemeral: true });
        } catch (error) {
            await interaction.reply('Hubo un error al asignar el rol.', { ephemeral: true });
            console.error('Error al añadir el rol:', error);
        }
    }
});

client.login('TU_TOKEN_DEL_BOT'); // Reemplaza con tu token
