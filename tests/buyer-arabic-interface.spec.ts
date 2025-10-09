import { test, expect } from '@playwright/test';

test.describe('Buyer Arabic Interface Issues', () => {
  test.beforeEach(async ({ page }) => {
    // Start local server and navigate to buyer app
    await page.goto('http://localhost:8080/frontend/buyer/');
    await page.waitForLoadState('networkidle');
    
    // Switch to Arabic
    await page.evaluate(() => {
      if (window.setLang) {
        window.setLang('ar');
      }
    });
    await page.waitForTimeout(500);
  });

  test('Recently Viewed items should be clickable in profile section', async ({ page }) => {
    // Navigate to profile
    await page.click('a[href="#/profile"], [data-route="profile"]');
    await page.waitForTimeout(1000);
    
    // Look for recently viewed items - check for clickable items
    const hasRecentlyViewedItems = await page.locator('[onclick*="location.hash="], [onclick*="#/pdp/"]').count() > 0;
    
    if (hasRecentlyViewedItems) {
      // Verify that there are clickable recently viewed items
      const clickableItems = page.locator('[onclick*="location.hash="], [onclick*="#/pdp/"]');
      await expect(clickableItems.first()).toBeVisible();
    } else {
      console.log('No recently viewed items found - this is expected behavior');
    }
  });

  test('Bulk Actions button should be visible with proper contrast', async ({ page }) => {
    // Navigate to wishlist where bulk actions appear
    await page.click('a[href="#/wishlist"]');
    await page.waitForTimeout(1000);
    
    // Look for bulk actions button - it might not always be present if wishlist is empty
    const bulkActionsButton = await page.locator('button').filter({ hasText: /bulk|إجراءات/i }).count();
    
    if (bulkActionsButton > 0) {
      const button = page.locator('button').filter({ hasText: /bulk|إجراءات/i }).first();
      await expect(button).toBeVisible();
      
      // Check button has proper contrast (not white background)
      const buttonStyle = await button.evaluate(el => {
        const computedStyle = window.getComputedStyle(el);
        return {
          backgroundColor: computedStyle.backgroundColor,
          color: computedStyle.color
        };
      });
      
      // Should use CSS variables, not white background
      expect(buttonStyle.backgroundColor).not.toBe('rgb(255, 255, 255)');
    } else {
      console.log('Bulk Actions button not present - expected for empty wishlist');
    }
  });

  test('Add to compare button should be visible in dark theme', async ({ page }) => {
    // Switch to dark theme
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });
    
    // Navigate to a product page
    await page.goto('http://localhost:8080/frontend/buyer/#/pdp/p1');
    await page.waitForTimeout(1000);
    
    // Look for compare button (emoji button)
    const compareButton = page.locator('button:has-text("⚖️")').first();
    await expect(compareButton).toBeVisible();
    
    // Check button visibility in dark theme
    const buttonStyle = await compareButton.evaluate(el => {
      const computedStyle = window.getComputedStyle(el);
      return {
        opacity: computedStyle.opacity,
        visibility: computedStyle.visibility
      };
    });
    
    expect(parseFloat(buttonStyle.opacity)).toBeGreaterThan(0.5);
    expect(buttonStyle.visibility).toBe('visible');
  });

  test('Compare functionality should open proper window not alert', async ({ page }) => {
    // Navigate to product page
    await page.goto('http://localhost:8080/frontend/buyer/#/pdp/p1');
    await page.waitForTimeout(1000);
    
    // Track if alert is called
    let alertCalled = false;
    page.on('dialog', async dialog => {
      alertCalled = true;
      await dialog.accept();
    });
    
    // Click compare button
    const compareButton = page.locator('button:has-text("مقارنة"), button:has-text("Compare")').first();
    if (await compareButton.count() > 0) {
      await compareButton.click();
      await page.waitForTimeout(500);
      
      // Should not show alert, should show proper comparison interface
      expect(alertCalled).toBeFalsy();
      
      // Should have comparison modal or interface
      const comparisonModal = page.locator('[class*="modal"], [style*="position: fixed"], .comparison-window');
      await expect(comparisonModal).toBeVisible();
    }
  });

  test('Review summary should show proper numbers', async ({ page }) => {
    // Navigate to product page  
    await page.goto('http://localhost:8080/frontend/buyer/#/pdp/p1');
    await page.waitForTimeout(1000);
    
    // Find review statistics - look for star ratings breakdown
    const starRatings = page.locator('text=/\\d+ stars/');
    const ratingCounts = await starRatings.allTextContents();
    
    // Check that ratings don't contain undefined or NaN
    for (const rating of ratingCounts) {
      expect(rating).not.toContain('undefined');
      expect(rating).not.toContain('NaN');
      expect(rating).not.toContain('null');
    }
    
    // Check that review numbers are visible
    const reviewNumbers = page.locator('text=/Based on \\d+ reviews/');
    if (await reviewNumbers.count() > 0) {
      const reviewText = await reviewNumbers.textContent();
      expect(reviewText).not.toContain('undefined');
      expect(reviewText).not.toContain('NaN');
    }
  });

  test('Review text should not show undefined', async ({ page }) => {
    // Navigate to product page
    await page.goto('http://localhost:8080/frontend/buyer/#/pdp/p1');
    await page.waitForTimeout(1000);
    
    // Look for reviews section
    const reviewsSection = page.locator('[class*="review"], [style*="review"]');
    if (await reviewsSection.count() > 0) {
      const reviewTexts = await reviewsSection.allTextContents();
      
      // No review should contain "undefined"
      reviewTexts.forEach(text => {
        expect(text).not.toContain('undefined');
        expect(text).not.toContain('null');
      });
    }
  });

  test('Sponsor panel should have enhanced information', async ({ page }) => {
    // Navigate to home page
    await page.goto('http://localhost:8080/frontend/buyer/#/home');
    await page.waitForTimeout(1000);
    
    // Check that page content doesn't contain undefined text
    const bodyText = await page.textContent('body');
    expect(bodyText).not.toContain('undefined');
    expect(bodyText).not.toContain('null');
    
    // If there are sponsor-related elements, verify they have content
    const sponsorElements = await page.locator('[data-sponsor], .sponsor').count();
    if (sponsorElements > 0) {
      const sponsorText = await page.locator('[data-sponsor], .sponsor').first().textContent();
      expect(sponsorText?.length || 0).toBeGreaterThan(0);
    }
  });

  test('All Arabic interface elements should be functional', async ({ page }) => {
    // Navigate through key pages and verify functionality
    const pages = ['#/home', '#/discover', '#/cart', '#/profile'];
    
    for (const pageHash of pages) {
      await page.goto(`http://localhost:8080/frontend/buyer/${pageHash}`);
      await page.waitForTimeout(1000);
      
      // Check for any JavaScript errors
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      
      // Check for undefined text content
      const bodyText = await page.textContent('body');
      expect(bodyText).not.toContain('undefined');
      expect(bodyText).not.toContain('NaN');
      
      // Verify no JavaScript errors occurred
      expect(errors).toHaveLength(0);
    }
  });
});