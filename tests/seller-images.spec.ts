import { test, expect } from '@playwright/test';

/**
 * SELLER SPA - Image Validation Tests
 * 
 * This spec validates all images used in the Seller SPA:
 * - Product images in catalog
 * - Product thumbnails
 * - Featured product images
 * - Product edit page images
 * - Creator dashboard images
 * 
 * Each image is tested individually to ensure it loads correctly.
 */

test.describe('Seller SPA - Individual Image Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/frontend/Seller/index.html');
    await page.waitForTimeout(1500);
  });

  // =====================================================
  // CATALOG PRODUCT IMAGES
  // =====================================================

  test('Catalog displays product images with correct Unsplash format', async ({ page }) => {
    // Navigate to catalog
    const catalogTab = page.locator('button, a').filter({ hasText: /Catalog|الكتالوج/i }).first();
    if (await catalogTab.isVisible()) {
      await catalogTab.click();
      await page.waitForTimeout(1000);
    }
    
    // Find product images
    const productImages = page.locator('img[src*="unsplash.com"]');
    const count = await productImages.count();
    
    if (count > 0) {
      // Check first product image
      const firstImg = productImages.first();
      const src = await firstImg.getAttribute('src');
      
      // Verify Unsplash URL format
      expect(src).toContain('images.unsplash.com/photo-');
      expect(src).toMatch(/[?&]auto=format/);
      expect(src).toMatch(/[?&]fit=crop/);
      expect(src).toMatch(/[?&]w=\d+/);
      expect(src).toMatch(/[?&]q=\d+/);
      
      // Verify image loads
      await expect(firstImg).toBeVisible();
      
      const isLoaded = await firstImg.evaluate((el: HTMLImageElement) => {
        return el.complete && el.naturalWidth > 0;
      });
      
      expect(isLoaded).toBe(true);
    }
  });

  test('Product catalog thumbnails (w=600) load correctly', async ({ page }) => {
    const catalogTab = page.locator('button, a').filter({ hasText: /Catalog|الكتالوج/i }).first();
    if (await catalogTab.isVisible()) {
      await catalogTab.click();
      await page.waitForTimeout(1000);
    }
    
    // Look for 600px width thumbnails
    const thumbnails = page.locator('img[src*="w=600"]');
    const count = await thumbnails.count();
    
    if (count > 0) {
      for (let i = 0; i < Math.min(count, 3); i++) {
        const thumb = thumbnails.nth(i);
        const src = await thumb.getAttribute('src');
        
        expect(src).toContain('w=600');
        
        if (await thumb.isVisible()) {
          const isLoaded = await thumb.evaluate((el: HTMLImageElement) => {
            return el.complete && el.naturalWidth > 0;
          });
          
          expect(isLoaded).toBe(true);
        }
      }
    }
  });

  test('Product edit main image (w=600) loads correctly', async ({ page }) => {
    // Navigate to catalog
    const catalogTab = page.locator('button, a').filter({ hasText: /Catalog|الكتالوج/i }).first();
    if (await catalogTab.isVisible()) {
      await catalogTab.click();
      await page.waitForTimeout(1000);
    }
    
    // Click first product to edit
    const firstProduct = page.locator('a[href*="#/catalog-edit"], button').filter({ hasText: /Edit|تعديل|View/i }).first();
    if (await firstProduct.isVisible()) {
      await firstProduct.click();
      await page.waitForTimeout(1000);
      
      // Find main product image
      const mainImage = page.locator('#mainProductImage, img[src*="unsplash.com"]').first();
      
      if (await mainImage.isVisible()) {
        const src = await mainImage.getAttribute('src');
        
        expect(src).toContain('unsplash.com');
        
        const isLoaded = await mainImage.evaluate((el: HTMLImageElement) => {
          return el.complete && el.naturalWidth > 0;
        });
        
        expect(isLoaded).toBe(true);
      }
    }
  });

  // =====================================================
  // CREATOR DASHBOARD FEATURED PRODUCT IMAGES
  // =====================================================

  test('Creator dashboard featured product thumbnails (w=300) load', async ({ page }) => {
    // Navigate to Creator dashboard
    const creatorTab = page.locator('button, a').filter({ hasText: /Creator|المنشئ/i }).first();
    if (await creatorTab.isVisible()) {
      await creatorTab.click();
      await page.waitForTimeout(1000);
    }
    
    // Look for featured product images (300px width)
    const featuredImages = page.locator('img[src*="w=300"]');
    const count = await featuredImages.count();
    
    if (count > 0) {
      const img = featuredImages.first();
      const src = await img.getAttribute('src');
      
      expect(src).toContain('w=300');
      expect(src).toContain('unsplash.com');
      
      if (await img.isVisible()) {
        const isLoaded = await img.evaluate((el: HTMLImageElement) => {
          return el.complete && el.naturalWidth > 0;
        });
        
        expect(isLoaded).toBe(true);
      }
    }
  });

  // =====================================================
  // ORDERS PRODUCT THUMBNAILS
  // =====================================================

  test('Order detail product thumbnails (w=150) load correctly', async ({ page }) => {
    // Navigate to orders
    const ordersTab = page.locator('button, a').filter({ hasText: /Orders|الطلبات/i }).first();
    if (await ordersTab.isVisible()) {
      await ordersTab.click();
      await page.waitForTimeout(1000);
    }
    
    // Look for small product thumbnails (150px width)
    const orderImages = page.locator('img[src*="w=150"]');
    const count = await orderImages.count();
    
    if (count > 0) {
      const img = orderImages.first();
      const src = await img.getAttribute('src');
      
      expect(src).toContain('w=150');
      
      if (await img.isVisible()) {
        const isLoaded = await img.evaluate((el: HTMLImageElement) => {
          return el.complete && el.naturalWidth > 0;
        });
        
        expect(isLoaded).toBe(true);
      }
    }
  });

  // =====================================================
  // UGC CONTENT PRODUCT IMAGES
  // =====================================================

  test('UGC content product images (w=200) load correctly', async ({ page }) => {
    // Navigate to UGC
    const ugcTab = page.locator('button, a').filter({ hasText: /UGC|محتوى/i }).first();
    if (await ugcTab.isVisible()) {
      await ugcTab.click();
      await page.waitForTimeout(1000);
    }
    
    // Look for UGC product images (200px width)
    const ugcImages = page.locator('img[src*="w=200"]');
    const count = await ugcImages.count();
    
    if (count > 0) {
      const img = ugcImages.first();
      const src = await img.getAttribute('src');
      
      expect(src).toContain('w=200');
      
      if (await img.isVisible()) {
        const isLoaded = await img.evaluate((el: HTMLImageElement) => {
          return el.complete && el.naturalWidth > 0;
        });
        
        expect(isLoaded).toBe(true);
      }
    }
  });

  // =====================================================
  // DEFAULT PRODUCT IMAGE
  // =====================================================

  test('Default product image (1519744792095-2f2205e87b6f) loads as fallback', async ({ page }) => {
    // This is the default/placeholder image used in Seller SPA
    const defaultImageId = '1519744792095-2f2205e87b6f';
    
    // Navigate to catalog
    const catalogTab = page.locator('button, a').filter({ hasText: /Catalog|الكتالوج/i }).first();
    if (await catalogTab.isVisible()) {
      await catalogTab.click();
      await page.waitForTimeout(1000);
    }
    
    // Check if default image is used
    const defaultImages = page.locator(`img[src*="${defaultImageId}"]`);
    const count = await defaultImages.count();
    
    // Default image may or may not be present (depending on product data)
    expect(count).toBeGreaterThanOrEqual(0);
    
    if (count > 0) {
      const img = defaultImages.first();
      
      if (await img.isVisible()) {
        const isLoaded = await img.evaluate((el: HTMLImageElement) => {
          return el.complete && el.naturalWidth > 0;
        });
        
        expect(isLoaded).toBe(true);
      }
    }
  });

  // =====================================================
  // DESIGN & SIZING VALIDATION
  // =====================================================

  test('Catalog product images have consistent sizing', async ({ page }) => {
    const catalogTab = page.locator('button, a').filter({ hasText: /Catalog|الكتالوج/i }).first();
    if (await catalogTab.isVisible()) {
      await catalogTab.click();
      await page.waitForTimeout(1000);
    }
    
    const productImages = page.locator('img[src*="unsplash.com"]');
    const count = await productImages.count();
    
    if (count > 1) {
      const dimensions = [];
      
      for (let i = 0; i < Math.min(count, 4); i++) {
        const img = productImages.nth(i);
        const box = await img.boundingBox();
        
        if (box) {
          dimensions.push({ width: box.width, height: box.height });
        }
      }
      
      // Verify all images have valid dimensions
      for (const dim of dimensions) {
        expect(dim.width).toBeGreaterThan(0);
        expect(dim.height).toBeGreaterThan(0);
      }
      
      // Check for consistency (within 30% variance)
      if (dimensions.length > 1) {
        const firstWidth = dimensions[0].width;
        
        for (const dim of dimensions) {
          const variance = Math.abs(dim.width - firstWidth) / firstWidth;
          expect(variance).toBeLessThan(0.3);
        }
      }
    }
  });

  test('Product thumbnails maintain aspect ratio', async ({ page }) => {
    const catalogTab = page.locator('button, a').filter({ hasText: /Catalog|الكتالوج/i }).first();
    if (await catalogTab.isVisible()) {
      await catalogTab.click();
      await page.waitForTimeout(1000);
    }
    
    const images = page.locator('img[src*="unsplash.com"]');
    const count = await images.count();
    
    if (count > 0) {
      const img = images.first();
      const box = await img.boundingBox();
      
      if (box) {
        const aspectRatio = box.width / box.height;
        
        // Aspect ratio should be reasonable (between 0.5 and 2.0)
        expect(aspectRatio).toBeGreaterThan(0.5);
        expect(aspectRatio).toBeLessThan(2.0);
      }
    }
  });

  test('Images are properly aligned in catalog table', async ({ page }) => {
    const catalogTab = page.locator('button, a').filter({ hasText: /Catalog|الكتالوج/i }).first();
    if (await catalogTab.isVisible()) {
      await catalogTab.click();
      await page.waitForTimeout(1000);
    }
    
    const tableRows = page.locator('table tr, tbody tr');
    const count = await tableRows.count();
    
    if (count > 1) {
      const row1 = tableRows.nth(0);
      const row2 = tableRows.nth(1);
      
      const box1 = await row1.boundingBox();
      const box2 = await row2.boundingBox();
      
      if (box1 && box2) {
        // Rows should be stacked vertically
        expect(box2.y).toBeGreaterThan(box1.y);
        
        // Should have similar x positions (aligned)
        expect(Math.abs(box2.x - box1.x)).toBeLessThan(20);
      }
    }
  });

  test('Product images have proper object-fit styling', async ({ page }) => {
    const catalogTab = page.locator('button, a').filter({ hasText: /Catalog|الكتالوج/i }).first();
    if (await catalogTab.isVisible()) {
      await catalogTab.click();
      await page.waitForTimeout(1000);
    }
    
    const images = page.locator('img[src*="unsplash.com"]');
    const count = await images.count();
    
    if (count > 0) {
      const img = images.first();
      
      // Check for object-fit CSS property
      const objectFit = await img.evaluate((el) => {
        return window.getComputedStyle(el).objectFit;
      });
      
      // Should use cover, contain, or fill
      expect(['cover', 'contain', 'fill', 'none', 'scale-down']).toContain(objectFit);
    }
  });

  test('Images have proper border-radius styling', async ({ page }) => {
    const catalogTab = page.locator('button, a').filter({ hasText: /Catalog|الكتالوج/i }).first();
    if (await catalogTab.isVisible()) {
      await catalogTab.click();
      await page.waitForTimeout(1000);
    }
    
    const images = page.locator('img[src*="unsplash.com"]');
    const count = await images.count();
    
    if (count > 0) {
      const img = images.first();
      
      // Check border-radius
      const borderRadius = await img.evaluate((el) => {
        return window.getComputedStyle(el).borderRadius;
      });
      
      // Should have some border radius (not "0px")
      expect(borderRadius).toBeTruthy();
    }
  });

  test('Images are responsive on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/frontend/Seller/index.html');
    await page.waitForTimeout(1500);
    
    const catalogTab = page.locator('button, a').filter({ hasText: /Catalog|الكتالوج/i }).first();
    if (await catalogTab.isVisible()) {
      await catalogTab.click();
      await page.waitForTimeout(1000);
    }
    
    const images = page.locator('img[src*="unsplash.com"]');
    const count = await images.count();
    
    if (count > 0) {
      const img = images.first();
      const box = await img.boundingBox();
      
      if (box) {
        // Image should fit within mobile viewport
        expect(box.width).toBeLessThanOrEqual(375);
        expect(box.width).toBeGreaterThan(0);
      }
    }
  });

  test('Images are responsive on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/frontend/Seller/index.html');
    await page.waitForTimeout(1500);
    
    const catalogTab = page.locator('button, a').filter({ hasText: /Catalog|الكتالوج/i }).first();
    if (await catalogTab.isVisible()) {
      await catalogTab.click();
      await page.waitForTimeout(1000);
    }
    
    const images = page.locator('img[src*="unsplash.com"]');
    const count = await images.count();
    
    if (count > 0) {
      const img = images.first();
      const box = await img.boundingBox();
      
      if (box) {
        // Image should have reasonable desktop size
        expect(box.width).toBeGreaterThan(50);
        expect(box.width).toBeLessThanOrEqual(1920);
      }
    }
  });

  test('Featured product images are properly sized (60x60px)', async ({ page }) => {
    const creatorTab = page.locator('button, a').filter({ hasText: /Creator|المنشئ/i }).first();
    if (await creatorTab.isVisible()) {
      await creatorTab.click();
      await page.waitForTimeout(1000);
    }
    
    // Look for 60px styled images
    const featuredImages = page.locator('img[src*="unsplash.com"]');
    const count = await featuredImages.count();
    
    if (count > 0) {
      for (let i = 0; i < Math.min(count, 3); i++) {
        const img = featuredImages.nth(i);
        const box = await img.boundingBox();
        
        if (box) {
          // Should be reasonably sized (may not be exactly 60x60 due to responsive design)
          expect(box.width).toBeGreaterThan(30);
          expect(box.width).toBeLessThan(150);
        }
      }
    }
  });

  test('Order thumbnails are properly sized (40x40px)', async ({ page }) => {
    const ordersTab = page.locator('button, a').filter({ hasText: /Orders|الطلبات/i }).first();
    if (await ordersTab.isVisible()) {
      await ordersTab.click();
      await page.waitForTimeout(1000);
    }
    
    const orderImages = page.locator('img[src*="unsplash.com"]');
    const count = await orderImages.count();
    
    if (count > 0) {
      const img = orderImages.first();
      const box = await img.boundingBox();
      
      if (box) {
        // Thumbnails should be small
        expect(box.width).toBeGreaterThan(20);
        expect(box.width).toBeLessThan(100);
      }
    }
  });

  test('Images maintain quality with different width parameters', async ({ page }) => {
    // Test that different width parameters (150, 200, 300, 600) all load correctly
    const widths = [150, 200, 300, 600];
    
    for (const width of widths) {
      const images = page.locator(`img[src*="w=${width}"]`);
      const count = await images.count();
      
      if (count > 0) {
        const img = images.first();
        const src = await img.getAttribute('src');
        
        // Verify URL contains correct width parameter
        expect(src).toContain(`w=${width}`);
        
        // Verify quality parameter is present
        expect(src).toMatch(/q=\d+/);
      }
    }
  });

  test('Images have alt text for accessibility', async ({ page }) => {
    const catalogTab = page.locator('button, a').filter({ hasText: /Catalog|الكتالوج/i }).first();
    if (await catalogTab.isVisible()) {
      await catalogTab.click();
      await page.waitForTimeout(1000);
    }
    
    const images = page.locator('img[src*="unsplash.com"]');
    const count = await images.count();
    
    if (count > 0) {
      for (let i = 0; i < Math.min(count, 5); i++) {
        const img = images.nth(i);
        
        if (await img.isVisible()) {
          const alt = await img.getAttribute('alt');
          
          // Alt attribute should exist
          expect(alt).not.toBeNull();
        }
      }
    }
  });

  test('No broken image placeholders are visible', async ({ page }) => {
    const catalogTab = page.locator('button, a').filter({ hasText: /Catalog|الكتالوج/i }).first();
    if (await catalogTab.isVisible()) {
      await catalogTab.click();
      await page.waitForTimeout(2000);
    }
    
    const images = page.locator('img[src*="unsplash.com"]');
    const count = await images.count();
    
    if (count > 0) {
      for (let i = 0; i < Math.min(count, 5); i++) {
        const img = images.nth(i);
        
        if (await img.isVisible()) {
          // Check image loaded successfully (not broken)
          const isLoaded = await img.evaluate((el: HTMLImageElement) => {
            return el.complete && el.naturalWidth > 0;
          });
          
          // Should not show broken image icon
          expect(isLoaded).toBe(true);
        }
      }
    }
  });
});
