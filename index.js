#!/usr/bin/env node

/**
 * Supreme Bot by Pk
 * Simple checkout tool for Supreme
 *
 * @author Pk <https://github.com/splashxmoon>
 */

const chalk = require('chalk');
const init = require('./utils/init');
const cli = require('./utils/cli');
const log = require('./utils/log');
const readline = require('readline');
const fs = require('fs');

const DiscordRPC = require('discord-rpc');

const clientId = '1146834267696017469';

(async () => {
  try {
    await DiscordRPC.register(clientId);
    const rpc = new DiscordRPC.Client({ transport: 'ipc' });
    await rpc.login({ clientId });
    console.log('Connected to Discord RPC');

    await rpc.setActivity({
      details: 'Running Supreme',
      startTimestamp: new Date(),
      largeImageKey: 'compressjpeg_online_512x512_image',
      largeImageText: 'Why You Stalking Me?',
      smallImageKey: 'png-transparent-emoji-lucifer-devil-smile-emoji-purple-cat-like-mammal-carnivoran-thumbnail-removebg-preview_1_',
      smallImageText: 'Supreme',
    });

   
    process.on('SIGINT', () => {
      if (rpc) {
        rpc.destroy();
      }
    });
  } catch (error) {
    console.error('Error connecting to Discord RPC:', error);
  }
})();


const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

(async () => {
	init({ clear });
	input.includes(`help`) && cli.showHelp(0);

	debug && log(flags);
})();


