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