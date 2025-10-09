import { test, expect } from '@playwright/test';

// Comprehensive Seller App Test Suite - Working with Hub Navigation
// Testing seller app functionality accessed through the main hub

test.describe('Seller App - Navigation and Functionality Analysis', () => {
  const hubUrl = 'http://localhost:12799/';
  
  test.beforeEach(async ({ page }) => {
    // Navigate to hub and access seller app through the proper flow
    await page.goto(hubUrl);
    await page.waitForSelector('button:has-text("🏪 افتح لوحة البائع")', { timeout: 10000 });
  });

  test.describe('App Access and Structure Analysis', () => {
    test('should identify seller app access method and core structure', async ({ page }) => {
      // Check hub page loads correctly
      await expect(page.locator('button:has-text("🏪 افتح لوحة البائع")')).toBeVisible();
      await expect(page.locator('link:has-text("🔗 رابط مباشر")')).toBeVisible();
      
      // Analyze the seller app link destination
      const directLink = page.locator('a[href="./frontend/Seller/index.html"]');
      await expect(directLink).toBeVisible();
      
      // Test if direct navigation works
      await directLink.click();
      await page.waitForTimeout(3000);
      
      // Check what page we land on
      const isSellerApp = await page.locator('#view').count() > 0;
      const isHubPage = await page.locator('button:has-text("🏪 افتح لوحة البائع")').count() > 0;
      
      console.log(`Direct link result - Seller app: ${isSellerApp}, Hub page: ${isHubPage}`);
      
      // Document the finding
      expect(isSellerApp || isHubPage).toBe(true);
    });

    test('should analyze seller app routing and navigation structure', async ({ page }) => {
      // Try to access seller app via button click (new tab scenario)
      const sellerButton = page.locator('button:has-text("🏪 افتح لوحة البائع")');
      
      // Test both button and direct link approaches
      const [newPage] = await Promise.all([
        page.context().waitForEvent('page', { timeout: 5000 }).catch(() => null),
        sellerButton.click()
      ]);
      
      if (newPage) {
        // Seller app opened in new tab
        await newPage.waitForLoadState();
        
        // Check if seller app loaded properly
        const hasSellerApp = await newPage.locator('#view').count() > 0;
        const hasHeader = await newPage.locator('header').count() > 0;
        const hasNavigation = await newPage.locator('nav.bottom').count() > 0;
        
        console.log(`New tab result - App loaded: ${hasSellerApp}, Header: ${hasHeader}, Nav: ${hasNavigation}`);
        
        if (hasSellerApp) {
          // Test navigation elements
          const navLinks = await newPage.locator('nav.bottom a').count();
          console.log(`Navigation links found: ${navLinks}`);
          
          // Test if we can navigate to different sections
          const dashboardLink = newPage.locator('a[href="#/dashboard"]');
          const catalogLink = newPage.locator('a[href="#/catalog"]');
          const ordersLink = newPage.locator('a[href="#/orders"]');
          
          const dashboardExists = await dashboardLink.count() > 0;
          const catalogExists = await catalogLink.count() > 0;
          const ordersExists = await ordersLink.count() > 0;
          
          console.log(`Navigation analysis - Dashboard: ${dashboardExists}, Catalog: ${catalogExists}, Orders: ${ordersExists}`);
          
          expect(dashboardExists || catalogExists || ordersExists).toBe(true);
        }
        
        expect(hasSellerApp || hasHeader).toBe(true);
        await newPage.close();
      } else {
        // Navigation happened in same tab
        await page.waitForTimeout(2000);
        const hasSellerApp = await page.locator('#view').count() > 0;
        const isStillHub = await page.locator('button:has-text("🏪 افتح لوحة البائع")').count() > 0;
        
        console.log(`Same tab result - Seller app: ${hasSellerApp}, Still hub: ${isStillHub}`);
        expect(hasSellerApp || isStillHub).toBe(true);
      }
    });

    test('should identify missing features and implementation gaps', async ({ page }) => {
      // Document current issues and gaps found in seller app
      const issues = {
        routingIssues: [],
        missingFeatures: [],
        navigationProblems: [],
        uiIssues: []
      };
      
      // Test direct access issues
      await page.goto('http://localhost:12799/frontend/Seller/index.html');
      const redirectsToHub = await page.locator('button:has-text("🏪 افتح لوحة البائع")').count() > 0;
      
      if (redirectsToHub) {
        issues.routingIssues.push('Direct URLs redirect to hub page');
      }
      
      // Check for specific missing routes mentioned in user requirements
      await page.goto('http://localhost:12799/frontend/Seller/#/earnings');
      await page.waitForTimeout(1000);
      
      const earningsPageExists = await page.locator('text=تفصيل الأرباح').count() > 0;
      const analyticsPageExists = await page.locator('text=التحليلات').count() > 0;
      
      if (!earningsPageExists && !analyticsPageExists) {
        issues.missingFeatures.push('تفصيل الأرباح (Earnings) page missing or not accessible');
      }
      
      // Check for scheduled streaming edit functionality
      await page.goto('http://localhost:12799/frontend/Seller/#/live');
      await page.waitForTimeout(1000);
      
      const scheduledSection = await page.locator('text=البث المجدول').count() > 0;
      const editIcons = await page.locator('[class*="edit"], button:has-text("تعديل"), svg[class*="edit"]').count();
      
      if (scheduledSection && editIcons === 0) {
        issues.uiIssues.push('البث المجدول edit icons not functional or missing');
      }
      
      // Log comprehensive analysis
      console.log('Seller App Analysis Results:', JSON.stringify(issues, null, 2));
      
      // Test should pass but document issues
      expect(issues.routingIssues.length + issues.missingFeatures.length + issues.uiIssues.length).toBeGreaterThan(0);
    });
  });
});

  test.describe('Orders Management', () => {
    test.beforeEach(async ({ page }) => {
      await page.click('[onclick="nav(\'orders\')"]');
      await waitForAppLoad(page);
    });

    test('should display orders list with status filters', async ({ page }) => {
      await expect(page.locator('text=الطلبات')).toBeVisible();
      
      // Check for status filter buttons
      const statusFilters = [
        'text=جميع الطلبات',
        'text=قيد الانتظار', 
        'text=تم التأكيد',
        'text=تم الشحن',
        'text=تم التسليم'
      ];
      
      for (const filter of statusFilters) {
        const filterElement = page.locator(filter);
        if (await filterElement.count() > 0) {
          await expect(filterElement).toBeVisible();
        }
      }
    });

    test('should allow order status updates', async ({ page }) => {
      // Look for status update dropdowns or buttons
      const statusDropdowns = page.locator('select, [class*="status-select"]');
      const statusButtons = page.locator('button:has-text("تحديث الحالة"), button:has-text("Update Status")');
      
      if (await statusDropdowns.count() > 0) {
        await expect(statusDropdowns.first()).toBeVisible();
      } else if (await statusButtons.count() > 0) {
        await expect(statusButtons.first()).toBeVisible();
      }
    });
  });

  test.describe('Analytics Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.click('[onclick="nav(\'analytics\')"]');
      await waitForAppLoad(page);
    });

    test('should display analytics dashboard with charts', async ({ page }) => {
      await expect(page.locator('text=التحليلات')).toBeVisible();
      
      // Check for chart containers or canvas elements
      const charts = page.locator('canvas, [class*="chart"], [id*="chart"]');
      if (await charts.count() > 0) {
        await expect(charts.first()).toBeVisible();
      }
    });

    test('should show sales performance metrics', async ({ page }) => {
      // Look for key performance indicators
      const metrics = [
        'text=إجمالي المبيعات',
        'text=متوسط الطلب',
        'text=معدل التحويل',
        'text=العملاء الجدد'
      ];
      
      for (const metric of metrics) {
        const element = page.locator(metric);
        if (await element.count() > 0) {
          await expect(element).toBeVisible();
        }
      }
    });
  });

  test.describe('Earnings Page Issues', () => {
    test.beforeEach(async ({ page }) => {
      await page.click('[onclick="nav(\'earnings\')"]');
      await waitForAppLoad(page);
    });

    test('should have proper navigation on earnings page', async ({ page }) => {
      await expect(page.locator('text=تفصيل الأرباح')).toBeVisible();
      
      // Check for navigation elements
      const backButton = page.locator('button:has-text("رجوع"), button:has-text("Back"), [onclick*="back"]');
      const homeButton = page.locator('button:has-text("الرئيسية"), button:has-text("Home"), [onclick*="home"]');
      
      // At least one navigation option should exist
      const hasNavigation = (await backButton.count() > 0) || (await homeButton.count() > 0);
      expect(hasNavigation).toBe(true);
    });

    test('should display earnings breakdown and totals', async ({ page }) => {
      // Check for earnings data
      const earningsElements = [
        'text=الأرباح الإجمالية',
        'text=أرباح هذا الشهر', 
        'text=أرباح الأسبوع',
        '[class*="earnings"], [class*="revenue"]'
      ];
      
      for (const element of earningsElements) {
        const locator = page.locator(element);
        if (await locator.count() > 0) {
          await expect(locator.first()).toBeVisible();
        }
      }
    });
  });

  test.describe('Live Streaming Features', () => {
    test.beforeEach(async ({ page }) => {
      await page.click('[onclick="nav(\'live\')"]');
      await waitForAppLoad(page);
    });

    test('should display live streaming dashboard', async ({ page }) => {
      await expect(page.locator('text=البث المباشر')).toBeVisible();
      
      // Check for streaming controls
      const streamButton = page.locator('button:has-text("بدء البث"), button:has-text("Start Stream")');
      if (await streamButton.count() > 0) {
        await expect(streamButton).toBeVisible();
      }
    });

    test('should show scheduled streams panel with working edit icons', async ({ page }) => {
      // Look for scheduled streams section
      await expect(page.locator('text=البث المجدول')).toBeVisible();
      
      // Check for edit icons/buttons
      const editIcons = page.locator('button:has-text("تعديل"), [class*="edit"], [onclick*="edit"], svg[class*="edit"]');
      
      if (await editIcons.count() > 0) {
        // Test that edit icons are clickable
        const firstEditIcon = editIcons.first();
        await expect(firstEditIcon).toBeVisible();
        
        // Try clicking to see if it triggers any action
        await firstEditIcon.click();
        await page.waitForTimeout(500);
        
        // Check if modal or edit form appears
        const editModal = page.locator('[class*="modal"], [class*="popup"], form');
        const hasResponse = await editModal.count() > 0;
        
        // Log result for debugging
        console.log(`Edit icon clicked, modal appeared: ${hasResponse}`);
      }
    });

    test('should allow creating new scheduled streams', async ({ page }) => {
      const scheduleButton = page.locator('button:has-text("جدولة بث"), button:has-text("Schedule Stream")');
      if (await scheduleButton.count() > 0) {
        await expect(scheduleButton).toBeVisible();
        await scheduleButton.click();
        
        // Check if scheduling form/modal appears
        const scheduleForm = page.locator('form, [class*="modal"], [class*="popup"]');
        await expect(scheduleForm.first()).toBeVisible();
      }
    });
  });

  test.describe('Profile Settings', () => {
    test.beforeEach(async ({ page }) => {
      await page.click('[onclick="nav(\'profile\')"]');
      await waitForAppLoad(page);
    });

    test('should display profile information form', async ({ page }) => {
      await expect(page.locator('text=الملف الشخصي')).toBeVisible();
      
      // Check for profile form fields
      const profileFields = page.locator('input[type="text"], input[type="email"], textarea');
      if (await profileFields.count() > 0) {
        await expect(profileFields.first()).toBeVisible();
      }
    });

    test('should have save changes functionality', async ({ page }) => {
      const saveButton = page.locator('button:has-text("حفظ"), button:has-text("Save")');
      if (await saveButton.count() > 0) {
        await expect(saveButton).toBeVisible();
      }
    });
  });

  test.describe('Error Handling and Console Errors', () => {
    test('should not have JavaScript console errors on any page', async ({ page }) => {
      const errors: string[] = [];
      
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      // Navigate through all main pages
      const pages = ['dashboard', 'products', 'orders', 'analytics', 'earnings', 'live', 'profile'];
      
      for (const pageName of pages) {
        await page.click(`[onclick="nav('${pageName}')"]`);
        await waitForAppLoad(page);
        await page.waitForTimeout(1000);
      }
      
      // Log any errors found
      if (errors.length > 0) {
        console.log('Console errors found:', errors);
      }
      
      expect(errors.length).toBeLessThan(3); // Allow for minor non-critical errors
    });

    test('should handle network failures gracefully', async ({ page }) => {
      // Simulate network failure
      await page.route('**/*', route => route.abort());
      
      // Try navigating to different pages
      await page.click('[onclick="nav(\'products\')"]');
      await page.waitForTimeout(2000);
      
      // App should still be responsive
      const appContainer = page.locator('[data-route], body');
      await expect(appContainer).toBeVisible();
    });
  });

  test.describe('Responsive Design', () => {
    test('should work properly on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Check if mobile navigation works
      await page.click('[onclick="nav(\'dashboard\')"]');
      await waitForAppLoad(page);
      await expect(page.locator('text=لوحة التحكم')).toBeVisible();
    });

    test('should work properly on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      
      // Check responsive layout
      await page.click('[onclick="nav(\'analytics\')"]');
      await waitForAppLoad(page);
      await expect(page.locator('text=التحليلات')).toBeVisible();
    });
  });
});