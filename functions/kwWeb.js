async function sendKW(keywords,webhook) {
    const webhookUrl = webhook;

    try {
      const embed = {
        title: 'Monitoring Product',
        color: 10181046,
        fields: [
          {
            name: 'Keywords',
            value: `${keywords}`,
            inline: true,
          },
          
        ],

        
      };

      const formData = new FormData();
      formData.append('payload_json', JSON.stringify({ embeds: [embed] }));

      const response = await axios.post(webhookUrl, formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });

    } catch (error) {
      console.error('Error sending webhook:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      }
    }
  }