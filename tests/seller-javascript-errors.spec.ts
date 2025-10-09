import { test, expect } from '@playwright/test';

test.describe('Seller SPA JavaScript Error Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to seller SPA and wait for it to load
    await page.goto('http://localhost:8080/frontend/Seller/');
    await page.waitForLoadState('networkidle');
    
    // Wait for the app to initialize
    await page.waitForSelector('strong:has-text("Dashboard"), main, .seller-console', { timeout: 10000 });
  });

  test('Product catalog synchronization - should display 8 products (p1-p8)', async ({ page }) => {
    // Navigate to catalog
    await page.click('a[href="#/catalog"], button:has-text("Catalog")');
    await page.waitForSelector('.product-card, .catalog-item, [data-product-id]', { timeout: 5000 });
    
    // Check that we have 8 products with IDs p1-p8
    const expectedProductIds = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8'];
    
    for (const productId of expectedProductIds) {
      // Look for product ID in various possible locations
      const productExists = await page.locator(`text=${productId}`).count() > 0 ||
                           await page.locator(`[data-product-id="${productId}"]`).count() > 0 ||
                           await page.locator(`[id*="${productId}"]`).count() > 0;
      
      expect(productExists).toBeTruthy();
    }
    
    // Verify specific products from buyer app are present
    await expect(page.locator('text=CloudRunner Sneakers')).toBeVisible();
    await expect(page.locator('text=Sunset Hoodie')).toBeVisible();
    await expect(page.locator('text=Mystic Diffuser')).toBeVisible();
    await expect(page.locator('text=Travel Mug')).toBeVisible();
    await expect(page.locator('text=Plant Pot Set')).toBeVisible();
    await expect(page.locator('text=Active Leggings')).toBeVisible();
    await expect(page.locator('text=Blue Light Glasses')).toBeVisible();
    await expect(page.locator('text=Detox Clay Mask')).toBeVisible();
  });

  test('showStreamAnalytics function - should not throw "is not defined" error', async ({ page }) => {
    // Listen for console errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Navigate to streaming section
    await page.click('a[href="#/streams"], button:has-text("Stream"), text=Live');
    await page.waitForTimeout(1000);
    
    // Look for the Analytics button and click it
    const analyticsButton = page.locator('button:has-text("Analytics"), button:has-text("📊")');
    if (await analyticsButton.count() > 0) {
      await analyticsButton.click();
      await page.waitForTimeout(500);
      
      // Check that showStreamAnalytics function doesn't cause errors
      const hasAnalyticsError = consoleErrors.some(error => 
        error.includes('showStreamAnalytics is not defined') ||
        error.includes('showStreamAnalytics') && error.includes('not defined')
      );
      
      expect(hasAnalyticsError).toBeFalsy();
      
      // Verify analytics modal/sheet opens
      await expect(page.locator('text=Stream Performance Overview, text=Analytics, .analytics-modal')).toBeVisible({ timeout: 2000 });
    }
  });

  test('Product deletion confirmation - should show confirmation dialog', async ({ page }) => {
    // Navigate to catalog
    await page.click('a[href="#/catalog"], button:has-text("Catalog")');
    await page.waitForSelector('.product-card, .catalog-item', { timeout: 5000 });
    
    // Set up dialog handler to accept confirmation
    let confirmationShown = false;
    page.on('dialog', async dialog => {
      confirmationShown = true;
      expect(dialog.message()).toContain('Are you sure you want to delete');
      expect(dialog.message()).toContain('This action cannot be undone');
      await dialog.dismiss(); // Dismiss to avoid actually deleting
    });
    
    // Look for delete button (usually ✕ or Delete text)
    const deleteButton = page.locator('button:has-text("✕"), button:has-text("Delete"), .delete-btn').first();
    if (await deleteButton.count() > 0) {
      await deleteButton.click();
      await page.waitForTimeout(500);
      
      expect(confirmationShown).toBeTruthy();
    }
  });

  test('Order management functions - should not throw JavaScript errors', async ({ page }) => {
    // Listen for console errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Navigate to orders
    await page.click('a[href="#/orders"], button:has-text("Order")');
    await page.waitForTimeout(1000);
    
    // Look for an order and click to view details
    const orderLink = page.locator('a[href*="/order/"], button:has-text("View")').first();
    if (await orderLink.count() > 0) {
      await orderLink.click();
      await page.waitForTimeout(1000);
      
      // Test Mark Fulfilled button (updateOrderStatus function)
      const fulfillButton = page.locator('button:has-text("Mark"), button:has-text("Fulfill")');
      if (await fulfillButton.count() > 0) {
        await fulfillButton.click();
        await page.waitForTimeout(500);
      }
      
      // Test Create Label button (createOrderLabel function)
      const labelButton = page.locator('button:has-text("Label"), button:has-text("Create")');
      if (await labelButton.count() > 0) {
        await labelButton.click();
        await page.waitForTimeout(500);
      }
      
      // Check for specific JavaScript errors that were reported
      const hasOrderErrors = consoleErrors.some(error => 
        error.includes('o is not defined') ||
        error.includes('state is not defined') ||
        error.includes('URL.createObjectURL is not a function')
      );
      
      expect(hasOrderErrors).toBeFalsy();
    }
  });

  test('Return processing - should not throw JavaScript errors', async ({ page }) => {
    // Listen for console errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Set up dialog handler for return reason prompt
    page.on('dialog', async dialog => {
      if (dialog.message().includes('Return reason') || dialog.message().includes('Reason')) {
        await dialog.accept('Product damaged');
      }
    });
    
    // Navigate to orders and find order details
    await page.click('a[href="#/orders"], button:has-text("Order")');
    await page.waitForTimeout(1000);
    
    const orderLink = page.locator('a[href*="/order/"], button:has-text("View")').first();
    if (await orderLink.count() > 0) {
      await orderLink.click();
      await page.waitForTimeout(1000);
      
      // Test Start Return button (startReturn function)
      const returnButton = page.locator('button:has-text("Return"), button:has-text("Start Return")');
      if (await returnButton.count() > 0) {
        await returnButton.click();
        await page.waitForTimeout(1000);
        
        // Should navigate to returns page without errors
        await expect(page.locator('text=Return, text=Returns')).toBeVisible({ timeout: 3000 });
      }
      
      // Check that no JavaScript errors occurred
      const hasReturnErrors = consoleErrors.some(error => 
        error.includes('state is not defined') ||
        error.includes('navigate is not defined')
      );
      
      expect(hasReturnErrors).toBeFalsy();
    }
  });

  test('Global function availability - all required functions should be accessible', async ({ page }) => {
    // Check that all critical functions are available on window object
    const functionChecks = await page.evaluate(() => {
      const requiredFunctions = [
        'showStreamAnalytics',
        'updateOrderStatus', 
        'createOrderLabel',
        'startReturn',
        'deleteProduct'
      ];
      
      const results: { [key: string]: boolean } = {};
      
      for (const funcName of requiredFunctions) {
        results[funcName] = typeof (window as any)[funcName] === 'function';
      }
      
      return results;
    });
    
    // Verify all functions are available
    expect(functionChecks.showStreamAnalytics).toBeTruthy();
    expect(functionChecks.updateOrderStatus).toBeTruthy();
    expect(functionChecks.createOrderLabel).toBeTruthy();
    expect(functionChecks.startReturn).toBeTruthy();
    expect(functionChecks.deleteProduct).toBeTruthy();
  });

  test('No console errors during typical workflow', async ({ page }) => {
    // Track all console errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Perform typical seller workflow
    await page.click('a[href="#/catalog"], button:has-text("Catalog")');
    await page.waitForTimeout(1000);
    
    await page.click('a[href="#/orders"], button:has-text("Order")');
    await page.waitForTimeout(1000);
    
    await page.click('a[href="#/analytics"], button:has-text("Analytics")');
    await page.waitForTimeout(1000);
    
    await page.click('a[href="#/streams"], button:has-text("Stream")');
    await page.waitForTimeout(1000);
    
    // Filter out known non-critical errors (like network errors in testing)
    const criticalErrors = consoleErrors.filter(error => 
      !error.includes('favicon.ico') &&
      !error.includes('net::ERR_') &&
      !error.includes('Loading module from') &&
      !error.includes('404')
    );
    
    expect(criticalErrors).toHaveLength(0);
    
    if (criticalErrors.length > 0) {
      console.log('Critical console errors found:', criticalErrors);
    }
  });
});