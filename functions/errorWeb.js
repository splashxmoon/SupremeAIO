async function sendErrorWebhook(cartedSize, productName, addressEmbed, productImageURL,proxyString,webhook,keywords){
    const webhookUrl = webhook;

    try {
      const embed = {
        title: 'Payment Declined',
        color: 15548997,
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
          {
            name: 'Keywords',
            value: `${keywords}`,
            inline: false,
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

      console.log('Webhook sent successfully');
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error sending webhook:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      }
    }
  }
  