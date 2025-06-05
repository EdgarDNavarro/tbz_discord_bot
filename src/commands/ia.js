const { default: axios } = require("axios");

const MAX_LENGTH = 3000
const prompt = "Eres un bot de discord llamado Tbz bot, estas aqui para ayudar a los integrantes del grupo, siempre responde en español. "

module.exports = {
    async run(message) {
        const args = message.content.split(' ');
        args.shift();
        const searchTerm = args.join(' ');

        try {
            let reply = await message.reply('⏳ Generando respuesta...');
            return reply.edit('Lo siento, el comando de IA está deshabilitado temporalmente. Si necesitas ayuda, contacta a MCube21. anota ahi: 0426');
            const response = await axios.post('http://localhost:11434/api/generate', {
                model: 'deepseek-r1:7b',
                prompt: prompt + searchTerm,
                stream: false
            });
            let responseText = response.data.response;
            responseText = responseText.replace(/<think>.*?<\/think>/s, '').trim();
            
            if (responseText.length > MAX_LENGTH) {
                let chunks = responseText.match(new RegExp(`.{1,${MAX_LENGTH}}`, 'g'));
                reply.edit(chunks.shift());

                for (let chunk of chunks) {
                    await message.channel.send(chunk); 
                }
            } else {
                reply.edit(responseText);
            }

        
        } catch (error) {
            console.error('Error al consultar Ollama:', error);
            await message.reply('Hubo un error al obtener la respuesta de la IA.');
        }
    }
};