function getUserWebhook() {
	const rl = readline.createInterface({
	  input: process.stdin,
	  output: process.stdout,
	});
  
	return new Promise((resolve) => {
	  rl.question('Enter your Discord webhook URL: ', (webhookUrl) => {
		rl.close();
		resolve(webhookUrl);
	  });
	});
  }

  const mainMenu = async () => {
	init({ clear });
	input.includes(`help`) && cli.showHelp(0);
  
	debug && log(flags);
  
	const inquirer = await dynamicImport('inquirer');
  
  
  let webhookUrl = loadWebhookFromFile();
  
	
	if (!webhookUrl || input.includes('webhook')) {
	  webhookUrl = await getUserWebhook();
	  saveWebhookToFile(webhookUrl);
	}
	
	
	const { option } = await inquirer.prompt([
	  {
		type: 'list',
		name: 'option',
		message: 'Select an option:',
		choices: ['1 - Checkout','2 - Settings', 'Exit'],
	  },
	]);
	if (option === '1 - Checkout') {
		
	
		
		
		
		const puppeteer = require('puppeteer-extra');
		const cheerio = require('cheerio');
		const fs = require('fs');
		const path = require('path');
		const axios = require('axios');
		const FormData = require('form-data');
		const StealthPlugin = require('puppeteer-extra-plugin-stealth');
		const sound = require("sound-play");
		const apiRequestUrl = 'https://us.supreme.com/cart/add.js';
		const payload = {
		  items: [
			{
			  id: 42713343688975,
			  quantity: 1,
			  properties: {
				_max_style: 8,
				_max_product: 16,
				_style: 'style:A36',
				Style: 'Black',
			  },
			},
		  ],
		};
		puppeteer.use(StealthPlugin());
	  
		async function selectRandomSize() {
		  const sizes = ['Small','Medium','Large','XLarge'];
		  const randomIndex = Math.floor(Math.random() * sizes.length);
		  return sizes[randomIndex];
		}
	  
		async function selectColor(page, selectedColor) {
		  // waiting for element with the classname to exist
		  await page.waitForSelector('.aspectRatio-content', { timeout: 0 });
	  
		  // find all element with the classname
		  const imageFound = await page.$$('.aspectRatio-content');
	  
		  // loop thru all images
		  for (const handle of imageFound) {
			  // click on image to select color
			  await handle.click();
	  
			  // wait for element to exist.
			  await page.waitForSelector('div.fontWeight-bold.mb-s.display-none.bpS-display-block.js-variant', { visible: true });
	  
			  // print out color that was looped thru
			  const textContent = await page.evaluate(() => {
				  const div = document.querySelector('div.fontWeight-bold.mb-s.display-none.bpS-display-block.js-variant');
				  return div.textContent.trim();
	  
			  });
			  
			  if (textContent == selectedColor) {
				  console.log(`\tColor found: ${textContent}`)
	  
				  const currentURL = await page.url();   
				  return currentURL 
			  }
	  
		  }
	  
		  
	  }
	  
	  
	  
		async function selectSizeBasedOnDataSize(page, dataSize) {
		  await page.waitForSelector('[data-cy="size-selector"]', { timeout: 0 });
		  await page.click('[data-cy="size-selector"]');
		  await page.focus('[data-cy="size-selector"]');
		  for (let i = 0; i < ['small', 'medium', 'large', 'xlarge', 'xxlarge'].indexOf(dataSize); i++) {
			await page.keyboard.press('ArrowDown');
		  }
		  await page.keyboard.press('Enter');
		}
	  
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
	  
	  
		async function readCSVFile(filepath) {
		  try {
			const results = [];
			const fileContent = fs.readFileSync(filepath, 'utf-8');
			const data = fileContent.split('\n');
			for (const row of data) {
			  const columns = row.split(',');
			  const [name, last, email, address, address2, city, zip, phone, cardinfo, expiry, cvv,webhook,item,selectedColor] = columns;
			  results.push({ name, last, email, address, address2, city, zip, phone, cardinfo, expiry, cvv,webhook,item,selectedColor});
			}
			console.log('Parsed data:');
			console.log(results);
			return results;
		  } catch (error) {
			console.error('Error parsing CSV file:', error);
			throw error;
		  }
		}
	  
		function readProxiesFromFile(filePath) {
		  const fileContent = fs.readFileSync(filePath, 'utf-8');
		  const lines = fileContent.trim().split('\n');
	  
		  const proxies = lines.map((line) => {
			const [ip, port, user, pass] = line.split(':');
			if (!ip || !port) {
			  return null; 
			}
			return { ip, port, user, pass: pass.trim() };
		  });
	  
		  return proxies.filter((proxy) => proxy !== null);
		}
		function formatProxyString(proxy) {
	  
		  if (!proxy) {
			return 'None'; 
		  }
	  
		  let proxyString = `${proxy.ip}:${proxy.port}`;
		  if (proxy.user && proxy.pass) {
			proxyString;
		  }
		  return proxyString;
		}
	  
	  
	  
		async function main(proxy) {
		  try {

			
	  
			let currentUrl1;
			const filePath = 'proxies.txt';
			const proxies = readProxiesFromFile(filePath);
			const csvFilePath = path.resolve(__dirname, 'task1.csv');
			const data = await readCSVFile(csvFilePath);
			const keywordsFilePath = path.resolve(__dirname, 'keywords.csv');
			const keywordsContent = fs.readFileSync(keywordsFilePath, 'utf-8');
			const keywords = keywordsContent.split(',');
			
			if (data.length === 0) {
			  console.log('No data found in the CSV file.');
			  return;
			}
	  
			const browserInstances = [];
			
			for (const entry of data) {
			browser = await puppeteer.launch({
				headless: false,
				args: [
				  '--verbose',
				  proxy ? `--proxy-server=${proxy.ip}:${proxy.port}` : '',
				],
			  });
			  const page = await browser.newPage();
	  
			  if (proxy) {
				await page.authenticate({ username: proxy.user, password: proxy.pass });
			  }
	  
			  await page.setViewport({ width: 1020, height: 800, isMobile: false });
	  
			  browserInstances.push({ browser, page, entry });
			}
			const promises = browserInstances.map(({ page, entry }) => {
			  return (async () => {
	  
			const { name, last, email, address, address2, city, zip, phone, cardinfo, expiry, cvv,webhook,item,selectedColor } = entry;
	  
			try {
		  console.log(proxies);
			  await page.goto('https://us.supreme.com/products/1q62q-xoor8lreo');
			  
			  const sizeSelector = '[data-cy="size-selector"]';
				const isSizeAvailable = await page.evaluate((selector) => {
				  const sizeDropdown = document.querySelector(selector);
				  return sizeDropdown && sizeDropdown.childElementCount > 0;
				}, sizeSelector);
				
				if (isSizeAvailable) {
				  console.log('Starting Preload')
			
				  const response = await page.evaluate(async (url, payload) => {
					const requestOptions = {
					  method: 'POST',
					  headers: {
						'Content-Type': 'application/json',
					  },
					  body: JSON.stringify(payload),
					};
				
					const result = await fetch(url, requestOptions);
					return result.json();
				  }, apiRequestUrl, payload);
				
				  
				  console.log('API Response:', response);
				
				  await page.goto('https://us.supreme.com/cart')
			  console.log('Item added to cart.');
			  await page.waitForSelector('#main > div.main-content.js-main-content > div > div > form > div.js-checkout-actions.cart-checkout-actions.p-s.bpS-p-7 > div > input');
			  await page.click('#main > div.main-content.js-main-content > div > div > form > div.js-checkout-actions.cart-checkout-actions.p-s.bpS-p-7 > div > input');
			  console.log('Proceeding to checkout...');
			  await page.waitForNavigation({timeout:0});
			  
			  await page.waitForSelector('input[name="firstName"]',{timeout:0});
				await page.type('input[name="firstName"]',name);
				await page.waitForSelector('input[name="lastName"]');
				await page.type('input[name="lastName"]',last);
				await page.type('input[name="email"]',email);
				await page.type('input[name="address1"]',address);
				await page.waitForSelector('#shipping-address1-option-0', { timeout: 5000 }).then(async () => {
				console.log('Found address option, clicking...');
				await page.click('#shipping-address1-option-0');
			  }).catch(() => {
				console.log('Address option not found.');
			  });
				
				await page.waitForTimeout(500);
				if (address2) {
				  await page.waitForSelector('input[name="address2"]');
				  await page.type('input[name="address2"]',address2);
			
				  
				}
				await page.waitForSelector('input[name="phone"]');
				await page.type('input[name="phone"]', phone);
				const inputSelector = '#number'; 
		  await page.waitForSelector(inputSelector);
	  
		  const inputElement = await page.$(inputSelector);
		  await inputElement.focus();
		  await inputElement.click({ clickCount: 3 }); 
		  await page.keyboard.press('Backspace'); 
	  
	  
		  await page.type(inputSelector, cardinfo);
	  
		  const cardName = '#name';
		  await page.waitForSelector(cardName);
		  const inputElement2 = await page.$(cardName);
		  await inputElement2.focus();
		  await inputElement2.click({ clickCount: 3 }); 
		  await page.keyboard.press('Backspace'); 
		  await page.type(cardName, name+ " " +last);
	  
	  
		  await page.waitForSelector('#expiry');
		  const inputElement3 = await page.$('#expiry');
		  await inputElement3.focus();
		  await inputElement3.click({ clickCount: 3 }); 
		  await page.keyboard.press('Backspace'); 
		  await page.type('#expiry',expiry);
	  
		  await page.waitForSelector('#verification_value');
		  const inputElement4 = await page.$('#verification_value');
		  await inputElement4.focus();
		  await inputElement4.click({ clickCount: 3 }); 
		  await page.keyboard.press('Backspace'); 
		  await page.type('#verification_value',cvv);
		  currentUrl1 = page.url();
			  await page.waitForTimeout(1000);
			  await page.goto('https://us.supreme.com/cart');
			  await page.waitForSelector('#main > div.main-content.js-main-content > div > div > form > div.mobile-shadow.bg-white > div > div.cart-wrap > table > tbody > tr > td.borderLeft-gray--2.borderRight-gray--2.bpS-border-none.pl-xs.pr-xs.bpS-p-0 > div.display-none.bpS-display-block > a');
			  await page.click('#main > div.main-content.js-main-content > div > div > form > div.mobile-shadow.bg-white > div > div.cart-wrap > table > tbody > tr > td.borderLeft-gray--2.borderRight-gray--2.bpS-border-none.pl-xs.pr-xs.bpS-p-0 > div.display-none.bpS-display-block > a');
				}

				const browser2 = await puppeteer.launch({
					headless: false,
					defaultViewport: null, 
					args: [`--window-size=650,650`] 
				  });
				 const page2 = await browser2.newPage();

				 await page2.goto('http://127.0.0.1:3000/captcha.html')

				 await page2.click('#captchaFrame');
    
				 let tokenValue = '';
				
			 
				 
				   
				   await page2.waitForFunction(() => {
					 const tokenDiv = document.getElementById('tokenResponse');
					 return tokenDiv && tokenDiv.innerText.trim().length > 0;
				 }, { timeout: 60000 }); // Set a timeout of 60 seconds
				 
			 
					 
					 const newTokenValue = await page2.evaluate(() => {
						 const tokenDiv = document.getElementById('tokenResponse');
						 return tokenDiv.innerText.trim();
					 });
			 
					
					 if (newTokenValue !== tokenValue) {
						 tokenValue = newTokenValue;
						
					 }
			 
			 
					 
					 const formattedToken = `${tokenValue}`;
			 
			 
					 await page.goto('https://us.supreme.com/checkpoint',{timeout:0});
			 
					 console.log('Checkpoint loaded')
			 
					 
					 await page.evaluate((formattedToken) => {
						 document.getElementById("g-recaptcha-response").innerHTML = formattedToken;
					 }, formattedToken);
			 
					 console.log('Submitting Checkpoint')
			 
					 await page.click('#main > div.main-content.js-main-content > div > div > div > form > p > button');
			 
			 
				   
					 console.log('Checkpoint submitted')
					
				
				
				 
			  
			  const url = `https://us.supreme.com/collections/${item}`;
			  await page.goto(url);
			  
			  await sendKW(keywords,webhook)
			  console.log(`Monitoring product: ${keywords}`);


			  await page.waitForSelector('li.collection-product-item');
			  
			 
			  
			  
			  let matchingProductHandle = await findAndClickMatchingProduct(page, keywords);
	  
			  if (matchingProductHandle) {
				await matchingProductHandle.click();
				const productNameSelector = '.product-title';
				await page.waitForSelector(productNameSelector);
				const productNameElement = await page.$(productNameSelector);
				const productName = await productNameElement.evaluate(el => el.textContent.trim());
	  
				
				const urlOfSelectedColor = await selectColor(page, selectedColor);
				await page.goto(urlOfSelectedColor);
	  
				
				console.log('Product Found', productName);
				const sizeSelector = '[data-cy="size-selector"]';
				const isSizeAvailable = await page.evaluate((selector) => {
				  const sizeDropdown = document.querySelector(selector);
				  return sizeDropdown && sizeDropdown.childElementCount > 0;
				}, sizeSelector);
				const productImageSelector = '.js-product-image';
				await page.waitForSelector(productImageSelector);
				const productImageElement = await page.$(productImageSelector);
				const productImage = await productImageElement.evaluate(el => el.getAttribute('src'));
				const productImageURL = `https:${productImage}`;
				await sendProduct(productName,productImageURL,webhook);
	  
				if (isSizeAvailable) {
				  console.log('Size available. Adding to cart...');
				  
		  
				
				
				  cartedSize = await selectRandomSize();
	  
				await selectSizeBasedOnDataSize(page, cartedSize);

				const apiProd = page.url();

				const maxRetries = 40;
let retryCount = 0;

try {
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
} catch (error) {
    console.error('Error fetching data:', error);
}

				  
				
				 
				  console.log('Carted Size:', cartedSize);
				  await page.waitForTimeout(500);
				  console.log('Item added to cart.');
				  await page.goto(currentUrl1);
	  
				  
				
	  
				  const inputSelector = '#number'; 
			await page.waitForSelector(inputSelector);
	  
			const inputElement = await page.$(inputSelector);
			await inputElement.focus();
			await inputElement.click({ clickCount: 3 }); 
			await page.keyboard.press('Backspace'); 
	  
	  
			await page.type(inputSelector, cardinfo);
	  
			const cardName = '#name';
			await page.waitForSelector(cardName);
			const inputElement2 = await page.$(cardName);
			await inputElement2.focus();
			await inputElement2.click({ clickCount: 3 }); 
			await page.keyboard.press('Backspace'); 
			await page.type(cardName, name+ " " +last);
	  
	  
			await page.waitForSelector('#expiry');
			const inputElement3 = await page.$('#expiry');
			await inputElement3.focus();
			await inputElement3.click({ clickCount: 3 }); 
			await page.keyboard.press('Backspace'); 
			await page.type('#expiry',expiry);
	  
			
			await page.waitForSelector('#verification_value');
			const inputElement4 = await page.$('#verification_value');
			await inputElement4.focus();
			await inputElement4.click({ clickCount: 3 }); 
			await page.keyboard.press('Backspace'); 
			  await page.type('#verification_value',cvv);
			  
			  await page.waitForTimeout(2000);
			  const button = await page.$('div._1ip0g651 button[type="submit"].QT4by');

			  // Check if the button is found
			  if (button) {
				// Click on the button
				await button.click();
				console.log('Processing');
			  } 
			  
			  await page.waitForNavigation();
			  await page.waitForTimeout(2000);
			  const alertSelector = 'div[role="alert"].sdr03s1';
			  const alertElement = await page.$(alertSelector);
			  
			  if (alertElement) {
				const alertText = await page.$eval(alertSelector, alert => alert.textContent.trim());
				const addressEmbed = `Name: ${name} ${last}\nEmail: ${email}\nAddress: ${address}${address2 ? ', ' + address2 : ''}\nCity: ${city}\nZip: ${zip}\nPhone: ${phone}`;
				const formattedProxy = formatProxyString(proxy);
			
				await sendErrorWebhook(cartedSize, productName, addressEmbed,productImageURL,formattedProxy,webhook);
			  
				
			  
				console.log('Error:', alertText);
				console.log('Trying again');
				const inputSelector = '#number'; 
		await page.waitForSelector(inputSelector);
	
		const inputElement = await page.$(inputSelector);
		await inputElement.focus();
		await inputElement.click({ clickCount: 3 }); 
		await page.keyboard.press('Backspace'); 
	
	
		await page.type(inputSelector, cardinfo);
	
		const cardName = '#name';
		await page.waitForSelector(cardName);
		const inputElement2 = await page.$(cardName);
		await inputElement2.focus();
		await inputElement2.click({ clickCount: 3 }); 
		await page.keyboard.press('Backspace'); 
		await page.type(cardName, name+ " " +last);
	
	
		await page.waitForSelector('#expiry');
		const inputElement3 = await page.$('#expiry');
		await inputElement3.focus();
		await inputElement3.click({ clickCount: 3 }); 
		await page.keyboard.press('Backspace'); 
		await page.type('#expiry',expiry);
	
		await page.waitForSelector('#verification_value');
		const inputElement4 = await page.$('#verification_value');
		await inputElement4.focus();
		await inputElement4.click({ clickCount: 3 }); 
		await page.keyboard.press('Backspace'); 
		await page.type('#verification_value',cvv);
		await page.waitForTimeout(2000);
		await page.click('#pay-button-container > div > div > button');
			  }  else  {
				const addressEmbed = `Name: ${name} ${last}\nEmail: ${email}\nAddress: ${address}${address2 ? ', ' + address2 : ''}\nCity: ${city}\nZip: ${zip}\nPhone: ${phone}`;
				const formattedProxy = formatProxyString(proxy);
				await sendWebhook(cartedSize, productName, addressEmbed,productImageURL,formattedProxy,webhook);
			   
				sound.play("C:\\Users\\Arun Dass\\Desktop\\Checkout_1.mp3")
			  }
				} else {
		
				  console.log('\nOUT OF STOCK (waiting for restock)');
			  
				  while (true) {
					await page.waitForTimeout(6000); 
					await page.reload(); 
					console.log('\tChecking for restock');
					
					const isSizeAvailableAfterRefresh = await page.evaluate((selector) => {
					  const sizeDropdown = document.querySelector(selector);
					  return sizeDropdown && sizeDropdown.childElementCount > 0;
					}, sizeSelector);
				
					if (isSizeAvailableAfterRefresh) {
					  console.log('Size restocked. Adding to cart...');
					  console.log('Size available. Adding to cart...');
				  const productImageSelector = '.js-product-image';
				  await page.waitForSelector(productImageSelector);
				  const productImageElement = await page.$(productImageSelector);
				  const productImage = await productImageElement.evaluate(el => el.getAttribute('src'));
		  
				
				  const productImageURL = `https:${productImage}`;
				  cartedSize = await selectRandomSize();
	  
				await selectSizeBasedOnDataSize(page, cartedSize);
				  await page.waitForSelector('#product-root > div > div.Product.width-100.js-product.routing-transition.fade-on-routing > div.product-column-right > form > div.width-100 > div > div.mb-7.mt-7.pl-s.pr-s.bpS-pl-0.bpS-pr-0.display-flex.bpS-display-block.product-actions-wrap.js-mobile-buttons > div.bpS-ml-auto.bpS-ml-0.product-controls.js-product-controls.quick-transition > div.product-action-grid > div:nth-child(3) > div.js-add-to-cart.pdp-add-to-cart.product-action-grid-c2 > input');
				  await page.click('#product-root > div > div.Product.width-100.js-product.routing-transition.fade-on-routing > div.product-column-right > form > div.width-100 > div > div.mb-7.mt-7.pl-s.pr-s.bpS-pl-0.bpS-pr-0.display-flex.bpS-display-block.product-actions-wrap.js-mobile-buttons > div.bpS-ml-auto.bpS-ml-0.product-controls.js-product-controls.quick-transition > div.product-action-grid > div:nth-child(3) > div.js-add-to-cart.pdp-add-to-cart.product-action-grid-c2 > input');
				  console.log('Carted Size:', cartedSize);
				  await page.waitForTimeout(500);
				  console.log('Item added to cart.');
				  await page.goto('https://us.supreme.com/cart');
				  await page.waitForSelector('#main > div.main-content.js-main-content > div > div > form > div.js-checkout-actions.cart-checkout-actions.p-s.bpS-p-7 > div > input');
				  await page.click('#main > div.main-content.js-main-content > div > div > form > div.js-checkout-actions.cart-checkout-actions.p-s.bpS-p-7 > div > input');
				  console.log('Proceeding to checkout...');
				  await page.goto(currentUrl1);
				  const inputSelector = '#number'; 
			await page.waitForSelector(inputSelector);
	  
			const inputElement = await page.$(inputSelector);
			await inputElement.focus();
			await inputElement.click({ clickCount: 3 }); 
			await page.keyboard.press('Backspace'); 
	  
	  
			await page.type(inputSelector, cardinfo);
	  
			const cardName = '#name';
			await page.waitForSelector(cardName);
			const inputElement2 = await page.$(cardName);
			await inputElement2.focus();
			await inputElement2.click({ clickCount: 3 }); 
			await page.keyboard.press('Backspace'); 
			await page.type(cardName, name+ " " +last);
	  
	  
			await page.waitForSelector('#expiry');
			const inputElement3 = await page.$('#expiry');
			await inputElement3.focus();
			await inputElement3.click({ clickCount: 3 }); 
			await page.keyboard.press('Backspace'); 
			await page.type('#expiry',expiry);
	  
			
			await page.waitForSelector('#verification_value');
			const inputElement4 = await page.$('#verification_value');
			await inputElement4.focus();
			await inputElement4.click({ clickCount: 3 }); 
			await page.keyboard.press('Backspace'); 
			  await page.type('#verification_value',cvv);
			  
			  await page.waitForTimeout(2000);
			  await page.click('#Form0 > div > div.BGZeY > div > div > div:nth-child(2) > div > div > div > div:nth-child(2) > div > div > button');
			  console.log("Processing");
			  await page.waitForNavigation();
			  const currentUrl = page.url();   
			  if (currentUrl.includes('/error')) {
				
				const addressEmbed = `Name: ${name} ${last}\nEmail: ${email}\nAddress: ${address}${address2 ? ', ' + address2 : ''}\nCity: ${city}\nZip: ${zip}\nPhone: ${phone}`;
				await sendErrorWebhook(cartedSize, productName, addressEmbed,productImageURL);
				console.log('Checkout Failed');
	  
			  } else {
				const addressEmbed = `Name: ${name} ${last}\nEmail: ${email}\nAddress: ${address}${address2 ? ', ' + address2 : ''}\nCity: ${city}\nZip: ${zip}\nPhone: ${phone}`;
				await sendWebhook(cartedSize, productName, addressEmbed,productImageURL);
				console.log('Checkout Success');
			  }
					  break; 
					
				  }
				  }
				}
			  }  else {
				
				
				const maxRetries = 50;
				let retries = 0;
			   
				const intervalId = setInterval(async () => {
		try{
		  
		  console.log('Waiting For Product');
		
		 
		  
			await page.reload({ waitUntil: 'domcontentloaded' });
			await page.waitForTimeout(4000);
			
	  
			matchingProductHandle = await findAndClickMatchingProduct(page, keywords);
		
			if (matchingProductHandle) {
			  await matchingProductHandle.click();
			  const productNameSelector = '.product-title';
			  await page.waitForSelector(productNameSelector);
			  const productNameElement = await page.$(productNameSelector);
			  const productName = await productNameElement.evaluate(el => el.textContent.trim());
		
			  console.log('Product Found', productName);
			  const sizeSelector = '[data-cy="size-selector"]';
			  const isSizeAvailable = await page.evaluate((selector) => {
				const sizeDropdown = document.querySelector(selector);
				return sizeDropdown && sizeDropdown.childElementCount > 0;
			  }, sizeSelector);
		
			  if (isSizeAvailable) {
				console.log('Size available. Adding to cart...');
				const productImageSelector = '.js-product-image';
				await page.waitForSelector(productImageSelector);
				const productImageElement = await page.$(productImageSelector);
				const productImage = await productImageElement.evaluate(el => el.getAttribute('src'));
		
				const productImageURL = `https:${productImage}`;
				cartedSize = await selectRandomSize();
				await selectSizeBasedOnDataSize(page, cartedSize);
				await page.waitForSelector('#product-root > div > div.Product.width-100.js-product.routing-transition.fade-on-routing > div.product-column-right > form > div.width-100 > div > div.mb-7.mt-7.pl-s.pr-s.bpS-pl-0.bpS-pr-0.display-flex.bpS-display-block.product-actions-wrap.js-mobile-buttons > div.bpS-ml-auto.bpS-ml-0.product-controls.js-product-controls.quick-transition > div.product-action-grid > div:nth-child(3) > div.js-add-to-cart.pdp-add-to-cart.product-action-grid-c2 > input');
				await page.click('#product-root > div > div.Product.width-100.js-product.routing-transition.fade-on-routing > div.product-column-right > form > div.width-100 > div > div.mb-7.mt-7.pl-s.pr-s.bpS-pl-0.bpS-pr-0.display-flex.bpS-display-block.product-actions-wrap.js-mobile-buttons > div.bpS-ml-auto.bpS-ml-0.product-controls.js-product-controls.quick-transition > div.product-action-grid > div:nth-child(3) > div.js-add-to-cart.pdp-add-to-cart.product-action-grid-c2 > input');
				console.log('Carted Size:', cartedSize);
				await page.waitForTimeout(500);
				console.log('Item added to cart.');
				await page.goto(currentUrl1);
		
				await page.waitForSelector('input[name="firstName"]', { timeout: 0 });
				await page.type('input[name="firstName"]', name);
				await page.waitForSelector('input[name="lastName"]');
				await page.type('input[name="lastName"]', last);
				await page.type('input[name="email"]', email);
				await page.type('input[name="address1"]', address);
				await page.waitForSelector('#address1-option-0', { timeout: 5000 }).then(async () => {
				  console.log('Found address option, clicking...');
				  await page.click('#address1-option-0');
				}).catch(() => {
				  console.log('Address option not found.');
				});
				await page.waitForTimeout(500);
		
				if (address2) {
				  await page.waitForSelector('input[name="address2"]');
				  await page.type('input[name="address2"]', address2);
				}
				await page.waitForSelector('input[name="phone"]');
				await page.type('input[name="phone"]', phone);
				const inputSelector = '#number';
				await page.waitForSelector(inputSelector);
		
				const inputElement = await page.$(inputSelector);
				await inputElement.focus();
				await inputElement.click({ clickCount: 3 });
				await page.keyboard.press('Backspace');
		
				await page.type(inputSelector, cardinfo);
		
				const cardName = '#name';
				await page.waitForSelector(cardName);
				const inputElement2 = await page.$(cardName);
				await inputElement2.focus();
				await inputElement2.click({ clickCount: 3 });
				await page.keyboard.press('Backspace');
				await page.type(cardName, name + " " + last);
		
				await page.waitForSelector('#expiry');
				const inputElement3 = await page.$('#expiry');
				await inputElement3.focus();
				await inputElement3.click({ clickCount: 3 });
				await page.keyboard.press('Backspace');
				await page.type('#expiry', expiry);
		
				await page.click('#error-for-TextField4 > div > span > span > button');
		
				await page.waitForSelector('#verification_value');
				const inputElement4 = await page.$('#verification_value');
				await inputElement4.focus();
				await inputElement4.click({ clickCount: 3 });
				await page.keyboard.press('Backspace');
				await page.type('#verification_value', cvv);
				await page.click('#accept_tos');
				await page.waitForTimeout(2000);
				await page.click('#Form0 > div > div.BGZeY > div > div > div:nth-child(2) > div > div > div > div:nth-child(2) > div > div > button');
				console.log("Processing");
				await page.waitForNavigation();
				const currentUrl = page.url();
				if (currentUrl.includes('/error')) {
				  const addressEmbed = `Name: ${name} ${last}\nEmail: ${email}\nAddress: ${address}${address2 ? ', ' + address2 : ''}\nCity: ${city}\nZip: ${zip}\nPhone: ${phone}`;
				  const formattedProxy = formatProxyString(proxy);
				  await sendErrorWebhook(cartedSize, productName, addressEmbed, productImageURL, formattedProxy);
				 
				} else {
				  const addressEmbed = `Name: ${name} ${last}\nEmail: ${email}\nAddress: ${address}${address2 ? ', ' + address2 : ''}\nCity: ${city}\nZip: ${zip}\nPhone: ${phone}`;
				  const formattedProxy = formatProxyString(proxy);
				  await sendWebhook(cartedSize, productName, addressEmbed, productImageURL, formattedProxy);
				}
			  } else {
				console.log('OUT OF STOCK (waiting for restock)');
				while (true) {
				  await page.waitForTimeout(6000);
				  await page.reload();
				  console.log('Checking for restock');
		
				  const isSizeAvailableAfterRefresh = await page.evaluate((selector) => {
					const sizeDropdown = document.querySelector(selector);
					return sizeDropdown && sizeDropdown.childElementCount > 0;
				  }, sizeSelector);
		
				  if (isSizeAvailableAfterRefresh) {
					console.log('Product restocked');
					const productImageSelector = '.js-product-image';
					await page.waitForSelector(productImageSelector);
					const productImageElement = await page.$(productImageSelector);
					const productImage = await productImageElement.evaluate(el => el.getAttribute('src'));
		
					const productImageURL = `https:${productImage}`;
					cartedSize = await selectRandomSize();
					await selectSizeBasedOnDataSize(page, cartedSize);
					await page.waitForSelector('#product-root > div > div.Product.width-100.js-product.routing-transition.fade-on-routing > div.product-column-right > form > div.width-100 > div > div.mb-7.mt-7.pl-s.pr-s.bpS-pl-0.bpS-pr-0.display-flex.bpS-display-block.product-actions-wrap.js-mobile-buttons > div.bpS-ml-auto.bpS-ml-0.product-controls.js-product-controls.quick-transition > div.product-action-grid > div:nth-child(3) > div.js-add-to-cart.pdp-add-to-cart.product-action-grid-c2 > input');
					await page.click('#product-root > div > div.Product.width-100.js-product.routing-transition.fade-on-routing > div.product-column-right > form > div.width-100 > div > div.mb-7.mt-7.pl-s.pr-s.bpS-pl-0.bpS-pr-0.display-flex.bpS-display-block.product-actions-wrap.js-mobile-buttons > div.bpS-ml-auto.bpS-ml-0.product-controls.js-product-controls.quick-transition > div.product-action-grid > div:nth-child(3) > div.js-add-to-cart.pdp-add-to-cart.product-action-grid-c2 > input');
					console.log('Carted Size:', cartedSize);
					await page.waitForTimeout(500);
					console.log('Item added to cart.');
					await page.goto('https://us.supreme.com/cart');
					await page.waitForSelector('#main > div.main-content.js-main-content > div > div > form > div.js-checkout-actions.cart-checkout-actions.p-s.bpS-p-7 > div > input');
					await page.click('#main > div.main-content.js-main-content > div > div > form > div.js-checkout-actions.cart-checkout-actions.p-s.bpS-p-7 > div > input');
					console.log('Proceeding to checkout...');
					currentUrl = page.url();
					if (currentUrl.includes('/throttle')) {
					  console.log('Still in queue');
					  await page.waitForTimeout(5000);
					} else {
					  console.log('Checkout page is available');
					  await page.waitForSelector('#TextField0', { timeout: 0 });
					  await page.type('#TextField0', name);
					  await page.waitForSelector('#TextField1');
					  await page.type('#TextField1', last);
					  await page.type('#email', email);
					  await page.type('#address1', address);
					  await page.waitForSelector('#address1-option-0', { timeout: 5000 }).then(async () => {
						console.log('Found address option, clicking...');
						await page.click('#address1-option-0');
					  }).catch(() => {
						console.log('Address option not found.');
					  });
		
					  await page.waitForTimeout(500);
					  if (address2) {
						await page.waitForSelector('#TextField3');
						await page.type('#TextField3', address2);
					  }
					  await page.waitForSelector('input[name="phone"]');
					  await page.type('input[name="phone"]', phone);
					  const inputSelector = '#number';
					  await page.waitForSelector(inputSelector);
		
					  const inputElement = await page.$(inputSelector);
					  await inputElement.focus();
					  await inputElement.click({ clickCount: 3 });
					  await page.keyboard.press('Backspace');
		
					  await page.type(inputSelector, cardinfo);
		
					  const cardName = '#name';
					  await page.waitForSelector(cardName);
					  const inputElement2 = await page.$(cardName);
					  await inputElement2.focus();
					  await inputElement2.click({ clickCount: 3 });
					  await page.keyboard.press('Backspace');
					  await page.type(cardName, name + " " + last);
		
					  await page.waitForSelector('#expiry');
					  const inputElement3 = await page.$('#expiry');
					  await inputElement3.focus();
					  await inputElement3.click({ clickCount: 3 });
					  await page.keyboard.press('Backspace');
					  await page.type('#expiry', expiry);
		
					  await page.waitForSelector('#verification_value');
					  const inputElement4 = await page.$('#verification_value');
					  await inputElement4.focus();
					  await inputElement4.click({ clickCount: 3 });
					  await page.keyboard.press('Backspace');
					  await page.type('#verification_value', cvv);
					  await page.click('#accept_tos');
					  await page.click('#Form0 > div > div.BGZeY > div > div > div:nth-child(2) > div > div > div > div:nth-child(2) > div > div > button');
					  console.log("Processing");
					  await page.waitForNavigation();
					  const currentUrl = page.url();
					  if (currentUrl.includes('/error')) {
						const addressEmbed = `Name: ${name} ${last}\nEmail: ${email}\nAddress: ${address}${address2 ? ', ' + address2 : ''}\nCity: ${city}\nZip: ${zip}\nPhone: ${phone}`;
						await sendErrorWebhook(cartedSize, productName, addressEmbed, productImageURL);
					  } else {
						const addressEmbed = `Name: ${name} ${last}\nEmail: ${email}\nAddress: ${address}${address2 ? ', ' + address2 : ''}\nCity: ${city}\nZip: ${zip}\nPhone: ${phone}`;
						await sendWebhook(cartedSize, productName, addressEmbed, productImageURL);
					  }
					  break;
					}
				  }
				}
			  }
		
			  retries++;
			  console.log(`Retrying (${retries}/${maxRetries})...`);
			}
			
		
			if (retries >= maxRetries) {
			  clearInterval(intervalId);
			  console.log('Timeout Waiting For Product');
			  return;
			}
		  
		} catch (error) {
			console.error('Error:', error);
		  }
		}, 5000);
	  
			}
			
			} catch (error) {
			  console.error('Error:', error);
			}
			
		  
		})();
		});
	   
		
		await Promise.all(promises);
		  } catch (error) {
			console.error('Error:', error);
		  }
		  
		} 
		
		
	  
		async function findAndClickMatchingProduct(page, keywords) {
		  const productItems = await page.$$('li.collection-product-item');
		
		  for (const item of productItems) {
			const productNameElement = await item.$('.collection-product-info--title');
		
			if (productNameElement) {
			  const productName = await productNameElement.evaluate(el => el.textContent.trim().toLowerCase());
		
			  if (keywords.every(keyword => productName.includes(keyword))) {
				return item;
			  }
			}
		  }
		
		  return null;
		}
	  
		main();
	}


	else if (option === '2 - Settings') {
		
		const settingsOptions = ['1 - Set Webhook', '2 - Back to Main Menu'];
		const { settingsOption } = await inquirer.prompt([
		  {
			type: 'list',
			name: 'settingsOption',
			message: 'Settings options:',
			choices: settingsOptions,
		  },
		]);
	
		if (settingsOption === '1 - Set Webhook') {
			webhookUrl = await getUserWebhook();
			saveWebhookToFile(webhookUrl);
		  await mainMenu();
		} 
		else if (settingsOption === '2 - Back to Main Menu') {
			await mainMenu();
		  }
	}


}

const dynamicImport = async (module) => {
	return import(module).then((result) => result.default);
  };

function loadWebhookFromFile() {
	try {
	  const webhookUrl = fs.readFileSync('webhook.txt', 'utf-8');
	  return webhookUrl;
	} catch (error) {
	  return null; 
	}
  }
  
  function saveWebhookToFile(webhookUrl) {
	try {
	  fs.writeFileSync('webhook.txt', webhookUrl);
	  console.log('Webhook URL saved to webhook.txt');
	} catch (error) {
	  console.error('Error saving webhook URL:', error);
	}
  }
  
  
  

(async () => {
	await mainMenu();
  })();