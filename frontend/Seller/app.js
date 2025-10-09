/* StoreZ â€” Seller Console (single ES module)
   - Routing + state + i18n + views in one file for easy drop-in.
   - Open over http:// (not file://) to avoid CORS for modules.
*/

/* ---------- Tiny helpers ---------- */
const qs = (s, el = document) => el.querySelector(s);
const qsa = (s, el = document) => Array.from(el.querySelectorAll(s));
const html = (x) => x.trim();
const fmtSAR = (n) =>
  new Intl.NumberFormat(getLocale(), {
    style: "currency",
    currency: "SAR",
    maximumFractionDigits: 0,
    currencyDisplay: getLang() === "en" ? "code" : "symbol",
  }).format(Number(n || 0));

/* ---------- i18n ---------- */
const DICT = {
  en: {
    nav_dashboard: "Dashboard",
    nav_catalog: "Catalog",
    nav_orders: "Orders",
    nav_creator: "Creator",
    nav_live: "Live",
    nav_ugc: "UGC",

    kpi_gmv: "GMV (30d)",
    kpi_orders: "Orders",
    kpi_aov: "AOV",
    kpi_ret: "Return rate",
    kpi_followers: "Followers",
    kpi_engagement: "Engagement",
    kpi_live_viewers: "Live viewers",
    kpi_social_gmv: "Social GMV",

    quick_add: "Add product",
    quick_import: "Import CSV",
    quick_announce: "Announcement",

    catalog_title: "Catalog",
    add_product: "Add product",
    import_catalog: "Import catalog",
    ai_addons: "AI add-ons",
    search_catalog: "Search productsâ€¦",

    orders_title: "Orders",
    order: "Order",
    customer: "Customer",
    status: "Status",
    total: "Total",
    created: "Created",
    actions: "Actions",
    view: "View",
    fulfill: "Fulfill",
    refund: "Refund",
    label: "Label",
    approve: "Approve",
    deny: "Deny",

    order_detail: "Order detail",
    items: "Items",
    placed: "Placed",
    shipped: "Shipped",
    out_for_delivery: "Out for delivery",
    delivered: "Delivered",
    processing: "Processing",
    start_return: "Create return",
    mark_fulfilled: "Mark fulfilled",
    create_label: "Create label",

    returns_title: "Returns",
    inbox_title: "Inbox",
    live_title: "Live",
    live_go: "Start live session",
    live_end: "End live session",
    pick_product: "Pick product to feature",
    live_viewers: "Live viewers",
    session_sales: "Session sales",
    current_viewers: "Current viewers",
    engagement_rate: "Engagement",
    spotlight_product: "Spotlight",
    send_message: "Send Message",
    toggle_chat: "Toggle Chat",
    share_link: "Share Link",
    add_discount: "Add Discount",
    invite_followers: "Invite Followers",
    save_highlight: "Save Highlight",

    ugc_title: "UGC Content",
    ugc_posts: "Creator Posts",
    ugc_pending: "Pending Review",
    ugc_approved: "Approved",
    ugc_flagged: "Flagged",
    ugc_rejected: "Rejected",
    content_policy: "Content Policy",
    moderation_queue: "Moderation Queue",
    approve_post: "Approve",
    reject_post: "Reject",
    view_post: "View",
    flag_reason: "Flag reason",
    content_guidelines: "Content Guidelines",

    analytics_title: "Analytics",
    settings_title: "Settings",
    store_name: "Store name",
    save: "Save",
    billing_title: "Billing",
    plan: "Plan",
    upgrade: "Upgrade",
    renew: "Renew",

    import_hint: "Paste CSV with columns: name,price,category,imageId",
    parse: "Parse & add",

    pdpl_note: "PDPL: Only necessary data is processed for order fulfillment.",
    enable_ai: "Enable AI add-ons",
    ai_title_rewrite: "Title rewrite",
    ai_image_enhance: "Image enhance",
    ai_auto_translate: "Auto-translate",
    
    // Creator economy features
    creator_title: "Creator Economy",
    creator_dashboard: "Creator Dashboard",
    performance_analytics: "Performance Analytics",
    commission_tracking: "Commission Tracking",
    livestream_management: "Livestream Management",
    revenue_overview: "Revenue Overview",
    total_earnings: "Total Earnings",
    this_month: "This Month",
    last_month: "Last Month",
    growth_rate: "Growth Rate",
    commission_rate: "Commission Rate",
    followers_count: "Followers",
    engagement_rate: "Engagement Rate",
    avg_order_value: "Avg Order Value",
    conversion_rate: "Conversion Rate",
    content_views: "Content Views",
    revenue_trends: "Revenue Trends",
    top_products: "Top Performing Products",
    audience_demographics: "Audience Demographics",
    payment_schedule: "Payment Schedule",
    next_payment: "Next Payment",
    payment_method: "Payment Method",
    earnings_breakdown: "Earnings Breakdown",
    product_commissions: "Product Commissions",
    referral_bonuses: "Referral Bonuses",
    live_stream_tips: "Livestream Tips",
    performance_bonuses: "Performance Bonuses",
    scheduled_streams: "Scheduled Streams",
    stream_analytics: "Stream Analytics",
    peak_viewers: "Peak Viewers",
    stream_duration: "Stream Duration",
    revenue_per_stream: "Revenue per Stream",
    viewer_retention: "Viewer Retention",
    schedule_stream: "Schedule Stream",
    stream_title: "Stream Title",
    stream_date: "Stream Date",
    stream_time: "Stream Time",
    featured_products: "Featured Products",
    stream_description: "Stream Description",
    notify_followers: "Notify Followers",
    auto_post_social: "Auto-post to Social",
    
    // Enhanced product management
    edit_product: "Edit Product",
    back_to_catalog: "Back to Catalog",
    delete: "Delete",
    duplicate: "Duplicate",
    save_changes: "Save Changes",
    product_status: "Product Status",
    active: "Active",
    hidden: "Hidden",
    draft: "Draft",
    product_images: "Product Images",
    change_image: "Change Image",
    image_guidelines: "Image Guidelines",
    min_resolution: "Minimum resolution",
    max_file_size: "Maximum file size",
    supported_formats: "Supported formats",
    square_aspect_ratio: "Use square aspect ratio for best results",
    product_information: "Product Information",
    product_name: "Product Name",
    english: "English",
    arabic: "Arabic",
    enter_product_name_en: "Enter product name in English",
    enter_product_name_ar: "Enter product name in Arabic",
    category: "Category",
    product_description: "Product Description",
    enter_product_description_en: "Enter product description in English",
    enter_product_description_ar: "Enter product description in Arabic",
    pricing_inventory: "Pricing & Inventory",
    price: "Price",
    sar: "SAR",
    compare_price: "Compare at Price",
    compare_price_help: "Show original price before discount",
    stock_quantity: "Stock Quantity",
    cancel: "Cancel",
    preview: "Preview",
    confirm_delete_product: "Are you sure you want to delete this product?",
    product_name_required: "Product name is required",
    price_required: "Price must be greater than 0",
    product_saved_successfully: "Product saved successfully!",
    image_upload_coming_soon: "Image upload feature coming soon",
  },
  ar: {
    nav_dashboard: "Ù„ÙˆØ­Ø© Ø§Ù„ØªØ­ÙƒÙ…",
    nav_catalog: "Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª",
    nav_orders: "Ø§Ù„Ø·Ù„Ø¨Ø§Øª",
    nav_creator: "Ø§Ù„Ù…Ø¨Ø¯Ø¹",
    nav_live: "Ø§Ù„Ø¨Ø«",
    nav_ugc: "Ø§Ù„Ù…Ø­ØªÙˆÙ‰",

    kpi_gmv: "Ø§Ù„Ù…Ø¨ÙŠØ¹Ø§Øª (Ù£Ù  ÙŠÙˆÙ…)",
    kpi_orders: "Ø§Ù„Ø·Ù„Ø¨Ø§Øª",
    kpi_aov: "Ù…ØªÙˆØ³Ø· Ù‚ÙŠÙ…Ø© Ø§Ù„Ø·Ù„Ø¨",
    kpi_ret: "Ù…Ø¹Ø¯Ù„ Ø§Ù„Ø¥Ø±Ø¬Ø§Ø¹",
    kpi_followers: "Ø§Ù„Ù…ØªØ§Ø¨Ø¹ÙˆÙ†",
    kpi_engagement: "Ø§Ù„ØªÙØ§Ø¹Ù„",
    kpi_live_viewers: "Ù…Ø´Ø§Ù‡Ø¯Ùˆ Ø§Ù„Ø¨Ø«",
    kpi_social_gmv: "Ù…Ø¨ÙŠØ¹Ø§Øª Ø§Ù„ØªÙˆØ§ØµÙ„",
    kpi_aov: "Ù…ØªÙˆØ³Ø· Ù‚ÙŠÙ…Ø© Ø§Ù„Ø·Ù„Ø¨",
    kpi_ret: "Ù…Ø¹Ø¯Ù„ Ø§Ù„Ø§Ø³ØªØ±Ø¬Ø§Ø¹",

    quick_add: "Ø¥Ø¶Ø§ÙØ© Ù…Ù†ØªØ¬",
    quick_import: "Ø§Ø³ØªÙŠØ±Ø§Ø¯ CSV",
    quick_announce: "Ø¥Ø¹Ù„Ø§Ù†",

    catalog_title: "Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª",
    add_product: "Ø¥Ø¶Ø§ÙØ© Ù…Ù†ØªØ¬",
    import_catalog: "Ø§Ø³ØªÙŠØ±Ø§Ø¯ Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª",
    ai_addons: "Ø¥Ø¶Ø§ÙØ§Øª Ø§Ù„Ø°ÙƒØ§Ø¡",
    search_catalog: "Ø§Ø¨Ø­Ø« ÙÙŠ Ø§Ù„Ù…Ù†ØªØ¬Ø§Øªâ€¦",

    orders_title: "Ø§Ù„Ø·Ù„Ø¨Ø§Øª",
    order: "Ø·Ù„Ø¨",
    customer: "Ø§Ù„Ø¹Ù…ÙŠÙ„",
    status: "Ø§Ù„Ø­Ø§Ù„Ø©",
    total: "Ø§Ù„Ø¥Ø¬Ù…Ø§Ù„ÙŠ",
    created: "Ø£ÙÙ†Ø´Ù‰Ø¡",
    actions: "Ø§Ù„Ø¥Ø¬Ø±Ø§Ø¡Ø§Øª",
    view: "Ø¹Ø±Ø¶",
    fulfill: "ØªÙ†ÙÙŠØ°",
    refund: "Ø§Ø³ØªØ±Ø¬Ø§Ø¹",
    label: "Ù…Ù„ØµÙ‚ Ø´Ø­Ù†",
    approve: "Ù…ÙˆØ§ÙÙ‚Ø©",
    deny: "Ø±ÙØ¶",

    order_detail: "ØªÙØ§ØµÙŠÙ„ Ø§Ù„Ø·Ù„Ø¨",
    items: "Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª",
    placed: "ØªÙ… Ø§Ù„Ø¥Ù†Ø´Ø§Ø¡",
    shipped: "ØªÙ… Ø§Ù„Ø´Ø­Ù†",
    out_for_delivery: "Ø®Ø§Ø±Ø¬ Ù„Ù„ØªØ³Ù„ÙŠÙ…",
    delivered: "ØªÙ… Ø§Ù„ØªØ³Ù„ÙŠÙ…",
    processing: "Ù‚ÙŠØ¯ Ø§Ù„Ù…Ø¹Ø§Ù„Ø¬Ø©",
    start_return: "Ø¥Ù†Ø´Ø§Ø¡ Ø§Ø³ØªØ±Ø¬Ø§Ø¹",
    mark_fulfilled: "ÙˆØ¶Ø¹ ØªÙ… Ø§Ù„ØªÙ†ÙÙŠØ°",
    create_label: "Ø¥Ù†Ø´Ø§Ø¡ Ù…Ù„ØµÙ‚",

    returns_title: "Ø§Ù„Ø§Ø³ØªØ±Ø¬Ø§Ø¹Ø§Øª",
    inbox_title: "Ø§Ù„Ø±Ø³Ø§Ø¦Ù„",
    live_title: "Ø§Ù„Ø¨Ø«",
    live_go: "Ø§Ø¨Ø¯Ø£ Ø§Ù„Ø¨Ø«",
    live_end: "Ø¥Ù†Ù‡Ø§Ø¡ Ø§Ù„Ø¨Ø«",
    pick_product: "Ø§Ø®ØªØ± Ù…Ù†ØªØ¬ Ù„Ù„Ø¹Ø±Ø¶",
    live_viewers: "Ù…Ø´Ø§Ù‡Ø¯Ùˆ Ø§Ù„Ø¨Ø«",
    session_sales: "Ù…Ø¨ÙŠØ¹Ø§Øª Ø§Ù„Ø¬Ù„Ø³Ø©", 
    current_viewers: "Ø§Ù„Ù…Ø´Ø§Ù‡Ø¯ÙˆÙ† Ø§Ù„Ø­Ø§Ù„ÙŠÙˆÙ†",
    engagement_rate: "Ù…Ø¹Ø¯Ù„ Ø§Ù„ØªÙØ§Ø¹Ù„",
    spotlight_product: "ØªØ³Ù„ÙŠØ· Ø§Ù„Ø¶ÙˆØ¡",
    send_message: "Ø¥Ø±Ø³Ø§Ù„ Ø±Ø³Ø§Ù„Ø©",
    toggle_chat: "ØªØ¨Ø¯ÙŠÙ„ Ø§Ù„Ø¯Ø±Ø¯Ø´Ø©",
    share_link: "Ù…Ø´Ø§Ø±ÙƒØ© Ø§Ù„Ø±Ø§Ø¨Ø·",
    add_discount: "Ø¥Ø¶Ø§ÙØ© Ø®ØµÙ…",
    invite_followers: "Ø¯Ø¹ÙˆØ© Ø§Ù„Ù…ØªØ§Ø¨Ø¹ÙŠÙ†",
    save_highlight: "Ø­ÙØ¸ Ù…Ù‚Ø·Ø¹ Ù…Ù…ÙŠØ²",

    ugc_title: "Ø§Ù„Ù…Ø­ØªÙˆÙ‰ Ø§Ù„Ù…ÙÙ†Ø´Ø£",
    ugc_posts: "Ù…Ù†Ø´ÙˆØ±Ø§Øª Ø§Ù„Ù…Ø¨Ø¯Ø¹ÙŠÙ†",
    ugc_pending: "ÙÙŠ Ø§Ù„Ø§Ù†ØªØ¸Ø§Ø±",
    ugc_approved: "Ù…ÙˆØ§ÙÙ‚ Ø¹Ù„ÙŠÙ‡",
    ugc_flagged: "Ù…Ø¨Ù„Øº Ø¹Ù†Ù‡",
    ugc_rejected: "Ù…Ø±ÙÙˆØ¶",
    content_policy: "Ø³ÙŠØ§Ø³Ø© Ø§Ù„Ù…Ø­ØªÙˆÙ‰",
    moderation_queue: "Ø·Ø§Ø¨ÙˆØ± Ø§Ù„Ù…Ø±Ø§Ø¬Ø¹Ø©",
    approve_post: "Ù…ÙˆØ§ÙÙ‚Ø©",
    reject_post: "Ø±ÙØ¶",
    view_post: "Ø¹Ø±Ø¶",
    flag_reason: "Ø³Ø¨Ø¨ Ø§Ù„Ø¥Ø¨Ù„Ø§Øº",
    content_guidelines: "Ø¥Ø±Ø´Ø§Ø¯Ø§Øª Ø§Ù„Ù…Ø­ØªÙˆÙ‰",

    analytics_title: "Ø§Ù„ØªØ­Ù„ÙŠÙ„Ø§Øª",
    settings_title: "Ø§Ù„Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª",
    store_name: "Ø§Ø³Ù… Ø§Ù„Ù…ØªØ¬Ø±",
    save: "Ø­ÙØ¸",
    billing_title: "Ø§Ù„ÙÙˆØªØ±Ø©",
    plan: "Ø§Ù„Ø®Ø·Ø©",
    upgrade: "ØªØ±Ù‚ÙŠØ©",
    renew: "ØªØ¬Ø¯ÙŠØ¯",

    import_hint: "Ø§Ù„ØµÙ‚ CSV Ø¨Ø§Ù„Ø£Ø¹Ù…Ø¯Ø©: name,price,category,imageId",
    parse: "ØªØ­Ù„ÙŠÙ„ ÙˆØ¥Ø¶Ø§ÙØ©",

    pdpl_note: "Ù†Ø¸Ø§Ù… Ø­Ù…Ø§ÙŠØ© Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª: Ù†Ø¹Ø§Ù„Ø¬ Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ù„Ø§Ø²Ù…Ø© ÙÙ‚Ø· Ù„ØªÙ†ÙÙŠØ° Ø§Ù„Ø·Ù„Ø¨.",
    enable_ai: "ØªÙØ¹ÙŠÙ„ Ø¥Ø¶Ø§ÙØ§Øª Ø§Ù„Ø°ÙƒØ§Ø¡",
    ai_title_rewrite: "ØªØ­Ø³ÙŠÙ† Ø§Ù„Ø¹Ù†ÙˆØ§Ù†",
    ai_image_enhance: "ØªØ­Ø³ÙŠÙ† Ø§Ù„ØµÙˆØ±",
    ai_auto_translate: "ØªØ±Ø¬Ù…Ø© ØªÙ„Ù‚Ø§Ø¦ÙŠØ©",
    
    // Creator economy features
    creator_title: "Ø§Ù‚ØªØµØ§Ø¯ Ø§Ù„Ù…Ø¨Ø¯Ø¹ÙŠÙ†",
    creator_dashboard: "Ù„ÙˆØ­Ø© Ø§Ù„Ù…Ø¨Ø¯Ø¹",
    performance_analytics: "ØªØ­Ù„ÙŠÙ„Ø§Øª Ø§Ù„Ø£Ø¯Ø§Ø¡",
    commission_tracking: "ØªØªØ¨Ø¹ Ø§Ù„Ø¹Ù…ÙˆÙ„Ø§Øª",
    livestream_management: "Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ø¨Ø« Ø§Ù„Ù…Ø¨Ø§Ø´Ø±",
    revenue_overview: "Ù†Ø¸Ø±Ø© Ø¹Ø§Ù…Ø© Ø¹Ù„Ù‰ Ø§Ù„Ø¥ÙŠØ±Ø§Ø¯Ø§Øª",
    total_earnings: "Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„Ø£Ø±Ø¨Ø§Ø­",
    this_month: "Ù‡Ø°Ø§ Ø§Ù„Ø´Ù‡Ø±",
    last_month: "Ø§Ù„Ø´Ù‡Ø± Ø§Ù„Ù…Ø§Ø¶ÙŠ",
    growth_rate: "Ù…Ø¹Ø¯Ù„ Ø§Ù„Ù†Ù…Ùˆ",
    commission_rate: "Ù…Ø¹Ø¯Ù„ Ø§Ù„Ø¹Ù…ÙˆÙ„Ø©",
    followers_count: "Ø§Ù„Ù…ØªØ§Ø¨Ø¹ÙˆÙ†",
    engagement_rate: "Ù…Ø¹Ø¯Ù„ Ø§Ù„ØªÙØ§Ø¹Ù„",
    avg_order_value: "Ù…ØªÙˆØ³Ø· Ù‚ÙŠÙ…Ø© Ø§Ù„Ø·Ù„Ø¨",
    conversion_rate: "Ù…Ø¹Ø¯Ù„ Ø§Ù„ØªØ­ÙˆÙŠÙ„",
    content_views: "Ù…Ø´Ø§Ù‡Ø¯Ø§Øª Ø§Ù„Ù…Ø­ØªÙˆÙ‰",
    revenue_trends: "Ø§ØªØ¬Ø§Ù‡Ø§Øª Ø§Ù„Ø¥ÙŠØ±Ø§Ø¯Ø§Øª",
    top_products: "Ø£ÙØ¶Ù„ Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª Ø£Ø¯Ø§Ø¡Ù‹",
    audience_demographics: "Ø§Ù„Ø¯ÙŠÙ…ÙˆØºØ±Ø§ÙÙŠØ§ Ù„Ù„Ø¬Ù…Ù‡ÙˆØ±",
    payment_schedule: "Ø¬Ø¯ÙˆÙ„ Ø§Ù„Ù…Ø¯ÙÙˆØ¹Ø§Øª",
    next_payment: "Ø§Ù„Ø¯ÙØ¹Ø© Ø§Ù„ØªØ§Ù„ÙŠØ©",
    payment_method: "Ø·Ø±ÙŠÙ‚Ø© Ø§Ù„Ø¯ÙØ¹",
    earnings_breakdown: "ØªÙØµÙŠÙ„ Ø§Ù„Ø£Ø±Ø¨Ø§Ø­",
    product_commissions: "Ø¹Ù…ÙˆÙ„Ø§Øª Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª",
    referral_bonuses: "Ù…ÙƒØ§ÙØ¢Øª Ø§Ù„Ø¥Ø­Ø§Ù„Ø©",
    live_stream_tips: "Ù†ØµØ§Ø¦Ø­ Ø§Ù„Ø¨Ø« Ø§Ù„Ù…Ø¨Ø§Ø´Ø±",
    performance_bonuses: "Ù…ÙƒØ§ÙØ¢Øª Ø§Ù„Ø£Ø¯Ø§Ø¡",
    scheduled_streams: "Ø§Ù„Ø¨Ø« Ø§Ù„Ù…Ø¬Ø¯ÙˆÙ„",
    stream_analytics: "ØªØ­Ù„ÙŠÙ„Ø§Øª Ø§Ù„Ø¨Ø«",
    peak_viewers: "Ø°Ø±ÙˆØ© Ø§Ù„Ù…Ø´Ø§Ù‡Ø¯ÙŠÙ†",
    stream_duration: "Ù…Ø¯Ø© Ø§Ù„Ø¨Ø«",
    revenue_per_stream: "Ø§Ù„Ø¥ÙŠØ±Ø§Ø¯Ø§Øª Ù„ÙƒÙ„ Ø¨Ø«",
    viewer_retention: "Ø§Ù„Ø§Ø­ØªÙØ§Ø¸ Ø¨Ø§Ù„Ù…Ø´Ø§Ù‡Ø¯ÙŠÙ†",
    schedule_stream: "Ø¬Ø¯ÙˆÙ„Ø© Ø§Ù„Ø¨Ø«",
    stream_title: "Ø¹Ù†ÙˆØ§Ù† Ø§Ù„Ø¨Ø«",
    stream_date: "ØªØ§Ø±ÙŠØ® Ø§Ù„Ø¨Ø«",
    stream_time: "ÙˆÙ‚Øª Ø§Ù„Ø¨Ø«",
    featured_products: "Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª Ø§Ù„Ù…Ù…ÙŠØ²Ø©",
    stream_description: "ÙˆØµÙ Ø§Ù„Ø¨Ø«",
    notify_followers: "Ø¥Ø´Ø¹Ø§Ø± Ø§Ù„Ù…ØªØ§Ø¨Ø¹ÙŠÙ†",
    auto_post_social: "Ø§Ù„Ù†Ø´Ø± Ø§Ù„ØªÙ„Ù‚Ø§Ø¦ÙŠ Ø¹Ù„Ù‰ ÙˆØ³Ø§Ø¦Ù„ Ø§Ù„ØªÙˆØ§ØµÙ„",
    
    // Enhanced product management
    edit_product: "ØªØ­Ø±ÙŠØ± Ø§Ù„Ù…Ù†ØªØ¬",
    back_to_catalog: "Ø§Ù„Ø¹ÙˆØ¯Ø© Ù„Ù„Ù…Ù†ØªØ¬Ø§Øª",
    delete: "Ø­Ø°Ù",
    duplicate: "Ù†Ø³Ø®",
    save_changes: "Ø­ÙØ¸ Ø§Ù„ØªØºÙŠÙŠØ±Ø§Øª",
    product_status: "Ø­Ø§Ù„Ø© Ø§Ù„Ù…Ù†ØªØ¬",
    active: "Ù†Ø´Ø·",
    hidden: "Ù…Ø®ÙÙŠ",
    draft: "Ù…Ø³ÙˆØ¯Ø©",
    product_images: "ØµÙˆØ± Ø§Ù„Ù…Ù†ØªØ¬",
    change_image: "ØªØºÙŠÙŠØ± Ø§Ù„ØµÙˆØ±Ø©",
    image_guidelines: "Ø¥Ø±Ø´Ø§Ø¯Ø§Øª Ø§Ù„ØµÙˆØ±",
    min_resolution: "Ø§Ù„Ø­Ø¯ Ø§Ù„Ø£Ø¯Ù†Ù‰ Ù„Ù„Ø¯Ù‚Ø©",
    max_file_size: "Ø§Ù„Ø­Ø¯ Ø§Ù„Ø£Ù‚ØµÙ‰ Ù„Ø­Ø¬Ù… Ø§Ù„Ù…Ù„Ù",
    supported_formats: "Ø§Ù„ØµÙŠØº Ø§Ù„Ù…Ø¯Ø¹ÙˆÙ…Ø©",
    square_aspect_ratio: "Ø§Ø³ØªØ®Ø¯Ù… Ù†Ø³Ø¨Ø© Ù…Ø±Ø¨Ø¹Ø© Ù„Ù„Ø­ØµÙˆÙ„ Ø¹Ù„Ù‰ Ø£ÙØ¶Ù„ Ø§Ù„Ù†ØªØ§Ø¦Ø¬",
    product_information: "Ù…Ø¹Ù„ÙˆÙ…Ø§Øª Ø§Ù„Ù…Ù†ØªØ¬",
    product_name: "Ø§Ø³Ù… Ø§Ù„Ù…Ù†ØªØ¬",
    english: "Ø§Ù„Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠØ©",
    arabic: "Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©",
    enter_product_name_en: "Ø£Ø¯Ø®Ù„ Ø§Ø³Ù… Ø§Ù„Ù…Ù†ØªØ¬ Ø¨Ø§Ù„Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠØ©",
    enter_product_name_ar: "Ø£Ø¯Ø®Ù„ Ø§Ø³Ù… Ø§Ù„Ù…Ù†ØªØ¬ Ø¨Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©",
    category: "Ø§Ù„ÙØ¦Ø©",
    product_description: "ÙˆØµÙ Ø§Ù„Ù…Ù†ØªØ¬",
    enter_product_description_en: "Ø£Ø¯Ø®Ù„ ÙˆØµÙ Ø§Ù„Ù…Ù†ØªØ¬ Ø¨Ø§Ù„Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠØ©",
    enter_product_description_ar: "Ø£Ø¯Ø®Ù„ ÙˆØµÙ Ø§Ù„Ù…Ù†ØªØ¬ Ø¨Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©",
    pricing_inventory: "Ø§Ù„ØªØ³Ø¹ÙŠØ± ÙˆØ§Ù„Ù…Ø®Ø²ÙˆÙ†",
    price: "Ø§Ù„Ø³Ø¹Ø±",
    sar: "Ø±.Ø³",
    compare_price: "Ø§Ù„Ø³Ø¹Ø± Ø§Ù„Ù…Ù‚Ø§Ø±Ù†",
    compare_price_help: "Ø£Ø¸Ù‡Ø± Ø§Ù„Ø³Ø¹Ø± Ø§Ù„Ø£ØµÙ„ÙŠ Ù‚Ø¨Ù„ Ø§Ù„Ø®ØµÙ…",
    stock_quantity: "ÙƒÙ…ÙŠØ© Ø§Ù„Ù…Ø®Ø²ÙˆÙ†",
    cancel: "Ø¥Ù„ØºØ§Ø¡",
    preview: "Ù…Ø¹Ø§ÙŠÙ†Ø©",
    confirm_delete_product: "Ù‡Ù„ Ø£Ù†Øª Ù…ØªØ£ÙƒØ¯ Ù…Ù† Ø­Ø°Ù Ù‡Ø°Ø§ Ø§Ù„Ù…Ù†ØªØ¬ØŸ",
    product_name_required: "Ø§Ø³Ù… Ø§Ù„Ù…Ù†ØªØ¬ Ù…Ø·Ù„ÙˆØ¨",
    price_required: "ÙŠØ¬Ø¨ Ø£Ù† ÙŠÙƒÙˆÙ† Ø§Ù„Ø³Ø¹Ø± Ø£ÙƒØ¨Ø± Ù…Ù† 0",
    product_saved_successfully: "ØªÙ… Ø­ÙØ¸ Ø§Ù„Ù…Ù†ØªØ¬ Ø¨Ù†Ø¬Ø§Ø­!",
    image_upload_coming_soon: "Ù…ÙŠØ²Ø© Ø±ÙØ¹ Ø§Ù„ØµÙˆØ± Ù‚Ø§Ø¯Ù…Ø© Ù‚Ø±ÙŠØ¨Ø§Ù‹",
  },
};
const LANG_KEY = "storez_seller_lang";
function setLang(lang) {
  const L = DICT[lang] ? lang : "en";
  localStorage.setItem(LANG_KEY, L);
  return L;
}
function getLang() { return localStorage.getItem(LANG_KEY) || "ar"; }
function getLocale() { return getLang() === "ar" ? "ar-SA" : "en"; }
function t(k) { const L = getLang(); return (DICT[L][k] ?? DICT.en[k] ?? k); }

