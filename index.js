const Discord = require('discord.js');
const client = new Discord.Client();
const { MessageButton, MessageActionRow } = require('discord-buttons');
require('discord-buttons')(client);

const CHANNEL_ID = '1274443859207655434'; // Reemplaza con el ID del canal
const ROLE_ID = '1274445003669635204'; // Reemplaza con el ID del rol

client.once('ready', () => {
    console.log('Bot online');
    client.user.setActivity('Verificando usuarios');

    const channel = client.channels.cache.get(CHANNEL_ID);
    if (!channel) {
        console.error(`Canal con ID ${CHANNEL_ID} no encontrado.`);
        return;
    }

    const embed = new Discord.MessageEmbed()
        .setTitle("¡Bienvenido!")
        .setDescription("Por favor, verifica haciendo clic en el botón de abajo.")
        .setColor('#38A800');

    const verifyButton = new MessageButton()
        .setLabel('Verificar')
        .setStyle('blurple')
        .setEmoji('✅')
        .setID('verify_button');

    const row = new MessageActionRow()
        .addComponents(verifyButton);

    channel.send({
        embed: embed,
        components: [row]
    }).catch(console.error);
});

client.on('clickButton', async (button) => {
    if (button.id === 'verify_button') {
        const role = button.guild.roles.cache.get(ROLE_ID);
        const member = button.clicker.member;

        if (!role) {
            button.reply.send('Rol no encontrado.', true);
            return;
        }

        if (!member) {
            button.reply.send('Miembro no encontrado.', true);
            return;
        }

        try {
            // Verificar que el bot tenga el permiso para gestionar roles
            if (!member.hasPermission('MANAGE_ROLES')) {
                button.reply.send('No tengo permiso para asignar roles.', true);
                return;
            }

            await member.roles.add(role);
            button.reply.send('¡Ahora estás verificado!', true);
        } catch (error) {
            button.reply.send('Hubo un error al asignar el rol.', true);
            console.error('Error al añadir el rol:', error);
        }
    }
});

client.login('TU_TOKEN_DEL_BOT'); // Reemplaza con el token de tu bot
