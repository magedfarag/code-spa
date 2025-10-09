import { test, expect } from '@playwright/test';

/**
 * Test cases for ReferenceError bugs detected during live testing
 * These tests verify that the navigate and showReviewForm functions
 * are properly exposed globally and don't throw ReferenceErrors
 */

test.describe('Buyer SPA - ReferenceError Bug Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Start HTTP server and navigate to buyer SPA
    await page.goto('http://localhost:8080/frontend/buyer/');
    
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
  });

  test('should have navigate function available globally and working', async ({ page }) => {
    // Check if navigate function is available globally
    const navigateExists = await page.evaluate(() => {
      return typeof window.navigate === 'function';
    });
    
    expect(navigateExists).toBeTruthy();
    
    // Test that navigate function works without throwing errors
    const navigationResult = await page.evaluate(() => {
      try {
        // Call navigate function as it would be called from onclick handlers
        (window as any).navigate('wishlist');
        return { success: true, error: null };
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : String(error) };
      }
    });
    
    expect(navigationResult.success).toBeTruthy();
    expect(navigationResult.error).toBeNull();
    
    // Verify the navigation actually worked - use timeout to avoid hanging
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('wishlist');
  });

  test('should have showReviewForm function available globally and working', async ({ page }) => {
    // Navigate to a product page first
    await page.goto('http://localhost:8080/frontend/buyer/#/pdp/p4');
    await page.waitForLoadState('networkidle');
    
    // Wait for the routes module to load and define showReviewForm
    await page.waitForTimeout(3000);
    
    // Check if showReviewForm function is available globally
    const showReviewFormExists = await page.evaluate(() => {
      return typeof (window as any).showReviewForm === 'function';
    });
    
    expect(showReviewFormExists).toBeTruthy();
    
    // Test that showReviewForm function works without throwing errors
    const reviewFormResult = await page.evaluate(() => {
      try {
        // Call showReviewForm function as it would be called from onclick handlers
        (window as any).showReviewForm('p4');
        return { success: true, error: null };
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : String(error) };
      }
    });
    
    expect(reviewFormResult.success).toBeTruthy();
    expect(reviewFormResult.error).toBeNull();
    
    // Verify that a review modal appeared
    const modalExists = await page.locator('.review-modal').count();
    expect(modalExists).toBeGreaterThan(0);
  });

  test('should handle navigation clicks in orders page without errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    // Capture console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Navigate to orders page where the original error was detected
    await page.goto('http://localhost:8080/frontend/buyer/#/orders');
    await page.waitForLoadState('networkidle');
    
    // Try clicking the navigation elements that previously caused errors
    const cartElement = page.locator('.go_to_cart, [onclick*="navigate(\'cart\')"], div[onclick*="cart"]').first();
    
    if (await cartElement.count() > 0) {
      await cartElement.click();
      await page.waitForTimeout(1000);
    }
    
    // Verify no ReferenceErrors occurred
    const hasNavigateError = consoleErrors.some(error => 
      error.includes('navigate is not defined')
    );
    
    expect(hasNavigateError).toBeFalsy();
    
    // Should have successfully navigated
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/(cart|wishlist|profile)/);
  });

  test('should handle review button clicks in product pages without errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    // Capture console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Navigate to product detail page where the error was detected
    await page.goto('http://localhost:8080/frontend/buyer/#/pdp/p4');
    await page.waitForLoadState('networkidle');
    
    // Try clicking the review button that previously caused errors
    const reviewButton = page.locator('button:has-text("Review"), button:has-text("✍️")').first();
    
    if (await reviewButton.count() > 0) {
      await reviewButton.click();
      await page.waitForTimeout(1000);
    }
    
    // Verify no ReferenceErrors occurred
    const hasReviewError = consoleErrors.some(error => 
      error.includes('showReviewForm is not defined')
    );
    
    expect(hasReviewError).toBeFalsy();
    
    // Should have successfully opened review modal or form
    const modalOrFormExists = await page.locator('.review-modal, .review-form, [class*="review"]').count();
    expect(modalOrFormExists).toBeGreaterThan(0);
  });
});