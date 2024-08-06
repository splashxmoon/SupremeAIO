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