/* ---------- Theme ---------- */
const THEME_KEY = "storez_seller_theme";
const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)");
function osTheme(){ return prefersDark?.matches ? "dark" : "light"; }
function applyTheme(theme){
  const applied = theme === "auto" ? osTheme() : theme;
  document.documentElement.dataset.theme = applied;
  localStorage.setItem(THEME_KEY, theme);
  // set meta color
  const m = qs("#metaThemeColor"); if(m){
    const bg = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim() || "#0b0c10";
    m.setAttribute("content", bg);
  }
}

/* ---------- State ---------- */
const LS_KEY = "storez_seller_state_v1";
const state = loadState() || seed();
saveState(); // ensure presence

function seed(){
  const now = Date.now();
  return {
    prefs: { sponsor: true },
    store: { name: "Maya Fit Co.", tier: "Starter", live: false, ai: { title: true, image: true, translate: false } },
    catalog: [
      P("p1","CloudRunner Sneakers","Footwear",329,399,"1542291026-7eec264c27ff"),
      P("p2","Sunset Hoodie","Apparel",149,189,"1515879218367-8466d910aaa4"),
      P("p3","Mystic Diffuser","Home",89,119,"1515378791036-0648a3ef77b2"),
      P("p4","Travel Mug","Accessories",45,65,"1521572267360-ee0c2909d518"),
      P("p5","Plant Pot Set","Home",199,249,"1515378791036-0648a3ef77b2"),
      P("p6","Active Leggings","Apparel",149,189,"1521572267360-ee0c2909d518"),
      P("p7","Blue Light Glasses","Accessories",99,129,"1515879218367-8466d910aaa4"),
      P("p8","Detox Clay Mask","Beauty",79,null,"1515378791036-0648a3ef77b2"),
    ],
    orders: [
      O("o101", now-86400e3*2, [{id:"p1",name:"CloudRunner Sneakers",qty:1,price:329}], 329, "Processing", "Fahad A."),
      O("o102", now-86400e3*5, [{id:"p8",name:"Detox Clay Mask",qty:2,price:79}], 158, "Shipped", "Sara K."),
      O("o103", now-86400e3*9, [{id:"p2",name:"Sunset Hoodie",qty:1,price:149}], 149, "Delivered", "Omar M."),
    ],
    returns: [
      { id:"r1", orderId:"o103", customer:"Omar M.", reason:"Size issue", status:"Pending", ts: now-86400e3*3, total:49 }
    ],
    inbox: [
      { id:"t1", with:"@linafit", last:"When is the new colorway?", ts: now-3*3600e3 }
    ],
    ugcPosts: [
      { id:"ugc1", creator:"@sarah_k", content:"Love my new CloudRunner sneakers! ðŸ˜", products:["p1"], status:"approved", ts:now-2*3600e3, likes:45, comments:12, shares:3 },
      { id:"ugc2", creator:"@maya_style", content:"This clay mask is amazing for my skincare routine âœ¨", products:["p8"], status:"pending", ts:now-1*3600e3, likes:23, comments:5, shares:1 },
      { id:"ugc3", creator:"@fahad_tech", content:"Perfect hoodie for coding sessions! ðŸ“±", products:["p2"], status:"flagged", ts:now-4*3600e3, likes:12, comments:2, shares:0, flagReason:"Inappropriate content" },
      { id:"ugc4", creator:"@lina_fashionista", content:"These leggings are perfect for my workout routine", products:["p6"], status:"approved", ts:now-6*3600e3, likes:89, comments:25, shares:8 }
    ],
    metrics: { 
      gmv30: 6150, 
      orders30: 58, 
      aov: 106, 
      ret: 3.8, 
      followers: 1247,
      engagement: 7.2,
      liveViewers: 0,
      socialGmv: 2850,
      spark: buildSpark(24) 
    },
  };
}
function P(id,name,cat,price,listPrice,imgId){
  return { 
    id, 
    name: { en: name, ar: name }, // Add Arabic support
    cat: { en: cat, ar: cat }, // Add Arabic support  
    price, 
    listPrice, 
    imgId, 
    stock: rnd(10,40),
    description: { 
      en: "High-quality product with premium materials and excellent craftsmanship.",
      ar: "Ù…Ù†ØªØ¬ Ø¹Ø§Ù„ÙŠ Ø§Ù„Ø¬ÙˆØ¯Ø© Ø¨Ù…ÙˆØ§Ø¯ ÙØ§Ø®Ø±Ø© ÙˆØ­Ø±ÙÙŠØ© Ù…Ù…ØªØ§Ø²Ø©."
    },
    features: [
      { en: "Premium materials", ar: "Ù…ÙˆØ§Ø¯ ÙØ§Ø®Ø±Ø©" },
      { en: "Sustainable packaging", ar: "ØªØºÙ„ÙŠÙ ØµØ¯ÙŠÙ‚ Ù„Ù„Ø¨ÙŠØ¦Ø©" },
      { en: "30-day return policy", ar: "Ø³ÙŠØ§Ø³Ø© Ø¥Ø±Ø¬Ø§Ø¹ 30 ÙŠÙˆÙ…Ø§Ù‹" }
    ],
    sizeOptions: ["S", "M", "L", "XL"],
    colorOptions: [
      { en: "Black", ar: "Ø£Ø³ÙˆØ¯", hex: "#000000" },
      { en: "White", ar: "Ø£Ø¨ÙŠØ¶", hex: "#FFFFFF" },
      { en: "Mint", ar: "Ù†Ø¹Ù†Ø§Ø¹ÙŠ", hex: "#98FB98" }
    ],
    tags: [],
    seo: {
      title: { en: name, ar: name },
      description: { en: `Buy ${name} online`, ar: `Ø§Ø´ØªØ±ÙŠ ${name} Ø£ÙˆÙ†Ù„Ø§ÙŠÙ†` }
    },
    visibility: "active", // active, hidden, draft
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
}
function O(id,ts,items,total,status,customer){
  return { id, ts, items, total, status, customer, timeline: ["Placed"].concat(status==="Shipped"?["Shipped"]:[]).concat(status==="Delivered"?["Shipped","Out for delivery","Delivered"]:[]) };
}
function rnd(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }
function uns(id,w=900){ return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`; }

function loadState(){
  try { const raw = localStorage.getItem(LS_KEY); return raw? JSON.parse(raw): null; } catch { return null; }
}
function saveState(){ try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch {} }

/* ---------- Router ---------- */
function parseHash(){
  const h = location.hash.slice(1) || "/dashboard";
  const parts = h.split("/").filter(Boolean);
  if(parts.length===1) return { path:"/"+parts[0] };
  return { path:"/"+parts[0], id: parts[1] };
}
const routes = {
  "/dashboard": renderDashboard,
  "/catalog": renderCatalog,
  "/catalog-new": renderCatalogNew,
  "/catalog-edit": renderCatalogEdit,
  "/catalog-import": renderCatalogImport,
  "/orders": renderOrders,
  "/order": renderOrderDetail,
  "/returns": renderReturns,
  "/creator": renderCreator,
  "/live": renderLive,
  "/ugc": renderUGC,
  "/analytics": renderAnalytics,
  "/settings": renderSettings,
  "/billing": renderBilling,
};
function navigate(h){ location.hash = h; }
// Make navigate available for inline onclick handlers
window.navigate = navigate;
function route(){
  const { path, id } = parseHash();
  highlightTab(path);
  (routes[path] || renderDashboard)(id);
  qs("#view")?.focus();
}
window.addEventListener("hashchange", route);

/* ---------- Header wiring ---------- */
function wireHeader(){
  qs("#btnReset")?.addEventListener("click", ()=>{ localStorage.removeItem(LS_KEY); location.reload(); });
  qs("#btnQuickAdd")?.addEventListener("click", ()=>navigate("#/catalog-new"));
  qs("#btnQuickLive")?.addEventListener("click", ()=>navigate("#/live"));

  const langSel = qs("#langSelect");
  if(langSel){
    langSel.value = getLang();
    langSel.addEventListener("change", e=>{
      const L = setLang(e.target.value);
      document.documentElement.lang = (L==="ar"?"ar-SA":"en");
      document.documentElement.dir = (L==="ar"?"rtl":"ltr");
      renderStaticLabels();
      route();
    });
  }
  const themeSel = qs("#themeSelect");
  if(themeSel){
    const pref = localStorage.getItem(THEME_KEY) || "dark";
    themeSel.value = pref;
    applyTheme(pref);
    prefersDark?.addEventListener("change", ()=>{ if((localStorage.getItem(THEME_KEY)||"auto")==="auto") applyTheme("auto"); });
    themeSel.addEventListener("change", e=>applyTheme(e.target.value));
  }
  renderStaticLabels();
}
function renderStaticLabels(){
  qsa("[data-i18n]").forEach(el=> el.textContent = t(el.dataset.i18n));
  qs("#chipTier")?.replaceChildren(document.createTextNode(state.store.tier));
}

/* ---------- UI helpers ---------- */
function highlightTab(path){ qsa("nav.bottom a").forEach(a=>a.classList.toggle("active", a.getAttribute("href")==="#"+path)); }
function setSheet(title, bodyHTML){
  const s=qs("#sheet"); if(!s) return;
  qs("#sheetTitle").textContent = title;
  qs("#sheetBody").innerHTML = bodyHTML;
  s.classList.add("show"); s.setAttribute("aria-hidden","false");
  window.__closeSheet = ()=>{ s.classList.remove("show"); s.setAttribute("aria-hidden","true"); };
}

function showScheduleStream(){
  const products = state.catalog.map(p => `<option value="${p.id}">${loc(p.name)}</option>`).join("");
  setSheet(t("schedule_stream"), html(`
    <form onsubmit="scheduleNewStream(event)" style="display:flex; flex-direction:column; gap:16px">
      <label>
        ${t("stream_title")}
        <input type="text" name="title" placeholder="Enter stream title" required />
      </label>
      
      <div class="grid cols-2" style="gap:12px">
        <label>
          ${t("stream_date")}
          <input type="date" name="date" required />
        </label>
        <label>
          ${t("stream_time")}
          <input type="time" name="time" required />
        </label>
      </div>
      
      <label>
        ${t("featured_products")}
        <select name="products" multiple style="min-height:100px">
          ${products}
        </select>
        <div class="muted small" style="margin-top:4px">Hold Ctrl/Cmd to select multiple products</div>
      </label>
      
      <label>
        ${t("stream_description")}
        <textarea name="description" rows="3" placeholder="Describe what you'll cover in this stream"></textarea>
      </label>
      
      <div style="display:flex; gap:8px">
        <label style="display:flex; align-items:center; gap:8px; cursor:pointer">
          <input type="checkbox" name="notify" checked />
          ${t("notify_followers")}
        </label>
        <label style="display:flex; align-items:center; gap:8px; cursor:pointer">
          <input type="checkbox" name="autoPost" />
          ${t("auto_post_social")}
        </label>
      </div>
      
      <div class="row" style="gap:8px; margin-top:8px">
        <button type="submit" class="primary">${t("schedule_stream")}</button>
        <button type="button" class="ghost" onclick="window.__closeSheet?.()">${t("cancel")}</button>
      </div>
    </form>
  `));
}

function scheduleNewStream(event){
  event.preventDefault();
  const formData = new FormData(event.target);
  const streamData = {
    id: 'stream_' + Date.now(),
    title: formData.get('title'),
    date: formData.get('date'),
    time: formData.get('time'),
    description: formData.get('description'),
    products: Array.from(formData.getAll('products')),
    notifyFollowers: formData.get('notify') === 'on',
    autoPost: formData.get('autoPost') === 'on',
    status: 'scheduled'
  };
  
  // Add to state (in a real app, this would sync with backend)
  if (!state.scheduledStreams) state.scheduledStreams = [];
  state.scheduledStreams.push(streamData);
  saveState();
  
  window.__closeSheet?.();
  // Refresh the creator dashboard
  if (location.hash === '#/creator') renderCreator();
}

function showDetailedCommissions(){
  const commissionData = {
    currentMonth: {
      productSales: 2850.75,
      referralBonuses: 450.00,
      livestreamTips: 320.50,
      performanceBonuses: 680.25
    },
    byCategory: [
      { category: "Beauty & Skincare", sales: 1240.50, commission: 186.08, rate: 15 },
      { category: "Fashion", sales: 2850.00, commission: 427.50, rate: 15 },
      { category: "Electronics", sales: 1890.25, commission: 226.83, rate: 12 },
      { category: "Home & Living", sales: 620.75, commission: 124.15, rate: 20 }
    ],
    paymentHistory: [
      { date: "2024-10-15", amount: 3960.50, method: "Bank Transfer", status: "Paid" },
      { date: "2024-09-15", amount: 3120.25, method: "Bank Transfer", status: "Paid" },
      { date: "2024-08-15", amount: 2890.75, method: "Bank Transfer", status: "Paid" }
    ]
  };

  const totalThisMonth = Object.values(commissionData.currentMonth).reduce((a, b) => a + b, 0);

  setSheet(t("commission_tracking"), html(`
    <div style="display:flex; flex-direction:column; gap:20px">
      <!-- Current Month Breakdown -->
      <div>
        <h4 style="margin:0 0 12px">${t("earnings_breakdown")} - ${t("this_month")}</h4>
        <div style="background:var(--bg); border-radius:8px; padding:16px">
          <div class="row between" style="margin-bottom:8px">
            <span>${t("product_commissions")}</span>
            <strong style="color:var(--good)">${fmtSAR(commissionData.currentMonth.productSales)}</strong>
          </div>
          <div class="row between" style="margin-bottom:8px">
            <span>${t("referral_bonuses")}</span>
            <strong style="color:var(--brand)">${fmtSAR(commissionData.currentMonth.referralBonuses)}</strong>
          </div>
          <div class="row between" style="margin-bottom:8px">
            <span>${t("live_stream_tips")}</span>
            <strong style="color:var(--warning)">${fmtSAR(commissionData.currentMonth.livestreamTips)}</strong>
          </div>
          <div class="row between" style="border-top:1px solid var(--border); padding-top:8px; margin-top:8px">
            <span>${t("performance_bonuses")}</span>
            <strong style="color:var(--accent)">${fmtSAR(commissionData.currentMonth.performanceBonuses)}</strong>
          </div>
          <div class="row between" style="border-top:2px solid var(--border); padding-top:12px; margin-top:12px; font-weight:700; font-size:1.1rem">
            <span>Total ${t("this_month")}</span>
            <span style="color:var(--good)">${fmtSAR(totalThisMonth)}</span>
          </div>
        </div>
      </div>

      <!-- Commission by Category -->
      <div>
        <h4 style="margin:0 0 12px">Commission by Category</h4>
        <div style="display:flex; flex-direction:column; gap:8px">
          ${commissionData.byCategory.map(cat => `
            <div style="background:var(--bg); border-radius:8px; padding:12px">
              <div class="row between" style="margin-bottom:4px">
                <span style="font-weight:600">${cat.category}</span>
                <span style="font-weight:700; color:var(--good)">${fmtSAR(cat.commission)}</span>
              </div>
              <div class="row between" style="font-size:0.85rem; color:var(--muted)">
                <span>${fmtSAR(cat.sales)} sales â€¢ ${cat.rate}% rate</span>
                <span>${((cat.commission / cat.sales) * 100).toFixed(1)}% earned</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Payment History -->
      <div>
        <h4 style="margin:0 0 12px">Payment History</h4>
        <div style="display:flex; flex-direction:column; gap:8px">
          ${commissionData.paymentHistory.map(payment => `
            <div class="row between" style="background:var(--bg); border-radius:8px; padding:12px">
              <div>
                <div style="font-weight:600">${payment.date}</div>
                <div style="font-size:0.85rem; color:var(--muted)">${payment.method}</div>
              </div>
              <div style="text-align:right">
                <div style="font-weight:700; color:var(--good)">${fmtSAR(payment.amount)}</div>
                <div style="font-size:0.85rem; color:var(--good)">${payment.status}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Next Payment Info -->
      <div style="background:var(--bg2); border-radius:8px; padding:16px; border:1px solid var(--border)">
        <h4 style="margin:0 0 8px">${t("next_payment")}</h4>
        <div class="row between" style="margin-bottom:4px">
          <span>Estimated Amount</span>
          <strong style="color:var(--brand)">${fmtSAR(totalThisMonth)}</strong>
        </div>
        <div class="row between" style="margin-bottom:4px">
          <span>Payment Date</span>
          <span>2024-11-15</span>
        </div>
        <div class="row between">
          <span>${t("payment_method")}</span>
          <span>Bank Transfer</span>
        </div>
      </div>
    </div>
  `));
}

function showStreamAnalytics(){
  const analyticsData = {
    totalStreams: 24,
    totalRevenue: 18450.75,
    avgViewers: 365,
    avgDuration: 95, // minutes
    topPerformingStreams: [
      { title: "Friday Fashion Flash", date: "2024-11-01", viewers: 485, duration: 135, revenue: 1250.75 },
      { title: "Sunday Skincare Secrets", date: "2024-10-27", viewers: 610, duration: 150, revenue: 1680.25 },
      { title: "Tech Tuesday Reviews", date: "2024-10-29", viewers: 320, duration: 105, revenue: 890.50 },
      { title: "Wednesday Wellness", date: "2024-10-23", viewers: 445, duration: 120, revenue: 1120.00 }
    ],
    audienceInsights: {
      topCountries: [
        { country: "Saudi Arabia", percentage: 78, flag: "ðŸ‡¸ðŸ‡¦" },
        { country: "UAE", percentage: 12, flag: "ðŸ‡¦ðŸ‡ª" },
        { country: "Kuwait", percentage: 6, flag: "ðŸ‡°ðŸ‡¼" },
        { country: "Others", percentage: 4, flag: "ðŸŒ" }
      ],
      ageGroups: [
        { range: "18-24", percentage: 45 },
        { range: "25-34", percentage: 35 },
        { range: "35-44", percentage: 15 },
        { range: "45+", percentage: 5 }
      ],
      peakTimes: [
        { time: "19:00-21:00", engagement: "High" },
        { time: "15:00-17:00", engagement: "Medium" },
        { time: "21:00-23:00", engagement: "Medium" }
      ]
    }
  };

  setSheet(t("stream_analytics"), html(`
    <div style="display:flex; flex-direction:column; gap:20px">
      <!-- Overview Stats -->
      <div>
        <h4 style="margin:0 0 12px">Stream Performance Overview</h4>
        <div class="grid cols-2" style="gap:12px">
          <div style="background:var(--bg); border-radius:8px; padding:16px; text-align:center">
            <div style="font-size:1.5rem; font-weight:700; color:var(--brand)">${analyticsData.totalStreams}</div>
            <div class="muted small">Total Streams</div>
          </div>
          <div style="background:var(--bg); border-radius:8px; padding:16px; text-align:center">
            <div style="font-size:1.5rem; font-weight:700; color:var(--good)">${fmtSAR(analyticsData.totalRevenue)}</div>
            <div class="muted small">${t("total_earnings")}</div>
          </div>
          <div style="background:var(--bg); border-radius:8px; padding:16px; text-align:center">
            <div style="font-size:1.5rem; font-weight:700; color:var(--accent)">${analyticsData.avgViewers}</div>
            <div class="muted small">Avg Viewers</div>
          </div>
          <div style="background:var(--bg); border-radius:8px; padding:16px; text-align:center">
            <div style="font-size:1.5rem; font-weight:700; color:var(--warning)">${analyticsData.avgDuration}m</div>
            <div class="muted small">Avg Duration</div>
          </div>
        </div>
      </div>

      <!-- Top Performing Streams -->
      <div>
        <h4 style="margin:0 0 12px">Top Performing Streams</h4>
        <div style="display:flex; flex-direction:column; gap:8px">
          ${analyticsData.topPerformingStreams.map(stream => `
            <div style="background:var(--bg); border-radius:8px; padding:12px">
              <div class="row between" style="margin-bottom:4px">
                <span style="font-weight:600">${stream.title}</span>
                <span style="font-weight:700; color:var(--good)">${fmtSAR(stream.revenue)}</span>
              </div>
              <div class="row between" style="font-size:0.85rem; color:var(--muted)">
                <span>${stream.date} â€¢ ${stream.duration}m</span>
                <span>${stream.viewers} peak viewers</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Audience Demographics -->
      <div>
        <h4 style="margin:0 0 12px">${t("audience_demographics")}</h4>
        <div class="grid cols-2" style="gap:16px">
          <div>
            <div style="font-weight:600; margin-bottom:8px">Top Countries</div>
            ${analyticsData.audienceInsights.topCountries.map(country => `
              <div class="row between" style="margin-bottom:6px">
                <span style="display:flex; align-items:center; gap:6px">
                  <span>${country.flag}</span>
                  <span class="small">${country.country}</span>
                </span>
                <span class="small">${country.percentage}%</span>
              </div>
            `).join('')}
          </div>
          <div>
            <div style="font-weight:600; margin-bottom:8px">Age Groups</div>
            ${analyticsData.audienceInsights.ageGroups.map(group => `
              <div class="row between" style="margin-bottom:6px">
                <span class="small">${group.range}</span>
                <span class="small">${group.percentage}%</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Peak Times -->
      <div>
        <h4 style="margin:0 0 12px">Best Times to Stream</h4>
        <div style="background:var(--bg); border-radius:8px; padding:12px">
          ${analyticsData.audienceInsights.peakTimes.map(time => `
            <div class="row between" style="margin-bottom:6px">
              <span class="small">${time.time}</span>
              <span class="small chip" style="background:${time.engagement === 'High' ? 'var(--good)' : 'var(--warning)'}; color:white; font-size:10px">
                ${time.engagement}
              </span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `));
}

function showDetailedPerformance(){
  const performanceData = {
    monthlyTrends: [
      { month: "Oct 2024", revenue: 3960.50, followers: 11240, engagement: 7.8, orders: 89 },
      { month: "Sep 2024", revenue: 3120.25, followers: 10450, engagement: 7.2, orders: 76 },
      { month: "Aug 2024", revenue: 2890.75, followers: 9820, engagement: 6.9, orders: 68 },
      { month: "Jul 2024", revenue: 2650.40, followers: 9100, engagement: 6.5, orders: 62 }
    ],
    contentPerformance: [
      { type: "Live Streams", posts: 24, avgViews: 485, engagementRate: 8.4, revenue: 12450.00 },
      { type: "Product Reviews", posts: 18, avgViews: 320, engagementRate: 12.1, revenue: 3200.50 },
      { type: "Style Tips", posts: 45, avgViews: 180, engagementRate: 15.3, revenue: 1850.25 },
      { type: "Tutorials", posts: 12, avgViews: 220, engagementRate: 11.8, revenue: 950.00 }
    ],
    topCategories: [
      { category: "Beauty & Skincare", sales: 156, revenue: 4680.00, growth: "+23%" },
      { category: "Fashion", sales: 203, revenue: 6090.00, growth: "+18%" },
      { category: "Electronics", sales: 89, revenue: 2670.00, growth: "+12%" },
      { category: "Home & Living", sales: 67, revenue: 2010.00, growth: "+8%" }
    ],
    audienceGrowth: {
      newFollowers: 1605,
      unfollowers: 235,
      netGrowth: 1370,
      growthRate: 12.2,
      repeatCustomers: 68
    }
  };

  setSheet("Creator Performance Report", html(`
    <div style="display:flex; flex-direction:column; gap:24px">
      <!-- Growth Overview -->
      <div>
        <h4 style="margin:0 0 16px">Growth Overview (Last 4 Months)</h4>
        <div style="display:flex; flex-direction:column; gap:8px">
          ${performanceData.monthlyTrends.map((month, index) => {
            const isRecent = index === 0;
            return `
              <div style="background:var(--bg); border-radius:8px; padding:12px; ${isRecent ? 'border:2px solid var(--brand)' : ''}">
                <div class="row between" style="margin-bottom:8px">
                  <span style="font-weight:600">${month.month} ${isRecent ? '(Current)' : ''}</span>
                  <span style="font-weight:700; color:var(--good)">${fmtSAR(month.revenue)}</span>
                </div>
                <div class="row between" style="font-size:0.85rem; color:var(--muted)">
                  <span>${month.followers.toLocaleString()} followers</span>
                  <span>${month.engagement}% engagement</span>
                  <span>${month.orders} orders</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Content Performance -->
      <div>
        <h4 style="margin:0 0 16px">Content Performance by Type</h4>
        <div style="display:flex; flex-direction:column; gap:8px">
          ${performanceData.contentPerformance.map(content => `
            <div style="background:var(--bg); border-radius:8px; padding:12px">
              <div class="row between" style="margin-bottom:4px">
                <span style="font-weight:600">${content.type}</span>
                <span style="font-weight:700; color:var(--good)">${fmtSAR(content.revenue)}</span>
              </div>
              <div class="row between" style="font-size:0.85rem; color:var(--muted)">
                <span>${content.posts} posts â€¢ ${content.avgViews} avg views</span>
                <span>${content.engagementRate}% engagement</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Category Performance -->
      <div>
        <h4 style="margin:0 0 16px">Top Product Categories</h4>
        <div style="display:flex; flex-direction:column; gap:8px">
          ${performanceData.topCategories.map(category => `
            <div style="background:var(--bg); border-radius:8px; padding:12px">
              <div class="row between" style="margin-bottom:4px">
                <span style="font-weight:600">${category.category}</span>
                <span style="font-weight:700; color:var(--good)">${fmtSAR(category.revenue)}</span>
              </div>
              <div class="row between" style="font-size:0.85rem; color:var(--muted)">
                <span>${category.sales} sales</span>
                <span style="color:var(--good)">${category.growth}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Audience Insights -->
      <div>
        <h4 style="margin:0 0 16px">Audience Growth & Retention</h4>
        <div style="background:var(--bg); border-radius:8px; padding:16px">
          <div class="grid cols-2" style="gap:16px; margin-bottom:16px">
            <div style="text-align:center">
              <div style="font-size:1.5rem; font-weight:700; color:var(--good)">+${performanceData.audienceGrowth.newFollowers}</div>
              <div class="muted small">New Followers</div>
            </div>
            <div style="text-align:center">
              <div style="font-size:1.5rem; font-weight:700; color:var(--brand)">+${performanceData.audienceGrowth.growthRate}%</div>
              <div class="muted small">Growth Rate</div>
            </div>
          </div>
          <div class="row between" style="margin-bottom:8px; font-size:0.9rem">
            <span>New Followers</span>
            <span style="color:var(--good)">+${performanceData.audienceGrowth.newFollowers}</span>
          </div>
          <div class="row between" style="margin-bottom:8px; font-size:0.9rem">
            <span>Unfollowers</span>
            <span style="color:var(--warning)">-${performanceData.audienceGrowth.unfollowers}</span>
          </div>
          <div class="row between" style="margin-bottom:8px; font-size:0.9rem; border-top:1px solid var(--border); padding-top:8px">
            <span style="font-weight:600">Net Growth</span>
            <span style="font-weight:700; color:var(--good)">+${performanceData.audienceGrowth.netGrowth}</span>
          </div>
          <div class="row between" style="font-size:0.9rem">
            <span>Repeat Customers</span>
            <span style="color:var(--brand)">${performanceData.audienceGrowth.repeatCustomers}%</span>
          </div>
        </div>
      </div>

      <!-- Optimization Recommendations -->
      <div>
        <h4 style="margin:0 0 16px">ðŸ’¡ Optimization Recommendations</h4>
        <div style="background:var(--bg2); border-radius:8px; padding:16px; border:1px solid var(--border)">
          <div style="margin-bottom:12px; color:var(--good)">âœ… <strong>Beauty content performs 23% above average</strong> - Continue focusing on skincare tutorials</div>
          <div style="margin-bottom:12px; color:var(--brand)">ðŸ’¡ <strong>Post during 7-9 PM</strong> - Your audience is most active during evening hours</div>
          <div style="margin-bottom:12px; color:var(--warning)">âš ï¸ <strong>Electronics engagement is lower</strong> - Consider more interactive tech reviews</div>
          <div style="color:var(--accent)">ðŸŽ¯ <strong>Live streams drive 3x revenue</strong> - Schedule 2-3 streams per week for optimal growth</div>
        </div>
      </div>
    </div>
  `));
}

/* ---------- Views ---------- */
function renderDashboard(){
  const v = qs("#view");
  const m = state.metrics;
  const ordersPending = state.orders.filter(x=>x.status==="Processing").length;
  const returnsPending = state.returns.filter(x=>x.status==="Pending").length;
  
  v.innerHTML = html(`
    <section class="panel">
      <div class="row between">
        <strong>Dashboard</strong>
        <span class="chip">${state.store.live ? "ðŸ”´ LIVE" : "Offline"}</span>
      </div>
      
      <!-- Creator KPIs Grid -->
      <div class="kpis" style="margin-top:16px">
        <div class="kpi" style="cursor:pointer" onclick="navigate('#/dashboard')" title="View sales details">
          <div class="head">${t("kpi_gmv")}</div>
          <div class="val">${fmtSAR(m.gmv30)}</div>
        </div>
        <div class="kpi" style="cursor:pointer" onclick="navigate('#/creator')" title="View social sales">
          <div class="head">${t("kpi_social_gmv")}</div>
          <div class="val">${fmtSAR(m.socialGmv)}</div>
          <div class="sub">${Math.round((m.socialGmv/m.gmv30)*100)}% of total</div>
        </div>
        <div class="kpi" style="cursor:pointer" onclick="navigate('#/creator')" title="View followers">
          <div class="head">${t("kpi_followers")}</div>
          <div class="val">${m.followers.toLocaleString()}</div>
          <div class="sub positive">+${Math.floor(Math.random()*50)+10} this week</div>
        </div>
        <div class="kpi" style="cursor:pointer" onclick="navigate('#/creator')" title="View engagement metrics">
          <div class="head">${t("kpi_engagement")}</div>
          <div class="val">${m.engagement}%</div>
          <div class="sub">${t("kpi_live_viewers")}: ${state.store.live ? Math.floor(Math.random()*500)+200 : 0}</div>
        </div>
        <div class="kpi" style="cursor:pointer" onclick="navigate('#/orders')" title="View all orders">
          <div class="head">${t("kpi_orders")}</div>
          <div class="val">${m.orders30}</div>
        </div>
        <div class="kpi" style="cursor:pointer" onclick="navigate('#/orders')" title="View order details">
          <div class="head">${t("kpi_aov")}</div>
          <div class="val">${fmtSAR(m.aov)}</div>
        </div>
      </div>
      
      <canvas id="spark" height="60" style="width:100%; margin:16px 0"></canvas>
      
      <!-- Quick Actions -->
      <div class="row" style="gap:8px; margin-top:16px">
        <button class="secondary" onclick="navigate('#/catalog-new')" style="flex:1">${t("quick_add")}</button>
        <button class="secondary" onclick="navigate('#/live')" style="flex:1">${state.store.live ? "Manage Live" : "Go Live"}</button>
        <button class="ghost" onclick="navigate('#/catalog-import')" style="flex:1">${t("quick_import")}</button>
      </div>
      
      <!-- Alerts/Notifications -->
      ${ordersPending ? `<div class="alert" style="margin-top:12px; cursor:pointer" onclick="navigate('#/orders')" title="Click to view pending orders">âš ï¸ ${ordersPending} orders need processing</div>` : ""}
      ${returnsPending ? `<div class="alert" style="margin-top:8px; cursor:pointer" onclick="navigate('#/returns')" title="Click to view pending returns">ðŸ“¦ ${returnsPending} returns pending review</div>` : ""}
      
      <!-- Creator Performance Insights -->
      <div class="panel" style="margin-top:16px; background:var(--panel-secondary,var(--panel))">
        <strong>Creator Insights</strong>
        <div style="margin-top:8px; line-height:1.5">
          <div class="muted">â€¢ Your live sessions drive ${Math.round((m.socialGmv/m.gmv30)*100)}% of total sales</div>
          <div class="muted">â€¢ Engagement rate is ${m.engagement > 5 ? 'above' : 'below'} industry average (5.2%)</div>
          <div class="muted">â€¢ Peak viewer times: 7-9 PM ${getLang() === 'ar' ? 'Ù…Ø³Ø§Ø¡Ù‹' : ''}</div>
        </div>
      </div>
    </section>
  `);
  
  qs("#ordersBadge")?.replaceChildren(document.createTextNode(String(ordersPending)));
  qs("#ugcBadge")?.replaceChildren(document.createTextNode(String((state.ugcPosts || []).filter(p => p.status === 'pending' || p.status === 'flagged').length)));
  drawSpark("spark", state.metrics.spark);
}
function drawSpark(id, arr){
  const c = qs(`#${id}`); if(!c) return;
  const ctx = c.getContext("2d");
  const w = c.width = c.offsetWidth;
  const h = c.height;
  const max = Math.max(...arr)+1, min = Math.min(...arr);
  ctx.clearRect(0,0,w,h);
  ctx.lineWidth = 2;
  ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--brand-2") || "#22c55e";
  ctx.beginPath();
  arr.forEach((v,i)=>{
    const x = (i/(arr.length-1))*w;
    const y = h - ((v-min)/(max-min))*h;
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  });
  ctx.stroke();
}
function buildSpark(n){ const a=[]; let v=100; for(let i=0;i<n;i++){ v += (Math.random()-0.4)*8; a.push(Math.max(40, Math.min(160, Math.round(v)))); } return a; }

// Helper function to get localized text
function loc(obj, fallback = "en") {
  if (typeof obj === "string") return obj; // backward compatibility
  const lang = getLang();
  const result = obj?.[lang] || obj?.[fallback] || obj || "";
  // Ensure we always return a string, never an object
  return typeof result === "string" ? result : "";
}

function renderCatalog(){
  const v=qs("#view");
  const items = state.catalog.map(p=>`
    <article class="card">
      <a class="media" href="#/catalog-edit/${p.id}"><img src="${uns(p.imgId, 600)}" alt="${loc(p.name) || p.name || 'Product'}"></a>
      <div class="body">
        <div class="row between">
          <strong>${loc(p.name)}</strong>
          <span class="chip">${loc(p.cat)}</span>
        </div>
        <div class="row between">
          <div class="row" style="gap:6px"><span class="price">${fmtSAR(p.price)}</span>${p.listPrice?`<span class="muted" style="text-decoration:line-through">${fmtSAR(p.listPrice)}</span>`:""}</div>
          <button class="small ghost" onclick="deleteProduct('${p.id}')">âœ•</button>
        </div>
      </div>
    </article>
  `).join("");
  v.innerHTML = html(`
    <section class="panel">
      <div class="catalog-header">
        <div class="catalog-title">
          <h1>${t("catalog_title")}</h1>
          <div class="catalog-stats">
            ${state.catalog.length} products
          </div>
        </div>
        <div class="catalog-actions">
          <a class="btn-secondary" href="#/catalog-new">
            <span class="btn-icon">+</span>
            ${t("add_product")}
          </a>
          <a class="btn-ghost" href="#/catalog-import">
            <span class="btn-icon">â†—</span>
            ${t("import_catalog")}
          </a>
        </div>
      </div>
      <div class="grid cols-3" style="margin-top:20px">${items}</div>
    </section>
  `);
}

function renderCatalogNew(){
  const v=qs("#view");
  v.innerHTML = html(`
    <section class="panel">
      <strong>${t("add_product")}</strong>
      <label>${t("store_name")}<input id="p_name" placeholder="Product name"></label>
      <label>Price (SAR)<input id="p_price" type="number" value="99"></label>
      <label>Category<select id="p_cat"><option>Apparel</option><option>Footwear</option><option>Accessories</option><option>Beauty</option></select></label>
      <label>Unsplash Image ID<input id="p_img" placeholder="1519744792095-2f2205e87b6f"></label>
      <div class="row" style="gap:8px; margin-top:10px">
        <button class="secondary" onclick="saveNewProduct()">${t("save")}</button>
        <button class="ghost" onclick="navigate('#/catalog')">Cancel</button>
      </div>
    </section>
  `);
}

function renderCatalogEdit(id) {
  const product = state.catalog.find(p => p.id === id);
  if (!product) {
    navigate("#/catalog");
    return;
  }

  const v = qs("#view");
  v.innerHTML = html(`
    <section class="panel">
      <div class="row between" style="margin-bottom:20px">
        <div>
          <button class="ghost small" onclick="navigate('#/catalog')" style="display:flex;align-items:center;gap:4px">
            <span>â†</span> ${t("back_to_catalog")}
          </button>
          <h2 style="margin:8px 0 0">${t("edit_product")}</h2>
        </div>
        <div class="row" style="gap:8px">
          <button class="ghost danger" onclick="deleteProduct('${product.id}')">${t("delete")}</button>
          <button class="secondary" onclick="duplicateProduct('${product.id}')">${t("duplicate")}</button>
          <button class="primary" onclick="saveProduct('${product.id}')">${t("save_changes")}</button>
        </div>
      </div>

      <!-- Product Status -->
      <div class="row between" style="margin-bottom:20px; padding:12px; background:var(--bg2); border-radius:8px">
        <div>
          <strong>${t("product_status")}:</strong>
          <span class="chip" style="background:${(product.visibility || 'active') === 'active' ? 'var(--good)' : (product.visibility || 'active') === 'hidden' ? 'orange' : 'var(--muted)'}; color:white; margin-left:8px">
            ${t(product.visibility || 'active')}
          </span>
        </div>
        <select id="productVisibility">
          <option value="active" ${(product.visibility || 'active') === 'active' ? 'selected' : ''}>${t("active")}</option>
          <option value="hidden" ${(product.visibility || 'active') === 'hidden' ? 'selected' : ''}>${t("hidden")}</option>
          <option value="draft" ${(product.visibility || 'active') === 'draft' ? 'selected' : ''}>${t("draft")}</option>
        </select>
      </div>

      <!-- Product Images -->
      <div style="margin-bottom:24px">
        <h3 style="margin:0 0 12px">${t("product_images")}</h3>
        <div class="row" style="gap:12px; flex-wrap:wrap">
          <div class="media" style="width:200px; aspect-ratio:1/1; border-radius:8px; overflow:hidden; position:relative">
            <img src="${uns(product.imgId, 600)}" alt="${product.name.en || product.name}" id="mainProductImage"/>
            <button class="icon-btn" style="position:absolute; top:8px; right:8px; background:rgba(0,0,0,0.5); color:white" onclick="uploadImage('main')" title="${t("change_image")}">ðŸ“·</button>
          </div>
          <div style="flex:1; min-width:200px">
            <div class="muted small" style="margin-bottom:8px">${t("image_guidelines")}</div>
            <ul class="muted small" style="padding-left:16px">
              <li>${t("min_resolution")}: 800x800px</li>
              <li>${t("max_file_size")}: 5MB</li>
              <li>${t("supported_formats")}: JPG, PNG, WebP</li>
              <li>${t("square_aspect_ratio")}</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Product Information -->
      <div style="margin-bottom:24px">
        <h3 style="margin:0 0 16px">${t("product_information")}</h3>
        
        <!-- Product Name -->
        <div style="margin-bottom:16px">
          <label style="display:block; font-weight:bold; margin-bottom:4px">${t("product_name")} *</label>
          <div class="row" style="gap:12px">
            <div style="flex:1">
              <label class="muted small">${t("english")}</label>
              <input type="text" id="nameEn" value="${product.name.en || product.name}" placeholder="${t("enter_product_name_en")}" style="width:100%"/>
            </div>
            <div style="flex:1">
              <label class="muted small">${t("arabic")}</label>
              <input type="text" id="nameAr" value="${product.name.ar || product.name}" placeholder="${t("enter_product_name_ar")}" style="width:100%" dir="rtl"/>
            </div>
          </div>
        </div>

        <!-- Category -->
        <div style="margin-bottom:16px">
          <label style="display:block; font-weight:bold; margin-bottom:4px">${t("category")} *</label>
          <div class="row" style="gap:12px">
            <div style="flex:1">
              <label class="muted small">${t("english")}</label>
              <select id="catEn" style="width:100%">
                <option value="Footwear" ${(product.cat.en || product.cat) === 'Footwear' ? 'selected' : ''}>Footwear</option>
                <option value="Beauty" ${(product.cat.en || product.cat) === 'Beauty' ? 'selected' : ''}>Beauty</option>
                <option value="Accessories" ${(product.cat.en || product.cat) === 'Accessories' ? 'selected' : ''}>Accessories</option>
                <option value="Apparel" ${(product.cat.en || product.cat) === 'Apparel' ? 'selected' : ''}>Apparel</option>
                <option value="Electronics" ${(product.cat.en || product.cat) === 'Electronics' ? 'selected' : ''}>Electronics</option>
                <option value="Home" ${(product.cat.en || product.cat) === 'Home' ? 'selected' : ''}>Home & Living</option>
              </select>
            </div>
            <div style="flex:1">
              <label class="muted small">${t("arabic")}</label>
              <select id="catAr" style="width:100%">
                <option value="Ø£Ø­Ø°ÙŠØ©" ${(product.cat.ar || product.cat) === 'Ø£Ø­Ø°ÙŠØ©' ? 'selected' : ''}>Ø£Ø­Ø°ÙŠØ©</option>
                <option value="Ø¬Ù…Ø§Ù„" ${(product.cat.ar || product.cat) === 'Ø¬Ù…Ø§Ù„' ? 'selected' : ''}>Ø¬Ù…Ø§Ù„</option>
                <option value="Ø¥ÙƒØ³Ø³ÙˆØ§Ø±Ø§Øª" ${(product.cat.ar || product.cat) === 'Ø¥ÙƒØ³Ø³ÙˆØ§Ø±Ø§Øª' ? 'selected' : ''}>Ø¥ÙƒØ³Ø³ÙˆØ§Ø±Ø§Øª</option>
                <option value="Ù…Ù„Ø§Ø¨Ø³" ${(product.cat.ar || product.cat) === 'Ù…Ù„Ø§Ø¨Ø³' ? 'selected' : ''}>Ù…Ù„Ø§Ø¨Ø³</option>
                <option value="Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠØ§Øª" ${(product.cat.ar || product.cat) === 'Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠØ§Øª' ? 'selected' : ''}>Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠØ§Øª</option>
                <option value="Ø§Ù„Ù…Ù†Ø²Ù„" ${(product.cat.ar || product.cat) === 'Ø§Ù„Ù…Ù†Ø²Ù„' ? 'selected' : ''}>Ø§Ù„Ù…Ù†Ø²Ù„ ÙˆØ§Ù„Ù…Ø¹ÙŠØ´Ø©</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div style="margin-bottom:16px">
          <label style="display:block; font-weight:bold; margin-bottom:4px">${t("product_description")}</label>
          <div class="row" style="gap:12px">
            <div style="flex:1">
              <label class="muted small">${t("english")}</label>
              <textarea id="descEn" placeholder="${t("enter_product_description_en")}" style="width:100%; min-height:80px">${product.description ? product.description.en : ''}</textarea>
            </div>
            <div style="flex:1">
              <label class="muted small">${t("arabic")}</label>
              <textarea id="descAr" placeholder="${t("enter_product_description_ar")}" style="width:100%; min-height:80px" dir="rtl">${product.description ? product.description.ar : ''}</textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Pricing & Inventory -->
      <div style="margin-bottom:24px">
        <h3 style="margin:0 0 16px">${t("pricing_inventory")}</h3>
        
        <div class="row" style="gap:16px; margin-bottom:16px">
          <div style="flex:1">
            <label style="display:block; font-weight:bold; margin-bottom:4px">${t("price")} (${t("sar")}) *</label>
            <input type="number" id="price" value="${product.price}" placeholder="0.00" min="0" step="0.01" style="width:100%"/>
          </div>
          <div style="flex:1">
            <label style="display:block; font-weight:bold; margin-bottom:4px">${t("compare_price")} (${t("sar")})</label>
            <input type="number" id="listPrice" value="${product.listPrice || ''}" placeholder="0.00" min="0" step="0.01" style="width:100%"/>
            <div class="muted small">${t("compare_price_help")}</div>
          </div>
          <div style="flex:1">
            <label style="display:block; font-weight:bold; margin-bottom:4px">${t("stock_quantity")} *</label>
            <input type="number" id="stock" value="${product.stock}" placeholder="0" min="0" style="width:100%"/>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="row" style="gap:12px; margin-top:24px; padding-top:24px; border-top:1px solid var(--border)">
        <button class="ghost" onclick="navigate('#/catalog')">${t("cancel")}</button>
        <button class="secondary" onclick="previewProduct('${product.id}')">${t("preview")}</button>
        <button class="primary" onclick="saveProduct('${product.id}')">${t("save_changes")}</button>
      </div>
    </section>
  `);
}

function renderCatalogImport(){
  const v=qs("#view");
  v.innerHTML = html(`
    <section class="panel">
      <strong>${t("import_catalog")}</strong>
      <p class="muted">${t("import_hint")}</p>
      <textarea id="csv" rows="6" placeholder="CloudRunner Sneakers,329,Footwear,1542291026-7eec264c27ff&#10;Aura Skin Serum,119,Beauty,1522336572468-97b06e8ef143"></textarea>
      <div class="row" style="gap:8px; margin-top:10px">
        <button class="secondary" onclick="parseCSVImport()">${t("parse")}</button>
        <button class="ghost" onclick="navigate('#/catalog')">Cancel</button>
      </div>
    </section>
  `);
}

function renderOrders(){
  const v=qs("#view");
  const rows = state.orders.map(o=>`
    <tr>
      <td><a href="#/order/${o.id}">${o.id}</a></td>
      <td>${o.customer}</td>
      <td>${o.status}</td>
      <td>${fmtSAR(o.total)}</td>
      <td>${new Date(o.ts).toLocaleString(getLocale())}</td>
      <td>
        <button class="small ghost" onclick="navigate('#/order/${o.id}')">${t("view")}</button>
      </td>
    </tr>
  `).join("");
  v.innerHTML = html(`
    <section class="panel">
      <div class="row between"><strong>${t("orders_title")}</strong><a class="chip" href="#/returns">${t("returns_title")}</a></div>
      <div style="overflow:auto">
        <table class="tbl">
          <thead><tr><th>${t("order")}</th><th>${t("customer")}</th><th>${t("status")}</th><th>${t("total")}</th><th>${t("created")}</th><th>${t("actions")}</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </section>
  `);
  qs("#ordersBadge")?.replaceChildren(document.createTextNode(String(state.orders.length)));
}

function renderOrderDetail(id){
  const o = state.orders.find(x=>x.id===id) || state.orders[0];
  if(!o){ navigate("#/orders"); return; }
  const items = o.items.map(i=>`<div class="row between"><span>${i.name} Ã— ${i.qty}</span><strong>${fmtSAR(i.qty*i.price)}</strong></div>`).join("");
  const timeline = (o.timeline?.length? o.timeline: ["Placed","Shipped","Out for delivery","Delivered"]).map(s=>`<span class="chip">${s}</span>`).join(" ");
  qs("#view").innerHTML = html(`
    <section class="panel">
      <strong>${t("order_detail")} â€” #${o.id}</strong>
      <div class="muted" style="margin-top:6px">${new Date(o.ts).toLocaleString(getLocale())}</div>
      <hr/>
      <div class="list">${items}</div>
      <hr/>
      <div><strong>${t("status")}:</strong> <span class="chip">${o.status}</span></div>
      <div style="margin-top:8px">${timeline}</div>
      <hr/>
      <div class="row" style="gap:8px">
        <button class="secondary" onclick="updateOrderStatus('${o.id}', 'Shipped')">${t("mark_fulfilled")}</button>
        <button class="ghost" onclick="createOrderLabel('${o.id}')">${t("create_label")}</button>
        <button class="ghost danger" onclick="startReturn('${o.id}', '${o.customer}', ${o.total})">${t("start_return")}</button>
      </div>
    </section>
  `);
}

function renderReturns(){
  const rows = state.returns.map(r=>`
    <tr>
      <td>${r.id}</td>
      <td><a href="#/order/${r.orderId}">${r.orderId}</a></td>
      <td>${r.customer}</td>
      <td>${fmtSAR(r.total)}</td>
      <td>${r.status}</td>
      <td>
        <button class="small secondary" onclick="(function(){ r.status='Approved'; saveState(); route(); })()">${t("approve")}</button>
        <button class="small ghost danger" onclick="(function(){ r.status='Denied'; saveState(); route(); })()">${t("deny")}</button>
      </td>
    </tr>
  `).join("");
  qs("#view").innerHTML = html(`
    <section class="panel">
      <strong>${t("returns_title")}</strong>
      <div style="overflow:auto">
        <table class="tbl">
          <thead><tr><th>ID</th><th>${t("order")}</th><th>${t("customer")}</th><th>${t("total")}</th><th>${t("status")}</th><th>${t("actions")}</th></tr></thead>
          <tbody>${rows || `<tr><td colspan="6" class="muted">${t("returns_title")} â€” 0</td></tr>`}</tbody>
        </table>
      </div>
    </section>
  `);
}

function renderCreator(){
  const v = qs("#view");
  
  // Generate realistic creator metrics
  const creatorMetrics = {
    totalEarnings: 28650.75,
    thisMonth: 4820.25,
    lastMonth: 3960.50,
    growthRate: 21.7,
    commissionRate: 15.5,
    followers: 12845,
    engagementRate: 8.4,
    avgOrderValue: 285.50,
    conversionRate: 3.2,
    contentViews: 145820,
    nextPayment: "2024-11-15",
    paymentMethod: "Bank Transfer"
  };

  const topProducts = [
    { name: "Premium Skincare Set", sales: 156, commission: 2340.00, rate: 20 },
    { name: "Designer Handbag", sales: 89, commission: 1780.00, rate: 15 },
    { name: "Wireless Earbuds", sales: 203, commission: 1520.25, rate: 12 },
    { name: "Luxury Watch", sales: 34, commission: 1360.00, rate: 18 }
  ];

  const upcomingStreams = [
    { title: "Weekend Beauty Haul", date: "2024-11-08", time: "19:00", products: 5 },
    { title: "Tech Review Session", date: "2024-11-10", time: "15:30", products: 3 },
    { title: "Fashion Styling Tips", date: "2024-11-12", time: "20:00", products: 8 }
  ];

  const recentStreams = [
    { title: "Friday Fashion Flash", viewers: 485, duration: "2h 15m", revenue: 1250.75, date: "2024-11-01" },
    { title: "Tech Tuesday", viewers: 320, duration: "1h 45m", revenue: 890.50, date: "2024-10-29" },
    { title: "Sunday Skincare", viewers: 610, duration: "2h 30m", revenue: 1680.25, date: "2024-10-27" }
  ];

  v.innerHTML = html(`
    <section class="panel">
      <div class="row between" style="margin-bottom:24px">
        <div>
          <h1 style="margin:0">${t("creator_dashboard")}</h1>
          <p class="muted" style="margin:4px 0 0">Monitor your creator performance and earnings</p>
        </div>
        <button class="primary" onclick="navigate('#/live')" style="display:flex;align-items:center;gap:8px">
          <span>ðŸ“º</span> ${t("live_go")}
        </button>
      </div>

      <!-- Revenue Overview -->
      <div class="grid cols-4" style="gap:16px; margin-bottom:24px">
        <div class="metric-card" style="padding:20px; background:var(--bg2); border-radius:12px; border:1px solid var(--border)">
          <div class="metric-value" style="font-size:2rem; font-weight:700; color:var(--good)">${fmtSAR(creatorMetrics.totalEarnings)}</div>
          <div class="metric-label" style="color:var(--muted); margin-top:4px">${t("total_earnings")}</div>
        </div>
        <div class="metric-card" style="padding:20px; background:var(--bg2); border-radius:12px; border:1px solid var(--border)">
          <div class="metric-value" style="font-size:2rem; font-weight:700; color:var(--brand)">${fmtSAR(creatorMetrics.thisMonth)}</div>
          <div class="metric-label" style="color:var(--muted); margin-top:4px">${t("this_month")}</div>
          <div class="metric-change" style="color:var(--good); font-size:0.85rem; margin-top:4px">
            +${creatorMetrics.growthRate}% vs ${t("last_month")}
          </div>
        </div>
        <div class="metric-card" style="padding:20px; background:var(--bg2); border-radius:12px; border:1px solid var(--border)">
          <div class="metric-value" style="font-size:2rem; font-weight:700">${creatorMetrics.followers.toLocaleString()}</div>
          <div class="metric-label" style="color:var(--muted); margin-top:4px">${t("followers_count")}</div>
        </div>
        <div class="metric-card" style="padding:20px; background:var(--bg2); border-radius:12px; border:1px solid var(--border)">
          <div class="metric-value" style="font-size:2rem; font-weight:700">${creatorMetrics.engagementRate}%</div>
          <div class="metric-label" style="color:var(--muted); margin-top:4px">${t("engagement_rate")}</div>
        </div>
      </div>

      <!-- Commission & Performance -->
      <div class="grid cols-2" style="gap:20px; margin-bottom:24px">
        <!-- Commission Tracking -->
        <div style="background:var(--bg2); border-radius:12px; padding:20px; border:1px solid var(--border)">
          <div class="row between" style="margin-bottom:16px">
            <h3 style="margin:0">${t("commission_tracking")}</h3>
            <button class="small secondary" onclick="showDetailedCommissions()">View Details</button>
          </div>
          
          <div class="row between" style="margin-bottom:12px; padding:12px; background:var(--bg); border-radius:8px">
            <span>${t("commission_rate")}</span>
            <strong style="color:var(--brand)">${creatorMetrics.commissionRate}%</strong>
          </div>
          
          <div class="row between" style="margin-bottom:12px; padding:12px; background:var(--bg); border-radius:8px">
            <span>${t("avg_order_value")}</span>
            <strong>${fmtSAR(creatorMetrics.avgOrderValue)}</strong>
          </div>
          
          <div class="row between" style="margin-bottom:16px; padding:12px; background:var(--bg); border-radius:8px">
            <span>${t("conversion_rate")}</span>
            <strong style="color:var(--good)">${creatorMetrics.conversionRate}%</strong>
          </div>

          <div style="border-top:1px solid var(--border); padding-top:16px">
            <div class="row between" style="margin-bottom:8px">
              <span class="muted">${t("next_payment")}</span>
              <span class="muted">${creatorMetrics.nextPayment}</span>
            </div>
            <div class="row between">
              <span class="muted">${t("payment_method")}</span>
              <span class="muted">${creatorMetrics.paymentMethod}</span>
            </div>
          </div>
        </div>

        <!-- Top Products -->
        <div style="background:var(--bg2); border-radius:12px; padding:20px; border:1px solid var(--border)">
          <h3 style="margin:0 0 16px">${t("top_products")}</h3>
          
          ${topProducts.map(product => `
            <div class="row between" style="padding:12px; background:var(--bg); border-radius:8px; margin-bottom:8px">
              <div style="flex:1">
                <div style="font-weight:600; margin-bottom:4px">${typeof product.name === 'object' ? (product.name[getLang()] || product.name.en || product.name.ar) : product.name}</div>
                <div class="muted small">${product.sales} sales â€¢ ${product.rate}% commission</div>
              </div>
              <div style="text-align:right">
                <div style="font-weight:700; color:var(--good)">${fmtSAR(product.commission)}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Livestream Management -->
      <div class="grid cols-2" style="gap:20px; margin-bottom:24px">
        <!-- Scheduled Streams -->
        <div style="background:var(--bg2); border-radius:12px; padding:20px; border:1px solid var(--border)">
          <div class="row between" style="margin-bottom:16px">
            <h3 style="margin:0">${t("scheduled_streams")}</h3>
            <button class="small secondary" onclick="showScheduleStream()">${t("schedule_stream")}</button>
          </div>
          
          ${upcomingStreams.map(stream => `
            <div class="row between" style="padding:12px; background:var(--bg); border-radius:8px; margin-bottom:8px">
              <div style="flex:1">
                <div style="font-weight:600; margin-bottom:4px">${stream.title}</div>
                <div class="muted small">${stream.date} at ${stream.time} â€¢ ${stream.products} products</div>
              </div>
              <button class="small ghost">Edit</button>
            </div>
          `).join('')}
        </div>

        <!-- Stream Analytics -->
        <div style="background:var(--bg2); border-radius:12px; padding:20px; border:1px solid var(--border)">
          <h3 style="margin:0 0 16px">${t("stream_analytics")}</h3>
          
          ${recentStreams.map(stream => `
            <div style="padding:12px; background:var(--bg); border-radius:8px; margin-bottom:8px">
              <div class="row between" style="margin-bottom:8px">
                <div style="font-weight:600">${stream.title}</div>
                <div style="color:var(--good); font-weight:700">${fmtSAR(stream.revenue)}</div>
              </div>
              <div class="row between" style="font-size:0.85rem; color:var(--muted)">
                <span>${stream.viewers} ${t("peak_viewers")} â€¢ ${stream.duration}</span>
                <span>${stream.date}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Performance Insights -->
      <div style="background:var(--bg2); border-radius:12px; padding:20px; border:1px solid var(--border)">
        <div class="row between" style="margin-bottom:16px">
          <h3 style="margin:0">${t("performance_analytics")}</h3>
          <button class="small secondary" onclick="showDetailedPerformance()">View Report</button>
        </div>
        
        <div class="grid cols-3" style="gap:16px">
          <div style="text-align:center; padding:16px">
            <div style="font-size:1.5rem; font-weight:700; color:var(--brand)">${creatorMetrics.contentViews.toLocaleString()}</div>
            <div class="muted small">${t("content_views")}</div>
          </div>
          <div style="text-align:center; padding:16px">
            <div style="font-size:1.5rem; font-weight:700; color:var(--good)">92%</div>
            <div class="muted small">${t("viewer_retention")}</div>
          </div>
          <div style="text-align:center; padding:16px">
            <div style="font-size:1.5rem; font-weight:700; color:var(--brand)">${fmtSAR(485.50)}</div>
            <div class="muted small">${t("revenue_per_stream")}</div>
          </div>
        </div>
      </div>
    </section>
  `);
}

function renderLive(){
  const live = state.store.live;
  const currentViewers = live ? Math.floor(Math.random()*500)+200 : 0;
  const products = state.catalog.map(p=>`<option value="${p.id}" ${p.stock < 5 ? 'data-low-stock="true"' : ''}>${loc(p.name)} â€” ${fmtSAR(p.price)} (Stock: ${p.stock})</option>`).join("");
  const featuredProductId = qs('#live_product')?.value || state.catalog[0]?.id;
  const featuredProduct = state.catalog.find(x=>x.id===featuredProductId);
  
  // Enhanced analytics data
  const streamStats = {
    sessionRevenue: live ? Math.floor(Math.random()*2000)+500 : 0,
    peakViewers: live ? currentViewers + Math.floor(Math.random()*100) : 0,
    avgWatchTime: live ? (Math.random()*45+15).toFixed(1) : 0,
    conversionRate: live ? (Math.random()*2+1.5).toFixed(1) : 0,
    commentsPerMin: live ? Math.floor(Math.random()*50)+20 : 0,
    sessionDuration: live ? Math.floor((Date.now() - (state.store.liveStartTime || Date.now())) / 60000) : 0
  };
  
  qs("#view").innerHTML = html(`
    <section class="panel">
      <div class="row between">
        <div>
          <strong>${t("live_title")}</strong>
          ${live ? `<div class="muted small" style="margin-top:4px">Live for ${streamStats.sessionDuration} minutes</div>` : ''}
        </div>
        <div class="row" style="gap:8px">
          ${!live ? `<button class="small ghost" onclick="showStreamAnalytics()">ðŸ“Š Analytics</button>` : ''}
          <span class="chip ${live ? 'danger' : ''}">${live ? 'ðŸ”´ LIVE' : 'Offline'}</span>
        </div>
      </div>
      
      ${live ? `
        <!-- Enhanced Live Session Stats -->
        <div class="grid cols-3" style="gap:12px; margin-top:16px">
          <div class="metric-card" style="padding:16px; background:var(--bg2); border-radius:8px">
            <div style="font-size:1.5rem; font-weight:700; color:var(--brand)">${currentViewers}</div>
            <div class="muted small">${t("current_viewers")}</div>
            <div class="muted small">Peak: ${streamStats.peakViewers}</div>
          </div>
          <div class="metric-card" style="padding:16px; background:var(--bg2); border-radius:8px">
            <div style="font-size:1.5rem; font-weight:700; color:var(--good)">${fmtSAR(streamStats.sessionRevenue)}</div>
            <div class="muted small">${t("session_sales")}</div>
            <div class="muted small">${Math.floor(Math.random()*15)+5} orders</div>
          </div>
          <div class="metric-card" style="padding:16px; background:var(--bg2); border-radius:8px">
            <div style="font-size:1.5rem; font-weight:700; color:var(--accent)">${streamStats.conversionRate}%</div>
            <div class="muted small">${t("conversion_rate")}</div>
            <div class="muted small">${streamStats.avgWatchTime}m avg watch</div>
          </div>
        </div>
        
        <!-- Audience Insights (Live) -->
        <div style="background:var(--bg2); border-radius:8px; padding:16px; margin-top:16px">
          <h4 style="margin:0 0 12px">Real-time Audience Insights</h4>
          <div class="grid cols-2" style="gap:16px">
            <div>
              <div class="row between" style="margin-bottom:8px">
                <span class="muted small">Saudi Arabia</span>
                <span class="small">78%</span>
              </div>
              <div class="row between" style="margin-bottom:8px">
                <span class="muted small">UAE</span>
                <span class="small">12%</span>
              </div>
              <div class="row between">
                <span class="muted small">Other</span>
                <span class="small">10%</span>
              </div>
            </div>
            <div>
              <div class="row between" style="margin-bottom:8px">
                <span class="muted small">Age 18-24</span>
                <span class="small">45%</span>
              </div>
              <div class="row between" style="margin-bottom:8px">
                <span class="muted small">Age 25-34</span>
                <span class="small">35%</span>
              </div>
              <div class="row between">
                <span class="muted small">Age 35+</span>
                <span class="small">20%</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Featured Product Control -->
        <div class="panel" style="margin-top:16px; background:var(--card)">
          <strong>Featured Product</strong>
          <div class="row" style="gap:8px; margin-top:8px">
            <select id="live_product" onchange="updateFeaturedProduct()">${products}</select>
            <button class="secondary small" onclick="spotlightProduct()">Spotlight</button>
            <button class="ghost small" onclick="addFlashDeal()">âš¡ Flash Deal</button>
          </div>
          ${featuredProduct ? `
            <div class="row" style="gap:12px; margin-top:12px">
              <img src="${uns(featuredProduct.imgId, 300)}" alt="${typeof featuredProduct.name === 'object' ? (featuredProduct.name[getLang()] || featuredProduct.name.en || featuredProduct.name.ar) : featuredProduct.name}" style="width:60px;height:60px;object-fit:cover;border-radius:8px">
              <div style="flex:1">
                <strong>${typeof featuredProduct.name === 'object' ? (featuredProduct.name[getLang()] || featuredProduct.name.en || featuredProduct.name.ar) : featuredProduct.name}</strong>
                <div class="muted">${fmtSAR(featuredProduct.price)} â€¢ Stock: ${featuredProduct.stock}</div>
                ${featuredProduct.stock < 5 ? '<div class="warning small">âš ï¸ Low stock</div>' : ''}
              </div>
            </div>
          ` : ''}
        </div>
        
        <!-- Enhanced Live Controls -->
        <div class="panel" style="margin-top:16px; background:var(--card)">
          <strong>Live Controls</strong>
          <div class="row" style="gap:8px; margin-top:8px">
            <button class="ghost small" onclick="addViewerMessage()">ðŸ“¢ Message</button>
            <button class="ghost small" onclick="toggleChat()">ðŸ’¬ Chat</button>
            <button class="ghost small" onclick="shareSession()">ðŸ“¤ Share</button>
            <button class="ghost small" onclick="addPoll()">ðŸ“Š Poll</button>
          </div>
          <div class="row" style="gap:8px; margin-top:8px">
            <button class="ghost small" onclick="addDiscount()">ðŸŽ« Discount</button>
            <button class="ghost small" onclick="inviteViewers()">ðŸ‘¥ Invite</button>
            <button class="ghost small" onclick="recordHighlight()">â­ Highlight</button>
            <button class="ghost small" onclick="showViewersList()">ðŸ‘€ Viewers</button>
          </div>
        </div>
        
        <!-- Recent Activity -->
        <div class="panel" style="margin-top:16px; background:var(--card)">
          <strong>Live Activity</strong>
          <div style="margin-top:8px; max-height:200px; overflow-y:auto">
            <div class="muted small" style="margin-bottom:4px; color:var(--brand)">ðŸ‘¤ @sarah_k joined the stream</div>
            <div class="muted small" style="margin-bottom:4px; color:var(--good)">ðŸ›’ @maya_user added CloudRunner Sneakers to cart</div>
            <div class="muted small" style="margin-bottom:4px">ðŸ’¬ @fahad_sa: "Love the quality!"</div>
            <div class="muted small" style="margin-bottom:4px; color:var(--good)">ðŸŽ‰ @lina_fit purchased Aura Skin Serum</div>
            <div class="muted small" style="margin-bottom:4px; color:var(--accent)">â¤ï¸ @style_hunter liked the stream</div>
            <div class="muted small" style="margin-bottom:4px; color:var(--brand)">ðŸ”¥ Flash deal activated: 20% off</div>
          </div>
        </div>
      ` : `
        <!-- Pre-Live Setup -->
        <div style="margin-top:16px">
          <!-- Quick Stream Setup -->
          <div class="panel" style="background:var(--card); margin-bottom:16px">
            <strong>Quick Setup</strong>
            <div style="margin-top:12px">
              <label>${t("stream_title")}
                <input type="text" id="streamTitle" placeholder="Weekend Beauty Haul" value="Live Shopping Session">
              </label>
              <label style="margin-top:8px">Featured Product
                <select id="live_product">${products}</select>
              </label>
              <p class="muted" style="margin-top:8px">${t("pick_product")}</p>
            </div>
          </div>
          
          <!-- Stream Options -->
          <div class="panel" style="margin-top:16px; background:var(--card)">
            <strong>Stream Options</strong>
            <div style="margin-top:8px">
              <label class="checkbox-option">
                <input type="checkbox" id="autoNotify" checked>
                <span>Notify followers when going live</span>
              </label>
              <label class="checkbox-option">
                <input type="checkbox" id="recordSession" checked>
                <span>Record session for highlights</span>
              </label>
              <label class="checkbox-option">
                <input type="checkbox" id="allowComments" checked>
                <span>Allow viewer comments</span>
              </label>
              <label class="checkbox-option">
                <input type="checkbox" id="enableTips">
                <span>Enable viewer tips</span>
              </label>
            </div>
          </div>
          
          <!-- Scheduled Streams Preview -->
          <div class="panel" style="margin-top:16px; background:var(--card)">
            <div class="row between" style="margin-bottom:12px">
              <strong>Upcoming Streams</strong>
              <button class="small secondary" onclick="navigate('#/creator')">Manage</button>
            </div>
            <div class="muted small">
              â€¢ Weekend Beauty Haul - Nov 8 at 7:00 PM<br>
              â€¢ Tech Review Session - Nov 10 at 3:30 PM<br>
              â€¢ Fashion Styling Tips - Nov 12 at 8:00 PM
            </div>
          </div>
          
          <!-- Performance Tips -->
          <div class="panel" style="margin-top:16px; background:var(--card)">
            <strong>Performance Tips</strong>
            <div style="margin-top:8px; line-height:1.5">
              <div class="muted small">â€¢ Best times: 7-9 PM for 80% higher engagement</div>
              <div class="muted small">â€¢ Feature 2-3 products max per session</div>
              <div class="muted small">â€¢ Use flash deals to boost urgency</div>
              <div class="muted small">â€¢ Interact with viewers every 2-3 minutes</div>
              <div class="muted small">â€¢ Test connection before going live</div>
            </div>
          </div>
        </div>
      `}
      
      <!-- Main Action Button -->
      <div style="margin-top:20px">
        <button class="${live ? 'danger' : 'primary'}" onclick="toggleLiveSession()" style="width:100%; font-weight:600; font-size:1.1rem; padding:16px">
          ${live ? `ðŸ”´ ${t("live_end")}` : `ðŸ“º ${t("live_go")}`}
        </button>
      </div>
    </section>
  `);
}

function renderInbox(){
  const rows = state.inbox.map(ti=>`
    <div class="item">
      <div style="flex:1">
        <div class="row between"><strong>${ti.with}</strong><span class="muted">${new Date(ti.ts).toLocaleTimeString(getLocale())}</span></div>
        <div class="muted">${ti.last}</div>
      </div>
      <a class="chip" href="javascript:void(0)" onclick="alert('Open thread ${ti.id}')">Open</a>
    </div>
  `).join("");
  qs("#view").innerHTML = html(`
    <section class="panel">
      <strong>${t("inbox_title")}</strong>
      <div class="list" style="margin-top:10px">${rows || `<div class="muted">0</div>`}</div>
    </section>
  `);
  qs("#inboxBadge")?.replaceChildren(document.createTextNode(String(state.inbox.length)));
}

function renderUGC(){
  const posts = state.ugcPosts || [];
  const pendingCount = posts.filter(p => p.status === 'pending').length;
  const flaggedCount = posts.filter(p => p.status === 'flagged').length;
  
  const postsHTML = posts.map(post => {
    const product = state.catalog.find(p => p.id === post.products[0]);
    const statusColor = {
      'approved': 'var(--ok)',
      'pending': 'var(--warn)', 
      'flagged': 'var(--bad)',
      'rejected': 'var(--muted)'
    }[post.status];
    
    return `
      <div class="card" style="margin-bottom:12px">
        <div class="row between" style="padding:12px; border-bottom:1px solid var(--border)">
          <div>
            <strong>${post.creator}</strong>
            <div class="muted small">${new Date(post.ts).toLocaleDateString(getLocale())}</div>
          </div>
          <span class="chip" style="background:${statusColor}; color:white; font-size:11px">
            ${t(`ugc_${post.status}`)}
          </span>
        </div>
        <div style="padding:12px">
          <p style="margin:0 0 8px 0">${post.content}</p>
          ${product ? `
            <div class="row" style="gap:8px; margin-bottom:8px">
              <img src="${uns(product.imgId, 150)}" alt="${typeof product.name === 'object' ? (product.name[getLang()] || product.name.en || product.name.ar) : product.name}" style="width:40px;height:40px;object-fit:cover;border-radius:6px">
              <div style="flex:1">
                <div class="small">${typeof product.name === 'object' ? (product.name[getLang()] || product.name.en || product.name.ar) : product.name}</div>
                <div class="muted small">${fmtSAR(product.price)}</div>
              </div>
            </div>
          ` : ''}
          <div class="row between" style="margin-top:8px">
            <div class="muted small">
              â¤ï¸ ${post.likes} â€¢ ðŸ’¬ ${post.comments} â€¢ ðŸ“¤ ${post.shares}
            </div>
            <div class="row" style="gap:4px">
              ${post.status === 'pending' ? `
                <button class="small secondary" onclick="moderatePost('${post.id}', 'approved')">${t("approve_post")}</button>
                <button class="small ghost" onclick="moderatePost('${post.id}', 'rejected')">${t("reject_post")}</button>
              ` : ''}
              <button class="small ghost" onclick="viewPostDetails('${post.id}')">${t("view_post")}</button>
            </div>
          </div>
          ${post.flagReason ? `
            <div class="alert" style="margin-top:8px; background:var(--bad); color:white">
              ${t("flag_reason")}: ${post.flagReason}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
  
  qs("#view").innerHTML = html(`
    <section class="panel">
      <div class="row between">
        <strong>${t("ugc_title")}</strong>
        <button class="ghost small" onclick="showContentPolicy()">${t("content_policy")}</button>
      </div>
      
      <!-- UGC Stats -->
      <div class="kpis" style="margin-top:16px">
        <div class="kpi" style="cursor:pointer" onclick="filterUGC('all')" title="View all posts">
          <div class="head">Total Posts</div>
          <div class="val">${posts.length}</div>
        </div>
        <div class="kpi" style="cursor:pointer" onclick="filterUGC('pending')" title="View pending posts">
          <div class="head">${t("ugc_pending")}</div>
          <div class="val">${pendingCount}</div>
          <div class="sub ${pendingCount > 0 ? 'warning' : ''}">Needs review</div>
        </div>
        <div class="kpi" style="cursor:pointer" onclick="filterUGC('flagged')" title="View flagged posts">
          <div class="head">${t("ugc_flagged")}</div>
          <div class="val">${flaggedCount}</div>
          <div class="sub ${flaggedCount > 0 ? 'danger' : ''}">Requires action</div>
        </div>
        <div class="kpi" style="cursor:pointer" onclick="navigate('#/creator')" title="View engagement details">
          <div class="head">Engagement</div>
          <div class="val">${(posts.reduce((sum, p) => sum + p.likes + p.comments, 0) / posts.length || 0).toFixed(0)}</div>
          <div class="sub">Avg per post</div>
        </div>
      </div>
      
      <!-- Filter Tabs -->
      <div class="row" style="gap:8px; margin:16px 0">
        <button class="small secondary" onclick="filterUGC('all')" id="filterAll">All Posts</button>
        <button class="small ghost" onclick="filterUGC('pending')" id="filterPending">
          ${t("ugc_pending")} ${pendingCount > 0 ? `(${pendingCount})` : ''}
        </button>
        <button class="small ghost" onclick="filterUGC('flagged')" id="filterFlagged">
          ${t("ugc_flagged")} ${flaggedCount > 0 ? `(${flaggedCount})` : ''}
        </button>
        <button class="small ghost" onclick="filterUGC('approved')" id="filterApproved">${t("ugc_approved")}</button>
      </div>
      
      <!-- Posts List -->
      <div id="ugcPosts">
        ${postsHTML || '<div class="panel center muted">No posts yet</div>'}
      </div>
      
      <!-- Content Guidelines -->
      <div class="panel" style="margin-top:16px; background:var(--card)">
        <strong>${t("content_guidelines")}</strong>
        <div style="margin-top:8px; line-height:1.5">
          <div class="muted small">â€¢ Products must be clearly featured</div>
          <div class="muted small">â€¢ No inappropriate or offensive content</div>
          <div class="muted small">â€¢ Must comply with PDPL regulations</div>
          <div class="muted small">â€¢ Authentic reviews and experiences only</div>
        </div>
      </div>
    </section>
  `);
}

function renderAnalytics(){
  const v=qs("#view"); const m=state.metrics;
  v.innerHTML = html(`
    <section class="panel">
      <strong>${t("analytics_title")}</strong>
      <div class="kpis" style="margin-top:10px">
        <div class="kpi"><div class="head">CTR</div><div class="val">${(Math.random()*4+2).toFixed(1)}%</div></div>
        <div class="kpi"><div class="head">CVR</div><div class="val">${(Math.random()*3+1).toFixed(1)}%</div></div>
        <div class="kpi"><div class="head">AOV</div><div class="val">${fmtSAR(m.aov)}</div></div>
        <div class="kpi"><div class="head">GMV</div><div class="val">${fmtSAR(m.gmv30)}</div></div>
      </div>
      <canvas id="spark2" height="60" style="width:100%; margin-top:12px"></canvas>
    </section>
  `);
  drawSpark("spark2", buildSpark(30));
}

function renderSettings(){
  const s=state.store;
  qs("#view").innerHTML = html(`
    <section class="panel">
      <strong>${t("settings_title")}</strong>
      <label>${t("store_name")}<input id="s_name" value="${s.name}"></label>
      <p class="muted" style="margin:.5rem 0">${t("pdpl_note")}</p>
      <label><input id="ai_title" type="checkbox" ${s.ai.title?"checked":""}/> ${t("ai_title_rewrite")}</label>
      <label><input id="ai_image" type="checkbox" ${s.ai.image?"checked":""}/> ${t("ai_image_enhance")}</label>
      <label><input id="ai_tr" type="checkbox" ${s.ai.translate?"checked":""}/> ${t("ai_auto_translate")}</label>
      <div class="row" style="gap:8px; margin-top:10px">
        <button class="secondary" onclick="(function(){ s.name=qs('#s_name').value||s.name; s.ai={ title:qs('#ai_title').checked, image:qs('#ai_image').checked, translate:qs('#ai_tr').checked }; saveState(); alert('Saved'); })()">${t("save")}</button>
        <a class="ghost" href="#/billing">${t("billing_title")}</a>
      </div>
    </section>
  `);
}

function renderBilling(){
  const s=state.store;
  qs("#view").innerHTML = html(`
    <section class="panel">
      <strong>${t("billing_title")}</strong>
      <div class="row between" style="margin-top:8px"><span>${t("plan")}</span><span class="chip">${s.tier}</span></div>
      <div class="row" style="gap:8px; margin-top:10px">
        <button class="secondary" onclick="(function(){ s.tier='Pro'; saveState(); renderStaticLabels(); route(); })()">${t("upgrade")}</button>
        <button class="ghost" onclick="alert('Renewed for 12 months')">${t("renew")}</button>
      </div>
    </section>
  `);
}

/* ---------- UGC Management Functions ---------- */
function moderatePost(postId, action) {
  const post = state.ugcPosts.find(p => p.id === postId);
  if (post) {
    post.status = action;
    saveState();
    renderUGC(); // Re-render to update the UI
    
    const actionText = action === 'approved' ? 'approved' : 'rejected';
    alert(`Post by ${post.creator} has been ${actionText}.`);
  }
}

function viewPostDetails(postId) {
  const post = state.ugcPosts.find(p => p.id === postId);
  if (post) {
    const product = state.catalog.find(p => p.id === post.products[0]);
    setSheet(`Post Details`, `
      <div style="max-width:400px">
        <div class="row" style="gap:12px; margin-bottom:16px">
          <div>
            <strong>${post.creator}</strong>
            <div class="muted small">${new Date(post.ts).toLocaleString(getLocale())}</div>
          </div>
        </div>
        
        <p style="margin:0 0 16px 0">${post.content}</p>
        
        ${product ? `
          <div class="card" style="margin-bottom:16px">
            <div class="row" style="gap:12px; padding:12px">
              <img src="${uns(product.imgId, 200)}" alt="${typeof product.name === 'object' ? (product.name[getLang()] || product.name.en || product.name.ar) : product.name}" style="width:60px;height:60px;object-fit:cover;border-radius:8px">
              <div>
                <strong>${typeof product.name === 'object' ? (product.name[getLang()] || product.name.en || product.name.ar) : product.name}</strong>
                <div class="muted">${fmtSAR(product.price)}</div>
              </div>
            </div>
          </div>
        ` : ''}
        
        <div class="row between" style="margin-bottom:16px">
          <div class="muted">â¤ï¸ ${post.likes} likes</div>
          <div class="muted">ðŸ’¬ ${post.comments} comments</div>
          <div class="muted">ðŸ“¤ ${post.shares} shares</div>
        </div>
        
        ${post.status === 'pending' ? `
          <div class="row" style="gap:8px">
            <button class="secondary" onclick="moderatePost('${post.id}', 'approved'); window.__closeSheet()">Approve</button>
            <button class="ghost" onclick="moderatePost('${post.id}', 'rejected'); window.__closeSheet()">Reject</button>
          </div>
        ` : ''}
      </div>
    `);
  }
}

function filterUGC(filter) {
  // Reset button styles
  qsa('[id^="filter"]').forEach(btn => {
    btn.className = 'small ghost';
  });
  
  // Highlight selected filter
  qs(`#filter${filter.charAt(0).toUpperCase() + filter.slice(1)}`).className = 'small secondary';
  
  // Filter posts
  const posts = state.ugcPosts.filter(post => 
    filter === 'all' || post.status === filter
  );
  
  // Re-render posts list (simplified - in a real app, you'd update just the posts container)
  renderUGC();
}

function showContentPolicy() {
  const isArabic = getLang() === 'ar';
  const content = isArabic ? `
    <div style="max-width:500px" dir="rtl">
      <h3>Ø¥Ø±Ø´Ø§Ø¯Ø§Øª Ø§Ù„Ù…Ø¬ØªÙ…Ø¹</h3>
      
      <h4>Ø§Ù„Ù…Ø­ØªÙˆÙ‰ Ø§Ù„Ù…Ø³Ù…ÙˆØ­</h4>
      <ul style="margin-right:20px">
        <li>ØªÙ‚ÙŠÙŠÙ…Ø§Øª ÙˆØªØ¬Ø§Ø±Ø¨ Ø­Ù‚ÙŠÙ‚ÙŠØ© Ù„Ù„Ù…Ù†ØªØ¬Ø§Øª</li>
        <li>Ø¹Ø±ÙˆØ¶ ØªÙˆØ¶ÙŠØ­ÙŠØ© ÙˆØ§Ø¶Ø­Ø© Ù„Ù„Ù…Ù†ØªØ¬Ø§Øª</li>
        <li>Ø´Ù‡Ø§Ø¯Ø§Øª ÙˆØªÙˆØµÙŠØ§Øª Ø­Ù‚ÙŠÙ‚ÙŠØ©</li>
        <li>Ø§Ù‚ØªØ±Ø§Ø­Ø§Øª Ø¥Ø¨Ø¯Ø§Ø¹ÙŠØ© Ù„Ù„Ø§Ø³ØªØ®Ø¯Ø§Ù… Ø£Ùˆ Ø§Ù„ØªÙ†Ø³ÙŠÙ‚</li>
      </ul>
      
      <h4>Ø§Ù„Ù…Ø­ØªÙˆÙ‰ Ø§Ù„Ù…Ø­Ø¸ÙˆØ±</h4>
      <ul style="margin-right:20px">
        <li>Ù…Ø­ØªÙˆÙ‰ ØºÙŠØ± Ù„Ø§Ø¦Ù‚ Ø£Ùˆ Ù…Ø³ÙŠØ¡ Ø£Ùˆ Ø¶Ø§Ø±</li>
        <li>ØªÙ‚ÙŠÙŠÙ…Ø§Øª Ù…Ø²ÙŠÙØ© Ø£Ùˆ Ø§Ø¯Ø¹Ø§Ø¡Ø§Øª Ù…Ø¶Ù„Ù„Ø©</li>
        <li>Ù…Ø­ØªÙˆÙ‰ Ù„Ø§ ÙŠØ¹Ø±Ø¶ Ù…Ù†ØªØ¬Ø§ØªÙ†Ø§</li>
        <li>Ù…ÙˆØ§Ø¯ Ù…Ø­Ù…ÙŠØ© Ø¨Ø­Ù‚ÙˆÙ‚ Ø§Ù„Ø·Ø¨Ø¹ ÙˆØ§Ù„Ù†Ø´Ø± Ø¨Ø¯ÙˆÙ† Ø¥Ø°Ù†</li>
        <li>Ù…Ø¹Ù„ÙˆÙ…Ø§Øª Ø´Ø®ØµÙŠØ© Ù„Ù„Ø¢Ø®Ø±ÙŠÙ†</li>
      </ul>
      
      <h4>Ø¹Ù…Ù„ÙŠØ© Ø§Ù„Ù…Ø±Ø§Ø¬Ø¹Ø©</h4>
      <p>ØªØªÙ… Ù…Ø±Ø§Ø¬Ø¹Ø© Ø¬Ù…ÙŠØ¹ Ø§Ù„Ù…Ù†Ø´ÙˆØ±Ø§Øª Ø®Ù„Ø§Ù„ 24 Ø³Ø§Ø¹Ø©. ÙŠØªÙ… ØªØµØ¹ÙŠØ¯ Ø§Ù„Ù…Ø­ØªÙˆÙ‰ Ø§Ù„Ù…Ø¨Ù„Øº Ø¹Ù†Ù‡ Ù„Ù„Ù…Ø±Ø§Ø¬Ø¹Ø© Ø§Ù„ÙŠØ¯ÙˆÙŠØ©. ÙŠÙ…ÙƒÙ† ØªÙ‚Ø¯ÙŠÙ… Ø§Ù„Ø·Ø¹ÙˆÙ† Ù…Ù† Ø®Ù„Ø§Ù„ Ù†Ø¸Ø§Ù… Ø§Ù„Ø¯Ø¹Ù… Ù„Ø¯ÙŠÙ†Ø§.</p>
      
      <p><strong>Ù…Ù„Ø§Ø­Ø¸Ø©:</strong> ÙŠØ¬Ø¨ Ø£Ù† ÙŠØªÙˆØ§ÙÙ‚ Ø¬Ù…ÙŠØ¹ Ø§Ù„Ù…Ø­ØªÙˆÙ‰ Ù…Ø¹ Ù…ØªØ·Ù„Ø¨Ø§Øª Ù†Ø¸Ø§Ù… Ø­Ù…Ø§ÙŠØ© Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ø´Ø®ØµÙŠØ© (PDPL) Ø§Ù„Ø³Ø¹ÙˆØ¯ÙŠ.</p>
    </div>
  ` : `
    <div style="max-width:500px">
      <h3>Community Guidelines</h3>
      
      <h4>Approved Content</h4>
      <ul style="margin-left:20px">
        <li>Authentic product reviews and experiences</li>
        <li>Clear product demonstrations</li>
        <li>Genuine testimonials and recommendations</li>
        <li>Creative styling or usage suggestions</li>
      </ul>
      
      <h4>Prohibited Content</h4>
      <ul style="margin-left:20px">
        <li>Inappropriate, offensive, or harmful content</li>
        <li>Fake reviews or misleading claims</li>
        <li>Content not featuring our products</li>
        <li>Copyrighted material without permission</li>
        <li>Personal information of others</li>
      </ul>
      
      <h4>Moderation Process</h4>
      <p>All posts are reviewed within 24 hours. Flagged content is escalated for manual review. Appeals can be submitted through our support system.</p>
      
      <p><strong>Note:</strong> All content must comply with PDPL (Saudi Data Protection Law) requirements.</p>
    </div>
  `;
  
  setSheet(t('content_policy'), content);
}

/* ---------- Live Commerce Functions ---------- */
window.toggleLiveSession = function() {
  state.store.live = !state.store.live;
  if (state.store.live) {
    // Update metrics when going live
    state.metrics.liveViewers = Math.floor(Math.random()*500)+200;
  } else {
    state.metrics.liveViewers = 0;
  }
  saveState();
  route();
};

window.updateFeaturedProduct = function() {
  const productId = qs('#live_product')?.value;
  if (productId && state.store.live) {
    // In a real app, this would update the live stream
    console.log(`Featuring product: ${productId}`);
  }
};

window.spotlightProduct = function() {
  const productId = qs('#live_product')?.value;
  const product = state.catalog.find(p => p.id === productId);
  if (product) {
    const productName = typeof product.name === 'object' ? (product.name[getLang()] || product.name.en || product.name.ar) : product.name;
    alert(`Spotlighting "${productName}" for 30 seconds!`);
    // In a real app, this would highlight the product in the live stream
  }
};

window.addFlashDeal = function() {
  const productId = qs('#live_product')?.value;
  const product = state.catalog.find(p => p.id === productId);
  if (product) {
    const discount = prompt('Enter discount percentage (1-50):', '20');
    if (discount && !isNaN(discount) && discount >= 1 && discount <= 50) {
      const originalPrice = product.price;
      const discountedPrice = originalPrice * (1 - discount / 100);
      const productName = typeof product.name === 'object' ? (product.name[getLang()] || product.name.en || product.name.ar) : product.name;
      alert(`âš¡ Flash Deal created for "${productName}"\nOriginal: ${fmtSAR(originalPrice)}\nDiscounted: ${fmtSAR(discountedPrice)} (${discount}% off)\nDuration: 60 minutes`);
      // In a real app, this would create a time-limited deal
    } else {
      alert('Invalid discount. Please enter a value between 1 and 50.');
    }
  }
};

window.showScheduleStream = showScheduleStream;
window.showContentPolicy = showContentPolicy;
window.showStreamAnalytics = showStreamAnalytics;

// Order management functions
window.updateOrderStatus = function(orderId, newStatus) {
  const order = state.orders.find(o => o.id === orderId);
  if (!order) return;
  
  order.status = newStatus;
  if (!order.timeline) order.timeline = [];
  order.timeline.push(newStatus);
  saveState();
  route(); // Refresh the current view
};

window.createOrderLabel = function(orderId) {
  try {
    const labelContent = `StoreZ Shipping Label\nOrder ID: ${orderId}\nGenerated: ${new Date().toLocaleDateString()}`;
    const blob = new Blob([labelContent], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LABEL-${orderId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error creating label:', error);
    alert('Error creating shipping label. Please try again.');
  }
};

window.startReturn = function(orderId, customer, total) {
  const reason = prompt('Return reason:');
  if (!reason) return;
  
  const returnId = 'r' + (Date.now() % 100000);
  state.returns.unshift({
    id: returnId,
    orderId: orderId,
    customer: customer,
    reason: reason,
    status: 'Pending',
    ts: Date.now(),
    total: total
  });
  saveState();
  navigate('#/returns');
};

function addViewerMessage() {
  const message = prompt('Send message to viewers:');
  if (message) {
    alert(`Message sent: "${message}"`);
    // In a real app, this would appear in the live chat
  }
}

function toggleChat() {
  alert('Chat visibility toggled');
  // In a real app, this would show/hide the chat overlay
}

function shareSession() {
  const shareUrl = `${location.origin}${location.pathname.replace('Seller', 'buyer')}#/live/${state.store.name.replace(/\s+/g, '-').toLowerCase()}`;
  if (navigator.share) {
    navigator.share({
      title: `${state.store.name} is live!`,
      text: 'Join my live shopping session',
      url: shareUrl
    });
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('Live session link copied to clipboard!');
    });
  } else {
    alert(`Share this link: ${shareUrl}`);
  }
}

function addDiscount() {
  const discount = prompt('Enter discount percentage (e.g., 10):');
  if (discount && !isNaN(discount)) {
    alert(`${discount}% discount activated for live viewers!`);
    // In a real app, this would apply the discount to the featured product
  }
}

function inviteViewers() {
  alert('Notifications sent to your 1,247 followers!');
  // In a real app, this would send push notifications
}

function recordHighlight() {
  alert('Highlight saved! This moment will be available in your highlights reel.');
  // In a real app, this would save a clip from the live stream
}

/* ---------- Boot ---------- */
/* ---------- Product Management Functions ---------- */

// Duplicate a product
window.duplicateProduct = function(id) {
  const original = state.catalog.find(p => p.id === id);
  if (!original) return;
  
  const duplicate = {
    ...original,
    id: 's' + (Date.now() % 100000),
    name: typeof original.name === 'object' 
      ? { en: (original.name.en || original.name) + " (Copy)", ar: (original.name.ar || original.name) + " (Ù†Ø³Ø®Ø©)" }
      : original.name + " (Copy)"
  };
  
  state.catalog.unshift(duplicate);
  saveState();
  navigate(`#/catalog-edit/${duplicate.id}`);
};

// Delete product
window.deleteProduct = function(id) {
  const product = state.catalog.find(p => p.id === id);
  if (!product) return;
  
  if (!confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) return;
  
  const index = state.catalog.findIndex(x => x.id === id);
  if (index !== -1) {
    state.catalog.splice(index, 1);
    saveState();
    location.hash = '#/catalog';
  }
};

// Parse CSV import
window.parseCSVImport = function() {
  const raw = qs('#csv').value.trim();
  if (!raw) {
    alert('Empty');
    return;
  }
  
  raw.split(/\r?\n/).forEach(line => {
    const [name, price, cat, img] = line.split(',');
    if (!name || !price) return;
    
    const productName = name.trim();
    const productCat = (cat || 'Apparel').trim();
    
    state.catalog.push({
      id: 's' + (Date.now() % 100000) + Math.floor(Math.random() * 9),
      name: { en: productName, ar: productName },
      cat: { en: productCat, ar: productCat },
      price: Number(price),
      listPrice: null,
      imgId: (img || '1519744792095-2f2205e87b6f').trim(),
      stock: rnd(10, 30),
      description: { 
        en: "High-quality product with premium materials.",
        ar: "Ù…Ù†ØªØ¬ Ø¹Ø§Ù„ÙŠ Ø§Ù„Ø¬ÙˆØ¯Ø© Ø¨Ù…ÙˆØ§Ø¯ ÙØ§Ø®Ø±Ø©."
      },
      visibility: "active",
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
  });
  
  saveState();
  navigate('#/catalog');
};

// Save new product
window.saveNewProduct = function() {
  const id = 's' + (Date.now() % 100000);
  const productName = qs('#p_name').value || 'New Product';
  const productCat = qs('#p_cat').value;
  
  const newProduct = {
    id,
    name: { en: productName, ar: productName },
    cat: { en: productCat, ar: productCat },
    price: Number(qs('#p_price').value || 0),
    listPrice: null,
    imgId: qs('#p_img').value || '1519744792095-2f2205e87b6f',
    stock: 20,
    description: { 
      en: "High-quality product with premium materials.",
      ar: "Ù…Ù†ØªØ¬ Ø¹Ø§Ù„ÙŠ Ø§Ù„Ø¬ÙˆØ¯Ø© Ø¨Ù…ÙˆØ§Ø¯ ÙØ§Ø®Ø±Ø©."
    },
    visibility: "active",
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  
  state.catalog.unshift(newProduct);
  saveState();
  navigate('#/catalog');
};

// Save product changes
window.saveProduct = function(id) {
  const product = state.catalog.find(p => p.id === id);
  if (!product) return;
  
  // Get form values
  const nameEn = qs("#nameEn").value.trim();
  const nameAr = qs("#nameAr").value.trim();
  const catEn = qs("#catEn").value;
  const catAr = qs("#catAr").value;
  const descEn = qs("#descEn").value.trim();
  const descAr = qs("#descAr").value.trim();
  const price = parseFloat(qs("#price").value) || 0;
  const listPrice = parseFloat(qs("#listPrice").value) || null;
  const stock = parseInt(qs("#stock").value) || 0;
  const visibility = qs("#productVisibility").value;
  
  // Validation
  if (!nameEn && !nameAr) {
    alert(t("product_name_required"));
    return;
  }
  
  if (price <= 0) {
    alert(t("price_required"));
    return;
  }
  
  // Update product
  product.name = { en: nameEn, ar: nameAr };
  product.cat = { en: catEn, ar: catAr };
  product.description = { en: descEn, ar: descAr };
  product.price = price;
  product.listPrice = listPrice;
  product.stock = stock;
  product.visibility = visibility;
  product.updatedAt = new Date().toISOString();
  
  saveState();
  
  // Show success message
  showNotification(t("product_saved_successfully"));
  navigate("#/catalog");
};

// Preview product in buyer SPA
window.previewProduct = function(id) {
  const product = state.catalog.find(p => p.id === id);
  if (!product) return;
  
  // Open buyer SPA with this product in a new tab
  const buyerUrl = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '/buyer/') + `#/pdp/${id}`;
  window.open(buyerUrl, '_blank');
};

// Upload image placeholder
window.uploadImage = function(type) {
  alert(t("image_upload_coming_soon"));
};

// Show notification
window.showNotification = function(message) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--good);
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    z-index: 1000;
    animation: slideIn 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
};

// Expose functions for inline onclick handlers
window.showDetailedCommissions = showDetailedCommissions;
window.showScheduleStream = showScheduleStream;
window.showDetailedPerformance = showDetailedPerformance;
window.viewPostDetails = viewPostDetails;
window.showContentPolicy = showContentPolicy;

/* ---------- Boot ---------- */

function boot(){
  // language
  const L = setLang(getLang());
  document.documentElement.lang = (L==="ar"?"ar-SA":"en");
  document.documentElement.dir = (L==="ar"?"rtl":"ltr");
  // theme
  applyTheme(localStorage.getItem(THEME_KEY) || "dark");
  // header and first render
  wireHeader();
  route();
}
document.addEventListener("DOMContentLoaded", boot);


