const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeData(apiProd, apiRequestUrl, page, selectedColor, maxRetries) {
    const response = await axios.get(apiProd);
    const html = response.data;

    const $ = cheerio.load(html);

    const containerDiv = $('div.container.product-padding');

    if (containerDiv.length > 0) {
        const scriptTag = containerDiv.find('script.js-product-json').html();
        if (scriptTag) {
            const jsonData = JSON.parse(scriptTag);
            const variants = jsonData.product.variants;

            const idsAndStyles = variants.map(variant => ({
                id: variant.id,
                style: jsonData.product.tags.find(tag => tag.startsWith('style:')).split(':')[1]
            }));

            console.log("Product Skus");
            idsAndStyles.forEach(item => console.log(`ID: ${item.id}, Style: ${item.style}`));

            let selectedVariant;
            let retryCount = 0;

            while (!selectedVariant && retryCount < maxRetries) {
                const randomIndex = Math.floor(Math.random() * idsAndStyles.length);
                const randomItem = idsAndStyles[randomIndex];
                console.log("\nSelecting random:");
                console.log(`ID: ${randomItem.id}, Style: ${randomItem.style}`);

                const payload2 = {
                    items: [
                        {
                            id: randomItem.id,
                            quantity: 1,
                            properties: {
                                _max_style: 2,
                                _max_product: 1,
                                _style: randomItem.style,
                                Style: selectedColor,
                            },
                        },
                    ],
                };

                const response = await page.evaluate(async (url, payload2) => {
                    const requestOptions = {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(payload2),
                    };

                    const result = await fetch(url, requestOptions);
                    return result.json();
                }, apiRequestUrl, payload2);

                if (response.status === 422) {
                    console.log("Product is sold out, retrying...");
                    retryCount++;
                } else {
                    selectedVariant = randomItem;
                    console.log(response);
                }
            }

            if (!selectedVariant) {
                console.log("Failed to select a variant after retrying.");
            }
        } else {
            console.log('JSON data not found in the HTML');
        }
    } else {
        console.log('Container div not found in the HTML');
    }
}

module.exports = scrapeData;
