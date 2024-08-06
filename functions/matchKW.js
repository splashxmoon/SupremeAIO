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


module.exports = findAndClickMatchingProduct;