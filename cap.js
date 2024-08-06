const puppeteer = require('puppeteer');

async function main() {
    const browser = await puppeteer.launch({
       headless: false,
       defaultViewport: null, 
       args: [`--window-size=650,650`] 
     });
    const page = await browser.newPage();
    
    
   
    await page.goto('http://127.0.0.1:3001/captcha.html',{timeout:0});


    await page.click('#captchaFrame');
    
    let tokenValue = '';
   

    while (true) {
      
      await page.waitForFunction(() => {
        const tokenDiv = document.getElementById('tokenResponse');
        return tokenDiv && tokenDiv.innerText.trim().length > 0;
    }, { timeout: 60000 }); // Set a timeout of 60 seconds
    

        
        const newTokenValue = await page.evaluate(() => {
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
    }

    
 
   
}
main();