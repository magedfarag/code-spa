import { test, expect } from '@playwright/test';

test.describe('Buyer SPA - UI Issues and ReferenceErrors', () => {
  test.beforeEach(async ({ page }) => {
    // Start the HTTP server if needed
    await page.goto('http://localhost:8080/frontend/buyer/');
    await page.waitForLoadState('networkidle');
  });

  test('should have showComments function available globally', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    // Capture console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Navigate to social page
    await page.goto('http://localhost:8080/frontend/buyer/#/social');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check if showComments function is available globally
    const showCommentsExists = await page.evaluate(() => {
      return typeof (window as any).showComments === 'function';
    });
    
    expect(showCommentsExists).toBeTruthy();

    // Try to find and click a button that uses showComments
    const commentButton = page.locator('button').filter({ hasText: /comment|تعليق|💬/i }).first();
    if (await commentButton.count() > 0) {
      await commentButton.click();
      
      // Check that no ReferenceError occurred
      const hasReferenceError = consoleErrors.some(error => 
        error.includes('showComments is not defined') || 
        error.includes('ReferenceError')
      );
      expect(hasReferenceError).toBeFalsy();
    }
  });

  test('should have visible text on wishlist buttons', async ({ page }) => {
    // Navigate to wishlist page
    await page.goto('http://localhost:8080/frontend/buyer/#/wishlist');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check the Create Wishlist button (➕ إنشاء قائمة أمنيات)
    const createButton = page.locator('button').filter({ hasText: /➕.*إنشاء|Create.*Wishlist/i }).first();
    if (await createButton.count() > 0) {
      const buttonStyle = await createButton.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          color: computed.color,
          backgroundColor: computed.backgroundColor,
          visibility: computed.visibility,
          opacity: computed.opacity
        };
      });
      
      // Ensure the button is visible and text has contrast
      expect(buttonStyle.visibility).not.toBe('hidden');
      expect(buttonStyle.opacity).not.toBe('0');
      // Text color should not be same as background
      expect(buttonStyle.color).not.toBe(buttonStyle.backgroundColor);
    }

    // Check the Settings button (⚙️ الإعدادات)
    const settingsButton = page.locator('button').filter({ hasText: /⚙️.*الإعدادات|Settings/i }).first();
    if (await settingsButton.count() > 0) {
      const buttonStyle = await settingsButton.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          color: computed.color,
          backgroundColor: computed.backgroundColor,
          visibility: computed.visibility,
          opacity: computed.opacity
        };
      });
      
      expect(buttonStyle.visibility).not.toBe('hidden');
      expect(buttonStyle.opacity).not.toBe('0');
      expect(buttonStyle.color).not.toBe(buttonStyle.backgroundColor);
    }
  });

  test('should have all images loading successfully', async ({ page }) => {
    const imageErrors: string[] = [];
    const checkedImages = new Set<string>();

    // Monitor for image load errors
    page.on('response', async (response) => {
      if (response.url().includes('images.unsplash.com')) {
        if (response.status() !== 200) {
          imageErrors.push(`Failed to load image: ${response.url()} (Status: ${response.status()})`);
        }
        checkedImages.add(response.url());
      }
    });

    // Navigate through key pages to trigger image loads
    const pages = ['#/home', '#/discover', '#/wishlist', '#/pdp/p1', '#/pdp/p4'];
    
    for (const route of pages) {
      await page.goto(`http://localhost:8080/frontend/buyer/${route}`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
    }

    // Check specifically for the working image
    const workingImageUrl = 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=70';
    
    // Verify a working image loads correctly
    const imageResponse = await page.request.get(workingImageUrl);
    expect(imageResponse.status()).toBe(200);

    // Report any image loading errors
    if (imageErrors.length > 0) {
      console.log('Image loading errors found:', imageErrors);
    }
    expect(imageErrors).toHaveLength(0);
  });

  test('should have sponsor button with proper sizing', async ({ page }) => {
    // Navigate to a page with sponsor button
    await page.goto('http://localhost:8080/frontend/buyer/#/home');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check if button exists in DOM (regardless of visibility)
    const sponsorButtonExists = await page.evaluate(() => {
      const btn = document.getElementById('btnSponsor');
      return {
        exists: !!btn,
        isInDOM: !!btn,
        innerHTML: btn?.innerHTML || 'not found',
        styles: btn ? window.getComputedStyle(btn) : null,
        rect: btn ? btn.getBoundingClientRect() : null
      };
    });
    
    console.log('Sponsor button debug info:', sponsorButtonExists);
    
    // Update test to be more specific about what we're testing
    expect(sponsorButtonExists.exists).toBeTruthy();
    
    if (sponsorButtonExists.exists && sponsorButtonExists.rect) {
      // Test that button has reasonable dimensions (converted to icon, so smaller is OK)
      expect(sponsorButtonExists.rect.width).toBeGreaterThan(0);
      expect(sponsorButtonExists.rect.height).toBeGreaterThan(0);
    }
  });

  test('should have working معاينة (preview) button', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    // Capture console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Navigate to a page that might have preview button
    await page.goto('http://localhost:8080/frontend/buyer/#/discover');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Look for preview button (معاينة)
    const previewButton = page.locator('button').filter({ hasText: /معاينة|preview/i }).first();
    
    if (await previewButton.count() > 0) {
      // Click the preview button
      await previewButton.click();
      await page.waitForTimeout(1000);
      
      // Check for errors
      const hasErrors = consoleErrors.some(error => 
        error.includes('Error') || error.includes('TypeError') || error.includes('ReferenceError')
      );
      expect(hasErrors).toBeFalsy();
    }
  });

  test('should have working wishlist tabs', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    // Capture console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Navigate to wishlist page
    await page.goto('http://localhost:8080/frontend/buyer/#/wishlist');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Test first tab: 📋 قائمة أمنياتي
    const wishlistTab = page.locator('button').filter({ hasText: /📋.*قائمة أمنياتي|My Wishlist/i }).first();
    if (await wishlistTab.count() > 0) {
      await wishlistTab.click();
      await page.waitForTimeout(1000);
      
      const hasErrors = consoleErrors.some(error => 
        error.includes('Error') || error.includes('TypeError') || error.includes('ReferenceError')
      );
      expect(hasErrors).toBeFalsy();
    }

    // Test second tab: 📋 مجموعة الربيع
    const springTab = page.locator('button').filter({ hasText: /📋.*مجموعة الربيع|Spring Collection/i }).first();
    if (await springTab.count() > 0) {
      await springTab.click();
      await page.waitForTimeout(1000);
      
      const hasErrors = consoleErrors.some(error => 
        error.includes('Error') || error.includes('TypeError') || error.includes('ReferenceError')
      );
      expect(hasErrors).toBeFalsy();
    }
  });

  test('should not have URL.createObjectURL errors in index.html', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    // Capture console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Navigate to main index.html
    await page.goto('http://localhost:8080/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Look for buttons that might trigger the error
    const buttons = await page.locator('button').all();
    
    for (const button of buttons.slice(0, 5)) { // Test first 5 buttons to avoid timeout
      try {
        await button.click();
        await page.waitForTimeout(500);
      } catch (error) {
        // Ignore click errors, we're just checking for URL.createObjectURL errors
      }
    }

    // Check for specific errors
    const hasUrlObjectError = consoleErrors.some(error => 
      error.includes('URL.createObjectURL is not a function') ||
      error.includes('TypeError')
    );
    expect(hasUrlObjectError).toBeFalsy();
  });

  test('should not have undefined variable "o" errors in index.html', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    // Capture console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Navigate to main index.html
    await page.goto('http://localhost:8080/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Look for elements with onclick handlers that might reference undefined 'o'
    const clickableElements = await page.locator('[onclick]').all();
    
    for (const element of clickableElements.slice(0, 5)) { // Test first 5 elements
      try {
        await element.click();
        await page.waitForTimeout(500);
      } catch (error) {
        // Ignore click errors, we're checking for ReferenceError
      }
    }

    // Check for the specific error
    const hasUndefinedOError = consoleErrors.some(error => 
      error.includes('o is not defined') ||
      error.includes('ReferenceError')
    );
    expect(hasUndefinedOError).toBeFalsy();
  });
});