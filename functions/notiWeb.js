async function sendProduct(productName,productImageURL,webhook) {
    const webhookUrl = webhook;

    try {
      const embed = {
        title: 'Found Product!',
        color: 3447003,
        fields: [
          {
            name: 'Product Name',
            value: `${productName}`,
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