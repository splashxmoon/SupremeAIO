async function sendWebhook(cartedSize, productName, addressEmbed, productImageURL,proxyString,webhook) {
    const webhookUrl = webhook;

    try {
      const embed = {
        title: 'Checkout Success',
        color: 5763719,
        fields: [
          {
            name: 'Product Name',
            value: `${productName}`,
            inline: true,
          },
          {
            name: 'Mode',
            value: 'Preload',
            inline: true,
          },
          {
            name: 'Size',
            value: `${cartedSize}`,
            inline: false,
          },
          {
            name: 'Address',
            value: `||${addressEmbed}||`,
            inline: true,
          },
          {
            name: 'Proxy',
            value: `||${proxyString}||`,
            inline: true,
          },
          
          
        ],

        thumbnail: {
          url: productImageURL,
        },
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