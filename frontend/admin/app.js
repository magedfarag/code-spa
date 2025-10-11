/* admin.app.js — StoreZ Admin Console (SPA, single module)
   Destinations: Overview, Moderation, Orders, Support, Settings.
   Includes EN/AR (Saudi) text, RTL, theme switch, notices, impersonation.
*/

/* -------------------- i18n (EN / AR—Saudi) -------------------- */
const I18N = {
  en: {
    nav_overview: "Overview",
    nav_creators: "Creators",
    nav_live: "Live Commerce",
    nav_moderation: "Content Moderation",
    content_moderation: "Content Moderation",
    moderation_statistics: "Moderation Statistics",
    pending_reviews: "Pending Reviews",
    approved_today: "Approved Today",
    rejected_today: "Rejected Today",
    auto_moderation_rate: "Auto-Moderation Rate",
    content_queue: "Content Queue",
    all_content: "All Content",
    posts: "Posts",
    comments: "Comments",
    livestreams: "Livestreams",
    products: "Products",
    all_priorities: "All Priorities",
    author: "Author",
    submitted: "Submitted",
    flagged_for: "Flagged for",
    approve: "Approve",
    request_changes: "Request Changes",
    reject: "Reject",
    view_details: "View Details",
    auto_moderation_rules: "Auto-Moderation Rules",
    create_rule: "Create Rule",
    criteria: "Criteria",
    action: "Action",
    triggered: "Triggered",
    times_this_week: "times this week",
    edit: "Edit",
    delete: "Delete",
    action_taken: "Action Taken",
    reason: "Reason",
    date: "Date",
    moderator: "Moderator",
    inappropriate_content: "Inappropriate Content",
    spam: "Spam",
    copyright_violation: "Copyright Violation",
    harassment: "Harassment",
    false_information: "False Information",
    auto_approve: "Auto-Approve",
    auto_reject: "Auto-Reject",
    flag_for_review: "Flag for Review",
    approved: "Approved",
    rejected: "Rejected",
    content_approved_success: "Content #{contentId} approved successfully",
    content_rejected_success: "Content #{contentId} rejected",
    changes_requested_success: "Changes requested for content #{contentId}",
    rejection_reason_prompt: "Please provide a reason for rejection:",
    requested_changes_prompt: "Please specify the required changes:",
    content_details: "Content Details",
    content_information: "Content Information",
    content_preview: "Content Preview",
    flagged_reasons: "Flagged Reasons",
    close: "Close",
    create_moderation_rule: "Create Moderation Rule",
    rule_name: "Rule Name",
    rule_created_success: "Moderation rule created successfully",
    rule_status_updated: "Rule status updated to {status}",
    enabled: "enabled",
    disabled: "disabled",
    edit_rule_functionality: "Edit rule functionality would open here",
    confirm_delete_rule: "Are you sure you want to delete this rule?",
    creator_management: "Creator Management",
    creator_statistics: "Creator Statistics",
    total_creators: "Total Creators",
    pending_applications: "Pending Applications",
    verified_creators: "Verified Creators",
    suspended_creators: "Suspended Creators",
    all_applications: "All Applications",
    new_seller: "New Seller",
    verification_request: "Verification Request",
    reactivation_request: "Reactivation Request",
    new_application: "New Application",
    verification_application: "Verification Application",
    reactivation_application: "Reactivation Application",
    followers: "Followers",
    experience: "Experience",
    years: "Years",
    products_planned: "Products Planned",
    submitted_documents: "Submitted Documents",
    national_id: "National ID",
    business_license: "Business License",
    tax_certificate: "Tax Certificate",
    bank_details: "Bank Details",
    verified: "Verified",
    pending: "Pending",
    approve: "Approve",
    request_documents: "Request Documents",
    view_details: "View Details",
    active_creators: "Active Creators",
    all_statuses: "All Statuses",
    active: "Active",
    warning: "Warning",
    suspended: "Suspended",
    all_categories: "All Categories",
    creator: "Creator",
    category: "Category",
    status: "Status",
    products: "Products",
    revenue_30d: "Revenue (30d)",
    performance_score: "Performance Score",
    view: "View",
    suspend: "Suspend",
    reactivate: "Reactivate",
    performance_analytics: "Performance Analytics",
    top_performing_creators: "Top Performing Creators",
    revenue: "Revenue",
    application_approved_success: "Application #{appId} approved successfully",
    application_rejected_success: "Application #{appId} rejected",
    documents_requested_success: "Additional documents requested for #{appId}",
    request_documents_prompt: "Please specify which documents are needed:",
    application_details: "Application Details",
    creator_information: "Creator Information",
    document_verification: "Document Verification",
    verify: "Verify",
    approve_application: "Approve Application",
    reject_application: "Reject Application",
    creator_profile: "Creator Profile",
    suspension_reason_prompt: "Please provide a reason for suspension:",
    confirm_reactivate_creator: "Are you sure you want to reactivate this creator?",
    creator_suspended_success: "Creator #{creatorId} suspended successfully",
    creator_reactivated_success: "Creator #{creatorId} reactivated successfully",
    edit_creator_functionality: "Edit creator functionality would open here",
    risk_fraud_detection: "Risk & Fraud Detection",
    risk_overview: "Risk Overview",
    active_fraud_alerts: "Active Fraud Alerts",
    suspicious_transactions: "Suspicious Transactions",
    amount_blocked: "Amount Blocked",
    detection_accuracy: "Detection Accuracy",
    all_alerts: "All Alerts",
    payment_fraud: "Payment Fraud",
    account_fraud: "Account Fraud",
    return_abuse: "Return Abuse",
    identity_theft: "Identity Theft",
    all_risk_levels: "All Risk Levels",
    critical_risk: "Critical Risk",
    high_risk: "High Risk",
    medium_risk: "Medium Risk",
    low_risk: "Low Risk",
    account: "Account",
    amount: "Amount",
    detected_at: "Detected At",
    confidence_score: "Confidence Score",
    fraud_indicators: "Fraud Indicators",
    confirm_fraud: "Confirm Fraud",
    mark_legitimate: "Mark Legitimate",
    investigate: "Investigate",
    fraud_detection_rules: "Fraud Detection Rules",
    conditions: "Conditions",
    times_this_month: "times this month",
    accuracy: "Accuracy",
    transaction_monitoring: "Transaction Monitoring",
    transaction_id: "Transaction ID",
    risk_score: "Risk Score",
    payment_method: "Payment Method",
    location: "Location",
    review: "Review",
    block: "Block",
    account_security_monitoring: "Account Security Monitoring",
    login_anomaly: "Unusual Login Activity",
    password_breach: "Password Breach Detected",
    device_new: "New Device Login",
    high: "High",
    medium: "Medium",
    critical: "Critical",
    nav_orders: "Orders",
    nav_support: "Support",
    nav_settings: "Settings",

    // Common
    demo: "Demo",
    search: "Search…",
    start: "Start",
    save: "Save",
    back: "Back",
    cancel: "Cancel",
    create: "Create",
    delete: "Delete",
    edit: "Edit",
    export: "Export",
    download: "Download",
    open: "Open",
    status: "Status",
    actions: "Actions",

    // Overview
    revenue: "Revenue",
    orders: "Orders",
    aov: "AOV",
    users: "Users",
    creators: "Creators",
    sellers: "Sellers",
    growth: "Growth",
    open_tickets: "Open tickets",
    open_reports: "Open reports",
    incidents: "Incidents",
    uptime: "Uptime",
    
    // Enhanced Overview
    platform_metrics: "Platform Metrics",
    total_users: "Total Users",
    active_sellers: "Active Sellers",
    monthly_revenue: "Monthly Revenue",
    system_uptime: "System Uptime",
    this_month: "this month",
    target: "Target",
    total: "total",
    sla_metrics: "SLA Metrics",
    support_response_time: "Support Response Time",
    ticket_resolution_time: "Ticket Resolution Time",
    seller_approval_time: "Seller Approval Time",
    content_moderation_time: "Content Moderation Time",
    good: "Good",
    excellent: "Excellent",
    warning: "Warning",
    critical: "Critical",
    pending_tasks: "Pending Tasks",
    seller_approval: "Seller Approvals",
    content_review: "Content Reviews",
    support_tickets: "Support Tickets",
    payment_disputes: "Payment Disputes",
    high: "High",
    medium: "Medium",
    low: "Low",
    quick_actions: "Quick Actions",
    
    // Billing & Subscriptions
    nav_billing: "Billing",
    billing_subscriptions: "Billing & Subscriptions",
    subscription_plans: "Subscription Plans",
    plan_basic: "Basic Plan",
    plan_standard: "Standard Plan", 
    plan_premium: "Premium Plan",
    monthly_price: "Monthly Price",
    annual_price: "Annual Price",
    features: "Features",
    subscribers: "Subscribers",
    revenue: "Revenue",
    create_plan: "Create Plan",
    edit_plan: "Edit Plan",
    plan_details: "Plan Details",
    billing_history: "Billing History",
    payment_status: "Payment Status",
    all: "All",
    paid: "Paid",
    pending: "Pending", 
    failed: "Failed",
    overdue: "Overdue",
    from_date: "From Date",
    to_date: "To Date",
    invoice_number: "Invoice #",
    customer: "Customer", 
    plan_name: "Plan",
    amount: "Amount",
    issue_date: "Issue Date",
    due_date: "Due Date",
    actions: "Actions",
    view: "View",
    payment_retry: "Retry Payment",
    send_invoice: "Send Invoice",
    delinquent_accounts: "Delinquent Accounts",
    overdue_days: "Overdue Days",
    last_payment: "Last Payment",
    send_reminder: "Send Reminder",
    suspend_account: "Suspend Account",
    tax_invoicing: "Tax & Invoicing",
    saudi_vat: "Saudi VAT (15%)",
    total_invoices: "Total Invoices",
    this_month: "This Month",
    generate_tax_report: "Generate Tax Report",
    download_vat_report: "Download VAT Report",
    
    // AI Add-ons Catalog
    ai_catalog: "AI Add-ons Catalog",
    ai_addons_marketplace: "AI Add-ons Marketplace",
    add_new_addon: "Add New Add-on",
    addon_name: "Add-on Name",
    addon_category: "Category",
    addon_price: "Price",
    addon_status: "Status",
    addon_subscribers: "Subscribers",
    addon_revenue: "Revenue",
    active: "Active",
    inactive: "Inactive",
    draft: "Draft",
    edit_addon: "Edit Add-on",
    view_details: "View Details",
    enable_addon: "Enable",
    disable_addon: "Disable",
    delete_addon: "Delete",
    ai_category_analytics: "Analytics & Insights",
    ai_category_automation: "Automation",
    ai_category_content: "Content Generation",
    ai_category_customer: "Customer Support",
    ai_category_marketing: "Marketing Tools",
    ai_category_inventory: "Inventory Management",
    ai_category_recommendations: "Recommendations",
    ai_category_translation: "Translation",
    entitlements_management: "Entitlements Management",
    seller_entitlements: "Seller Entitlements",
    assign_entitlement: "Assign Entitlement",
    revoke_entitlement: "Revoke Entitlement",
    entitlement_status: "Entitlement Status",
    entitlement_date: "Assignment Date",
    expires_on: "Expires On",
    unlimited: "Unlimited",
    usage_limits: "Usage Limits",
    monthly_quota: "Monthly Quota",
    total_usage: "Total Usage",
    pricing_tiers: "Pricing Tiers",
    tier_basic: "Basic Tier",
    tier_professional: "Professional Tier", 
    tier_enterprise: "Enterprise Tier",
    feature_configuration: "Feature Configuration",
    api_access: "API Access",
    premium_support: "Premium Support",
    custom_branding: "Custom Branding",
    advanced_analytics: "Advanced Analytics",
    search: "Search",
    seller_name: "Seller Name",
    
    // Announcements Admin
    announcements_admin: "Announcements Admin",
    announcement_management: "Announcement Management",
    create_announcement: "Create Announcement",
    announcement_title: "Title",
    announcement_content: "Content",
    announcement_type: "Type",
    announcement_priority: "Priority",
    announcement_placement: "Placement",
    announcement_status: "Status",
    announcement_audience: "Target Audience",
    high_priority: "High",
    medium_priority: "Medium",
    low_priority: "Low",
    banner_top: "Top Banner",
    banner_bottom: "Bottom Banner",
    popup_modal: "Popup Modal",
    in_feed: "In Feed",
    sidebar: "Sidebar",
    all_users: "All Users",
    buyers_only: "Buyers Only",
    sellers_only: "Sellers Only",
    premium_users: "Premium Users",
    announcement_performance: "Performance Metrics",
    impressions: "Impressions",
    clicks: "Clicks",
    click_rate: "Click Rate",
    conversion_rate: "Conversion Rate",
    edit_announcement: "Edit Announcement",
    delete_announcement: "Delete Announcement",
    publish_announcement: "Publish",
    unpublish_announcement: "Unpublish",
    schedule_announcement: "Schedule",
    announcement_analytics: "Analytics",
    start_date: "Start Date",
    end_date: "End Date",
    scheduled: "Scheduled",
    published: "Published",
    unpublished: "Unpublished",
    expired: "Expired",
    average: "Average",
    total: "Total",
    announcements: "Announcements",
    
    // Payment Providers
    payment_providers: "Payment Providers",
    provider_management: "Provider Management",
    add_provider: "Add Provider",
    provider_name: "Provider Name",
    provider_type: "Provider Type",
    provider_status: "Status",
    integration_status: "Integration Status",
    transaction_fee: "Transaction Fee",
    monthly_volume: "Monthly Volume",
    success_rate: "Success Rate",
    enable_provider: "Enable",
    disable_provider: "Disable",
    configure_provider: "Configure",
    test_integration: "Test Integration",
    view_transactions: "View Transactions",
    credit_card: "Credit Card",
    debit_card: "Debit Card",
    digital_wallet: "Digital Wallet",
    bank_transfer: "Bank Transfer",
    buy_now_pay_later: "Buy Now Pay Later",
    mada_card: "Mada Card",
    apple_pay: "Apple Pay",
    google_pay: "Google Pay",
    stc_pay: "STC Pay",
    saudi_payments: "Saudi Payments",
    visa_mastercard: "Visa/Mastercard",
    payment_statistics: "Payment Statistics",
    total_transactions: "Total Transactions",
    total_volume: "Total Volume",
    average_success_rate: "Average Success Rate",
    provider_fees: "Provider Fees",
    integration_complete: "Integration Complete",
    integration_pending: "Integration Pending",
    integration_failed: "Integration Failed",
    enabled: "Enabled",
    disabled: "Disabled",
    testing: "Testing",
    provider_performance: "Provider Performance",
    
    // Shipping Providers
    shipping_providers: "Shipping Providers",
    courier_management: "Courier Management",
    add_courier: "Add Courier",
    courier_name: "Courier Name",
    courier_type: "Service Type",
    service_areas: "Service Areas",
    delivery_time: "Delivery Time",
    shipping_cost: "Shipping Cost",
    coverage_area: "Coverage Area",
    tracking_available: "Tracking Available",
    cod_available: "Cash on Delivery",
    express_delivery: "Express Delivery",
    standard_delivery: "Standard Delivery",
    same_day_delivery: "Same Day Delivery",
    next_day_delivery: "Next Day Delivery",
    aramex: "Aramex",
    smsa: "SMSA Express",
    fedex: "FedEx",
    dhl: "DHL Express",
    local_courier: "Local Courier",
    nationwide: "Nationwide",
    major_cities: "Major Cities",
    riyadh_jeddah: "Riyadh & Jeddah",
    eastern_province: "Eastern Province",
    courier_statistics: "Shipping Statistics",
    total_shipments: "Total Shipments",
    on_time_delivery: "On-Time Delivery",
    average_delivery_time: "Average Delivery Time",
    shipping_volume: "Shipping Volume",
    courier_performance: "Courier Performance",
    configure_courier: "Configure Courier",
    test_api: "Test API",
    view_shipments: "View Shipments",
    delivery_zones: "Delivery Zones",
    pricing_tiers: "Pricing Tiers",
    weight_based: "Weight Based",
    distance_based: "Distance Based",
    zone_based: "Zone Based",
    days: "Days",
    
    // Support Center
    support_center: "Support Center",
    support_management: "Support Management",
    ticket_management: "Ticket Management",
    create_ticket: "Create Ticket",
    ticket_id: "Ticket ID",
    ticket_subject: "Subject",
    ticket_description: "Description",
    ticket_priority: "Priority",
    ticket_status: "Status",
    ticket_category: "Category",
    assigned_agent: "Assigned Agent",
    customer_name: "Customer Name",
    response_time: "Response Time",
    resolution_time: "Resolution Time",
    open_tickets: "Open Tickets",
    closed_tickets: "Closed Tickets",
    in_progress_tickets: "In Progress",
    escalated_tickets: "Escalated",
    assign_ticket: "Assign Ticket",
    close_ticket: "Close Ticket",
    escalate_ticket: "Escalate",
    reply_ticket: "Reply",
    ticket_general: "General Inquiry",
    ticket_technical: "Technical Issue",
    ticket_billing: "Billing",
    ticket_account: "Account",
    ticket_product: "Product Issue",
    ticket_shipping: "Shipping",
    sla_status: "SLA Status",
    within_sla: "Within SLA",
    sla_warning: "SLA Warning",
    sla_breached: "SLA Breached",
    agent_performance: "Agent Performance",
    avg_response_time: "Avg Response Time",
    avg_resolution_time: "Avg Resolution Time",
    tickets_resolved: "Tickets Resolved",
    customer_satisfaction: "Customer Satisfaction",
    support_statistics: "Support Statistics",
    first_response_sla: "First Response SLA",
    resolution_sla: "Resolution SLA",
    escalation_rate: "Escalation Rate",
    satisfaction_rate: "Satisfaction Rate",
    paid: "Paid",
    pending: "Pending",
    failed: "Failed",
    overdue: "Overdue",
    subscription_status: "Subscription Status",
    active: "Active",
    cancelled: "Cancelled",
    expired: "Expired",
    trial: "Trial",
    delinquent_accounts: "Delinquent Accounts",
    payment_retry: "Payment Retry",
    send_invoice: "Send Invoice",
    suspend_account: "Suspend Account",
    tax_invoicing: "Tax Invoicing",
    saudi_vat: "Saudi VAT (15%)",
    invoice_number: "Invoice Number",
    issue_date: "Issue Date",
    due_date: "Due Date",

    // Moderation
    content_queue: "Content queue",
    seller_queue: "Seller queue",
    ugc_queue: "UGC Queue",
    live_queue: "Live Sessions",
    reported_item: "Reported item",
    type: "Type",
    risk: "Risk",
    reporter: "Reporter",
    time: "Time",
    approve: "Approve",
    reject: "Reject",
    suspend: "Suspend",
    reinstate: "Reinstate",
    product: "Product",
    creator: "Creator",
    message: "Message",
    ugc_post: "UGC Post",
    live_stream: "Live Stream",
    active: "Active",
    suspended: "Suspended",
    view_details: "View Details",
    take_action: "Take Action",
    escalate: "Escalate",
    content_details: "Content Details",
    moderation_history: "Moderation History",
    live_session_control: "Live Session Control",

    // Creator Management
    creators: "Creators",
    creator_applications: "Creator Applications", 
    active_creators: "Active Creators",
    creator_onboarding: "Creator Onboarding",
    applications: "Applications",
    pending: "Pending",
    approved: "Approved",
    under_review: "Under Review",
    followers: "Followers",
    category: "Category",
    applied_date: "Applied Date",
    documents: "Documents",
    tier: "Tier",
    performance: "Performance",
    total_sales: "Total Sales",
    products_listed: "Products Listed",
    live_sessions: "Live Sessions",
    avg_rating: "Avg Rating",
    creator_stats: "Creator Stats",
    onboard_creator: "Onboard Creator",
    verify_documents: "Verify Documents",
    creator_profile: "Creator Profile",

    // Live Commerce Operations
    live_commerce: "Live Commerce",
    active_sessions: "Active Sessions", 
    scheduled_sessions: "Scheduled Sessions",
    session_history: "Session History",
    live_operations: "Live Operations",
    session_title: "Session Title",
    viewers: "Viewers",
    duration: "Duration",
    revenue: "Revenue", 
    emergency_stop: "Emergency Stop",
    session_details: "Session Details",
    chat_moderation: "Chat Moderation",
    technical_support: "Technical Support",
    stream_quality: "Stream Quality",
    end_session: "End Session",
    live_session_details: "Live Session Details",
    peak_viewers: "Peak Viewers",
    conversion_rate: "Conversion Rate",
    avg_view_time: "Avg View Time",
    moderate_chat: "Moderate Chat",
    total_messages: "Total Messages",
    flagged_messages: "Flagged Messages",
    active_viewers: "Active Viewers",
    live_chat_feed: "Live Chat Feed",
    enable_slow_mode: "Enable Slow Mode",
    pause_chat: "Pause Chat",
    chat_messages: "Chat Messages",

    // Orders
    id: "ID",
    customer: "Customer",
    items: "Items",
    total: "Total",
    placed: "Placed",
    paid: "Paid",
    fulfilled: "Fulfilled",
    delivered: "Delivered",
    refund: "Refund",
    mark_paid: "Mark paid",
    mark_fulfilled: "Mark fulfilled",
    mark_delivered: "Mark delivered",

    // Support
    support_center: "Support center",
    inbox: "Inbox",
    reply: "Reply",
    assign: "Assign",
    unassigned: "Unassigned",
    priority: "Priority",
    high: "High",
    normal: "Normal",
    low: "Low",
    ticket: "Ticket",

    // Settings
    settings_title: "Settings",
    language: "Language",
    theme: "Theme",
    pdpl_logging: "PDPL logging",
    feature_flags: "Feature flags",
    flag_live: "Live shopping",
    flag_ai: "AI add-ons",
    flag_wallet: "Wallet-first checkout",
    data_export: "Data export",
    reset_demo: "Reset demo",

    // Header actions
    impersonate: "Impersonate",
    create_notice: "Create notice",
    notice_title: "Global notice",
    notice_body: "Message",
    post_notice: "Post",
    sheet_default_title: "Sheet",
    impersonating: "Impersonating",
    
    // HTML hardcoded strings
    high_contrast: "High Contrast",
    impersonate_btn: "Impersonate",
    create_notice_btn: "+ Notice",
    reset_btn: "Reset",
    settings_btn: "Settings",
    create_global_notice: "Create global notice",
    reset_demo_data: "Reset demo data",
    posted: "Posted",
  },

  ar: {
    nav_overview: "نظرة عامة",
    nav_creators: "المبدعون",
    nav_live: "التجارة المباشرة",
    nav_moderation: "إشراف المحتوى",
    content_moderation: "إشراف المحتوى",
    moderation_statistics: "إحصائيات الإشراف",
    pending_reviews: "المراجعات المعلقة",
    approved_today: "المعتمد اليوم",
    rejected_today: "المرفوض اليوم",
    auto_moderation_rate: "معدل الإشراف التلقائي",
    content_queue: "قائمة انتظار المحتوى",
    all_content: "جميع المحتوى",
    posts: "المنشورات",
    comments: "التعليقات",
    livestreams: "البث المباشر",
    products: "المنتجات",
    all_priorities: "جميع الأولويات",
    author: "المؤلف",
    submitted: "مُرسل",
    flagged_for: "مُعلم بسبب",
    approve: "اعتماد",
    request_changes: "طلب تغييرات",
    reject: "رفض",
    view_details: "عرض التفاصيل",
    auto_moderation_rules: "قواعد الإشراف التلقائي",
    create_rule: "إنشاء قاعدة",
    criteria: "المعايير",
    action: "الإجراء",
    triggered: "مُفعل",
    times_this_week: "مرات هذا الأسبوع",
    edit: "تعديل",
    delete: "حذف",
    action_taken: "الإجراء المتخذ",
    reason: "السبب",
    date: "التاريخ",
    moderator: "المشرف",
    inappropriate_content: "محتوى غير مناسب",
    spam: "رسائل مزعجة",
    copyright_violation: "انتهاك حقوق الطبع",
    harassment: "مضايقة",
    false_information: "معلومات خاطئة",
    auto_approve: "اعتماد تلقائي",
    auto_reject: "رفض تلقائي",
    flag_for_review: "وضع علامة للمراجعة",
    approved: "معتمد",
    rejected: "مرفوض",
    content_approved_success: "تم اعتماد المحتوى #{contentId} بنجاح",
    content_rejected_success: "تم رفض المحتوى #{contentId}",
    changes_requested_success: "تم طلب تغييرات للمحتوى #{contentId}",
    rejection_reason_prompt: "يرجى تقديم سبب الرفض:",
    requested_changes_prompt: "يرجى تحديد التغييرات المطلوبة:",
    content_details: "تفاصيل المحتوى",
    content_information: "معلومات المحتوى",
    content_preview: "معاينة المحتوى",
    flagged_reasons: "أسباب وضع العلامة",
    close: "إغلاق",
    create_moderation_rule: "إنشاء قاعدة إشراف",
    rule_name: "اسم القاعدة",
    rule_created_success: "تم إنشاء قاعدة الإشراف بنجاح",
    rule_status_updated: "تم تحديث حالة القاعدة إلى {status}",
    enabled: "مفعل",
    disabled: "معطل",
    edit_rule_functionality: "ستفتح وظيفة تعديل القاعدة هنا",
    confirm_delete_rule: "هل أنت متأكد من حذف هذه القاعدة؟",
    creator_management: "إدارة المبدعين",
    creator_statistics: "إحصائيات المبدعين",
    total_creators: "إجمالي المبدعين",
    pending_applications: "الطلبات المعلقة",
    verified_creators: "المبدعون المعتمدون",
    suspended_creators: "المبدعون المعلقون",
    all_applications: "جميع الطلبات",
    new_seller: "بائع جديد",
    verification_request: "طلب التحقق",
    reactivation_request: "طلب إعادة التفعيل",
    new_application: "طلب جديد",
    verification_application: "طلب التحقق",
    reactivation_application: "طلب إعادة التفعيل",
    followers: "المتابعون",
    experience: "الخبرة",
    years: "سنوات",
    products_planned: "المنتجات المخططة",
    submitted_documents: "المستندات المقدمة",
    national_id: "الهوية الوطنية",
    business_license: "الرخصة التجارية",
    tax_certificate: "شهادة الضريبة",
    bank_details: "تفاصيل البنك",
    verified: "معتمد",
    pending: "معلق",
    approve: "اعتماد",
    request_documents: "طلب مستندات",
    view_details: "عرض التفاصيل",
    active_creators: "المبدعون النشطون",
    all_statuses: "جميع الحالات",
    active: "نشط",
    warning: "تحذير",
    suspended: "معلق",
    all_categories: "جميع الفئات",
    creator: "المبدع",
    category: "الفئة",
    status: "الحالة",
    products: "المنتجات",
    revenue_30d: "الإيرادات (30 يوم)",
    performance_score: "نقاط الأداء",
    view: "عرض",
    suspend: "تعليق",
    reactivate: "إعادة تفعيل",
    performance_analytics: "تحليلات الأداء",
    top_performing_creators: "أفضل المبدعين أداءً",
    revenue: "الإيرادات",
    application_approved_success: "تم اعتماد الطلب #{appId} بنجاح",
    application_rejected_success: "تم رفض الطلب #{appId}",
    documents_requested_success: "تم طلب مستندات إضافية للطلب #{appId}",
    request_documents_prompt: "يرجى تحديد المستندات المطلوبة:",
    application_details: "تفاصيل الطلب",
    creator_information: "معلومات المبدع",
    document_verification: "التحقق من المستندات",
    verify: "تحقق",
    approve_application: "اعتماد الطلب",
    reject_application: "رفض الطلب",
    creator_profile: "ملف المبدع",
    suspension_reason_prompt: "يرجى تقديم سبب التعليق:",
    confirm_reactivate_creator: "هل أنت متأكد من إعادة تفعيل هذا المبدع؟",
    creator_suspended_success: "تم تعليق المبدع #{creatorId} بنجاح",
    creator_reactivated_success: "تم إعادة تفعيل المبدع #{creatorId} بنجاح",
    edit_creator_functionality: "ستفتح وظيفة تعديل المبدع هنا",
    risk_fraud_detection: "كشف المخاطر والاحتيال",
    risk_overview: "نظرة عامة على المخاطر",
    active_fraud_alerts: "تنبيهات الاحتيال النشطة",
    suspicious_transactions: "المعاملات المشبوهة",
    amount_blocked: "المبلغ المحظور",
    detection_accuracy: "دقة الكشف",
    all_alerts: "جميع التنبيهات",
    payment_fraud: "احتيال الدفع",
    account_fraud: "احتيال الحساب",
    return_abuse: "إساءة الإرجاع",
    identity_theft: "سرقة الهوية",
    all_risk_levels: "جميع مستويات المخاطر",
    critical_risk: "مخاطر حرجة",
    high_risk: "مخاطر عالية",
    medium_risk: "مخاطر متوسطة",
    low_risk: "مخاطر منخفضة",
    account: "الحساب",
    amount: "المبلغ",
    detected_at: "تم الكشف في",
    confidence_score: "درجة الثقة",
    fraud_indicators: "مؤشرات الاحتيال",
    confirm_fraud: "تأكيد الاحتيال",
    mark_legitimate: "وضع علامة شرعي",
    investigate: "تحقيق",
    fraud_detection_rules: "قواعد كشف الاحتيال",
    conditions: "الشروط",
    times_this_month: "مرات هذا الشهر",
    accuracy: "الدقة",
    transaction_monitoring: "مراقبة المعاملات",
    transaction_id: "معرف المعاملة",
    risk_score: "درجة المخاطر",
    payment_method: "طريقة الدفع",
    location: "الموقع",
    review: "مراجعة",
    block: "حظر",
    account_security_monitoring: "مراقبة أمان الحساب",
    login_anomaly: "نشاط تسجيل دخول غير عادي",
    password_breach: "تم اكتشاف اختراق كلمة المرور",
    device_new: "تسجيل دخول من جهاز جديد",
    high: "عالي",
    medium: "متوسط",
    critical: "حرج",
    nav_orders: "الطلبات",
    nav_support: "الدعم",
    nav_settings: "الإعدادات",

    demo: "تجريبي",
    search: "ابحث…",
    start: "ابدأ",
    save: "حفظ",
    back: "رجوع",
    cancel: "إلغاء",
    create: "إنشاء",
    delete: "حذف",
    edit: "تعديل",
    export: "تصدير",
    download: "تنزيل",
    open: "فتح",
    status: "الحالة",
    actions: "الإجراءات",

    revenue: "الإيراد",
    orders: "الطلبات",
    aov: "متوسط الطلب",
    users: "المستخدمون",
    creators: "المبدعون",
    sellers: "البائعون",
    growth: "النمو",
    open_tickets: "التذاكر المفتوحة",
    open_reports: "البلاغات المفتوحة",
    incidents: "الحوادث",
    uptime: "التوافر",
    
    // Enhanced Overview Arabic
    platform_metrics: "مؤشرات المنصة",
    total_users: "إجمالي المستخدمين",
    active_sellers: "البائعون النشطون",
    monthly_revenue: "الإيراد الشهري",
    system_uptime: "توفر النظام",
    this_month: "هذا الشهر",
    target: "الهدف",
    total: "إجمالي",
    sla_metrics: "مؤشرات اتفاقية مستوى الخدمة",
    support_response_time: "وقت الاستجابة للدعم",
    ticket_resolution_time: "وقت حل التذاكر",
    seller_approval_time: "وقت موافقة البائعين",
    content_moderation_time: "وقت إشراف المحتوى",
    good: "جيد",
    excellent: "ممتاز",
    warning: "تحذير",
    critical: "حرج",
    pending_tasks: "المهام المعلقة",
    seller_approval: "موافقات البائعين",
    content_review: "مراجعة المحتوى",
    support_tickets: "تذاكر الدعم",
    payment_disputes: "نزاعات الدفع",
    high: "عالي",
    medium: "متوسط",
    low: "منخفض",
    quick_actions: "إجراءات سريعة",
    
    // Billing & Subscriptions Arabic
    nav_billing: "الفوترة",
    billing_subscriptions: "الفوترة والاشتراكات",
    subscription_plans: "خطط الاشتراك",
    plan_basic: "الخطة الأساسية",
    plan_standard: "الخطة المعيارية",
    plan_premium: "الخطة المميزة",
    monthly_price: "السعر الشهري",
    annual_price: "السعر السنوي",
    features: "الميزات",
    subscribers: "المشتركون",
    revenue: "الإيراد",
    create_plan: "إنشاء خطة",
    edit_plan: "تعديل الخطة",
    plan_details: "تفاصيل الخطة",
    billing_history: "تاريخ الفوترة",
    payment_status: "حالة الدفع",
    paid: "مدفوع",
    pending: "معلق",
    failed: "فاشل",
    overdue: "متأخر",
    subscription_status: "حالة الاشتراك",
    active: "نشط",
    cancelled: "ملغي",
    expired: "منتهي",
    trial: "تجريبي",
    delinquent_accounts: "الحسابات المتعثرة",
    payment_retry: "إعادة محاولة الدفع",
    send_invoice: "إرسال فاتورة",
    suspend_account: "تعليق الحساب",
    all: "الكل",
    from_date: "من تاريخ", 
    to_date: "إلى تاريخ",
    invoice_number: "رقم الفاتورة",
    customer: "العميل",
    plan_name: "اسم الخطة",
    amount: "المبلغ",
    issue_date: "تاريخ الإصدار",
    due_date: "تاريخ الاستحقاق",
    actions: "الإجراءات",
    view: "عرض",
    overdue_days: "أيام التأخير",
    last_payment: "آخر دفعة",
    send_reminder: "إرسال تذكير", 
    tax_invoicing: "الضرائب والفوترة",
    saudi_vat: "ضريبة القيمة المضافة السعودية (15%)",
    total_invoices: "إجمالي الفواتير",
    this_month: "هذا الشهر",
    generate_tax_report: "إنشاء تقرير ضريبي",
    download_vat_report: "تحميل تقرير ضريبة القيمة المضافة",
    
    // AI Add-ons Catalog Arabic
    ai_catalog: "كتالوج الإضافات الذكية",
    ai_addons_marketplace: "سوق الإضافات الذكية",
    add_new_addon: "إضافة جديدة",
    addon_name: "اسم الإضافة",
    addon_category: "الفئة",
    addon_price: "السعر",
    addon_status: "الحالة",
    addon_subscribers: "المشتركون",
    addon_revenue: "الإيراد",
    active: "نشط",
    inactive: "غير نشط",
    draft: "مسودة",
    edit_addon: "تعديل الإضافة",
    view_details: "عرض التفاصيل",
    enable_addon: "تفعيل",
    disable_addon: "إلغاء تفعيل",
    delete_addon: "حذف",
    ai_category_analytics: "التحليلات والرؤى",
    ai_category_automation: "الأتمتة",
    ai_category_content: "إنتاج المحتوى",
    ai_category_customer: "دعم العملاء",
    ai_category_marketing: "أدوات التسويق",
    ai_category_inventory: "إدارة المخزون",
    ai_category_recommendations: "التوصيات",
    ai_category_translation: "الترجمة",
    entitlements_management: "إدارة الصلاحيات",
    seller_entitlements: "صلاحيات البائعين",
    assign_entitlement: "تعيين صلاحية",
    revoke_entitlement: "إلغاء صلاحية",
    entitlement_status: "حالة الصلاحية",
    entitlement_date: "تاريخ التعيين",
    expires_on: "تنتهي في",
    unlimited: "غير محدود",
    usage_limits: "حدود الاستخدام",
    monthly_quota: "الحصة الشهرية",
    total_usage: "إجمالي الاستخدام",
    pricing_tiers: "مستويات التسعير",
    tier_basic: "المستوى الأساسي",
    tier_professional: "المستوى المهني",
    tier_enterprise: "مستوى المؤسسات",
    feature_configuration: "إعداد الميزات",
    api_access: "الوصول إلى API",
    premium_support: "الدعم المميز",
    custom_branding: "العلامة التجارية المخصصة",
    advanced_analytics: "التحليلات المتقدمة",
    search: "بحث",
    seller_name: "اسم البائع",
    
    // Announcements Admin Arabic
    announcements_admin: "إدارة الإعلانات",
    announcement_management: "إدارة الإعلانات",
    create_announcement: "إنشاء إعلان",
    announcement_title: "العنوان",
    announcement_content: "المحتوى",
    announcement_type: "النوع",
    announcement_priority: "الأولوية",
    announcement_placement: "المكان",
    announcement_status: "الحالة",
    announcement_audience: "الجمهور المستهدف",
    high_priority: "عالية",
    medium_priority: "متوسطة",
    low_priority: "منخفضة",
    banner_top: "بانر علوي",
    banner_bottom: "بانر سفلي",
    popup_modal: "نافذة منبثقة",
    in_feed: "في التغذية",
    sidebar: "الشريط الجانبي",
    all_users: "جميع المستخدمين",
    buyers_only: "المشترون فقط",
    sellers_only: "البائعون فقط",
    premium_users: "المستخدمون المميزون",
    announcement_performance: "مقاييس الأداء",
    impressions: "مرات الظهور",
    clicks: "النقرات",
    click_rate: "معدل النقر",
    conversion_rate: "معدل التحويل",
    edit_announcement: "تعديل الإعلان",
    delete_announcement: "حذف الإعلان",
    publish_announcement: "نشر",
    unpublish_announcement: "إلغاء النشر",
    schedule_announcement: "جدولة",
    announcement_analytics: "التحليلات",
    start_date: "تاريخ البداية",
    end_date: "تاريخ النهاية",
    scheduled: "مجدول",
    published: "منشور",
    unpublished: "غير منشور",
    expired: "منتهي الصلاحية",
    average: "متوسط",
    total: "إجمالي",
    announcements: "إعلانات",
    
    // Payment Providers Arabic
    payment_providers: "مقدمي الدفع",
    provider_management: "إدارة مقدمي الخدمة",
    add_provider: "إضافة مقدم خدمة",
    provider_name: "اسم مقدم الخدمة",
    provider_type: "نوع الخدمة",
    provider_status: "حالة الخدمة",
    integration_status: "حالة التكامل",
    transaction_fee: "رسوم المعاملة",
    monthly_volume: "الحجم الشهري",
    success_rate: "معدل النجاح",
    enable_provider: "تفعيل",
    disable_provider: "إلغاء تفعيل",
    configure_provider: "إعداد",
    test_integration: "اختبار التكامل",
    view_transactions: "عرض المعاملات",
    credit_card: "بطاقة ائتمان",
    debit_card: "بطاقة مدين",
    digital_wallet: "محفظة رقمية",
    bank_transfer: "تحويل مصرفي",
    buy_now_pay_later: "اشتري الآن وادفع لاحقاً",
    mada_card: "بطاقة مدى",
    apple_pay: "آبل باي",
    google_pay: "جوجل باي",
    stc_pay: "STC Pay",
    saudi_payments: "المدفوعات السعودية",
    visa_mastercard: "فيزا/ماستركارد",
    payment_statistics: "إحصائيات الدفع",
    total_transactions: "إجمالي المعاملات",
    total_volume: "إجمالي الحجم",
    average_success_rate: "متوسط معدل النجاح",
    provider_fees: "رسوم مقدمي الخدمة",
    integration_complete: "التكامل مكتمل",
    integration_pending: "التكامل معلق",
    integration_failed: "فشل التكامل",
    enabled: "مفعل",
    disabled: "معطل",
    testing: "اختبار",
    provider_performance: "أداء مقدمي الخدمة",
    
    // Shipping Providers Arabic
    shipping_providers: "شركات الشحن",
    courier_management: "إدارة شركات التوصيل",
    add_courier: "إضافة شركة توصيل",
    courier_name: "اسم شركة التوصيل",
    courier_type: "نوع الخدمة",
    service_areas: "مناطق الخدمة",
    delivery_time: "وقت التوصيل",
    shipping_cost: "تكلفة الشحن",
    coverage_area: "منطقة التغطية",
    tracking_available: "تتبع الشحنات",
    cod_available: "الدفع عند الاستلام",
    express_delivery: "توصيل سريع",
    standard_delivery: "توصيل عادي",
    same_day_delivery: "توصيل نفس اليوم",
    next_day_delivery: "توصيل اليوم التالي",
    aramex: "أرامكس",
    smsa: "SMSA إكسبريس",
    fedex: "فيدكس",
    dhl: "DHL إكسبريس",
    local_courier: "شركة توصيل محلية",
    nationwide: "على مستوى المملكة",
    major_cities: "المدن الرئيسية",
    riyadh_jeddah: "الرياض وجدة",
    eastern_province: "المنطقة الشرقية",
    courier_statistics: "إحصائيات الشحن",
    total_shipments: "إجمالي الشحنات",
    on_time_delivery: "التوصيل في الوقت المحدد",
    average_delivery_time: "متوسط وقت التوصيل",
    shipping_volume: "حجم الشحن",
    courier_performance: "أداء شركات التوصيل",
    configure_courier: "إعداد شركة التوصيل",
    test_api: "اختبار API",
    view_shipments: "عرض الشحنات",
    delivery_zones: "مناطق التوصيل",
    pricing_tiers: "مستويات التسعير",
    weight_based: "حسب الوزن",
    distance_based: "حسب المسافة",
    zone_based: "حسب المنطقة",
    days: "أيام",
    
    // Support Center Arabic
    support_center: "مركز الدعم",
    support_management: "إدارة الدعم",
    ticket_management: "إدارة التذاكر",
    create_ticket: "إنشاء تذكرة",
    ticket_id: "رقم التذكرة",
    ticket_subject: "الموضوع",
    ticket_description: "الوصف",
    ticket_priority: "الأولوية",
    ticket_status: "الحالة",
    ticket_category: "الفئة",
    assigned_agent: "الوكيل المكلف",
    customer_name: "اسم العميل",
    response_time: "وقت الاستجابة",
    resolution_time: "وقت الحل",
    open_tickets: "التذاكر المفتوحة",
    closed_tickets: "التذاكر المغلقة",
    in_progress_tickets: "قيد المعالجة",
    escalated_tickets: "مصعدة",
    assign_ticket: "تعيين تذكرة",
    close_ticket: "إغلاق تذكرة",
    escalate_ticket: "تصعيد",
    reply_ticket: "رد",
    ticket_general: "استفسار عام",
    ticket_technical: "مشكلة تقنية",
    ticket_billing: "فوترة",
    ticket_account: "حساب",
    ticket_product: "مشكلة منتج",
    ticket_shipping: "شحن",
    sla_status: "حالة SLA",
    within_sla: "ضمن SLA",
    sla_warning: "تحذير SLA",
    sla_breached: "انتهاك SLA",
    agent_performance: "أداء الوكلاء",
    avg_response_time: "متوسط وقت الاستجابة",
    avg_resolution_time: "متوسط وقت الحل",
    tickets_resolved: "التذاكر المحلولة",
    customer_satisfaction: "رضا العملاء",
    support_statistics: "إحصائيات الدعم",
    first_response_sla: "SLA الاستجابة الأولى",
    resolution_sla: "SLA الحل",
    escalation_rate: "معدل التصعيد",
    satisfaction_rate: "معدل الرضا",
    tax_invoicing: "الفوترة الضريبية",
    saudi_vat: "ضريبة القيمة المضافة السعودية (15%)",
    invoice_number: "رقم الفاتورة",
    issue_date: "تاريخ الإصدار",
    due_date: "تاريخ الاستحقاق",

    content_queue: "قائمة المحتوى",
    seller_queue: "قائمة البائعين",
    ugc_queue: "قائمة المحتوى المُنشأ",
    live_queue: "الجلسات المباشرة",
    reported_item: "عنصر مُبلغ عنه",
    type: "النوع",
    risk: "المخاطر",
    reporter: "المبلّغ",
    time: "الوقت",
    approve: "موافقة",
    reject: "رفض",
    suspend: "إيقاف",
    reinstate: "إعادة تفعيل",
    product: "منتج",
    creator: "مبدع",
    message: "رسالة",
    ugc_post: "منشور مُنشأ",
    live_stream: "بث مباشر",
    active: "نشط",
    suspended: "موقوف",
    view_details: "عرض التفاصيل",
    take_action: "اتخاذ إجراء",
    escalate: "تصعيد",
    content_details: "تفاصيل المحتوى",
    moderation_history: "تاريخ الإشراف",
    live_session_control: "التحكم في الجلسة المباشرة",

    // Creator Management
    creator_applications: "طلبات المبدعين",
    active_creators: "المبدعون النشطون",
    creator_onboarding: "إدراج المبدعين",
    applications: "الطلبات",
    pending: "قيد الانتظار",
    approved: "موافق عليه",
    under_review: "قيد المراجعة",
    followers: "المتابعون",
    category: "الفئة",
    applied_date: "تاريخ التقديم",
    documents: "المستندات",
    tier: "المستوى",
    performance: "الأداء",
    total_sales: "إجمالي المبيعات",
    products_listed: "المنتجات المدرجة",
    live_sessions: "الجلسات المباشرة",
    avg_rating: "متوسط التقييم",
    creator_stats: "إحصائيات المبدعين",
    onboard_creator: "إدراج مبدع",
    verify_documents: "التحقق من المستندات",
    creator_profile: "ملف المبدع",

    // Live Commerce Operations
    live_commerce: "التجارة المباشرة",
    active_sessions: "الجلسات النشطة",
    scheduled_sessions: "الجلسات المجدولة", 
    session_history: "تاريخ الجلسات",
    live_operations: "العمليات المباشرة",
    session_title: "عنوان الجلسة",
    viewers: "المشاهدون",
    duration: "المدة",
    emergency_stop: "إيقاف طارئ",
    session_details: "تفاصيل الجلسة", 
    chat_moderation: "إشراف الدردشة",
    technical_support: "الدعم التقني",
    stream_quality: "جودة البث",
    end_session: "إنهاء الجلسة",
    live_session_details: "تفاصيل الجلسة المباشرة",
    peak_viewers: "ذروة المشاهدين",
    conversion_rate: "معدل التحويل",
    avg_view_time: "متوسط وقت المشاهدة",
    moderate_chat: "إشراف الدردشة",
    total_messages: "إجمالي الرسائل",
    flagged_messages: "الرسائل المبلغ عنها",
    active_viewers: "المشاهدون النشطون",
    live_chat_feed: "تغذية الدردشة المباشرة",
    enable_slow_mode: "تفعيل الوضع البطيء",
    pause_chat: "إيقاف الدردشة مؤقتاً",
    chat_messages: "رسائل الدردشة",

    id: "المعرف",
    customer: "العميل",
    items: "المنتجات",
    total: "الإجمالي",
    placed: "تم الإنشاء",
    paid: "مدفوع",
    fulfilled: "تم التجهيز",
    delivered: "تم التسليم",
    refund: "استرداد",
    mark_paid: "تحديد كمدفوع",
    mark_fulfilled: "تحديد كمجهز",
    mark_delivered: "تحديد كمسلّم",

    support_center: "مركز الدعم",
    inbox: "الوارد",
    reply: "رد",
    assign: "تعيين",
    unassigned: "غير مُعيّن",
    priority: "الأولوية",
    high: "عالية",
    normal: "عادية",
    low: "منخفضة",
    ticket: "تذكرة",

    settings_title: "الإعدادات",
    language: "اللغة",
    theme: "السِّمات",
    pdpl_logging: "سجل نظام حماية البيانات السعودي",
    feature_flags: "خصائص تجريبية",
    flag_live: "البث المباشر",
    flag_ai: "إضافات الذكاء",
    flag_wallet: "الدفع بالمحفظة أولًا",
    data_export: "تصدير البيانات",
    reset_demo: "إعادة تعيين العرض",

    impersonate: "انتحال المستخدم",
    create_notice: "إشعار عام",
    notice_title: "إشعار عام",
    notice_body: "الرسالة",
    post_notice: "نشر",
    sheet_default_title: "ورقة",
    impersonating: "انتحال شخصية",
    
    // HTML hardcoded strings
    high_contrast: "تباين عالي",
    impersonate_btn: "انتحال شخصية",
    create_notice_btn: "+ إشعار",
    reset_btn: "إعادة تعيين",
    settings_btn: "الإعدادات",
    create_global_notice: "إنشاء إشعار عام",
    reset_demo_data: "إعادة تعيين بيانات العرض",
    posted: "تم النشر",
  }
};
const LS_LANG = "storez_admin_lang";
function t(k){ const d=I18N[getLang()]||I18N.en; return d[k]??k; }
function getLang(){ return localStorage.getItem(LS_LANG) || "ar"; }
function setLang(lang){
  const l=I18N[lang]?lang:"ar";
  localStorage.setItem(LS_LANG,l);
  document.documentElement.lang = l==="ar"?"ar-SA":"en";
  document.documentElement.dir  = l==="ar"?"rtl":"ltr";
  document.querySelectorAll("[data-i18n]").forEach(el=>{ const k=el.getAttribute("data-i18n"); if(k) el.textContent=t(k); });
}
function isRTL(){ return getLang() === "ar"; }
function fmtCurrency(n, code="SAR"){
  const loc = getLang()==="ar"?"ar-SA":"en";
  return new Intl.NumberFormat(loc,{style:"currency",currency:code,maximumFractionDigits:0}).format(Number(n)||0);
}
const fmtDate = ts => new Date(ts).toLocaleString(getLang()==="ar"?"ar-SA":"en");

/* -------------------- State & persistence -------------------- */
const LS_STATE = "storez_admin_state_v1";
const seed = () => ({
  prefs: { theme: "dark", pdpl: true, flags: { live:true, ai:true, wallet:true } },
  notices: [],
  impersonating: null, // {role:'buyer'|'seller'|'creator', id:'...'}
  metrics: { revenue: 145_200, orders: 1842, aov: 236, users: 420_000, creators: 2_800, sellers: 1_050, growth: 12.4, ticketsOpen: 7, reportsOpen: 5, incidents: 0, uptime: 99.98 },
  creators: {
    applications: [
      {id:"CR001", name:"Sarah Al-Mahmoud", email:"sarah.m@email.com", followers:15400, category:"Fashion", status:"Pending", appliedAt:new Date("2024-12-15").getTime(), documents:["ID","Portfolio"], note:"Strong engagement rate"},
      {id:"CR002", name:"Ahmed Hassan", email:"ahmed.h@email.com", followers:8900, category:"Tech", status:"Approved", appliedAt:new Date("2024-12-10").getTime(), documents:["ID","Portfolio","Contract"], note:"Approved for electronics category"},
      {id:"CR003", name:"Fatima Al-Zahra", email:"fatima.z@email.com", followers:22100, category:"Beauty", status:"Under Review", appliedAt:new Date("2024-12-18").getTime(), documents:["ID"], note:"Pending document verification"}
    ],
    activeCreators: [
      {id:"CR010", name:"Layla Fashion", email:"layla@email.com", followers:45600, totalSales:156780, avgRating:4.8, productsListed:67, liveSessionsMonth:12, status:"Active", tier:"Gold", joinedAt:new Date("2024-08-15").getTime()},
      {id:"CR011", name:"Tech Omar", email:"omar.tech@email.com", followers:31200, totalSales:89340, avgRating:4.6, productsListed:23, liveSessionsMonth:8, status:"Active", tier:"Silver", joinedAt:new Date("2024-09-20").getTime()},
      {id:"CR012", name:"Beauty by Nour", email:"nour.beauty@email.com", followers:67800, totalSales:234560, avgRating:4.9, productsListed:89, liveSessionsMonth:15, status:"Warning", tier:"Platinum", joinedAt:new Date("2024-07-10").getTime()}
    ],
    stats: {
      totalApplications: 47,
      pendingReview: 12,
      approvedThisMonth: 8,
      activeCreators: 156,
      topTier: 23,
      avgApprovalTime: "3.2 days",
      creatorRetention: "87%"
    }
  },
  liveCommerce: {
    activeSessions: [
      {id:"LIVE001", creatorId:"CR010", creatorName:"Layla Fashion", title:"Summer Fashion Haul - Live Shopping", viewers:1247, duration:23, startTime:new Date().getTime()-23*60*1000, status:"Live", products:[{id:"P1",name:"Summer Dress",sales:12,views:890},{id:"P2",name:"Sandals",sales:8,views:567}], revenue:2340, chatMessages:456, moderationFlags:0},
      {id:"LIVE002", creatorId:"CR011", creatorName:"Tech Omar", title:"Latest Gadgets Review & Sale", viewers:892, duration:18, startTime:new Date().getTime()-18*60*1000, status:"Live", products:[{id:"P3",name:"Wireless Earbuds",sales:15,views:623},{id:"P4",name:"Phone Case",sales:23,views:445}], revenue:1890, chatMessages:234, moderationFlags:1},
      {id:"LIVE003", creatorId:"CR012", creatorName:"Beauty by Nour", title:"Skincare Routine Live Demo", viewers:2156, duration:35, startTime:new Date().getTime()-35*60*1000, status:"Live", products:[{id:"P5",name:"Face Serum",sales:45,views:1123},{id:"P6",name:"Moisturizer",sales:38,views:987}], revenue:4520, chatMessages:789, moderationFlags:0}
    ],
    scheduledSessions: [
      {id:"SCHED001", creatorId:"CR010", creatorName:"Layla Fashion", title:"Evening Wear Collection Launch", scheduledTime:new Date().getTime()+2*60*60*1000, estimatedDuration:60, status:"Scheduled", products:12},
      {id:"SCHED002", creatorId:"CR015", creatorName:"Home Decor Hub", title:"Interior Design Tips & Products", scheduledTime:new Date().getTime()+4*60*60*1000, estimatedDuration:45, status:"Scheduled", products:8}
    ],
    recentSessions: [
      {id:"HIST001", creatorId:"CR011", creatorName:"Tech Omar", title:"Holiday Tech Deals", endTime:new Date().getTime()-2*60*60*1000, duration:42, totalViewers:3456, revenue:8940, status:"Completed"},
      {id:"HIST002", creatorId:"CR010", creatorName:"Layla Fashion", title:"Winter Fashion Trends", endTime:new Date().getTime()-6*60*60*1000, duration:38, totalViewers:2890, revenue:6750, status:"Completed"}
    ],
    stats: {
      totalSessionsToday: 8,
      activeSessions: 3,
      totalViewersOnline: 4295,
      revenueToday: 34567,
      averageSessionLength: 42,
      conversionRate: 12.8,
      emergencyStops: 0,
      moderationActions: 2
    }
  },
  moderation: {
    content: [
      rep("ugc1","ugc_post","High","@sara_k","Inappropriate content in product review"),
      rep("ugc2","ugc_post","Medium","@maya_style","Potential fake testimonial"),
      rep("live1","live_stream","High","@techsaudi","Inappropriate behavior during live session"),
      rep("p1","product","Medium","@customer123","Misleading product claims"),
      rep("m7","message","Low","@ali","Spam in creator DMs"),
      rep("c5","creator","Medium","@moh","Copyright infringement in posts"),
      rep("ugc3","ugc_post","Low","@styleuser","Minor content guideline violation"),
      rep("live2","live_stream","Medium","@fashionista","Inappropriate language in live chat")
    ],
    sellers: [
      seller("S-1003","Glow Co.","Active","High risk spike - unusual order patterns"),
      seller("S-1009","PhoneMods","Active","Chargeback wave - investigating"),
      seller("S-1015","StyleHub","Suspended","Multiple UGC policy violations"),
      seller("S-1021","TechGear","Active","Under review for fake reviews")
    ],
    ugcStats: {
      totalPosts: 1247,
      pendingReview: 23,
      approvedToday: 89,
      rejectedToday: 7,
      flaggedContent: 12,
      averageReviewTime: 3.2
    },
    liveStats: {
      activeSessions: 5,
      totalViewers: 2847,
      moderationActions: 12,
      emergencyStops: 0,
      averageSessionLength: 45
    }
  },
  orders: [
    order("A-1001","Maya A.",[{n:"Aura Serum",q:1,p:119}], "Paid"),
    order("A-1002","Saad M.",[{n:"CloudRunner",q:1,p:329}], "Fulfilled"),
    order("A-1003","Lina K.",[{n:"Holo Case",q:2,p:49}], "Placed")
  ],
  tickets: [
    ticket("T-501","Refund request for A-1001","High"),
    ticket("T-502","Address change on A-1003","Normal")
  ],
  pdplLogs: []
});
function rep(id,type,risk,by,reason){ return { id, type, risk, reporter:by, reason, ts: Date.now()-Math.random()*36e5, status:"Open" }; }
function seller(id,name,status, note){ return { id, name, status, note, ts: Date.now()-Math.random()*72e5 }; }
function order(id,customer,items,status="Placed"){ 
  const total = items.reduce((s,i)=>s+i.q*i.p,0);
  return { id, customer, items, total, status, ts: Date.now()-Math.random()*72e5 };
}
function ticket(id,subject,prio="Normal"){ return { id, subject, priority: prio, assignee: null, status:"Open", ts: Date.now()-Math.random()*48e5, thread: [] }; }

let state = load();
function load(){ try{ const raw=localStorage.getItem(LS_STATE); if(raw) return JSON.parse(raw); }catch{} const s=seed(); save(s); return s; }
function save(s=state){ try{ localStorage.setItem(LS_STATE, JSON.stringify(s)); }catch{} }
function reset(){ localStorage.removeItem(LS_STATE); state = seed(); save(); location.reload(); }

/* -------------------- DOM helpers & shell -------------------- */
const qs = (s,el=document)=>el.querySelector(s);
const qsa = (s,el=document)=>Array.from(el.querySelectorAll(s));
function html(strings,...vals){ return String.raw({raw:strings},...vals).trim(); }
function badge(el,n){ if(el) el.textContent=String(n); }
function setActive(path){ qsa("nav.bottom a").forEach(a=>a.classList.toggle("active", a.getAttribute("href")==="#"+path)); }

function showSheet(title, body){
  qs("#sheetTitle").textContent = title || t("sheet_default_title");
  qs("#sheetBody").innerHTML = body || "";
  const sh = qs("#sheet");
  sh.classList.add("show"); sh.setAttribute("aria-hidden","false");
}
function closeSheet(){
  const sh = qs("#sheet");
  sh.classList.remove("show"); sh.setAttribute("aria-hidden","true");
}
window.__closeSheet = closeSheet;
window.hideSheet = closeSheet; // Alias for compatibility

let toastTid=null;
function toast(msg){
  clearTimeout(toastTid);
  let tEl = qs("#_toast");
  if(!tEl){ tEl=document.createElement("div"); tEl.id="_toast"; tEl.className="toast"; document.body.appendChild(tEl); }
  tEl.textContent = msg; tEl.style.display="block";
  toastTid=setTimeout(()=>tEl.style.display="none", 1800);
}

/* -------------------- Routing -------------------- */
const routes = {
  "/overview": renderOverview,
  "/creators": renderCreators,
  "/live": renderLiveCommerce,
  "/content-moderation": renderContentModeration,
  "/creator-management": renderCreatorManagement,
  "/risk": renderRiskManagement,
  "/analytics-platform": renderPlatformAnalytics,
  "/orders": renderOrders,
  "/support": renderSupport,
  "/settings": renderSettings,
  "/billing": renderBilling,
  "/ai-catalog": renderAICatalog,
  "/announcements-admin": renderAnnouncementsAdmin,
  "/providers/payments": renderPaymentProviders,
  "/providers/couriers": renderShippingProviders
};
function parseHash(){
  const h = location.hash.slice(1) || "/overview";
  const parts = h.split("/").filter(Boolean);
  if(parts.length===1) return {path:"/"+parts[0], id:undefined};
  return {path:"/"+parts[0], id:parts[1]};
}
function route(){
  const {path,id} = parseHash();
  const fn = routes[path] || routes["/overview"];
  setActive(path);
  fn(id);
  qs("#view")?.focus();
}
window.addEventListener("hashchange", route);

function navigate(path) {
  location.hash = path;
}

// Make navigate function globally accessible
window.navigate = navigate;

/* -------------------- Views -------------------- */

function renderOverview(){
  const data = getAdminOverviewData();
  
  qs("#view").innerHTML = html`
    <div class="admin-overview" dir="${isRTL() ? 'rtl' : 'ltr'}">
      <!-- Platform Metrics Section -->
      <section class="overview-section">
        <h2 class="section-title">${t("platform_metrics")}</h2>
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-value">${data.platformMetrics.totalUsers.value.toLocaleString()}</div>
            <div class="metric-label">${t("total_users")}</div>
            <div class="metric-change ${data.platformMetrics.totalUsers.change > 0 ? 'positive' : 'negative'}">
              ${data.platformMetrics.totalUsers.change > 0 ? '+' : ''}${data.platformMetrics.totalUsers.change}% ${data.platformMetrics.totalUsers.period}
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-value">${data.platformMetrics.activeSellers.value.toLocaleString()}</div>
            <div class="metric-label">${t("active_sellers")}</div>
            <div class="metric-change positive">
              +${data.platformMetrics.activeSellers.change}% (${data.platformMetrics.activeSellers.total} ${t("total")})
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-value">${fmtCurrency(data.platformMetrics.monthlyRevenue.value)}</div>
            <div class="metric-label">${t("monthly_revenue")}</div>
            <div class="metric-change positive">
              +${data.platformMetrics.monthlyRevenue.change}% ${t("this_month")}
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-value">${data.platformMetrics.systemUptime.value}${data.platformMetrics.systemUptime.unit}</div>
            <div class="metric-label">${t("system_uptime")}</div>
            <div class="metric-change ${data.platformMetrics.systemUptime.value >= data.platformMetrics.systemUptime.target ? 'positive' : 'negative'}">
              ${t("target")}: ${data.platformMetrics.systemUptime.target}%
            </div>
          </div>
        </div>
      </section>

      <!-- SLA Metrics Section -->
      <section class="overview-section">
        <h2 class="section-title">${t("sla_metrics")}</h2>
        <div class="sla-grid">
          <div class="sla-card">
            <div class="sla-header">
              <span class="sla-title">${t("support_response_time")}</span>
              <span class="sla-status status-${data.slaMetrics.supportResponseTime.status}">${t(data.slaMetrics.supportResponseTime.status)}</span>
            </div>
            <div class="sla-progress">
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${(data.slaMetrics.supportResponseTime.current / data.slaMetrics.supportResponseTime.target) * 100}%"></div>
              </div>
              <div class="sla-numbers">
                ${data.slaMetrics.supportResponseTime.current} / ${data.slaMetrics.supportResponseTime.target} ${data.slaMetrics.supportResponseTime.unit}
              </div>
            </div>
          </div>
          
          <div class="sla-card">
            <div class="sla-header">
              <span class="sla-title">${t("ticket_resolution_time")}</span>
              <span class="sla-status status-${data.slaMetrics.ticketResolutionTime.status}">${t(data.slaMetrics.ticketResolutionTime.status)}</span>
            </div>
            <div class="sla-progress">
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${(data.slaMetrics.ticketResolutionTime.current / data.slaMetrics.ticketResolutionTime.target) * 100}%"></div>
              </div>
              <div class="sla-numbers">
                ${data.slaMetrics.ticketResolutionTime.current} / ${data.slaMetrics.ticketResolutionTime.target} ${data.slaMetrics.ticketResolutionTime.unit}
              </div>
            </div>
          </div>
          
          <div class="sla-card">
            <div class="sla-header">
              <span class="sla-title">${t("seller_approval_time")}</span>
              <span class="sla-status status-${data.slaMetrics.sellerApprovalTime.status}">${t(data.slaMetrics.sellerApprovalTime.status)}</span>
            </div>
            <div class="sla-progress">
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${(data.slaMetrics.sellerApprovalTime.current / data.slaMetrics.sellerApprovalTime.target) * 100}%"></div>
              </div>
              <div class="sla-numbers">
                ${data.slaMetrics.sellerApprovalTime.current} / ${data.slaMetrics.sellerApprovalTime.target} ${data.slaMetrics.sellerApprovalTime.unit}
              </div>
            </div>
          </div>
          
          <div class="sla-card">
            <div class="sla-header">
              <span class="sla-title">${t("content_moderation_time")}</span>
              <span class="sla-status status-${data.slaMetrics.contentModerationTime.status}">${t(data.slaMetrics.contentModerationTime.status)}</span>
            </div>
            <div class="sla-progress">
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${(data.slaMetrics.contentModerationTime.current / data.slaMetrics.contentModerationTime.target) * 100}%"></div>
              </div>
              <div class="sla-numbers">
                ${data.slaMetrics.contentModerationTime.current} / ${data.slaMetrics.contentModerationTime.target} ${data.slaMetrics.contentModerationTime.unit}
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Pending Tasks Section -->
      <section class="overview-section">
        <h2 class="section-title">${t("pending_tasks")}</h2>
        <div class="tasks-grid">
          ${data.pendingTasks.map(task => `
            <div class="task-card priority-${task.priority}" onclick="navigate('${task.route}')">
              <div class="task-count">${task.count}</div>
              <div class="task-type">${t(task.type)}</div>
              <div class="task-priority ${task.priority}">${t(task.priority)}</div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Quick Actions Section -->
      <section class="overview-section">
        <h2 class="section-title">${t("quick_actions")}</h2>
        <div class="actions-grid">
          ${data.quickActions.map(action => `
            <button class="action-button" onclick="navigate('${action.route}')">
              <span class="action-icon">${action.icon}</span>
              <span class="action-title">${action.title}</span>
            </button>
          `).join('')}
        </div>
      </section>
    </div>
  `;

  refreshBadges();
}

function renderBilling(){
  const data = getBillingData();
  
  qs("#view").innerHTML = html`
    <div class="billing-dashboard" dir="${isRTL() ? 'rtl' : 'ltr'}">
      <header class="view-header">
        <h1>${t("billing_subscriptions")}</h1>
      </header>

      <!-- Subscription Plans Section -->
      <section class="billing-section">
        <div class="section-header">
          <h2>${t("subscription_plans")}</h2>
          <button class="btn-primary" onclick="createNewPlan()">${t("create_plan")}</button>
        </div>
        
        <div class="plans-grid">
          ${data.plans.map(plan => `
            <div class="plan-card ${plan.featured ? 'featured' : ''}">
              <div class="plan-header">
                <h3>${t(plan.nameKey)}</h3>
                <div class="plan-price">
                  <span class="price-monthly">${fmtCurrency(plan.monthlyPrice)}</span>
                  <span class="price-period">/${t("monthly_price")}</span>
                </div>
                <div class="plan-price-annual">
                  <span class="price-annual">${fmtCurrency(plan.annualPrice)}</span>
                  <span class="price-period">/${t("annual_price")}</span>
                </div>
              </div>
              
              <div class="plan-stats">
                <div class="stat">
                  <span class="stat-value">${plan.subscribers.toLocaleString()}</span>
                  <span class="stat-label">${t("subscribers")}</span>
                </div>
                <div class="stat">
                  <span class="stat-value">${fmtCurrency(plan.monthlyRevenue)}</span>
                  <span class="stat-label">${t("revenue")}</span>
                </div>
              </div>
              
              <div class="plan-features">
                <h4>${t("features")}</h4>
                <ul>
                  ${plan.features.map(feature => `
                    <li>${feature}</li>
                  `).join('')}
                </ul>
              </div>
              
              <div class="plan-actions">
                <button class="btn-secondary small" onclick="editPlan('${plan.id}')">${t("edit_plan")}</button>
                <button class="btn-ghost small" onclick="viewPlanDetails('${plan.id}')">${t("plan_details")}</button>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Billing Overview Section -->
      <section class="billing-section">
        <h2>${t("billing_history")}</h2>
        
        <div class="billing-filters">
          <select id="statusFilter" onchange="filterBillingHistory()">
            <option value="all">${t("all")}</option>
            <option value="paid">${t("paid")}</option>
            <option value="pending">${t("pending")}</option>
            <option value="failed">${t("failed")}</option>
            <option value="overdue">${t("overdue")}</option>
          </select>
          
          <input type="date" id="dateFrom" onchange="filterBillingHistory()" placeholder="${t("from_date")}">
          <input type="date" id="dateTo" onchange="filterBillingHistory()" placeholder="${t("to_date")}">
        </div>

        <div class="billing-table-container">
          <table class="billing-table">
            <thead>
              <tr>
                <th>${t("invoice_number")}</th>
                <th>${t("customer")}</th>
                <th>${t("plan_name")}</th>
                <th>${t("amount")}</th>
                <th>${t("issue_date")}</th>
                <th>${t("due_date")}</th>
                <th>${t("payment_status")}</th>
                <th>${t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              ${data.billingHistory.map(invoice => `
                <tr>
                  <td><strong>${invoice.invoiceNumber}</strong></td>
                  <td>${invoice.customerName}</td>
                  <td>${t(invoice.planNameKey)}</td>
                  <td>${fmtCurrency(invoice.amount)}</td>
                  <td>${fmtDate(invoice.issueDate)}</td>
                  <td>${fmtDate(invoice.dueDate)}</td>
                  <td>
                    <span class="status ${invoice.status}">${t(invoice.status)}</span>
                  </td>
                  <td>
                    <button class="btn-ghost small" onclick="viewInvoice('${invoice.id}')">${t("view")}</button>
                    ${invoice.status === 'pending' || invoice.status === 'failed' ? `
                      <button class="btn-secondary small" onclick="retryPayment('${invoice.id}')">${t("payment_retry")}</button>
                    ` : ''}
                    <button class="btn-ghost small" onclick="sendInvoice('${invoice.id}')">${t("send_invoice")}</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </section>

      <!-- Delinquent Accounts Section -->
      <section class="billing-section">
        <h2>${t("delinquent_accounts")}</h2>
        
        <div class="delinquent-grid">
          ${data.delinquentAccounts.map(account => `
            <div class="delinquent-card priority-${account.priority}">
              <div class="account-header">
                <div class="account-info">
                  <h4>${account.customerName}</h4>
                  <span class="account-id">${account.customerId}</span>
                </div>
                <span class="overdue-amount">${fmtCurrency(account.overdueAmount)}</span>
              </div>
              
              <div class="account-details">
                <div class="detail">
                  <span>${t("overdue_days")}: ${account.overdueDays}</span>
                </div>
                <div class="detail">
                  <span>${t("plan_name")}: ${t(account.planNameKey)}</span>
                </div>
                <div class="detail">
                  <span>${t("last_payment")}: ${fmtDate(account.lastPaymentDate)}</span>
                </div>
              </div>
              
              <div class="account-actions">
                <button class="btn-secondary small" onclick="retryPayment('${account.customerId}')">${t("payment_retry")}</button>
                <button class="btn-ghost small" onclick="sendReminder('${account.customerId}')">${t("send_reminder")}</button>
                <button class="btn-danger small" onclick="suspendAccount('${account.customerId}')">${t("suspend_account")}</button>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Tax Invoicing Section -->
      <section class="billing-section">
        <h2>${t("tax_invoicing")}</h2>
        
        <div class="tax-summary">
          <div class="tax-card">
            <h4>${t("saudi_vat")}</h4>
            <div class="tax-amount">${fmtCurrency(data.taxSummary.vatCollected)}</div>
            <div class="tax-period">${t("this_month")}</div>
          </div>
          
          <div class="tax-card">
            <h4>${t("total_invoices")}</h4>
            <div class="tax-amount">${data.taxSummary.totalInvoices}</div>
            <div class="tax-period">${t("this_month")}</div>
          </div>
          
          <div class="tax-actions">
            <button class="btn-primary" onclick="generateTaxReport()">${t("generate_tax_report")}</button>
            <button class="btn-secondary" onclick="downloadVATReport()">${t("download_vat_report")}</button>
          </div>
        </div>
      </section>
    </div>
  `;

  refreshBadges();
}function renderCreators(){
  const tab = new URLSearchParams(location.hash.split("?")[1]||"").get("tab") || "applications";
  const isApplications = tab==="applications";
  const isActive = tab==="active";
  
  // Enhanced creator application rows with social commerce context
  const applicationRows = state.creators.applications.map(app=>{
    const statusColor = app.status === 'Approved' ? 'paid' : 
                       app.status === 'Pending' ? 'pending' : 'failed';
    const documentsStatus = app.documents.length >= 2 ? '✅' : '⚠️';
    
    return `
      <tr>
        <td data-label="ID"><strong>${app.id}</strong></td>
        <td data-label="${t("creator")}">${app.name}</td>
        <td data-label="${t("followers")}">${app.followers.toLocaleString()}</td>
        <td data-label="${t("category")}">${app.category}</td>
        <td data-label="${t("status")}"><span class="status ${statusColor}">${t(app.status.toLowerCase().replace(' ', '_'))}</span></td>
        <td data-label="${t("documents")}">${documentsStatus} ${app.documents.length}/3</td>
        <td data-label="${t("applied_date")}">${fmtDate(app.appliedAt)}</td>
        <td data-label="${t("actions")}" style="min-width:200px">
          <button class="small ghost" data-act="view-app" data-id="${app.id}">${t("view_details")}</button>
          ${app.status === 'Pending' ? `
            <button class="small secondary" data-act="approve-app" data-id="${app.id}">${t("approve")}</button>
            <button class="small ghost danger" data-act="reject-app" data-id="${app.id}">${t("reject")}</button>
          ` : ''}
        </td>
      </tr>`;
  }).join("");

  // Enhanced active creator rows with performance metrics
  const activeRows = state.creators.activeCreators.map(creator=>{
    const statusColor = creator.status === 'Active' ? 'paid' : 'failed';
    const tierBadge = creator.tier === 'Platinum' ? 'style="background:var(--good);color:white"' :
                     creator.tier === 'Gold' ? 'style="background:#ffd700;color:black"' :
                     'style="background:var(--muted);color:white"';

    return `
      <tr>
        <td data-label="ID"><strong>${creator.id}</strong></td>
        <td data-label="${t("creator")}">
          ${creator.name}
          <br><span class="chip" ${tierBadge}>${creator.tier}</span>
        </td>
        <td data-label="${t("followers")}">${creator.followers.toLocaleString()}</td>
        <td data-label="${t("total_sales")}">${fmtCurrency(creator.totalSales)}</td>
        <td data-label="${t("products_listed")}">${creator.productsListed}</td>
        <td data-label="${t("live_sessions")}">${creator.liveSessionsMonth}/month</td>
        <td data-label="${t("avg_rating")}">${creator.avgRating} ⭐</td>
        <td data-label="${t("status")}"><span class="status ${statusColor}">${t(creator.status.toLowerCase())}</span></td>
        <td data-label="${t("actions")}" style="min-width:200px">
          <button class="small ghost" data-act="view-creator" data-id="${creator.id}">${t("view_details")}</button>
          ${creator.status === 'Active' && creator.status !== 'Warning' ? 
            `<button class="small ghost danger" data-act="warn-creator" data-id="${creator.id}">Warn</button>` :
            `<button class="small secondary" data-act="clear-warning" data-id="${creator.id}">Clear Warning</button>`}
        </td>
      </tr>`;
  }).join("");

  // Creator management stats
  const stats = state.creators.stats;

  qs("#view").innerHTML = html`
    <section class="panel">
      <!-- Enhanced Tab Navigation -->
      <div class="tabs">
        <a href="#/creators?tab=applications" class="${isApplications?'active':''}">${t("creator_applications")} (${state.creators.applications.length})</a>
        <a href="#/creators?tab=active" class="${isActive?'active':''}">${t("active_creators")} (${state.creators.activeCreators.length})</a>
      </div>
      
      <!-- Creator Management Stats Dashboard -->
      <div class="grid cols-4" style="margin:16px 0; gap:12px">
        <div class="metric">
          <div class="k">${stats.totalApplications}</div>
          <div class="t">Total Applications</div>
        </div>
        <div class="metric">
          <div class="k">${stats.pendingReview}</div>
          <div class="t">Pending Review</div>
        </div>
        <div class="metric">
          <div class="k">${stats.approvedThisMonth}</div>
          <div class="t">Approved This Month</div>
        </div>
        <div class="metric">
          <div class="k">${stats.avgApprovalTime}</div>
          <div class="t">Avg Approval Time</div>
        </div>
        <div class="metric">
          <div class="k">${stats.activeCreators}</div>
          <div class="t">Active Creators</div>
        </div>
        <div class="metric">
          <div class="k">${stats.topTier}</div>
          <div class="t">Top Tier Creators</div>
        </div>
        <div class="metric">
          <div class="k">${stats.creatorRetention}</div>
          <div class="t">Creator Retention</div>
        </div>
        <div class="metric">
          <div class="k" style="color:var(--good)">+${stats.approvedThisMonth}</div>
          <div class="t">Monthly Growth</div>
        </div>
      </div>
      
      <!-- Enhanced Creator Table -->
      <table class="table">
        <thead>
          ${isApplications
            ? `<tr><th>ID</th><th>${t("creator")}</th><th>${t("followers")}</th><th>${t("category")}</th><th>${t("status")}</th><th>${t("documents")}</th><th>${t("applied_date")}</th><th>${t("actions")}</th></tr>`
            : `<tr><th>ID</th><th>${t("creator")}</th><th>${t("followers")}</th><th>${t("total_sales")}</th><th>${t("products_listed")}</th><th>${t("live_sessions")}</th><th>${t("avg_rating")}</th><th>${t("status")}</th><th>${t("actions")}</th></tr>`}
        </thead>
        <tbody>${isApplications ? (applicationRows || `<tr><td colspan="8">—</td></tr>`) : (activeRows || `<tr><td colspan="9">—</td></tr>`)}</tbody>
      </table>
    </section>
  `;

  const host = qs("#view");
  host.addEventListener("click", (e)=>{
    const b = e.target.closest("button[data-act]"); if(!b) return;
    const id = b.getAttribute("data-id"); const act = b.getAttribute("data-act");
    
    if(act==="approve-app"){
      const app = state.creators.applications.find(x=>x.id===id);
      if(app) {
        app.status = "Approved";
        state.creators.stats.approvedThisMonth += 1;
        state.creators.stats.pendingReview -= 1;
        save(); renderCreators(); toast("Creator application approved");
      }
    }
    if(act==="reject-app"){
      if(confirm("Reject this creator application?")) {
        state.creators.applications = state.creators.applications.filter(x=>x.id!==id);
        state.creators.stats.pendingReview -= 1;
        save(); renderCreators(); toast("Application rejected");
      }
    }
    if(act==="view-app"){
      const app = state.creators.applications.find(x=>x.id===id);
      if(app) showCreatorApplicationDetails(app);
    }
    if(act==="view-creator"){
      const creator = state.creators.activeCreators.find(x=>x.id===id);
      if(creator) showCreatorProfile(creator);
    }
    if(act==="warn-creator"){
      const creator = state.creators.activeCreators.find(x=>x.id===id);
      if(creator) {
        creator.status = "Warning";
        save(); renderCreators(); toast("Warning issued to creator");
      }
    }
    if(act==="clear-warning"){
      const creator = state.creators.activeCreators.find(x=>x.id===id);
      if(creator) {
        creator.status = "Active";
        save(); renderCreators(); toast("Warning cleared");
      }
    }
  });
  refreshBadges();
}

// Enhanced creator management detail sheets
function showCreatorApplicationDetails(app) {
  const documentsStatus = app.documents.map(doc => 
    `<span class="chip" style="background:var(--good);color:white;font-size:10px;margin:2px">${doc}</span>`
  ).join(' ');
  
  const missingDocs = ['ID', 'Portfolio', 'Contract'].filter(doc => !app.documents.includes(doc));
  const missingDocsHtml = missingDocs.length > 0 ? 
    `<div style="margin:8px 0"><strong>Missing:</strong> ${missingDocs.map(doc => 
      `<span class="chip" style="background:var(--bad);color:white;font-size:10px;margin:2px">${doc}</span>`
    ).join(' ')}</div>` : '';

  showSheet(t("creator_profile"), `
    <h3>Creator Application - ${app.name}</h3>
    
    <div class="grid cols-2" style="gap:12px; margin:16px 0">
      <div><strong>Application ID:</strong> ${app.id}</div>
      <div><strong>Status:</strong> <span class="status ${app.status==='Approved'?'paid':app.status==='Pending'?'pending':'failed'}">${app.status}</span></div>
      <div><strong>Email:</strong> ${app.email}</div>
      <div><strong>Category:</strong> ${app.category}</div>
      <div><strong>Followers:</strong> ${app.followers.toLocaleString()}</div>
      <div><strong>Applied:</strong> ${fmtDate(app.appliedAt)}</div>
    </div>
    
    <div style="margin:16px 0">
      <strong>Admin Note:</strong><br>
      "${app.note}"
    </div>

    <div style="margin:16px 0">
      <strong>Documents Submitted:</strong><br>
      ${documentsStatus}
      ${missingDocsHtml}
    </div>
    
    <div class="metric-grid" style="margin:16px 0">
      <div class="metric">
        <div class="k">${(app.followers / 1000).toFixed(1)}K</div>
        <div class="t">Followers</div>
      </div>
      <div class="metric">
        <div class="k">4.3</div>
        <div class="t">Engagement Rate</div>
      </div>
      <div class="metric">
        <div class="k">156</div>
        <div class="t">Posts Last 30d</div>
      </div>
    </div>
    
    <div class="flex" style="gap:12px; margin-top:24px">
      ${app.status === 'Pending' ? `
        <button class="btn secondary flex-1" onclick="approveCreatorApp('${app.id}')">
          ${t("approve")} Application
        </button>
        <button class="btn ghost danger flex-1" onclick="rejectCreatorApp('${app.id}')">
          ${t("reject")} Application
        </button>
      ` : `
        <button class="btn ghost" onclick="hideSheet()">Close</button>
      `}
    </div>
  `);
}

function showCreatorProfile(creator) {
  showSheet(`
    <h3>Creator Profile - ${creator.name}</h3>
    
    <div class="grid cols-2" style="gap:12px; margin:16px 0">
      <div><strong>Creator ID:</strong> ${creator.id}</div>
      <div><strong>Tier:</strong> <span class="chip" style="background:${creator.tier==='Platinum'?'var(--good)':creator.tier==='Gold'?'#ffd700':'var(--muted)'};color:${creator.tier==='Gold'?'black':'white'}">${creator.tier}</span></div>
      <div><strong>Email:</strong> ${creator.email}</div>
      <div><strong>Status:</strong> <span class="status ${creator.status==='Active'?'paid':'failed'}">${creator.status}</span></div>
      <div><strong>Joined:</strong> ${fmtDate(creator.joinedAt)}</div>
      <div><strong>Followers:</strong> ${creator.followers.toLocaleString()}</div>
    </div>
    
    <div class="metric-grid" style="margin:16px 0">
      <div class="metric">
        <div class="k">${fmtCurrency(creator.totalSales)}</div>
        <div class="t">Total Sales</div>
      </div>
      <div class="metric">
        <div class="k">${creator.productsListed}</div>
        <div class="t">Products Listed</div>
      </div>
      <div class="metric">
        <div class="k">${creator.liveSessionsMonth}</div>
        <div class="t">Live Sessions/Month</div>
      </div>
      <div class="metric">
        <div class="k">${creator.avgRating}</div>
        <div class="t">Avg Rating ⭐</div>
      </div>
    </div>

    <div style="margin:16px 0">
      <strong>Recent Activity:</strong><br>
      <div style="background:var(--bg2); padding:12px; border-radius:8px; margin:8px 0">
        • Posted 3 new products this week<br>
        • Completed 2 live shopping sessions<br>
        • Responded to all customer inquiries within 2 hours<br>
        • Maintained 4.8+ rating across all products
      </div>
    </div>
    
    <div class="flex" style="gap:12px; margin-top:24px">
      ${creator.status === 'Active' ? `
        <button class="btn ghost danger flex-1" onclick="warnCreator('${creator.id}')">
          Issue Warning
        </button>
      ` : `
        <button class="btn secondary flex-1" onclick="clearCreatorWarning('${creator.id}')">
          Clear Warning
        </button>
      `}
      <button class="btn ghost" onclick="hideSheet()">Close</button>
    </div>
  `);
}

// Quick action functions for creator management
function approveCreatorApp(id) {
  const app = state.creators.applications.find(x=>x.id===id);
  if(app) {
    app.status = "Approved";
    state.creators.stats.approvedThisMonth += 1;
    state.creators.stats.pendingReview = Math.max(0, state.creators.stats.pendingReview - 1);
    save(); hideSheet(); renderCreators(); toast("Creator application approved");
  }
}

function rejectCreatorApp(id) {
  if(confirm("Reject this creator application? This action cannot be undone.")) {
    state.creators.applications = state.creators.applications.filter(x=>x.id!==id);
    state.creators.stats.pendingReview = Math.max(0, state.creators.stats.pendingReview - 1);
    save(); hideSheet(); renderCreators(); toast("Application rejected");
  }
}

function warnCreator(id) {
  const creator = state.creators.activeCreators.find(x=>x.id===id);
  if(creator) {
    creator.status = "Warning";
    save(); hideSheet(); renderCreators(); toast("Warning issued to creator");
  }
}

function clearCreatorWarning(id) {
  const creator = state.creators.activeCreators.find(x=>x.id===id);
  if(creator) {
    creator.status = "Active";
    save(); hideSheet(); renderCreators(); toast("Warning cleared");
  }
}

// Make creator management functions globally accessible
window.approveCreatorApp = approveCreatorApp;
window.rejectCreatorApp = rejectCreatorApp;
window.warnCreator = warnCreator;
window.clearCreatorWarning = clearCreatorWarning;
window.filterApplications = filterApplications;
window.filterCreators = filterCreators;

function renderLiveCommerce(){
  const tab = new URLSearchParams(location.hash.split("?")[1]||"").get("tab") || "active";
  const isActive = tab==="active";
  const isScheduled = tab==="scheduled";
  const isHistory = tab==="history";
  
  // Format duration helper
  const formatDuration = (minutes) => `${Math.floor(minutes/60)}h ${minutes%60}m`;
  const formatTime = (timestamp) => new Date(timestamp).toLocaleTimeString(getLang()==="ar"?"ar-SA":"en", {hour:'2-digit', minute:'2-digit'});
  
  // Enhanced active session rows with real-time monitoring
  const activeRows = state.liveCommerce.activeSessions.map(session=>{
    const statusColor = session.status === 'Live' ? 'paid' : 'pending';
    const flagsWarning = session.moderationFlags > 0 ? 'style="color:var(--bad)"' : '';
    
    return `
      <tr>
        <td data-label="ID"><strong>${session.id}</strong></td>
        <td data-label="${t("creator")}">${session.creatorName}</td>
        <td data-label="${t("session_title")}">${session.title}</td>
        <td data-label="${t("viewers")}" style="font-weight:bold;color:var(--good)">${session.viewers.toLocaleString()}</td>
        <td data-label="${t("duration")}">${formatDuration(session.duration)}</td>
        <td data-label="${t("revenue")}">${fmtCurrency(session.revenue)}</td>
        <td data-label="Chat" ${flagsWarning}>${session.chatMessages} ${session.moderationFlags > 0 ? '⚠️' : ''}</td>
        <td data-label="${t("status")}"><span class="status ${statusColor}">🔴 ${session.status}</span></td>
        <td data-label="${t("actions")}" style="min-width:250px">
          <button class="small ghost" data-act="view-session" data-id="${session.id}">${t("session_details")}</button>
          <button class="small secondary" data-act="moderate-chat" data-id="${session.id}">Chat</button>
          <button class="small danger" data-act="emergency-stop" data-id="${session.id}">${t("emergency_stop")}</button>
        </td>
      </tr>`;
  }).join("");

  // Enhanced scheduled session rows
  const scheduledRows = state.liveCommerce.scheduledSessions.map(session=>{
    const timeUntil = Math.floor((session.scheduledTime - Date.now()) / (60*1000));
    const timeDisplay = timeUntil > 60 ? `${Math.floor(timeUntil/60)}h ${timeUntil%60}m` : `${timeUntil}m`;
    
    return `
      <tr>
        <td data-label="ID"><strong>${session.id}</strong></td>
        <td data-label="${t("creator")}">${session.creatorName}</td>
        <td data-label="${t("session_title")}">${session.title}</td>
        <td data-label="Start Time">${formatTime(session.scheduledTime)}</td>
        <td data-label="Time Until">in ${timeDisplay}</td>
        <td data-label="Products">${session.products} items</td>
        <td data-label="${t("status")}"><span class="status pending">${session.status}</span></td>
        <td data-label="${t("actions")}" style="min-width:200px">
          <button class="small ghost" data-act="view-scheduled" data-id="${session.id}">${t("view_details")}</button>
          <button class="small secondary" data-act="start-early" data-id="${session.id}">Start Early</button>
        </td>
      </tr>`;
  }).join("");

  // Enhanced session history rows
  const historyRows = state.liveCommerce.recentSessions.map(session=>{
    const statusColor = session.status === 'Completed' ? 'paid' : 'failed';
    
    return `
      <tr>
        <td data-label="ID"><strong>${session.id}</strong></td>
        <td data-label="${t("creator")}">${session.creatorName}</td>
        <td data-label="${t("session_title")}">${session.title}</td>
        <td data-label="End Time">${formatTime(session.endTime)}</td>
        <td data-label="${t("duration")}">${formatDuration(session.duration)}</td>
        <td data-label="Total Viewers">${session.totalViewers.toLocaleString()}</td>
        <td data-label="${t("revenue")}">${fmtCurrency(session.revenue)}</td>
        <td data-label="${t("status")}"><span class="status ${statusColor}">${session.status}</span></td>
        <td data-label="${t("actions")}">
          <button class="small ghost" data-act="view-analytics" data-id="${session.id}">Analytics</button>
        </td>
      </tr>`;
  }).join("");

  // Live commerce stats
  const stats = state.liveCommerce.stats;

  qs("#view").innerHTML = html`
    <section class="panel">
      <!-- Enhanced Tab Navigation -->
      <div class="tabs">
        <a href="#/live?tab=active" class="${isActive?'active':''}">${t("active_sessions")} (${state.liveCommerce.activeSessions.length})</a>
        <a href="#/live?tab=scheduled" class="${isScheduled?'active':''}">${t("scheduled_sessions")} (${state.liveCommerce.scheduledSessions.length})</a>
        <a href="#/live?tab=history" class="${isHistory?'active':''}">${t("session_history")}</a>
      </div>
      
      <!-- Live Commerce Operations Dashboard -->
      <div class="grid cols-4" style="margin:16px 0; gap:12px">
        <div class="metric">
          <div class="k" style="color:var(--good)">${stats.activeSessions}</div>
          <div class="t">Active Sessions</div>
        </div>
        <div class="metric">
          <div class="k">${stats.totalViewersOnline.toLocaleString()}</div>
          <div class="t">Viewers Online</div>
        </div>
        <div class="metric">
          <div class="k">${fmtCurrency(stats.revenueToday)}</div>
          <div class="t">Revenue Today</div>
        </div>
        <div class="metric">
          <div class="k">${stats.conversionRate}%</div>
          <div class="t">Conversion Rate</div>
        </div>
        <div class="metric">
          <div class="k">${stats.totalSessionsToday}</div>
          <div class="t">Sessions Today</div>
        </div>
        <div class="metric">
          <div class="k">${formatDuration(stats.averageSessionLength)}</div>
          <div class="t">Avg Session Length</div>
        </div>
        <div class="metric">
          <div class="k" style="color:${stats.emergencyStops > 0 ? 'var(--bad)' : 'var(--good)'}">${stats.emergencyStops}</div>
          <div class="t">Emergency Stops</div>
        </div>
        <div class="metric">
          <div class="k">${stats.moderationActions}</div>
          <div class="t">Moderation Actions</div>
        </div>
      </div>
      
      <!-- Enhanced Live Sessions Table -->
      <table class="table">
        <thead>
          ${isActive
            ? `<tr><th>ID</th><th>${t("creator")}</th><th>${t("session_title")}</th><th>${t("viewers")}</th><th>${t("duration")}</th><th>${t("revenue")}</th><th>Chat</th><th>${t("status")}</th><th>${t("actions")}</th></tr>`
            : isScheduled 
            ? `<tr><th>ID</th><th>${t("creator")}</th><th>${t("session_title")}</th><th>Start Time</th><th>Time Until</th><th>Products</th><th>${t("status")}</th><th>${t("actions")}</th></tr>`
            : `<tr><th>ID</th><th>${t("creator")}</th><th>${t("session_title")}</th><th>End Time</th><th>${t("duration")}</th><th>Total Viewers</th><th>${t("revenue")}</th><th>${t("status")}</th><th>${t("actions")}</th></tr>`}
        </thead>
        <tbody>
          ${isActive ? (activeRows || `<tr><td colspan="9">No active sessions</td></tr>`) : 
            isScheduled ? (scheduledRows || `<tr><td colspan="7">No scheduled sessions</td></tr>`) :
            (historyRows || `<tr><td colspan="8">No recent sessions</td></tr>`)}
        </tbody>
      </table>
    </section>
  `;

  const host = qs("#view");
  host.addEventListener("click", (e)=>{
    const b = e.target.closest("button[data-act]"); if(!b) return;
    const id = b.getAttribute("data-id"); const act = b.getAttribute("data-act");
    
    if(act==="view-session"){
      const session = state.liveCommerce.activeSessions.find(x=>x.id===id);
      if(session) showLiveSessionDetails(session);
    }
    if(act==="moderate-chat"){
      const session = state.liveCommerce.activeSessions.find(x=>x.id===id);
      if(session) showChatModeration(session);
    }
    if(act==="emergency-stop"){
      if(confirm("Emergency stop this live session? This will immediately end the broadcast and notify viewers.")) {
        state.liveCommerce.activeSessions = state.liveCommerce.activeSessions.filter(x=>x.id!==id);
        state.liveCommerce.stats.activeSessions -= 1;
        state.liveCommerce.stats.emergencyStops += 1;
        save(); renderLiveCommerce(); toast("Live session stopped");
      }
    }
    if(act==="view-scheduled"){
      const session = state.liveCommerce.scheduledSessions.find(x=>x.id===id);
      if(session) showScheduledSessionDetails(session);
    }
    if(act==="start-early"){
      if(confirm("Start this session early?")) {
        const session = state.liveCommerce.scheduledSessions.find(x=>x.id===id);
        if(session) {
          // Move to active sessions
          state.liveCommerce.activeSessions.push({
            ...session,
            viewers: 0,
            duration: 0,
            startTime: Date.now(),
            status: "Live",
            revenue: 0,
            chatMessages: 0,
            moderationFlags: 0,
            products: [{id:"P1",name:"Sample Product",sales:0,views:0}]
          });
          state.liveCommerce.scheduledSessions = state.liveCommerce.scheduledSessions.filter(x=>x.id!==id);
          state.liveCommerce.stats.activeSessions += 1;
          save(); renderLiveCommerce(); toast("Session started early");
        }
      }
    }
    if(act==="view-analytics"){
      const session = state.liveCommerce.recentSessions.find(x=>x.id===id);
      if(session) showSessionAnalytics(session);
    }
  });
  refreshBadges();
}

function renderContentModeration() {
  const data = getContentModerationData();
  
  qs("#view").innerHTML = html`
    <div class="moderation-dashboard" dir="${isRTL() ? 'rtl' : 'ltr'}">
      <header class="view-header">
        <h1>${t("content_moderation")}</h1>
      </header>

      <!-- Moderation Statistics -->
      <section class="moderation-section">
        <h2>${t("moderation_statistics")}</h2>
        
        <div class="moderation-stats">
          <div class="stats-grid">
            <div class="stat-card warning">
              <div class="stat-icon">⚠️</div>
              <div class="stat-content">
                <div class="stat-value">${data.statistics.pendingReviews}</div>
                <div class="stat-label">${t("pending_reviews")}</div>
              </div>
            </div>
            
            <div class="stat-card success">
              <div class="stat-icon">✅</div>
              <div class="stat-content">
                <div class="stat-value">${data.statistics.approvedToday}</div>
                <div class="stat-label">${t("approved_today")}</div>
              </div>
            </div>
            
            <div class="stat-card urgent">
              <div class="stat-icon">🚫</div>
              <div class="stat-content">
                <div class="stat-value">${data.statistics.rejectedToday}</div>
                <div class="stat-label">${t("rejected_today")}</div>
              </div>
            </div>
            
            <div class="stat-card info">
              <div class="stat-icon">🤖</div>
              <div class="stat-content">
                <div class="stat-value">${(data.statistics.autoModerationRate * 100).toFixed(1)}%</div>
                <div class="stat-label">${t("auto_moderation_rate")}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Content Queue -->
      <section class="moderation-section">
        <div class="section-header">
          <h2>${t("content_queue")}</h2>
          <div class="queue-filters">
            <select id="contentTypeFilter" onchange="filterContent()">
              <option value="all">${t("all_content")}</option>
              <option value="posts">${t("posts")}</option>
              <option value="comments">${t("comments")}</option>
              <option value="livestreams">${t("livestreams")}</option>
              <option value="products">${t("products")}</option>
            </select>
            
            <select id="priorityFilter" onchange="filterContent()">
              <option value="all">${t("all_priorities")}</option>
              <option value="high">${t("high_priority")}</option>
              <option value="medium">${t("medium_priority")}</option>
              <option value="low">${t("low_priority")}</option>
            </select>
          </div>
        </div>
        
        <div class="content-grid">
          ${data.contentQueue.map(item => `
            <div class="content-card ${item.priority}" data-type="${item.type}">
              <div class="content-header">
                <div class="content-type-badge">${t(item.type)}</div>
                <div class="content-priority priority-${item.priority}">${t(item.priority + "_priority")}</div>
              </div>
              
              <div class="content-preview">
                ${item.type === 'products' ? `
                  <img src="${item.preview.image}" alt="${item.preview.title}" class="content-image">
                ` : ''}
                <div class="content-text">
                  <h3>${item.preview.title}</h3>
                  <p>${item.preview.description}</p>
                </div>
              </div>
              
              <div class="content-metadata">
                <div class="content-author">
                  <strong>${t("author")}:</strong> ${item.author}
                </div>
                <div class="content-date">
                  <strong>${t("submitted")}:</strong> ${new Date(item.submittedAt).toLocaleString()}
                </div>
                ${item.flaggedReasons.length > 0 ? `
                  <div class="flagged-reasons">
                    <strong>${t("flagged_for")}:</strong>
                    ${item.flaggedReasons.map(reason => `<span class="flag-tag">${t(reason)}</span>`).join('')}
                  </div>
                ` : ''}
              </div>
              
              <div class="content-actions">
                <button class="btn-success small" onclick="approveContent('${item.id}')">${t("approve")}</button>
                <button class="btn-warning small" onclick="requestChanges('${item.id}')">${t("request_changes")}</button>
                <button class="btn-danger small" onclick="rejectContent('${item.id}')">${t("reject")}</button>
                <button class="btn-ghost small" onclick="viewContentDetails('${item.id}')">${t("view_details")}</button>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Auto-Moderation Rules -->
      <section class="moderation-section">
        <div class="section-header">
          <h2>${t("auto_moderation_rules")}</h2>
          <button class="btn-primary" onclick="createModerationRule()">${t("create_rule")}</button>
        </div>
        
        <div class="rules-list">
          ${data.autoModerationRules.map(rule => `
            <div class="rule-card">
              <div class="rule-header">
                <h3>${rule.name}</h3>
                <div class="rule-status">
                  <label class="toggle-switch">
                    <input type="checkbox" ${rule.enabled ? 'checked' : ''} 
                           onchange="toggleRule('${rule.id}', this.checked)">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>
              
              <div class="rule-details">
                <div class="rule-criteria">
                  <strong>${t("criteria")}:</strong> ${rule.criteria.join(', ')}
                </div>
                <div class="rule-action">
                  <strong>${t("action")}:</strong> ${t(rule.action)}
                </div>
                <div class="rule-stats">
                  <span>${t("triggered")}: ${rule.triggeredCount} ${t("times_this_week")}</span>
                </div>
              </div>
              
              <div class="rule-actions">
                <button class="btn-secondary small" onclick="editRule('${rule.id}')">${t("edit")}</button>
                <button class="btn-ghost small" onclick="deleteRule('${rule.id}')">${t("delete")}</button>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Moderation History -->
      <section class="moderation-section">
        <h2>${t("moderation_history")}</h2>
        
        <div class="history-table-container">
          <table class="history-table">
            <thead>
              <tr>
                <th>${t("content_type")}</th>
                <th>${t("author")}</th>
                <th>${t("moderator")}</th>
                <th>${t("action_taken")}</th>
                <th>${t("reason")}</th>
                <th>${t("date")}</th>
              </tr>
            </thead>
            <tbody>
              ${data.moderationHistory.map(entry => `
                <tr>
                  <td>${t(entry.contentType)}</td>
                  <td>${entry.author}</td>
                  <td>${entry.moderator}</td>
                  <td>
                    <span class="action-badge ${entry.action}">${t(entry.action)}</span>
                  </td>
                  <td>${entry.reason}</td>
                  <td>${new Date(entry.actionDate).toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `;

  refreshBadges();
}
  const tab = new URLSearchParams(location.hash.split("?")[1]||"").get("tab") || "content";
  const isContent = tab==="content";
  const isSellers = tab==="sellers";
  const isUGC = tab==="ugc";
  const isLive = tab==="live";
  
  // Enhanced moderation detail sheets
function showContentDetails(item) {
  const isUGC = item.type === 'ugc_post';
  const isLive = item.type === 'live_stream';
  
  const content = isUGC ? `
    <div class="metric-grid" style="margin:16px 0">
      <div class="metric">
        <div class="k">${item.engagement || '247'}</div>
        <div class="t">Likes</div>
      </div>
      <div class="metric">
        <div class="k">${item.shares || '89'}</div>
        <div class="t">Shares</div>
      </div>
      <div class="metric">
        <div class="k">${item.comments || '156'}</div>
        <div class="t">Comments</div>
      </div>
    </div>
    <div style="margin:16px 0">
      <strong>Content Preview:</strong><br>
      <div style="background:var(--bg2); padding:12px; border-radius:8px; margin:8px 0">
        "${item.content || 'Check out this amazing product! Perfect for summer 🌞 #StoreZ #Fashion'}"
      </div>
      <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=70" 
           style="width:100%; max-width:300px; border-radius:8px" alt="UGC Content">
    </div>
  ` : isLive ? `
    <div class="metric-grid" style="margin:16px 0">
      <div class="metric">
        <div class="k">${item.viewers || '1,247'}</div>
        <div class="t">Current Viewers</div>
      </div>
      <div class="metric">
        <div class="k">${item.duration || '23m'}</div>
        <div class="t">Stream Duration</div>
      </div>
      <div class="metric">
        <div class="k">${item.sales || '12'}</div>
        <div class="t">Products Sold</div>
      </div>
    </div>
    <div style="margin:16px 0">
      <strong>Stream Title:</strong><br>
      "${item.title || 'Summer Fashion Haul - Live Shopping Session'}"<br><br>
      <strong>Current Status:</strong> 
      <span class="status paid">LIVE</span>
      <span style="color:var(--good)">● Broadcasting</span>
    </div>
  ` : `
    <div style="margin:16px 0">
      <strong>Content:</strong><br>
      "${item.content || 'Reported content details would appear here'}"
    </div>
  `;

  showSheet(`
    <h3>Content Review - #${item.id}</h3>
    
    <div class="grid cols-2" style="gap:12px; margin:16px 0">
      <div><strong>Type:</strong> ${t(item.type)}</div>
      <div><strong>Risk Level:</strong> <span class="status ${item.risk==='High'?'failed':item.risk==='Medium'?'pending':'paid'}">${item.risk}</span></div>
      <div><strong>Reporter:</strong> ${item.reporter}</div>
      <div><strong>Report Time:</strong> ${fmtDate(item.ts)}</div>
    </div>
    
    <div style="margin:16px 0">
      <strong>Report Reason:</strong><br>
      "${item.reason}"
    </div>
    
    ${content}
    
    <div class="flex" style="gap:12px; margin-top:24px">
      <button class="btn secondary flex-1" onclick="approveContent('${item.id}')">
        ${t("approve")} Content
      </button>
      ${isLive ? `
        <button class="btn danger" onclick="emergencyStop('${item.id}')">
          Emergency Stop
        </button>
      ` : ''}
      <button class="btn ghost danger flex-1" onclick="rejectContent('${item.id}')">
        ${t("reject")} Content
      </button>
    </div>
  `);
}

function showSellerDetails(seller) {
  showSheet(`
    <h3>Seller Profile - ${seller.name}</h3>
    
    <div class="grid cols-2" style="gap:12px; margin:16px 0">
      <div><strong>Seller ID:</strong> ${seller.id}</div>
      <div><strong>Status:</strong> <span class="status ${seller.status==='Active'?'paid':'failed'}">${seller.status}</span></div>
      <div><strong>Join Date:</strong> March 2024</div>
      <div><strong>Products:</strong> 127</div>
      <div><strong>Total Sales:</strong> SAR 45,670</div>
      <div><strong>Rating:</strong> 4.7/5 ⭐</div>
    </div>
    
    <div style="margin:16px 0">
      <strong>Admin Note:</strong><br>
      "${seller.note}"
    </div>
    
    <div class="metric-grid" style="margin:16px 0">
      <div class="metric">
        <div class="k">127</div>
        <div class="t">Active Products</div>
      </div>
      <div class="metric">
        <div class="k">892</div>
        <div class="t">Total Orders</div>
      </div>
      <div class="metric">
        <div class="k">4.7</div>
        <div class="t">Avg Rating</div>
      </div>
    </div>
    
    <div class="flex" style="gap:12px; margin-top:24px">
      ${seller.status === 'Active' ? `
        <button class="btn danger flex-1" onclick="suspendSeller('${seller.id}')">
          ${t("suspend")} Seller
        </button>
      ` : `
        <button class="btn secondary flex-1" onclick="reinstateSeller('${seller.id}')">
          ${t("reinstate")} Seller
        </button>
      `}
      <button class="btn ghost" onclick="hideSheet()">Close</button>
    </div>
  `);
}

// Quick action functions for sheet buttons
function approveContent(id) {
  state.moderation.content = state.moderation.content.filter(x=>x.id!==id);
  state.metrics.reportsOpen = Math.max(0, state.metrics.reportsOpen-1);
  save(); hideSheet(); renderContentModeration(); toast("Content Approved");
}

function rejectContent(id) {
  state.moderation.content = state.moderation.content.filter(x=>x.id!==id);
  state.metrics.reportsOpen = Math.max(0, state.metrics.reportsOpen-1);
  save(); hideSheet(); renderContentModeration(); toast("Content Rejected");
}

function emergencyStop(id) {
  if(confirm("Emergency stop live session? This will immediately end the broadcast.")) {
    state.moderation.content = state.moderation.content.filter(x=>x.id!==id);
    state.moderation.liveStats.activeSessions = Math.max(0, state.moderation.liveStats.activeSessions-1);
    state.moderation.liveStats.emergencyStops += 1;
    save(); hideSheet(); renderContentModeration(); toast("Live session stopped");
  }
}

function suspendSeller(id) {
  const s = state.moderation.sellers.find(x=>x.id===id);
  if(s) {
    s.status = "Suspended";
    save(); hideSheet(); renderContentModeration(); toast(t("suspended"));
  }
}

function reinstateSeller(id) {
  const s = state.moderation.sellers.find(x=>x.id===id);
  if(s) {
    s.status = "Active";
    save(); hideSheet(); renderContentModeration(); toast(t("active"));
  }
}

// Make content moderation functions globally accessible
window.approveContent = approveContent;
window.rejectContent = rejectContent;
window.emergencyStop = emergencyStop;
window.suspendSeller = suspendSeller;
window.reinstateSeller = reinstateSeller;

  const contentRows = state.moderation.content.map(r=>{
    const isUGCContent = r.type === 'ugc_post';
    const isLiveContent = r.type === 'live_stream';
    const actionButtons = isUGCContent || isLiveContent ? 
      `<button class="small ghost" data-act="view" data-id="${r.id}">${t("view_details")}</button>
       <button class="small secondary" data-act="approve" data-id="${r.id}">${t("approve")}</button>
       <button class="small ghost danger" data-act="reject" data-id="${r.id}">${t("reject")}</button>
       ${isLiveContent ? `<button class="small danger" data-act="emergency" data-id="${r.id}">Emergency Stop</button>` : ''}` :
      `<button class="small secondary" data-act="approve" data-id="${r.id}">${t("approve")}</button>
       <button class="small ghost danger" data-act="reject" data-id="${r.id}">${t("reject")}</button>`;
    
    return `
      <tr>
        <td data-label="${t("reported_item")}">
          <strong>#${r.id}</strong>
          ${isUGCContent ? '<span class="chip" style="background:var(--brand);color:white;font-size:10px">UGC</span>' : ''}
          ${isLiveContent ? '<span class="chip" style="background:var(--bad);color:white;font-size:10px">LIVE</span>' : ''}
        </td>
        <td data-label="${t("type")}">${t(r.type)}</td>
        <td data-label="${t("risk")}"><span class="status ${r.risk==='High'?'failed':r.risk==='Medium'?'pending':'paid'}">${r.risk}</span></td>
        <td data-label="${t("reporter")}">${r.reporter}</td>
        <td data-label="${t("time")}">${fmtDate(r.ts)}</td>
        <td data-label="Reason" class="muted small">${r.reason}</td>
        <td data-label="${t("actions")}" style="min-width:200px">
          ${actionButtons}
        </td>
      </tr>`;
  }).join("");

  const sellerRows = state.moderation.sellers.map(s=>`
    <tr>
      <td data-label="ID"><strong>${s.id}</strong></td>
      <td data-label="${t("seller_queue")}">${s.name}</td>
      <td data-label="${t("status")}"><span class="status ${s.status==='Active'?'paid':'failed'}">${t(s.status.toLowerCase())||s.status}</span></td>
      <td data-label="Note" class="muted">${s.note}</td>
      <td data-label="${t("actions")}">
        <button class="small ghost" data-act="view-seller" data-id="${s.id}">${t("view_details")}</button>
        ${s.status==='Active'
          ? `<button class="small ghost danger" data-act="suspend" data-id="${s.id}">${t("suspend")}</button>`
          : `<button class="small secondary" data-act="reinstate" data-id="${s.id}">${t("reinstate")}</button>`}
      </td>
    </tr>`).join("");

  // UGC-specific stats and overview
  const ugcStats = state.moderation.ugcStats;
  const liveStats = state.moderation.liveStats;

  qs("#view").innerHTML = html`
    <section class="panel">
      <!-- Enhanced Tab Navigation -->
      <div class="tabs">
        <a href="#/moderation?tab=content" class="${isContent?'active':''}">${t("content_queue")} (${state.moderation.content.length})</a>
        <a href="#/moderation?tab=sellers" class="${isSellers?'active':''}">${t("seller_queue")} (${state.moderation.sellers.length})</a>
      </div>
      
      <!-- Moderation Stats Dashboard -->
      ${isContent ? `
        <div class="grid cols-3" style="margin:16px 0; gap:12px">
          <div class="metric">
            <div class="k">${ugcStats.pendingReview}</div>
            <div class="t">Pending Review</div>
          </div>
          <div class="metric">
            <div class="k">${ugcStats.approvedToday}</div>
            <div class="t">Approved Today</div>
          </div>
          <div class="metric">
            <div class="k">${ugcStats.averageReviewTime}h</div>
            <div class="t">Avg Review Time</div>
          </div>
          <div class="metric">
            <div class="k">${liveStats.activeSessions}</div>
            <div class="t">Active Live Sessions</div>
          </div>
          <div class="metric">
            <div class="k">${liveStats.totalViewers}</div>
            <div class="t">Total Live Viewers</div>
          </div>
          <div class="metric">
            <div class="k">${liveStats.emergencyStops}</div>
            <div class="t">Emergency Stops Today</div>
          </div>
        </div>
      ` : isSellers ? `
        <div class="grid cols-3" style="margin:16px 0; gap:12px">
          <div class="metric">
            <div class="k">${state.moderation.sellers.filter(s => s.status === 'Suspended').length}</div>
            <div class="t">Suspended Sellers</div>
          </div>
          <div class="metric">
            <div class="k">${state.moderation.sellers.filter(s => s.status === 'Active').length}</div>
            <div class="t">Active Sellers</div>
          </div>
          <div class="metric">
            <div class="k">${state.moderation.sellers.length}</div>
            <div class="t">Total Sellers</div>
          </div>
          <div class="metric">
            <div class="k">12</div>
            <div class="t">Applications Pending</div>
          </div>
          <div class="metric">
            <div class="k">89%</div>
            <div class="t">Approval Rate</div>
          </div>
          <div class="metric">
            <div class="k">2.3d</div>
            <div class="t">Avg Review Time</div>
          </div>
        </div>
      ` : ''}
      
      <!-- Enhanced Content Table -->
      <table class="table">
        <thead>
          ${isContent
            ? `<tr><th>${t("reported_item")}</th><th>${t("type")}</th><th>${t("risk")}</th><th>${t("reporter")}</th><th>${t("time")}</th><th>Reason</th><th>${t("actions")}</th></tr>`
            : `<tr><th>ID</th><th>${t("seller_queue")}</th><th>${t("status")}</th><th>Note</th><th>${t("actions")}</th></tr>`}
        </thead>
        <tbody>${isContent ? (contentRows || `<tr><td colspan="7">—</td></tr>`) : (sellerRows || `<tr><td colspan="5">—</td></tr>`)}</tbody>
      </table>
    </section>
  `;

  const host = qs("#view");
  host.addEventListener("click", (e)=>{
    const b = e.target.closest("button[data-act]"); if(!b) return;
    const id = b.getAttribute("data-id"); const act = b.getAttribute("data-act");
    
    if(act==="approve"||act==="reject"){
      state.moderation.content = state.moderation.content.filter(x=>x.id!==id);
      state.metrics.reportsOpen = Math.max(0, state.metrics.reportsOpen-1);
      save(); renderContentModeration(); toast(act==="approve"?"Approved":"Rejected");
    }
    if(act==="view"){
      const item = state.moderation.content.find(x=>x.id===id);
      if(item) showContentDetails(item);
    }
    if(act==="view-seller"){
      const seller = state.moderation.sellers.find(x=>x.id===id);
      if(seller) showSellerDetails(seller);
    }
    if(act==="emergency"){
      if(confirm("Emergency stop live session? This will immediately end the broadcast.")){
        state.moderation.content = state.moderation.content.filter(x=>x.id!==id);
        state.moderation.liveStats.activeSessions = Math.max(0, state.moderation.liveStats.activeSessions-1);
        state.moderation.liveStats.emergencyStops += 1;
        save(); renderContentModeration(); toast("Live session stopped");
      }
    }
    if(act==="suspend"){
      const s = state.moderation.sellers.find(x=>x.id===id); 
      if(s){ 
        s.status="Suspended"; 
        save(); renderContentModeration(); toast(t("suspended")); 
      }
    }
    if(act==="reinstate"){
      const s = state.moderation.sellers.find(x=>x.id===id); 
      if(s){ 
        s.status="Active"; 
        save(); renderContentModeration(); toast(t("reactivated")); 
      }
    }
  });


function renderCreatorManagement() {
  const data = getCreatorManagementData();
  
  qs("#view").innerHTML = html`
    <div class="creator-dashboard" dir="${isRTL() ? 'rtl' : 'ltr'}">
      <header class="view-header">
        <h1>${t("creator_management")}</h1>
      </header>

      <!-- Creator Statistics -->
      <section class="creator-section">
        <h2>${t("creator_statistics")}</h2>
        
        <div class="creator-stats">
          <div class="stats-grid">
            <div class="stat-card info">
              <div class="stat-icon">👥</div>
              <div class="stat-content">
                <div class="stat-value">${data.statistics.totalCreators}</div>
                <div class="stat-label">${t("total_creators")}</div>
              </div>
            </div>
            
            <div class="stat-card warning">
              <div class="stat-icon">⏳</div>
              <div class="stat-content">
                <div class="stat-value">${data.statistics.pendingApplications}</div>
                <div class="stat-label">${t("pending_applications")}</div>
              </div>
            </div>
            
            <div class="stat-card success">
              <div class="stat-icon">✅</div>
              <div class="stat-content">
                <div class="stat-value">${data.statistics.verifiedCreators}</div>
                <div class="stat-label">${t("verified_creators")}</div>
              </div>
            </div>
            
            <div class="stat-card urgent">
              <div class="stat-icon">🚫</div>
              <div class="stat-content">
                <div class="stat-value">${data.statistics.suspendedCreators}</div>
                <div class="stat-label">${t("suspended_creators")}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Pending Applications -->
      <section class="creator-section">
        <div class="section-header">
          <h2>${t("pending_applications")}</h2>
          <div class="application-filters">
            <select id="applicationTypeFilter" onchange="filterApplications()">
              <option value="all">${t("all_applications")}</option>
              <option value="new">${t("new_seller")}</option>
              <option value="verification">${t("verification_request")}</option>
              <option value="reactivation">${t("reactivation_request")}</option>
            </select>
          </div>
        </div>
        
        <div class="applications-grid">
          ${data.pendingApplications.map(app => `
            <div class="application-card" data-type="${app.type}">
              <div class="application-header">
                <div class="application-type-badge">${t(app.type + "_application")}</div>
                <div class="application-date">${new Date(app.submittedAt).toLocaleDateString()}</div>
              </div>
              
              <div class="creator-info">
                <div class="creator-avatar">
                  <img src="${app.creator.avatar}" alt="${app.creator.name}">
                </div>
                <div class="creator-details">
                  <h3>${app.creator.name}</h3>
                  <p class="creator-category">${t(app.creator.category)}</p>
                  <p class="creator-location">${app.creator.location}</p>
                </div>
              </div>
              
              <div class="application-stats">
                <div class="stat-item">
                  <span class="stat-label">${t("followers")}:</span>
                  <span class="stat-value">${app.creator.followers.toLocaleString()}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">${t("experience")}:</span>
                  <span class="stat-value">${app.creator.experience} ${t("years")}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">${t("products_planned")}:</span>
                  <span class="stat-value">${app.creator.productsPlanned}</span>
                </div>
              </div>
              
              <div class="application-documents">
                <h4>${t("submitted_documents")}</h4>
                <div class="documents-list">
                  ${app.documents.map(doc => `
                    <div class="document-item">
                      <span class="document-type">${t(doc.type)}</span>
                      <span class="document-status ${doc.verified ? 'verified' : 'pending'}">${doc.verified ? t("verified") : t("pending")}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
              
              <div class="application-actions">
                <button class="btn-success small" onclick="approveApplication('${app.id}')">${t("approve")}</button>
                <button class="btn-warning small" onclick="requestDocuments('${app.id}')">${t("request_documents")}</button>
                <button class="btn-danger small" onclick="rejectApplication('${app.id}')">${t("reject")}</button>
                <button class="btn-ghost small" onclick="viewApplicationDetails('${app.id}')">${t("view_details")}</button>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Active Creators -->
      <section class="creator-section">
        <div class="section-header">
          <h2>${t("active_creators")}</h2>
          <div class="creator-filters">
            <select id="creatorStatusFilter" onchange="filterCreators()">
              <option value="all">${t("all_statuses")}</option>
              <option value="active">${t("active")}</option>
              <option value="verified">${t("verified")}</option>
              <option value="warning">${t("warning")}</option>
              <option value="suspended">${t("suspended")}</option>
            </select>
            
            <select id="creatorCategoryFilter" onchange="filterCreators()">
              <option value="all">${t("all_categories")}</option>
              <option value="fashion">${t("fashion")}</option>
              <option value="beauty">${t("beauty")}</option>
              <option value="electronics">${t("electronics")}</option>
              <option value="home">${t("home")}</option>
              <option value="sports">${t("sports")}</option>
            </select>
          </div>
        </div>
        
        <div class="creators-table-container">
          <table class="creators-table">
            <thead>
              <tr>
                <th>${t("creator")}</th>
                <th>${t("category")}</th>
                <th>${t("status")}</th>
                <th>${t("followers")}</th>
                <th>${t("products")}</th>
                <th>${t("revenue_30d")}</th>
                <th>${t("performance_score")}</th>
                <th>${t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              ${data.activeCreators.map(creator => `
                <tr class="creator-row" data-status="${creator.status}" data-category="${creator.category}">
                  <td>
                    <div class="creator-info-cell">
                      <img src="${creator.avatar}" alt="${creator.name}" class="creator-avatar-small">
                      <div>
                        <strong>${creator.name}</strong>
                        <small>${creator.location}</small>
                      </div>
                    </div>
                  </td>
                  <td>${t(creator.category)}</td>
                  <td>
                    <span class="status-badge ${creator.status}">${t(creator.status)}</span>
                  </td>
                  <td>${creator.followers.toLocaleString()}</td>
                  <td>${creator.products}</td>
                  <td>${currency(creator.revenue30d)}</td>
                  <td>
                    <div class="performance-score">
                      <span class="score-value">${creator.performanceScore}</span>
                      <div class="score-bar">
                        <div class="score-fill" style="width: ${creator.performanceScore}%"></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <button class="btn-ghost small" onclick="viewCreatorDetails('${creator.id}')">${t("view")}</button>
                    <button class="btn-secondary small" onclick="editCreator('${creator.id}')">${t("edit")}</button>
                    ${creator.status !== 'suspended' ? `
                      <button class="btn-warning small" onclick="suspendCreator('${creator.id}')">${t("suspend")}</button>
                    ` : `
                      <button class="btn-success small" onclick="reactivateCreator('${creator.id}')">${t("reactivate")}</button>
                    `}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </section>

      <!-- Creator Performance Analytics -->
      <section class="creator-section">
        <h2>${t("performance_analytics")}</h2>
        
        <div class="analytics-grid">
          <div class="analytics-card">
            <h3>${t("top_performing_creators")}</h3>
            <div class="top-creators-list">
              ${data.topPerformers.map((creator, index) => `
                <div class="top-creator-item">
                  <span class="creator-rank">#${index + 1}</span>
                  <img src="${creator.avatar}" alt="${creator.name}" class="creator-avatar-small">
                  <div class="creator-info">
                    <strong>${creator.name}</strong>
                    <small>${currency(creator.revenue)} ${t("revenue")}</small>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
          
          <div class="analytics-card">
            <h3>${t("creator_categories_distribution")}</h3>
            <div class="category-distribution">
              ${Object.entries(data.categoryDistribution).map(([category, count]) => `
                <div class="category-item">
                  <span class="category-name">${t(category)}</span>
                  <div class="category-bar">
                    <div class="category-fill" style="width: ${(count/data.statistics.totalCreators)*100}%"></div>
                  </div>
                  <span class="category-count">${count}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </section>
    </div>
  `;

  refreshBadges();
}

// Content moderation data function
function getContentModerationData() {
  return {
    statistics: {
      pendingReviews: 23,
      approvedToday: 87,
      rejectedToday: 12,
      autoModerationRate: 0.78
    },
    contentQueue: [
      {
        id: "C001",
        type: "posts",
        author: "أحمد الخليل",
        priority: "high",
        submittedAt: "2024-01-15T10:30:00Z",
        flaggedReasons: ["inappropriate_content", "spam"],
        preview: {
          title: "منتجات التجميل الجديدة",
          description: "مجموعة رائعة من منتجات التجميل بأسعار مخفضة",
          image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300"
        }
      },
      {
        id: "C002",
        type: "products",
        author: "Fatima Al-Zahra",
        priority: "medium",
        submittedAt: "2024-01-15T09:15:00Z",
        flaggedReasons: [],
        preview: {
          title: "Luxury Handbag Collection",
          description: "Premium leather handbags with elegant designs",
          image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300"
        }
      },
      {
        id: "C003",
        type: "comments",
        author: "Mohammed Rashid",
        priority: "high",
        submittedAt: "2024-01-15T08:45:00Z",
        flaggedReasons: ["harassment"],
        preview: {
          title: "تعليق على منتج الإلكترونيات",
          description: "هذا المنتج سيء جداً ولا أنصح بشرائه إطلاقاً",
          image: null
        }
      },
      {
        id: "C004",
        type: "livestreams",
        author: "نورا العتيبي",
        priority: "low",
        submittedAt: "2024-01-15T07:20:00Z",
        flaggedReasons: [],
        preview: {
          title: "بث مباشر - عرض أزياء الصيف",
          description: "عرض مباشر لأحدث صيحات الموضة الصيفية",
          image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300"
        }
      }
    ],
    autoModerationRules: [
      {
        id: "R001",
        name: "Spam Detection",
        enabled: true,
        criteria: ["repeated_text", "excessive_links", "promotional_keywords"],
        action: "flag_for_review",
        triggeredCount: 34
      },
      {
        id: "R002",
        name: "Inappropriate Content Filter",
        enabled: true,
        criteria: ["adult_content", "violence", "hate_speech"],
        action: "auto_reject",
        triggeredCount: 12
      },
      {
        id: "R003",
        name: "Copyright Protection",
        enabled: true,
        criteria: ["copyright_keywords", "brand_mentions"],
        action: "flag_for_review",
        triggeredCount: 8
      },
      {
        id: "R004",
        name: "Quality Content Auto-Approval",
        enabled: false,
        criteria: ["verified_seller", "high_rating", "positive_history"],
        action: "auto_approve",
        triggeredCount: 156
      }
    ],
    moderationHistory: [
      {
        contentType: "posts",
        author: "سارة الأحمد",
        moderator: "Admin User",
        action: "approved",
        reason: "Content meets guidelines",
        actionDate: "2024-01-15T14:30:00Z"
      },
      {
        contentType: "products",
        author: "Omar Hassan",
        moderator: "Moderator 1",
        action: "rejected",
        reason: "Missing product information",
        actionDate: "2024-01-15T13:45:00Z"
      },
      {
        contentType: "comments",
        author: "ليلى المنصور",
        moderator: "Auto-Moderation",
        action: "rejected",
        reason: "Spam content detected",
        actionDate: "2024-01-15T12:20:00Z"
      },
      {
        contentType: "livestreams",
        author: "Khalid Al-Otaibi",
        moderator: "Admin User",
        action: "approved",
        reason: "Quality content approved",
        actionDate: "2024-01-15T11:10:00Z"
      }
    ]
  };
}

function requestChanges(contentId) {
  const changes = prompt(t("requested_changes_prompt"));
  if (changes) {
    alert(t("changes_requested_success").replace("{contentId}", contentId));
    renderContentModeration();
  }
}

function viewContentDetails(contentId) {
  const data = getContentModerationData();
  const content = data.contentQueue.find(c => c.id === contentId);
  
  if (content) {
    showSheet(t("content_details"), html`
      <div class="content-details-view">
        <div class="detail-section">
          <h3>${t("content_information")}</h3>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-label">${t("content_type")}:</span>
              <span class="detail-value">${t(content.type)}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">${t("author")}:</span>
              <span class="detail-value">${content.author}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">${t("priority")}:</span>
              <span class="detail-value priority-${content.priority}">${t(content.priority + "_priority")}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">${t("submitted")}:</span>
              <span class="detail-value">${new Date(content.submittedAt).toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <div class="detail-section">
          <h3>${t("content_preview")}</h3>
          <div class="preview-content">
            ${content.preview.image ? `<img src="${content.preview.image}" alt="${content.preview.title}" class="preview-image">` : ''}
            <h4>${content.preview.title}</h4>
            <p>${content.preview.description}</p>
          </div>
        </div>
        
        ${content.flaggedReasons.length > 0 ? `
          <div class="detail-section">
            <h3>${t("flagged_reasons")}</h3>
            <div class="flagged-reasons-list">
              ${content.flaggedReasons.map(reason => `
                <span class="flag-tag">${t(reason)}</span>
              `).join('')}
            </div>
          </div>
        ` : ''}
        
        <div class="detail-actions">
          <button class="btn-success" onclick="approveContent('${content.id}'); hideSheet();">${t("approve")}</button>
          <button class="btn-warning" onclick="requestChanges('${content.id}'); hideSheet();">${t("request_changes")}</button>
          <button class="btn-danger" onclick="rejectContent('${content.id}'); hideSheet();">${t("reject")}</button>
          <button class="btn-ghost" onclick="hideSheet()">${t("close")}</button>
        </div>
      </div>`);
  }
}

function filterContent() {
  const typeFilter = qs("#contentTypeFilter").value;
  const priorityFilter = qs("#priorityFilter").value;
  
  const cards = qsa(".content-card");
  cards.forEach(card => {
    const type = card.dataset.type;
    const priority = card.classList.contains('high') ? 'high' : 
                    card.classList.contains('medium') ? 'medium' : 'low';
    
    let show = true;
    
    if (typeFilter !== "all" && type !== typeFilter) {
      show = false;
    }
    
    if (priorityFilter !== "all" && priority !== priorityFilter) {
      show = false;
    }
    
    card.style.display = show ? "" : "none";
  });
}

function createModerationRule() {
  showSheet(html`
    <div class="sheet-header">
      <h2>${t("create_moderation_rule")}</h2>
    </div>
    <form class="rule-form" onsubmit="submitModerationRule(event)">
      <div class="form-group">
        <label>${t("rule_name")}</label>
        <input type="text" name="ruleName" required>
      </div>
      
      <div class="form-group">
        <label>${t("criteria")}</label>
        <div class="criteria-checkboxes">
          <label><input type="checkbox" name="criteria" value="spam"> ${t("spam")}</label>
          <label><input type="checkbox" name="criteria" value="inappropriate_content"> ${t("inappropriate_content")}</label>
          <label><input type="checkbox" name="criteria" value="copyright_violation"> ${t("copyright_violation")}</label>
          <label><input type="checkbox" name="criteria" value="harassment"> ${t("harassment")}</label>
          <label><input type="checkbox" name="criteria" value="false_information"> ${t("false_information")}</label>
        </div>
      </div>
      
      <div class="form-group">
        <label>${t("action")}</label>
        <select name="action" required>
          <option value="auto_approve">${t("auto_approve")}</option>
          <option value="auto_reject">${t("auto_reject")}</option>
          <option value="flag_for_review">${t("flag_for_review")}</option>
        </select>
      </div>
      
      <div class="form-actions">
        <button type="button" class="btn-ghost" onclick="hideSheet()">${t("cancel")}</button>
        <button type="submit" class="btn-primary">${t("create_rule")}</button>
      </div>
    </form>
  `);
}

function submitModerationRule(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  
  alert(t("rule_created_success"));
  hideSheet();
  renderContentModeration();
}

function toggleRule(ruleId, enabled) {
  alert(t("rule_status_updated").replace("{status}", enabled ? t("enabled") : t("disabled")));
  renderContentModeration();
}

function editRule(ruleId) {
  alert(t("edit_rule_functionality"));
}

function deleteRule(ruleId) {
  if (confirm(t("confirm_delete_rule"))) {
    alert(t("rule_deleted_success"));
    renderContentModeration();
  }
}

// Make content moderation functions globally accessible
window.requestChanges = requestChanges;
window.viewContentDetails = viewContentDetails;
window.createModerationRule = createModerationRule;
window.editRule = editRule;
window.deleteRule = deleteRule;
window.filterContent = filterContent;

function renderOrders(){
  const q = new URLSearchParams(location.hash.split("?")[1]||"");
  const term = (q.get("q")||"").toLowerCase();
  const list = state.orders.filter(o => (o.id+o.customer).toLowerCase().includes(term));

  const rows = list.map(o=>`
    <tr>
      <td data-label="${t("id")}"><a href="javascript:void(0)" onclick="__openOrder('${o.id}')"><strong>#${o.id}</strong></a></td>
      <td data-label="${t("customer")}">${o.customer}</td>
      <td data-label="${t("items")}">${o.items.map(i=>`${i.n}×${i.q}`).join(", ")}</td>
      <td data-label="${t("total")}">${fmtCurrency(o.total)}</td>
      <td data-label="${t("status")}"><span class="status ${o.status==='Paid'?'paid':'pending'}">${t(o.status.toLowerCase())||o.status}</span></td>
      <td data-label="${t("actions")}">
        ${o.status==="Placed"?`<button class="small ghost" onclick="__setOrder('${o.id}','Paid')">${t("mark_paid")}</button>`:""}
        ${o.status==="Paid"?`<button class="small ghost" onclick="__setOrder('${o.id}','Fulfilled')">${t("mark_fulfilled")}</button>`:""}
        ${o.status==="Fulfilled"?`<button class="small ghost" onclick="__setOrder('${o.id}','Delivered')">${t("mark_delivered")}</button>`:""}
        <button class="small ghost danger" onclick="__refund('${o.id}')">${t("refund")}</button>
      </td>
    </tr>`).join("");

  qs("#view").innerHTML = html`
    <section class="panel">
      <div class="row between">
        <strong>${t("nav_orders")}</strong>
        <div class="row">
          <input id="ord_q" placeholder="${t("search")}" value="${term || ""}" />
          <button class="small ghost" onclick="location.hash='#/orders?q='+encodeURIComponent(document.getElementById('ord_q').value)">Go</button>
        </div>
      </div>
      <table class="table">
        <thead><tr><th>${t("id")}</th><th>${t("customer")}</th><th>${t("items")}</th><th>${t("total")}</th><th>${t("status")}</th><th>${t("actions")}</th></tr></thead>
        <tbody>${rows || `<tr><td colspan="6">—</td></tr>`}</tbody>
      </table>
    </section>
  `;
  refreshBadges();
}
window.__setOrder = (id,status)=>{ const o=state.orders.find(x=>x.id===id); if(o){ o.status=status; save(); route(); } };
window.__refund = (id)=>{ state.tickets.push(ticket("T-"+Math.floor(Math.random()*900+100), "Refund created for "+id, "High")); state.metrics.ticketsOpen++; save(); toast(t("refund")); route(); };
window.__openOrder = (id)=>{
  const o = state.orders.find(x=>x.id===id);
  if(!o) return;
  showSheet("#"+o.id, html`
    <div class="stack">
      <div class="muted">${fmtDate(o.ts)} · ${o.customer}</div>
      <div>${o.items.map(i=>`${i.n} × ${i.q} — <strong>${fmtCurrency(i.q*i.p)}</strong>`).join("<br/>")}</div>
      <hr/>
      <div class="row" style="gap:8px">
        <button class="secondary" onclick="__setOrder('${o.id}','Paid')">${t("mark_paid")}</button>
        <button class="ghost" onclick="__setOrder('${o.id}','Fulfilled')">${t("mark_fulfilled")}</button>
        <button class="ghost" onclick="__setOrder('${o.id}','Delivered')">${t("mark_delivered")}</button>
        <button class="ghost danger" onclick="__refund('${o.id}')">${t("refund")}</button>
      </div>
    </div>
  `);
};

function renderSupport(){
  const data = getSupportData();
  
  qs("#view").innerHTML = html`
    <div class="support-dashboard" dir="${isRTL() ? 'rtl' : 'ltr'}">
      <header class="view-header">
        <h1>${t("support_management")}</h1>
      </header>

      <!-- Support Statistics -->
      <section class="support-section">
        <h2>${t("support_statistics")}</h2>
        
        <div class="support-stats">
          <div class="stats-grid">
            <div class="stat-card urgent">
              <div class="stat-icon">🆘</div>
              <div class="stat-content">
                <div class="stat-value">${data.statistics.openTickets}</div>
                <div class="stat-label">${t("open_tickets")}</div>
              </div>
            </div>
            
            <div class="stat-card success">
              <div class="stat-icon">✅</div>
              <div class="stat-content">
                <div class="stat-value">${data.statistics.closedTickets}</div>
                <div class="stat-label">${t("closed_tickets")}</div>
              </div>
            </div>
            
            <div class="stat-card warning">
              <div class="stat-icon">⏰</div>
              <div class="stat-content">
                <div class="stat-value">${data.statistics.avgResponseTime}h</div>
                <div class="stat-label">${t("avg_response_time")}</div>
              </div>
            </div>
            
            <div class="stat-card info">
              <div class="stat-icon">😊</div>
              <div class="stat-content">
                <div class="stat-value">${(data.statistics.satisfactionRate * 100).toFixed(1)}%</div>
                <div class="stat-label">${t("satisfaction_rate")}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Active Tickets -->
      <section class="support-section">
        <div class="section-header">
          <h2>${t("ticket_management")}</h2>
          <button class="btn-primary" onclick="createSupportTicket()">${t("create_ticket")}</button>
        </div>
        
        <div class="tickets-filters">
          <select id="statusFilter" onchange="filterTickets()">
            <option value="all">${t("all")}</option>
            <option value="open">${t("open")}</option>
            <option value="in_progress">${t("in_progress")}</option>
            <option value="escalated">${t("escalated")}</option>
            <option value="closed">${t("closed")}</option>
          </select>
          
          <select id="priorityFilter" onchange="filterTickets()">
            <option value="all">${t("all")}</option>
            <option value="high">${t("high_priority")}</option>
            <option value="medium">${t("medium_priority")}</option>
            <option value="low">${t("low_priority")}</option>
          </select>
          
          <select id="categoryFilter" onchange="filterTickets()">
            <option value="all">${t("all")}</option>
            <option value="technical">${t("ticket_technical")}</option>
            <option value="billing">${t("ticket_billing")}</option>
            <option value="account">${t("ticket_account")}</option>
            <option value="product">${t("ticket_product")}</option>
            <option value="shipping">${t("ticket_shipping")}</option>
          </select>
        </div>

        <div class="tickets-table-container">
          <table class="tickets-table">
            <thead>
              <tr>
                <th>${t("ticket_id")}</th>
                <th>${t("customer_name")}</th>
                <th>${t("ticket_subject")}</th>
                <th>${t("ticket_category")}</th>
                <th>${t("ticket_priority")}</th>
                <th>${t("assigned_agent")}</th>
                <th>${t("sla_status")}</th>
                <th>${t("ticket_status")}</th>
                <th>${t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              ${data.tickets.map(ticket => `
                <tr class="ticket-row ${ticket.priority.toLowerCase()}">
                  <td><strong>#${ticket.id}</strong></td>
                  <td>${ticket.customerName}</td>
                  <td>
                    <div class="ticket-subject">
                      <strong>${ticket.subject}</strong>
                      <small>${ticket.description.substring(0, 50)}...</small>
                    </div>
                  </td>
                  <td>${t(`ticket_${ticket.category}`)}</td>
                  <td>
                    <span class="priority-badge ${ticket.priority.toLowerCase()}">${t(ticket.priority.toLowerCase() + "_priority")}</span>
                  </td>
                  <td>${ticket.assignedAgent || t("unassigned")}</td>
                  <td>
                    <span class="sla-status ${ticket.slaStatus}">${t(ticket.slaStatus)}</span>
                  </td>
                  <td>
                    <span class="status-badge ${ticket.status}">${t(ticket.status)}</span>
                  </td>
                  <td>
                    <button class="btn-ghost small" onclick="assignTicket('${ticket.id}')">${t("assign")}</button>
                    <button class="btn-secondary small" onclick="replyToTicket('${ticket.id}')">${t("reply")}</button>
                    ${ticket.status !== 'closed' ? `
                      <button class="btn-success small" onclick="closeTicket('${ticket.id}')">${t("close_ticket")}</button>
                    ` : ''}
                    ${ticket.status !== 'escalated' && ticket.status !== 'closed' ? `
                      <button class="btn-warning small" onclick="escalateTicket('${ticket.id}')">${t("escalate_ticket")}</button>
                    ` : ''}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </section>

      <!-- Agent Performance -->
      <section class="support-section">
        <h2>${t("agent_performance")}</h2>
        
        <div class="agents-grid">
          ${data.agents.map(agent => `
            <div class="agent-card">
              <div class="agent-header">
                <div class="agent-avatar">
                  <span class="avatar-text">${agent.name.charAt(0)}</span>
                </div>
                <div class="agent-info">
                  <h3>${agent.name}</h3>
                  <span class="agent-status ${agent.status}">${t(agent.status)}</span>
                </div>
              </div>
              
              <div class="agent-stats">
                <div class="agent-stat">
                  <span class="stat-label">${t("open_tickets")}</span>
                  <span class="stat-value">${agent.activeTickets}</span>
                </div>
                <div class="agent-stat">
                  <span class="stat-label">${t("tickets_resolved")}</span>
                  <span class="stat-value">${agent.resolvedTickets}</span>
                </div>
                <div class="agent-stat">
                  <span class="stat-label">${t("avg_response_time")}</span>
                  <span class="stat-value">${agent.avgResponseTime}h</span>
                </div>
                <div class="agent-stat">
                  <span class="stat-label">${t("customer_satisfaction")}</span>
                  <span class="stat-value">${(agent.satisfactionRating * 100).toFixed(1)}%</span>
                </div>
              </div>
              
              <div class="agent-actions">
                <button class="btn-secondary small" onclick="viewAgentDetails('${agent.id}')">${t("view_details")}</button>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- SLA Performance -->
      <section class="support-section">
        <h2>${t("sla_status")} ${t("announcement_performance")}</h2>
        
        <div class="sla-overview">
          <div class="sla-metrics">
            <div class="sla-metric">
              <div class="metric-header">
                <h4>${t("first_response_sla")}</h4>
                <span class="metric-target">${t("target")}: 2h</span>
              </div>
              <div class="metric-bar">
                <div class="metric-progress" style="width: ${(data.slaMetrics.firstResponseSLA * 100).toFixed(1)}%"></div>
              </div>
              <div class="metric-value">${(data.slaMetrics.firstResponseSLA * 100).toFixed(1)}%</div>
            </div>
            
            <div class="sla-metric">
              <div class="metric-header">
                <h4>${t("resolution_sla")}</h4>
                <span class="metric-target">${t("target")}: 24h</span>
              </div>
              <div class="metric-bar">
                <div class="metric-progress" style="width: ${(data.slaMetrics.resolutionSLA * 100).toFixed(1)}%"></div>
              </div>
              <div class="metric-value">${(data.slaMetrics.resolutionSLA * 100).toFixed(1)}%</div>
            </div>
            
            <div class="sla-metric">
              <div class="metric-header">
                <h4>${t("escalation_rate")}</h4>
                <span class="metric-target">${t("target")}: <5%</span>
              </div>
              <div class="metric-bar">
                <div class="metric-progress warning" style="width: ${(data.slaMetrics.escalationRate * 100).toFixed(1)}%"></div>
              </div>
              <div class="metric-value">${(data.slaMetrics.escalationRate * 100).toFixed(1)}%</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `;

  refreshBadges();
}
// Support data functions
function getSupportData() {
  return {
    statistics: {
      openTickets: 47,
      closedTickets: 238,
      avgResponseTime: 2.3,
      satisfactionRate: 0.92
    },
    tickets: [
      {
        id: "T-2024001",
        customerName: "أحمد العتيبي",
        subject: "مشكلة في الدفع",
        description: "لا أستطيع إكمال عملية الدفع بالبطاقة الائتمانية",
        category: "billing",
        priority: "High",
        assignedAgent: "Sarah Al-Mansour",
        status: "open",
        slaStatus: "on_track",
        createdAt: "2024-01-15T10:30:00Z"
      },
      {
        id: "T-2024002",
        customerName: "Fatima Al-Zahra",
        subject: "طلب استرداد",
        description: "أريد إرجاع المنتج خلال فترة الضمان",
        category: "product",
        priority: "Medium",
        assignedAgent: "Omar Hassan",
        status: "in_progress",
        slaStatus: "at_risk",
        createdAt: "2024-01-15T09:15:00Z"
      },
      {
        id: "T-2024003",
        customerName: "Mohammed Al-Rashid",
        subject: "App crashing on startup",
        description: "The mobile app crashes every time I try to open it",
        category: "technical",
        priority: "High",
        assignedAgent: null,
        status: "escalated",
        slaStatus: "breach",
        createdAt: "2024-01-15T08:45:00Z"
      },
      {
        id: "T-2024004",
        customerName: "نورا الفيصل",
        subject: "تأخير في الشحن",
        description: "الطلب متأخر عن الموعد المحدد للتسليم",
        category: "shipping",
        priority: "Medium",
        assignedAgent: "Layla Ahmed",
        status: "open",
        slaStatus: "on_track",
        createdAt: "2024-01-15T07:20:00Z"
      },
      {
        id: "T-2024005",
        customerName: "Abdullah Al-Otaibi",
        subject: "Account verification issue",
        description: "Unable to verify my account with phone number",
        category: "account",
        priority: "Low",
        assignedAgent: "Sarah Al-Mansour",
        status: "closed",
        slaStatus: "met",
        createdAt: "2024-01-14T16:30:00Z"
      }
    ],
    agents: [
      {
        id: "A001",
        name: "Sarah Al-Mansour",
        status: "online",
        activeTickets: 12,
        resolvedTickets: 89,
        avgResponseTime: 1.8,
        satisfactionRating: 0.96
      },
      {
        id: "A002",
        name: "Omar Hassan",
        status: "online",
        activeTickets: 8,
        resolvedTickets: 67,
        avgResponseTime: 2.1,
        satisfactionRating: 0.91
      },
      {
        id: "A003",
        name: "Layla Ahmed",
        status: "busy",
        activeTickets: 15,
        resolvedTickets: 103,
        avgResponseTime: 3.2,
        satisfactionRating: 0.88
      },
      {
        id: "A004",
        name: "Khalid Al-Salam",
        status: "offline",
        activeTickets: 0,
        resolvedTickets: 45,
        avgResponseTime: 2.7,
        satisfactionRating: 0.94
      }
    ],
    slaMetrics: {
      firstResponseSLA: 0.87,
      resolutionSLA: 0.82,
      escalationRate: 0.08
    }
  };
}

// Support action functions
function createSupportTicket() {
  showSheet(
    t("create_ticket"),
    `<form class="support-form" onsubmit="submitNewTicket(event)">
      <div class="form-group">
        <label>${t("customer_name")}</label>
        <input type="text" name="customerName" required>
      </div>
      
      <div class="form-group">
        <label>${t("ticket_subject")}</label>
        <input type="text" name="subject" required>
      </div>
      
      <div class="form-group">
        <label>${t("ticket_category")}</label>
        <select name="category" required>
          <option value="general">${t("ticket_general")}</option>
          <option value="technical">${t("ticket_technical")}</option>
          <option value="billing">${t("ticket_billing")}</option>
          <option value="account">${t("ticket_account")}</option>
          <option value="product">${t("ticket_product")}</option>
          <option value="shipping">${t("ticket_shipping")}</option>
        </select>
      </div>
      
      <div class="form-group">
        <label>${t("ticket_priority")}</label>
        <select name="priority" required>
          <option value="Low">${t("low_priority")}</option>
          <option value="Medium">${t("medium_priority")}</option>
          <option value="High">${t("high_priority")}</option>
        </select>
      </div>
      
      <div class="form-group">
        <label>${t("description")}</label>
        <textarea name="description" rows="4" required></textarea>
      </div>
      
      <div class="form-actions">
        <button type="button" class="btn-ghost" onclick="hideSheet()">${t("cancel")}</button>
        <button type="submit" class="btn-primary">${t("create_ticket")}</button>
      </div>
    </form>`
  );
}

function assignTicket(ticketId) {
  const agents = getSupportData().agents.filter(a => a.status !== 'offline');
  
  showSheet(
    `${t("assign_ticket")} #${ticketId}`,
    `<div class="assign-form">
      <div class="form-group">
        <label>${t("select_agent")}</label>
        <div class="agents-list">
          ${agents.map(agent => `
            <div class="agent-option" onclick="confirmAssignment('${ticketId}', '${agent.id}', '${agent.name}')">
              <div class="agent-info">
                <strong>${agent.name}</strong>
                <span class="agent-status ${agent.status}">${t(agent.status)}</span>
              </div>
              <div class="agent-workload">
                <small>${agent.activeTickets} ${t("open_tickets")}</small>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>`
  );
}

function confirmAssignment(ticketId, agentId, agentName) {
  alert(t("ticket_assigned_success").replace("{ticketId}", ticketId).replace("{agentName}", agentName));
  hideSheet();
  renderSupport();
}

function replyToTicket(ticketId) {
  showSheet(
    `${t("reply_to_ticket")} #${ticketId}`,
    `<form class="reply-form" onsubmit="submitReply(event, '${ticketId}')">
      <div class="form-group">
        <label>${t("reply_message")}</label>
        <textarea name="reply" rows="6" required placeholder="${t("type_your_reply")}"></textarea>
      </div>
      
      <div class="form-group">
        <label>
          <input type="checkbox" name="internal"> ${t("internal_note")}
        </label>
      </div>
      
      <div class="form-actions">
        <button type="button" class="btn-ghost" onclick="hideSheet()">${t("cancel")}</button>
        <button type="submit" class="btn-primary">${t("send_reply")}</button>
      </div>
    </form>`
  );
}

function closeTicket(ticketId) {
  if (confirm(t("confirm_close_ticket").replace("{ticketId}", ticketId))) {
    alert(t("ticket_closed_success").replace("{ticketId}", ticketId));
    renderSupport();
  }
}

function escalateTicket(ticketId) {
  if (confirm(t("confirm_escalate_ticket").replace("{ticketId}", ticketId))) {
    alert(t("ticket_escalated_success").replace("{ticketId}", ticketId));
    renderSupport();
  }
}

// Make support functions globally accessible
window.createSupportTicket = createSupportTicket;
window.assignTicket = assignTicket;
window.confirmAssignment = confirmAssignment;
window.replyToTicket = replyToTicket;
window.closeTicket = closeTicket;
window.escalateTicket = escalateTicket;
window.filterTickets = filterTickets;

function filterTickets() {
  const statusFilter = qs("#statusFilter").value;
  const priorityFilter = qs("#priorityFilter").value;
  const categoryFilter = qs("#categoryFilter").value;
  
  const rows = qsa(".ticket-row");
  rows.forEach(row => {
    const status = row.querySelector(".status-badge").textContent.toLowerCase();
    const priority = row.querySelector(".priority-badge").textContent.toLowerCase();
    const category = row.cells[3].textContent.toLowerCase();
    
    let show = true;
    
    if (statusFilter !== "all" && !status.includes(t(statusFilter).toLowerCase())) {
      show = false;
    }
    
    if (priorityFilter !== "all" && !priority.includes(t(priorityFilter + "_priority").toLowerCase())) {
      show = false;
    }
    
    if (categoryFilter !== "all" && !category.includes(t("ticket_" + categoryFilter).toLowerCase())) {
      show = false;
    }
    
    row.style.display = show ? "" : "none";
  });
}

function submitNewTicket(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const ticketData = Object.fromEntries(formData);
  
  alert(t("ticket_created_success").replace("{ticketId}", "T-" + Date.now()));
  hideSheet();
  renderSupport();
}

function submitReply(event, ticketId) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const replyData = Object.fromEntries(formData);
  
  alert(t("reply_sent_success").replace("{ticketId}", ticketId));
  hideSheet();
  renderSupport();
}

function viewAgentDetails(agentId) {
  const agent = getSupportData().agents.find(a => a.id === agentId);
  
  showSheet(html`
    <div class="sheet-header">
      <h2>${t("agent_details")}: ${agent.name}</h2>
    </div>
    <div class="agent-details">
      <div class="detail-section">
        <h3>${t("agent_performance")}</h3>
        <div class="performance-grid">
          <div class="performance-item">
            <span class="performance-label">${t("current_status")}</span>
            <span class="performance-value status-badge ${agent.status}">${t(agent.status)}</span>
          </div>
          <div class="performance-item">
            <span class="performance-label">${t("open_tickets")}</span>
            <span class="performance-value">${agent.activeTickets}</span>
          </div>
          <div class="performance-item">
            <span class="performance-label">${t("tickets_resolved")}</span>
            <span class="performance-value">${agent.resolvedTickets}</span>
          </div>
          <div class="performance-item">
            <span class="performance-label">${t("avg_response_time")}</span>
            <span class="performance-value">${agent.avgResponseTime}h</span>
          </div>
          <div class="performance-item">
            <span class="performance-label">${t("customer_satisfaction")}</span>
            <span class="performance-value">${(agent.satisfactionRating * 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </div>
  `);
}

window.__assign = (id)=>{
  const a = prompt("Agent name?");
  const tix = state.tickets.find(x=>x.id===id);
  if(!tix) return;
  tix.assignee = a || tix.assignee || "Agent A";
  save(); route();
};
window.__reply = (id)=>{
  const tix = state.tickets.find(x=>x.id===id); if(!tix) return;
  showSheet(t("reply"), html`
    <div class="stack">
      <textarea id="r_body" rows="4" placeholder="Type reply…"></textarea>
      <div class="row right" style="gap:8px">
        <button class="ghost" onclick="__closeSheet()">${t("cancel")}</button>
        <button class="secondary" onclick="(function(){ const v=document.getElementById('r_body').value.trim(); if(!v) return; tix.thread.push({from:'Admin', text:v, ts:Date.now()}); toast('Sent'); save(); __closeSheet(); })()">${t("reply")}</button>
      </div>
    </div>
  `);
};

function renderSettings(){
  const p = state.prefs;
  qs("#view").innerHTML = html`
    <section class="panel">
      <strong>${t("settings_title")}</strong>
      <div class="grid cols-2" style="margin-top:10px">
        <div class="panel">
          <label>${t("language")}
            <select id="s_lang">
              <option value="en" ${getLang()==="en"?"selected":""}>English</option>
              <option value="ar" ${getLang()==="ar"?"selected":""}>العربية (السعودية)</option>
            </select>
          </label>
          <label style="margin-top:8px">${t("theme")}
            <select id="s_theme">
              <option value="auto">Auto</option>
              <option value="light">Light</option>
              <option value="dark" ${p.theme==="dark"?"selected":""}>Dark</option>
              <option value="emerald" ${p.theme==="emerald"?"selected":""}>Emerald</option>
              <option value="purple" ${p.theme==="purple"?"selected":""}>Purple</option>
              <option value="contrast" ${p.theme==="contrast"?"selected":""}>High Contrast</option>
            </select>
          </label>
          <label style="margin-top:8px"><input type="checkbox" id="s_pdpl" ${p.pdpl?"checked":""}/> ${t("pdpl_logging")}</label>
        </div>

        <div class="panel">
          <strong>${t("feature_flags")}</strong>
          <label><input type="checkbox" id="f_live" ${p.flags.live?"checked":""}/> ${t("flag_live")}</label>
          <label><input type="checkbox" id="f_ai" ${p.flags.ai?"checked":""}/> ${t("flag_ai")}</label>
          <label><input type="checkbox" id="f_wallet" ${p.flags.wallet?"checked":""}/> ${t("flag_wallet")}</label>
        </div>
      </div>

      <section class="panel" style="margin-top:12px">
        <strong>${t("data_export")}</strong>
        <div class="row" style="gap:8px; margin-top:8px">
          <button class="ghost" onclick="__downloadJSON()">${t("download")}</button>
          <button class="ghost danger" onclick="__resetDemo()">${t("reset_demo")}</button>
        </div>
      </section>
    </section>
  `;

  qs("#s_lang").onchange = (e)=>{ setLang(e.target.value); route(); };
  qs("#s_theme").onchange = (e)=>applyTheme(e.target.value);
  qs("#s_pdpl").onchange = (e)=>{ state.prefs.pdpl = e.target.checked; save(); logPDPL("pdpl_toggle", {enabled:e.target.checked}); };
  qs("#f_live").onchange = (e)=>{ state.prefs.flags.live = e.target.checked; save(); };
  qs("#f_ai").onchange = (e)=>{ state.prefs.flags.ai = e.target.checked; save(); };
  qs("#f_wallet").onchange = (e)=>{ state.prefs.flags.wallet = e.target.checked; save(); };
}
window.__downloadJSON = ()=>{
  const blob = new Blob([JSON.stringify(state,null,2)], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href=url; a.download="storez-admin-export.json"; a.click();
  URL.revokeObjectURL(url);
};
window.__resetDemo = reset;

/* -------------------- Header wiring & badges -------------------- */
function refreshBadges(){
  badge(qs("#creatorsBadge"), state.creators.stats.pendingReview);
  badge(qs("#liveBadge"), state.liveCommerce.activeSessions.length);
  badge(qs("#ordersBadge"), state.orders.length);
  badge(qs("#ticketsBadge"), state.tickets.length);
}
function applyTheme(theme){
  const applied = theme==="auto" ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark":"light") : theme;
  document.documentElement.setAttribute("data-theme", applied);
  qs("#metaThemeColor")?.setAttribute("content", getComputedStyle(document.documentElement).getPropertyValue("--bg").trim());
  state.prefs.theme = theme; save();
}
function wireHeader(){
  const langSelect = qs("#langSelect"); langSelect.value=getLang(); langSelect.addEventListener("change",e=>{ setLang(e.target.value); route(); });
  const themeSelect= qs("#themeSelect"); themeSelect.value=state.prefs.theme||"dark"; themeSelect.addEventListener("change",e=>applyTheme(e.target.value));

  qs("#btnImpersonate")?.addEventListener("click", ()=> {
    showSheet(t("impersonate"), html`
      <div class="stack">
        <label>Role<select id="imp_role"><option>buyer</option><option>seller</option><option>creator</option></select></label>
        <label>ID<input id="imp_id" placeholder="u123 / s900 / c45"/></label>
        <div class="row right" style="gap:8px">
          <button class="ghost" onclick="__closeSheet()">${t("cancel")}</button>
          <button class="secondary" onclick="(function(){ state.impersonating={role:document.getElementById('imp_role').value,id:document.getElementById('imp_id').value||'demo'}; save(); document.getElementById('envChip').textContent=t('impersonating')+' '+state.impersonating.role; __closeSheet(); })()">${t("start")}</button>
        </div>
      </div>
    `);
  });

  qs("#btnCreateNotice")?.addEventListener("click", ()=>{
    showSheet(t("notice_title"), html`
      <div class="stack">
        <input id="n_title" placeholder="${t("notice_title")}" />
        <textarea id="n_body" rows="4" placeholder="${t("notice_body")}"></textarea>
        <div class="row right" style="gap:8px">
          <button class="ghost" onclick="__closeSheet()">${t("cancel")}</button>
          <button class="secondary" onclick="(function(){ const title=document.getElementById('n_title').value||'Notice'; const body=document.getElementById('n_body').value||''; state.notices.unshift({id:'N-'+(state.notices.length+1), title, body, ts:Date.now()}); save(); toast(t('posted')); __closeSheet(); })()">${t("post_notice")}</button>
        </div>
      </div>
    `);
  });

  qs("#btnReset")?.addEventListener("click", reset);
}

/* -------------------- Live Commerce Functions -------------------- */
function showLiveSessionDetails(session) {
  const title = `${t("live_session_details")} - ${session.id}`;
  const body = html`
    <div style="max-width:600px">
      <div class="grid cols-2" style="gap:12px; margin:16px 0">
        <div><strong>${t("creator")}:</strong> ${session.creator}</div>
        <div><strong>${t("status")}:</strong> <span class="status ${session.status === 'Live' ? 'success' : 'pending'}">${session.status}</span></div>
        <div><strong>${t("viewers")}:</strong> ${session.viewers.toLocaleString()}</div>
        <div><strong>${t("duration")}:</strong> ${session.duration}</div>
        <div><strong>${t("revenue")}:</strong> ${fmtCurrency(session.revenue)}</div>
        <div><strong>${t("chat_messages")}:</strong> ${session.chatMessages}</div>
      </div>
      
      <div style="margin:16px 0">
        <strong>${t("session_title")}:</strong><br>
        <div style="background:var(--bg2); padding:12px; border-radius:8px; margin:8px 0">
          ${session.title}
        </div>
      </div>

      <div class="metric-grid" style="margin:16px 0">
        <div class="metric">
          <div class="k">${session.peakViewers || session.viewers}</div>
          <div class="t">${t("peak_viewers")}</div>
        </div>
        <div class="metric">
          <div class="k">${session.conversionRate || "12.8%"}</div>
          <div class="t">${t("conversion_rate")}</div>
        </div>
        <div class="metric">
          <div class="k">${session.avgViewTime || "8m"}</div>
          <div class="t">${t("avg_view_time")}</div>
        </div>
      </div>

      <div class="flex" style="gap:12px; margin-top:24px">
        <button class="btn secondary flex-1" onclick="showChatModeration('${session.id}')">
          ${t("moderate_chat")}
        </button>
        <button class="btn ghost danger flex-1" onclick="confirmEmergencyStop('${session.id}')">
          ${t("emergency_stop")}
        </button>
      </div>
    </div>
  `;
  showSheet(title, body);
}

function showChatModeration(sessionId) {
  const session = state.liveCommerce.activeSessions.find(x => x.id === sessionId);
  if (!session) return;
  
  const title = `${t("chat_moderation")} - ${session.id}`;
  const sampleMessages = [
    { user: "@viewer1", message: "Amazing product! Where can I buy?", time: "2m ago", flagged: false },
    { user: "@viewer2", message: "This looks great! 😍", time: "3m ago", flagged: false },
    { user: "@spammer", message: "Check out my channel for better deals!", time: "5m ago", flagged: true },
    { user: "@viewer3", message: "Love this color! Is it available in size M?", time: "7m ago", flagged: false },
    { user: "@viewer4", message: "When will you restock?", time: "10m ago", flagged: false }
  ];

  const body = html`
    <div style="max-width:700px">
      <div style="margin:16px 0">
        <div class="flex" style="gap:12px; margin-bottom:16px">
          <div class="metric">
            <div class="k">${session.chatMessages}</div>
            <div class="t">${t("total_messages")}</div>
          </div>
          <div class="metric">
            <div class="k">3</div>
            <div class="t">${t("flagged_messages")}</div>
          </div>
          <div class="metric">
            <div class="k">${session.viewers}</div>
            <div class="t">${t("active_viewers")}</div>
          </div>
        </div>
      </div>

      <div style="background:var(--bg2); border-radius:8px; padding:16px; max-height:400px; overflow-y:auto">
        <strong style="margin-bottom:12px; display:block">${t("live_chat_feed")}</strong>
        ${sampleMessages.map(msg => html`
          <div class="chat-message" style="padding:8px; border-bottom:1px solid var(--border); ${msg.flagged ? 'background:rgba(255,0,0,0.1); border-left:3px solid red;' : ''}">
            <div style="display:flex; justify-content:space-between; align-items:center">
              <div>
                <strong style="color:${msg.flagged ? 'red' : 'var(--primary)'}}">${msg.user}</strong>
                <span style="font-size:0.9em; color:var(--text-muted); margin-left:8px">${msg.time}</span>
              </div>
              ${msg.flagged ? '<span style="color:red; font-weight:bold">⚠️ FLAGGED</span>' : ''}
            </div>
            <div style="margin-top:4px">${msg.message}</div>
            <div style="margin-top:8px; display:flex; gap:8px">
              <button class="btn small ghost" onclick="moderateMessage('${msg.user}', 'timeout')">Timeout</button>
              <button class="btn small ghost" onclick="moderateMessage('${msg.user}', 'delete')">Delete</button>
              ${msg.flagged ? '<button class="btn small secondary" onclick="moderateMessage(\'' + msg.user + '\', \'approve\')">Approve</button>' : ''}
            </div>
          </div>
        `).join('')}
      </div>

      <div class="flex" style="gap:12px; margin-top:16px">
        <button class="btn secondary flex-1" onclick="enableSlowMode()">
          ${t("enable_slow_mode")}
        </button>
        <button class="btn ghost flex-1" onclick="pauseChat()">
          ${t("pause_chat")}
        </button>
      </div>
    </div>
  `;
  showSheet(title, body);
}

function moderateMessage(user, action) {
  const actions = {
    timeout: `User ${user} has been timed out for 5 minutes`,
    delete: `Message from ${user} has been deleted`,
    approve: `Message from ${user} has been approved`
  };
  toast(actions[action] || "Action completed");
}

function enableSlowMode() {
  toast("Slow mode enabled - users can send 1 message per 30 seconds");
}

function pauseChat() {
  toast("Chat has been paused for moderation");
}

function confirmEmergencyStop(sessionId) {
  if(confirm("Emergency stop this live session? This will immediately end the broadcast and notify viewers.")) {
    // Find and update session
    const sessionIndex = state.liveCommerce.activeSessions.findIndex(s => s.id === sessionId);
    if (sessionIndex >= 0) {
      state.liveCommerce.activeSessions.splice(sessionIndex, 1);
      state.liveCommerce.emergencyStops++;
      save();
      toast("Live session stopped");
      closeSheet();
      route(); // Refresh the view
    }
  }
}

// Make live commerce functions globally accessible
window.showChatModeration = showChatModeration;
window.moderateMessage = moderateMessage;
window.enableSlowMode = enableSlowMode;
window.pauseChat = pauseChat;
window.confirmEmergencyStop = confirmEmergencyStop;

function showScheduledSessionDetails(session) {
  const title = `${t("scheduled_sessions")} - ${session.id}`;
  const timeUntil = Math.floor((session.scheduledTime - Date.now()) / (60*1000));
  const timeDisplay = timeUntil > 60 ? `${Math.floor(timeUntil/60)}h ${timeUntil%60}m` : `${timeUntil}m`;
  
  const body = html`
    <div style="max-width:600px">
      <div class="grid cols-2" style="gap:12px; margin:16px 0">
        <div><strong>${t("creator")}:</strong> ${session.creatorName}</div>
        <div><strong>${t("status")}:</strong> <span class="status pending">${session.status}</span></div>
        <div><strong>Scheduled Time:</strong> ${new Date(session.scheduledTime).toLocaleString()}</div>
        <div><strong>Time Until Start:</strong> in ${timeDisplay}</div>
        <div><strong>Estimated Duration:</strong> ${session.estimatedDuration || 60} minutes</div>
        <div><strong>Products:</strong> ${session.products} items</div>
      </div>
      
      <div style="margin:16px 0">
        <strong>${t("session_title")}:</strong><br>
        <div style="background:var(--bg2); padding:12px; border-radius:8px; margin:8px 0">
          ${session.title}
        </div>
      </div>

      <div class="metric-grid" style="margin:16px 0">
        <div class="metric">
          <div class="k">${session.estimatedViewers || "1.2K"}</div>
          <div class="t">Expected Viewers</div>
        </div>
        <div class="metric">
          <div class="k">${session.marketingReach || "5.8K"}</div>
          <div class="t">Marketing Reach</div>
        </div>
        <div class="metric">
          <div class="k">${session.prereg || "234"}</div>
          <div class="t">Pre-registered</div>
        </div>
      </div>

      <div class="flex" style="gap:12px; margin-top:24px">
        <button class="btn secondary flex-1" onclick="startSessionEarly('${session.id}')">
          ${t("start")} Early
        </button>
        <button class="btn ghost flex-1" onclick="editScheduledSession('${session.id}')">
          Edit Schedule
        </button>
      </div>
    </div>
  `;
  showSheet(title, body);
}

function showSessionAnalytics(session) {
  const title = `Session Analytics - ${session.id}`;
  const conversionRate = session.revenue && session.totalViewers ? 
    ((session.revenue / session.totalViewers) * 100).toFixed(1) : "12.8";
  
  const body = html`
    <div style="max-width:700px">
      <div class="grid cols-2" style="gap:12px; margin:16px 0">
        <div><strong>${t("creator")}:</strong> ${session.creatorName}</div>
        <div><strong>${t("status")}:</strong> <span class="status ${session.status === 'Completed' ? 'paid' : 'failed'}">${session.status}</span></div>
        <div><strong>End Time:</strong> ${new Date(session.endTime).toLocaleString()}</div>
        <div><strong>${t("duration")}:</strong> ${session.duration} minutes</div>
        <div><strong>Total Viewers:</strong> ${session.totalViewers.toLocaleString()}</div>
        <div><strong>${t("revenue")}:</strong> ${fmtCurrency(session.revenue)}</div>
      </div>
      
      <div style="margin:16px 0">
        <strong>${t("session_title")}:</strong><br>
        <div style="background:var(--bg2); padding:12px; border-radius:8px; margin:8px 0">
          ${session.title}
        </div>
      </div>

      <div class="metric-grid" style="margin:16px 0">
        <div class="metric">
          <div class="k">${session.peakViewers || Math.floor(session.totalViewers * 1.3)}</div>
          <div class="t">Peak Viewers</div>
        </div>
        <div class="metric">
          <div class="k">${conversionRate}%</div>
          <div class="t">Conversion Rate</div>
        </div>
        <div class="metric">
          <div class="k">${session.avgWatchTime || "8.5m"}</div>
          <div class="t">Avg Watch Time</div>
        </div>
        <div class="metric">
          <div class="k">${session.chatEngagement || "456"}</div>
          <div class="t">Chat Messages</div>
        </div>
        <div class="metric">
          <div class="k">${session.productViews || "2.1K"}</div>
          <div class="t">Product Views</div>
        </div>
        <div class="metric">
          <div class="k">${session.shares || "89"}</div>
          <div class="t">Social Shares</div>
        </div>
      </div>

      <div style="margin:16px 0">
        <strong>Performance Summary:</strong><br>
        <div style="background:var(--bg2); padding:12px; border-radius:8px; margin:8px 0">
          ${session.status === 'Completed' ? 
            `✅ Session completed successfully with ${fmtCurrency(session.revenue)} revenue` :
            `⚠️ Session ended unexpectedly`}
        </div>
      </div>

      <div class="flex" style="gap:12px; margin-top:24px">
        <button class="btn secondary flex-1" onclick="exportSessionData('${session.id}')">
          Export Data
        </button>
        <button class="btn ghost flex-1" onclick="closeSheet()">
          Close
        </button>
      </div>
    </div>
  `;
  showSheet(title, body);
}

function startSessionEarly(sessionId) {
  if(confirm("Start this session early?")) {
    const session = state.liveCommerce.scheduledSessions.find(x => x.id === sessionId);
    if(session) {
      // Move to active sessions
      state.liveCommerce.activeSessions.push({
        ...session,
        viewers: 0,
        duration: 0,
        startTime: Date.now(),
        status: "Live",
        revenue: 0,
        chatMessages: 0,
        moderationFlags: 0,
        products: [{id:"P1",name:"Sample Product",sales:0,views:0}]
      });
      state.liveCommerce.scheduledSessions = state.liveCommerce.scheduledSessions.filter(x => x.id !== sessionId);
      state.liveCommerce.stats.activeSessions += 1;
      save();
      toast("Session started early");
      closeSheet();
      route();
    }
  }
}

function editScheduledSession(sessionId) {
  toast("Edit functionality will open session management modal");
}

function exportSessionData(sessionId) {
  toast("Session analytics exported to downloads");
}

/* -------------------- Admin Overview Data -------------------- */
function getAdminOverviewData() {
  return {
    platformMetrics: {
      totalUsers: { value: 127500, change: 8.5, period: "هذا الشهر" },
      activeSellers: { value: 4250, change: 12.3, total: 5000 },
      monthlyRevenue: { value: 2750000, currency: "SAR", change: 15.7 },
      systemUptime: { value: 99.97, unit: "%", target: 99.9 }
    },
    slaMetrics: {
      supportResponseTime: { current: 1.8, target: 2.0, unit: "ساعة", status: "good" },
      ticketResolutionTime: { current: 18.5, target: 24.0, unit: "ساعة", status: "excellent" },
      sellerApprovalTime: { current: 36, target: 48, unit: "ساعة", status: "good" },
      contentModerationTime: { current: 4.2, target: 8.0, unit: "ساعة", status: "excellent" }
    },
    pendingTasks: [
      { type: "seller_approval", count: 23, priority: "high", route: "/content-moderation" },
      { type: "content_review", count: 156, priority: "medium", route: "/content-moderation" },
      { type: "support_tickets", count: 89, priority: "high", route: "/support" },
      { type: "payment_disputes", count: 12, priority: "critical", route: "/billing" }
    ],
    quickActions: [
      { title: "مراجعة البائعين", icon: "👤", route: "/content-moderation" },
      { title: "دعم العملاء", icon: "🎧", route: "/support" },
      { title: "التحليلات المتقدمة", icon: "📊", route: "/analytics-platform" },
      { title: "إعدادات المنصة", icon: "⚙️", route: "/settings" }
    ]
  };
}

function getBillingData() {
  return {
    plans: [
      {
        id: "basic",
        nameKey: "plan_basic",
        monthlyPrice: 99,
        annualPrice: 999,
        subscribers: 1250,
        monthlyRevenue: 123750,
        featured: false,
        features: [
          "Up to 100 products",
          "Basic analytics",
          "Email support",
          "Standard themes",
          "Mobile app access"
        ]
      },
      {
        id: "standard",
        nameKey: "plan_standard", 
        monthlyPrice: 199,
        annualPrice: 1999,
        subscribers: 850,
        monthlyRevenue: 169150,
        featured: true,
        features: [
          "Up to 500 products",
          "Advanced analytics",
          "Priority support",
          "Custom themes",
          "Live streaming",
          "Social commerce tools"
        ]
      },
      {
        id: "premium",
        nameKey: "plan_premium",
        monthlyPrice: 399,
        annualPrice: 3999,
        subscribers: 340,
        monthlyRevenue: 135660,
        featured: false,
        features: [
          "Unlimited products",
          "Full analytics suite",
          "Dedicated support",
          "White-label solution",
          "AI recommendations",
          "API access",
          "Advanced integrations"
        ]
      }
    ],
    billingHistory: [
      {
        id: "inv_001",
        invoiceNumber: "INV-2024-001234",
        customerName: "أحمد العلي",
        planNameKey: "plan_standard",
        amount: 229.85, // includes 15% VAT
        issueDate: "2024-01-15",
        dueDate: "2024-02-15",
        status: "paid"
      },
      {
        id: "inv_002", 
        invoiceNumber: "INV-2024-001235",
        customerName: "فاطمة السعد",
        planNameKey: "plan_premium",
        amount: 458.85, // includes 15% VAT
        issueDate: "2024-01-10",
        dueDate: "2024-02-10",
        status: "pending"
      },
      {
        id: "inv_003",
        invoiceNumber: "INV-2024-001236", 
        customerName: "محمد الخالد",
        planNameKey: "plan_basic",
        amount: 113.85, // includes 15% VAT
        issueDate: "2024-01-08",
        dueDate: "2024-02-08",
        status: "overdue"
      },
      {
        id: "inv_004",
        invoiceNumber: "INV-2024-001237",
        customerName: "نورا القحطاني",
        planNameKey: "plan_standard",
        amount: 229.85,
        issueDate: "2024-01-05",
        dueDate: "2024-02-05", 
        status: "failed"
      },
      {
        id: "inv_005",
        invoiceNumber: "INV-2024-001238",
        customerName: "عبدالله المطيري",
        planNameKey: "plan_premium",
        amount: 458.85,
        issueDate: "2024-01-03",
        dueDate: "2024-02-03",
        status: "paid"
      }
    ],
    delinquentAccounts: [
      {
        customerId: "CUST_001",
        customerName: "محمد الخالد",
        planNameKey: "plan_basic",
        overdueAmount: 341.55, // 3 months
        overdueDays: 92,
        lastPaymentDate: "2023-10-15",
        priority: "high"
      },
      {
        customerId: "CUST_002", 
        customerName: "سارة العتيبي",
        planNameKey: "plan_standard",
        overdueAmount: 459.70, // 2 months
        overdueDays: 45,
        lastPaymentDate: "2023-12-01",
        priority: "medium"
      },
      {
        customerId: "CUST_003",
        customerName: "خالد الراشد",
        planNameKey: "plan_premium",
        overdueAmount: 917.70, // 2 months
        overdueDays: 38,
        lastPaymentDate: "2023-12-08",
        priority: "high"
      }
    ],
    taxSummary: {
      vatCollected: 45680.50,
      totalInvoices: 1847,
      vatRate: 0.15 // Saudi VAT rate
    }
  };
}

// Billing action functions
function createNewPlan() {
  console.log("Creating new plan...");
  // TODO: Implement plan creation
}

function editPlan(planId) {
  console.log("Editing plan:", planId);
  // TODO: Implement plan editing
}

function viewPlanDetails(planId) {
  console.log("Viewing plan details:", planId);
  // TODO: Implement plan details view
}

function filterBillingHistory() {
  console.log("Filtering billing history...");
  // TODO: Implement billing history filtering
}

function viewInvoice(invoiceId) {
  console.log("Viewing invoice:", invoiceId);
  // TODO: Implement invoice viewer
}

function retryPayment(id) {
  console.log("Retrying payment for:", id);
  // TODO: Implement payment retry
}

function sendInvoice(invoiceId) {
  console.log("Sending invoice:", invoiceId);
  // TODO: Implement invoice sending
}

function sendReminder(customerId) {
  console.log("Sending reminder to:", customerId);
  // TODO: Implement reminder sending
}

function suspendAccount(customerId) {
  console.log("Suspending account:", customerId);
  // TODO: Implement account suspension
}

function generateTaxReport() {
  console.log("Generating tax report...");
  // TODO: Implement tax report generation
}

function downloadVATReport() {
  console.log("Downloading VAT report...");
  // TODO: Implement VAT report download
}

// Make billing functions globally accessible
window.createNewPlan = createNewPlan;
window.editPlan = editPlan;
window.viewPlanDetails = viewPlanDetails;
window.filterBillingHistory = filterBillingHistory;
window.viewInvoice = viewInvoice;
window.retryPayment = retryPayment;
window.sendInvoice = sendInvoice;
window.sendReminder = sendReminder;
window.suspendAccount = suspendAccount;
window.generateTaxReport = generateTaxReport;
window.downloadVATReport = downloadVATReport;

function renderAICatalog(){
  const data = getAICatalogData();
  
  qs("#view").innerHTML = html`
    <div class="ai-catalog-dashboard" dir="${isRTL() ? 'rtl' : 'ltr'}">
      <header class="view-header">
        <h1>${t("ai_addons_marketplace")}</h1>
      </header>

      <!-- AI Add-ons Grid -->
      <section class="catalog-section">
        <div class="section-header">
          <h2>${t("ai_catalog")}</h2>
          <button class="btn-primary" onclick="addNewAddon()">${t("add_new_addon")}</button>
        </div>
        
        <!-- Category Filter -->
        <div class="catalog-filters">
          <select id="categoryFilter" onchange="filterAddons()">
            <option value="all">${t("all")}</option>
            <option value="analytics">${t("ai_category_analytics")}</option>
            <option value="automation">${t("ai_category_automation")}</option>
            <option value="content">${t("ai_category_content")}</option>
            <option value="customer">${t("ai_category_customer")}</option>
            <option value="marketing">${t("ai_category_marketing")}</option>
            <option value="inventory">${t("ai_category_inventory")}</option>
            <option value="recommendations">${t("ai_category_recommendations")}</option>
            <option value="translation">${t("ai_category_translation")}</option>
          </select>
          
          <select id="statusFilter" onchange="filterAddons()">
            <option value="all">${t("all")}</option>
            <option value="active">${t("active")}</option>
            <option value="inactive">${t("inactive")}</option>
            <option value="draft">${t("draft")}</option>
          </select>
        </div>

        <div class="addons-grid">
          ${data.addons.map(addon => `
            <div class="addon-card ${addon.status}">
              <div class="addon-header">
                <div class="addon-icon">
                  <span class="icon">${addon.icon}</span>
                </div>
                <div class="addon-info">
                  <h3>${addon.name}</h3>
                  <span class="category">${t(`ai_category_${addon.category}`)}</span>
                </div>
                <span class="status-badge ${addon.status}">${t(addon.status)}</span>
              </div>
              
              <div class="addon-description">
                <p>${addon.description}</p>
              </div>
              
              <div class="addon-stats">
                <div class="stat">
                  <span class="stat-value">${fmtCurrency(addon.price)}</span>
                  <span class="stat-label">${t("addon_price")}</span>
                </div>
                <div class="stat">
                  <span class="stat-value">${addon.subscribers.toLocaleString()}</span>
                  <span class="stat-label">${t("addon_subscribers")}</span>
                </div>
                <div class="stat">
                  <span class="stat-value">${fmtCurrency(addon.monthlyRevenue)}</span>
                  <span class="stat-label">${t("addon_revenue")}</span>
                </div>
              </div>
              
              <div class="addon-actions">
                <button class="btn-secondary small" onclick="editAddon('${addon.id}')">${t("edit_addon")}</button>
                <button class="btn-ghost small" onclick="viewAddonDetails('${addon.id}')">${t("view_details")}</button>
                ${addon.status === 'active' ? `
                  <button class="btn-warning small" onclick="disableAddon('${addon.id}')">${t("disable_addon")}</button>
                ` : `
                  <button class="btn-success small" onclick="enableAddon('${addon.id}')">${t("enable_addon")}</button>
                `}
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Entitlements Management -->
      <section class="catalog-section">
        <h2>${t("entitlements_management")}</h2>
        
        <div class="entitlements-container">
          <div class="entitlements-header">
            <div class="search-box">
              <input type="text" placeholder="${t("search")}..." id="sellerSearch" onkeyup="filterEntitlements()">
            </div>
            <button class="btn-primary" onclick="assignEntitlement()">${t("assign_entitlement")}</button>
          </div>

          <div class="entitlements-table-container">
            <table class="entitlements-table">
              <thead>
                <tr>
                  <th>${t("seller_name")}</th>
                  <th>${t("addon_name")}</th>
                  <th>${t("entitlement_status")}</th>
                  <th>${t("entitlement_date")}</th>
                  <th>${t("expires_on")}</th>
                  <th>${t("total_usage")}</th>
                  <th>${t("monthly_quota")}</th>
                  <th>${t("actions")}</th>
                </tr>
              </thead>
              <tbody>
                ${data.entitlements.map(entitlement => `
                  <tr>
                    <td>
                      <div class="seller-info">
                        <strong>${entitlement.sellerName}</strong>
                        <small>${entitlement.sellerId}</small>
                      </div>
                    </td>
                    <td>${entitlement.addonName}</td>
                    <td>
                      <span class="status ${entitlement.status}">${t(entitlement.status)}</span>
                    </td>
                    <td>${fmtDate(entitlement.assignedDate)}</td>
                    <td>${entitlement.expiresOn ? fmtDate(entitlement.expiresOn) : t("unlimited")}</td>
                    <td>${entitlement.totalUsage.toLocaleString()}</td>
                    <td>${entitlement.monthlyQuota === -1 ? t("unlimited") : entitlement.monthlyQuota.toLocaleString()}</td>
                    <td>
                      <button class="btn-ghost small" onclick="viewUsageDetails('${entitlement.id}')">${t("view_details")}</button>
                      <button class="btn-danger small" onclick="revokeEntitlement('${entitlement.id}')">${t("revoke_entitlement")}</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- Pricing Tiers Configuration -->
      <section class="catalog-section">
        <h2>${t("pricing_tiers")}</h2>
        
        <div class="pricing-tiers-grid">
          ${data.pricingTiers.map(tier => `
            <div class="pricing-tier-card ${tier.popular ? 'popular' : ''}">
              <div class="tier-header">
                <h3>${t(tier.nameKey)}</h3>
                <div class="tier-price">
                  <span class="price">${fmtCurrency(tier.price)}</span>
                  <span class="period">/${t("monthly_price")}</span>
                </div>
              </div>
              
              <div class="tier-features">
                <h4>${t("feature_configuration")}</h4>
                <ul>
                  ${tier.features.map(feature => `
                    <li class="${feature.included ? 'included' : 'excluded'}">
                      <span class="feature-icon">${feature.included ? '✓' : '✗'}</span>
                      ${t(feature.nameKey)}
                    </li>
                  `).join('')}
                </ul>
              </div>
              
              <div class="tier-limits">
                <div class="limit-item">
                  <span class="limit-label">${t("monthly_quota")}</span>
                  <span class="limit-value">${tier.monthlyQuota === -1 ? t("unlimited") : tier.monthlyQuota.toLocaleString()}</span>
                </div>
                <div class="limit-item">
                  <span class="limit-label">${t("api_access")}</span>
                  <span class="limit-value">${tier.apiAccess ? t("active") : t("inactive")}</span>
                </div>
              </div>
              
              <div class="tier-actions">
                <button class="btn-secondary small" onclick="editPricingTier('${tier.id}')">${t("edit_plan")}</button>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    </div>
  `;

  refreshBadges();
}

function getAICatalogData() {
  return {
    addons: [
      {
        id: "ai_analytics_pro",
        name: "AI Analytics Pro",
        category: "analytics",
        description: "Advanced AI-powered analytics with predictive insights, customer behavior analysis, and revenue forecasting.",
        icon: "📊",
        price: 149,
        subscribers: 324,
        monthlyRevenue: 48276,
        status: "active"
      },
      {
        id: "smart_inventory",
        name: "Smart Inventory Manager", 
        category: "inventory",
        description: "AI-driven inventory optimization with demand prediction, automated reordering, and stock level alerts.",
        icon: "📦",
        price: 99,
        subscribers: 156,
        monthlyRevenue: 15444,
        status: "active"
      },
      {
        id: "content_generator",
        name: "Content Generator AI",
        category: "content",
        description: "Generate product descriptions, social media posts, and marketing content using advanced AI language models.",
        icon: "✏️",
        price: 79,
        subscribers: 412,
        monthlyRevenue: 32548,
        status: "active"
      },
      {
        id: "customer_support_bot",
        name: "Customer Support Bot",
        category: "customer",
        description: "24/7 AI customer support with Arabic language support, order tracking, and automated responses.",
        icon: "🤖",
        price: 119,
        subscribers: 287,
        monthlyRevenue: 34153,
        status: "active"
      },
      {
        id: "recommendation_engine",
        name: "Smart Recommendations",
        category: "recommendations", 
        description: "Personalized product recommendations based on customer behavior, purchase history, and preferences.",
        icon: "🎯",
        price: 129,
        subscribers: 198,
        monthlyRevenue: 25542,
        status: "active"
      },
      {
        id: "marketing_automation",
        name: "Marketing Automation Suite",
        category: "marketing",
        description: "Automated email campaigns, social media posting, and targeted advertising with AI optimization.",
        icon: "📧",
        price: 189,
        subscribers: 143,
        monthlyRevenue: 27027,
        status: "active"
      },
      {
        id: "translation_pro",
        name: "AI Translation Pro",
        category: "translation",
        description: "Real-time translation between Arabic and English with cultural context and e-commerce terminology.",
        icon: "🌐",
        price: 69,
        subscribers: 234,
        monthlyRevenue: 16146,
        status: "active"
      },
      {
        id: "workflow_automation",
        name: "Workflow Automation",
        category: "automation",
        description: "Automate order processing, inventory updates, customer notifications, and business workflows.",
        icon: "⚙️",
        price: 109,
        subscribers: 167,
        monthlyRevenue: 18203,
        status: "inactive"
      }
    ],
    entitlements: [
      {
        id: "ent_001",
        sellerId: "SELL_001",
        sellerName: "أحمد التجاري",
        addonName: "AI Analytics Pro",
        status: "active",
        assignedDate: "2024-01-15",
        expiresOn: "2025-01-15",
        totalUsage: 2847,
        monthlyQuota: 5000
      },
      {
        id: "ent_002",
        sellerId: "SELL_002", 
        sellerName: "فاطمة للأزياء",
        addonName: "Content Generator AI",
        status: "active",
        assignedDate: "2024-02-01",
        expiresOn: null,
        totalUsage: 1256,
        monthlyQuota: -1
      },
      {
        id: "ent_003",
        sellerId: "SELL_003",
        sellerName: "محمد الإلكترونيات",
        addonName: "Smart Inventory Manager",
        status: "active",
        assignedDate: "2024-01-20",
        expiresOn: "2024-12-20",
        totalUsage: 892,
        monthlyQuota: 2000
      },
      {
        id: "ent_004",
        sellerId: "SELL_004",
        sellerName: "نورا الهدايا",
        addonName: "Customer Support Bot",
        status: "active",
        assignedDate: "2024-03-01",
        expiresOn: "2025-03-01",
        totalUsage: 3421,
        monthlyQuota: 10000
      },
      {
        id: "ent_005",
        sellerId: "SELL_005",
        sellerName: "عبدالله الرياضة",
        addonName: "Smart Recommendations",
        status: "inactive",
        assignedDate: "2024-01-10",
        expiresOn: "2024-07-10",
        totalUsage: 567,
        monthlyQuota: 1000
      }
    ],
    pricingTiers: [
      {
        id: "basic",
        nameKey: "tier_basic",
        price: 49,
        popular: false,
        monthlyQuota: 1000,
        apiAccess: false,
        features: [
          { nameKey: "advanced_analytics", included: false },
          { nameKey: "api_access", included: false },
          { nameKey: "premium_support", included: false },
          { nameKey: "custom_branding", included: false }
        ]
      },
      {
        id: "professional",
        nameKey: "tier_professional",
        price: 149,
        popular: true,
        monthlyQuota: 5000,
        apiAccess: true,
        features: [
          { nameKey: "advanced_analytics", included: true },
          { nameKey: "api_access", included: true },
          { nameKey: "premium_support", included: false },
          { nameKey: "custom_branding", included: false }
        ]
      },
      {
        id: "enterprise",
        nameKey: "tier_enterprise",
        price: 299,
        popular: false,
        monthlyQuota: -1,
        apiAccess: true,
        features: [
          { nameKey: "advanced_analytics", included: true },
          { nameKey: "api_access", included: true },
          { nameKey: "premium_support", included: true },
          { nameKey: "custom_branding", included: true }
        ]
      }
    ]
  };
}

// AI Catalog action functions
function addNewAddon() {
  console.log("Adding new AI add-on...");
  // TODO: Implement add-on creation
}

function filterAddons() {
  console.log("Filtering AI add-ons...");
  // TODO: Implement add-on filtering
}

function editAddon(addonId) {
  console.log("Editing add-on:", addonId);
  // TODO: Implement add-on editing
}

function viewAddonDetails(addonId) {
  console.log("Viewing add-on details:", addonId);
  // TODO: Implement add-on details view
}

function enableAddon(addonId) {
  console.log("Enabling add-on:", addonId);
  // TODO: Implement add-on enabling
}

function disableAddon(addonId) {
  console.log("Disabling add-on:", addonId);
  // TODO: Implement add-on disabling
}

function assignEntitlement() {
  console.log("Assigning entitlement...");
  // TODO: Implement entitlement assignment
}

function filterEntitlements() {
  console.log("Filtering entitlements...");
  // TODO: Implement entitlement filtering
}

function viewUsageDetails(entitlementId) {
  console.log("Viewing usage details:", entitlementId);
  // TODO: Implement usage details view
}

function revokeEntitlement(entitlementId) {
  console.log("Revoking entitlement:", entitlementId);
  // TODO: Implement entitlement revocation
}

function editPricingTier(tierId) {
  console.log("Editing pricing tier:", tierId);
  // TODO: Implement pricing tier editing
}

function renderAnnouncementsAdmin(){
  const data = getAnnouncementsData();
  
  qs("#view").innerHTML = html`
    <div class="announcements-dashboard" dir="${isRTL() ? 'rtl' : 'ltr'}">
      <header class="view-header">
        <h1>${t("announcement_management")}</h1>
      </header>

      <!-- Active Announcements -->
      <section class="announcements-section">
        <div class="section-header">
          <h2>${t("announcements_admin")}</h2>
          <button class="btn-primary" onclick="createAnnouncement()">${t("create_announcement")}</button>
        </div>
        
        <div class="announcements-filters">
          <select id="statusFilter" onchange="filterAnnouncements()">
            <option value="all">${t("all")}</option>
            <option value="published">${t("published")}</option>
            <option value="scheduled">${t("scheduled")}</option>
            <option value="unpublished">${t("unpublished")}</option>
            <option value="expired">${t("expired")}</option>
          </select>
          
          <select id="priorityFilter" onchange="filterAnnouncements()">
            <option value="all">${t("all")}</option>
            <option value="high">${t("high_priority")}</option>
            <option value="medium">${t("medium_priority")}</option>
            <option value="low">${t("low_priority")}</option>
          </select>
          
          <select id="placementFilter" onchange="filterAnnouncements()">
            <option value="all">${t("all")}</option>
            <option value="banner_top">${t("banner_top")}</option>
            <option value="banner_bottom">${t("banner_bottom")}</option>
            <option value="popup_modal">${t("popup_modal")}</option>
            <option value="in_feed">${t("in_feed")}</option>
            <option value="sidebar">${t("sidebar")}</option>
          </select>
        </div>

        <div class="announcements-grid">
          ${data.announcements.map(announcement => `
            <div class="announcement-card ${announcement.status} priority-${announcement.priority}">
              <div class="announcement-header">
                <div class="announcement-info">
                  <h3>${announcement.title}</h3>
                  <span class="announcement-type">${t(announcement.placement)}</span>
                </div>
                <div class="announcement-badges">
                  <span class="status-badge ${announcement.status}">${t(announcement.status)}</span>
                  <span class="priority-badge ${announcement.priority}">${t(announcement.priority + "_priority")}</span>
                </div>
              </div>
              
              <div class="announcement-content">
                <p>${announcement.content}</p>
              </div>
              
              <div class="announcement-details">
                <div class="detail">
                  <span class="label">${t("announcement_audience")}:</span>
                  <span class="value">${t(announcement.audience)}</span>
                </div>
                <div class="detail">
                  <span class="label">${t("start_date")}:</span>
                  <span class="value">${fmtDate(announcement.startDate)}</span>
                </div>
                <div class="detail">
                  <span class="label">${t("end_date")}:</span>
                  <span class="value">${announcement.endDate ? fmtDate(announcement.endDate) : t("unlimited")}</span>
                </div>
              </div>
              
              <div class="announcement-metrics">
                <div class="metric">
                  <span class="metric-value">${announcement.impressions.toLocaleString()}</span>
                  <span class="metric-label">${t("impressions")}</span>
                </div>
                <div class="metric">
                  <span class="metric-value">${announcement.clicks.toLocaleString()}</span>
                  <span class="metric-label">${t("clicks")}</span>
                </div>
                <div class="metric">
                  <span class="metric-value">${(announcement.clickRate * 100).toFixed(2)}%</span>
                  <span class="metric-label">${t("click_rate")}</span>
                </div>
                <div class="metric">
                  <span class="metric-value">${(announcement.conversionRate * 100).toFixed(2)}%</span>
                  <span class="metric-label">${t("conversion_rate")}</span>
                </div>
              </div>
              
              <div class="announcement-actions">
                <button class="btn-secondary small" onclick="editAnnouncement('${announcement.id}')">${t("edit_announcement")}</button>
                <button class="btn-ghost small" onclick="viewAnnouncementAnalytics('${announcement.id}')">${t("announcement_analytics")}</button>
                ${announcement.status === 'published' ? `
                  <button class="btn-warning small" onclick="unpublishAnnouncement('${announcement.id}')">${t("unpublish_announcement")}</button>
                ` : announcement.status === 'unpublished' ? `
                  <button class="btn-success small" onclick="publishAnnouncement('${announcement.id}')">${t("publish_announcement")}</button>
                ` : ''}
                <button class="btn-danger small" onclick="deleteAnnouncement('${announcement.id}')">${t("delete_announcement")}</button>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Performance Overview -->
      <section class="announcements-section">
        <h2>${t("announcement_performance")}</h2>
        
        <div class="performance-overview">
          <div class="performance-stats">
            <div class="stat-card">
              <div class="stat-icon">📊</div>
              <div class="stat-content">
                <div class="stat-value">${data.overview.totalImpressions.toLocaleString()}</div>
                <div class="stat-label">${t("total")} ${t("impressions")}</div>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">👆</div>
              <div class="stat-content">
                <div class="stat-value">${data.overview.totalClicks.toLocaleString()}</div>
                <div class="stat-label">${t("total")} ${t("clicks")}</div>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">📈</div>
              <div class="stat-content">
                <div class="stat-value">${(data.overview.averageClickRate * 100).toFixed(2)}%</div>
                <div class="stat-label">${t("average")} ${t("click_rate")}</div>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">🎯</div>
              <div class="stat-content">
                <div class="stat-value">${(data.overview.averageConversionRate * 100).toFixed(2)}%</div>
                <div class="stat-label">${t("average")} ${t("conversion_rate")}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Placement Performance -->
      <section class="announcements-section">
        <h2>${t("announcement_placement")} ${t("announcement_performance")}</h2>
        
        <div class="placement-performance">
          <div class="placement-table-container">
            <table class="placement-table">
              <thead>
                <tr>
                  <th>${t("announcement_placement")}</th>
                  <th>${t("active")} ${t("announcements")}</th>
                  <th>${t("impressions")}</th>
                  <th>${t("clicks")}</th>
                  <th>${t("click_rate")}</th>
                  <th>${t("conversion_rate")}</th>
                </tr>
              </thead>
              <tbody>
                ${data.placementStats.map(stat => `
                  <tr>
                    <td><strong>${t(stat.placement)}</strong></td>
                    <td>${stat.activeCount}</td>
                    <td>${stat.impressions.toLocaleString()}</td>
                    <td>${stat.clicks.toLocaleString()}</td>
                    <td>${(stat.clickRate * 100).toFixed(2)}%</td>
                    <td>${(stat.conversionRate * 100).toFixed(2)}%</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  `;

  refreshBadges();
}

function getAnnouncementsData() {
  return {
    announcements: [
      {
        id: "ann_001",
        title: "الجمعة البيضاء - خصومات تصل إلى 70%",
        content: "استمتع بأكبر عروض الجمعة البيضاء على جميع المنتجات. خصومات حصرية للمشترين والبائعين.",
        placement: "banner_top",
        priority: "high",
        status: "published",
        audience: "all_users",
        startDate: "2024-11-01",
        endDate: "2024-11-30",
        impressions: 1250000,
        clicks: 87500,
        clickRate: 0.07,
        conversionRate: 0.045
      },
      {
        id: "ann_002", 
        title: "منصة الذكاء الاصطناعي الجديدة",
        content: "اكتشف أدوات الذكاء الاصطناعي الجديدة لتحسين متجرك وزيادة المبيعات.",
        placement: "popup_modal",
        priority: "medium",
        status: "published",
        audience: "sellers_only",
        startDate: "2024-10-15",
        endDate: null,
        impressions: 234000,
        clicks: 14040,
        clickRate: 0.06,
        conversionRate: 0.032
      },
      {
        id: "ann_003",
        title: "تحديث سياسة الخصوصية",
        content: "تم تحديث سياسة الخصوصية وفقاً لقانون حماية البيانات الشخصية السعودي (PDPL).",
        placement: "in_feed",
        priority: "medium",
        status: "published",
        audience: "all_users",
        startDate: "2024-10-01",
        endDate: "2024-12-31",
        impressions: 892000,
        clicks: 31220,
        clickRate: 0.035,
        conversionRate: 0.012
      },
      {
        id: "ann_004",
        title: "برنامج البائع المميز",
        content: "انضم إلى برنامج البائع المميز واحصل على مزايا حصرية ودعم أولوية.",
        placement: "sidebar",
        priority: "low",
        status: "scheduled",
        audience: "sellers_only",
        startDate: "2024-11-15",
        endDate: "2025-01-15",
        impressions: 0,
        clicks: 0,
        clickRate: 0,
        conversionRate: 0
      },
      {
        id: "ann_005",
        title: "خدمة الدعم الفني الجديدة",
        content: "خدمة دعم فني 24/7 باللغة العربية مع فريق متخصص لحل جميع مشاكلك التقنية.",
        placement: "banner_bottom",
        priority: "medium",
        status: "unpublished",
        audience: "premium_users",
        startDate: "2024-12-01",
        endDate: "2025-02-28",
        impressions: 0,
        clicks: 0,
        clickRate: 0,
        conversionRate: 0
      },
      {
        id: "ann_006",
        title: "مسابقة أفضل متجر إلكتروني",
        content: "شارك في مسابقة أفضل متجر إلكتروني واربح جوائز قيمة تصل إلى 50,000 ريال سعودي.",
        placement: "popup_modal",
        priority: "high",
        status: "expired",
        audience: "sellers_only",
        startDate: "2024-08-01",
        endDate: "2024-09-30",
        impressions: 567000,
        clicks: 45360,
        clickRate: 0.08,
        conversionRate: 0.055
      }
    ],
    overview: {
      totalImpressions: 2943000,
      totalClicks: 178120,
      averageClickRate: 0.0605,
      averageConversionRate: 0.0348
    },
    placementStats: [
      {
        placement: "banner_top",
        activeCount: 1,
        impressions: 1250000,
        clicks: 87500,
        clickRate: 0.07,
        conversionRate: 0.045
      },
      {
        placement: "popup_modal", 
        activeCount: 1,
        impressions: 234000,
        clicks: 14040,
        clickRate: 0.06,
        conversionRate: 0.032
      },
      {
        placement: "in_feed",
        activeCount: 1,
        impressions: 892000,
        clicks: 31220,
        clickRate: 0.035,
        conversionRate: 0.012
      },
      {
        placement: "sidebar",
        activeCount: 0,
        impressions: 0,
        clicks: 0,
        clickRate: 0,
        conversionRate: 0
      },
      {
        placement: "banner_bottom",
        activeCount: 0,
        impressions: 0,
        clicks: 0,
        clickRate: 0,
        conversionRate: 0
      }
    ]
  };
}

// Announcements action functions
function createAnnouncement() {
  console.log("Creating new announcement...");
  // TODO: Implement announcement creation
}

function filterAnnouncements() {
  console.log("Filtering announcements...");
  // TODO: Implement announcement filtering
}

function editAnnouncement(announcementId) {
  console.log("Editing announcement:", announcementId);
  // TODO: Implement announcement editing
}

function viewAnnouncementAnalytics(announcementId) {
  console.log("Viewing announcement analytics:", announcementId);
  // TODO: Implement analytics view
}

function publishAnnouncement(announcementId) {
  console.log("Publishing announcement:", announcementId);
  // TODO: Implement announcement publishing
}

function unpublishAnnouncement(announcementId) {
  console.log("Unpublishing announcement:", announcementId);
  // TODO: Implement announcement unpublishing
}

function deleteAnnouncement(announcementId) {
  console.log("Deleting announcement:", announcementId);
  // TODO: Implement announcement deletion
}

function renderPaymentProviders(){
  const data = getPaymentProvidersData();
  
  qs("#view").innerHTML = html`
    <div class="payment-providers-dashboard" dir="${isRTL() ? 'rtl' : 'ltr'}">
      <header class="view-header">
        <h1>${t("provider_management")}</h1>
      </header>

      <!-- Payment Providers Grid -->
      <section class="providers-section">
        <div class="section-header">
          <h2>${t("payment_providers")}</h2>
          <button class="btn-primary" onclick="addPaymentProvider()">${t("add_provider")}</button>
        </div>
        
        <div class="providers-filters">
          <select id="statusFilter" onchange="filterProviders()">
            <option value="all">${t("all")}</option>
            <option value="enabled">${t("enabled")}</option>
            <option value="disabled">${t("disabled")}</option>
            <option value="testing">${t("testing")}</option>
          </select>
          
          <select id="typeFilter" onchange="filterProviders()">
            <option value="all">${t("all")}</option>
            <option value="credit_card">${t("credit_card")}</option>
            <option value="digital_wallet">${t("digital_wallet")}</option>
            <option value="bank_transfer">${t("bank_transfer")}</option>
            <option value="buy_now_pay_later">${t("buy_now_pay_later")}</option>
          </select>
        </div>

        <div class="providers-grid">
          ${data.providers.map(provider => `
            <div class="provider-card ${provider.status} integration-${provider.integrationStatus}">
              <div class="provider-header">
                <div class="provider-logo">
                  <img src="${provider.logoUrl}" alt="${provider.name}" class="provider-logo-img">
                </div>
                <div class="provider-info">
                  <h3>${provider.name}</h3>
                  <span class="provider-type">${t(provider.type)}</span>
                </div>
                <div class="provider-badges">
                  <span class="status-badge ${provider.status}">${t(provider.status)}</span>
                  <span class="integration-badge ${provider.integrationStatus}">${t(provider.integrationStatus)}</span>
                </div>
              </div>
              
              <div class="provider-stats">
                <div class="stat">
                  <span class="stat-value">${provider.transactionFee}%</span>
                  <span class="stat-label">${t("transaction_fee")}</span>
                </div>
                <div class="stat">
                  <span class="stat-value">${fmtCurrency(provider.monthlyVolume)}</span>
                  <span class="stat-label">${t("monthly_volume")}</span>
                </div>
                <div class="stat">
                  <span class="stat-value">${(provider.successRate * 100).toFixed(1)}%</span>
                  <span class="stat-label">${t("success_rate")}</span>
                </div>
              </div>
              
              <div class="provider-features">
                <div class="feature-list">
                  ${provider.features.map(feature => `
                    <span class="feature-tag">${feature}</span>
                  `).join('')}
                </div>
              </div>
              
              <div class="provider-actions">
                <button class="btn-secondary small" onclick="configureProvider('${provider.id}')">${t("configure_provider")}</button>
                <button class="btn-ghost small" onclick="testIntegration('${provider.id}')">${t("test_integration")}</button>
                ${provider.status === 'enabled' ? `
                  <button class="btn-warning small" onclick="disableProvider('${provider.id}')">${t("disable_provider")}</button>
                ` : `
                  <button class="btn-success small" onclick="enableProvider('${provider.id}')">${t("enable_provider")}</button>
                `}
                <button class="btn-ghost small" onclick="viewTransactions('${provider.id}')">${t("view_transactions")}</button>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Payment Statistics -->
      <section class="providers-section">
        <h2>${t("payment_statistics")}</h2>
        
        <div class="payment-stats">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">💳</div>
              <div class="stat-content">
                <div class="stat-value">${data.statistics.totalTransactions.toLocaleString()}</div>
                <div class="stat-label">${t("total_transactions")}</div>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">💰</div>
              <div class="stat-content">
                <div class="stat-value">${fmtCurrency(data.statistics.totalVolume)}</div>
                <div class="stat-label">${t("total_volume")}</div>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">✅</div>
              <div class="stat-content">
                <div class="stat-value">${(data.statistics.averageSuccessRate * 100).toFixed(1)}%</div>
                <div class="stat-label">${t("average_success_rate")}</div>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">📊</div>
              <div class="stat-content">
                <div class="stat-value">${fmtCurrency(data.statistics.totalFees)}</div>
                <div class="stat-label">${t("provider_fees")}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Provider Performance Table -->
      <section class="providers-section">
        <h2>${t("provider_performance")}</h2>
        
        <div class="performance-table-container">
          <table class="performance-table">
            <thead>
              <tr>
                <th>${t("provider_name")}</th>
                <th>${t("provider_type")}</th>
                <th>${t("total_transactions")}</th>
                <th>${t("monthly_volume")}</th>
                <th>${t("success_rate")}</th>
                <th>${t("transaction_fee")}</th>
                <th>${t("integration_status")}</th>
                <th>${t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              ${data.providers.map(provider => `
                <tr>
                  <td>
                    <div class="provider-name-cell">
                      <img src="${provider.logoUrl}" alt="${provider.name}" class="provider-mini-logo">
                      <strong>${provider.name}</strong>
                    </div>
                  </td>
                  <td>${t(provider.type)}</td>
                  <td>${provider.totalTransactions.toLocaleString()}</td>
                  <td>${fmtCurrency(provider.monthlyVolume)}</td>
                  <td>
                    <span class="success-rate ${provider.successRate > 0.95 ? 'excellent' : provider.successRate > 0.9 ? 'good' : 'warning'}">
                      ${(provider.successRate * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td>${provider.transactionFee}%</td>
                  <td>
                    <span class="integration-status ${provider.integrationStatus}">${t(provider.integrationStatus)}</span>
                  </td>
                  <td>
                    <button class="btn-ghost small" onclick="configureProvider('${provider.id}')">${t("configure_provider")}</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `;

  refreshBadges();
}

function getPaymentProvidersData() {
  return {
    providers: [
      {
        id: "mada",
        name: "Mada",
        type: "debit_card", 
        status: "enabled",
        integrationStatus: "integration_complete",
        transactionFee: 1.2,
        monthlyVolume: 12500000,
        successRate: 0.987,
        totalTransactions: 856420,
        logoUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzAwNzY0MyIvPjx0ZXh0IHg9IjUiIHk9IjI2IiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiPm1hZGE8L3RleHQ+PC9zdmc+",
        features: ["Saudi Local", "Instant Settlement", "No Chargebacks", "SAMA Regulated"]
      },
      {
        id: "visa_mastercard",
        name: "Visa/Mastercard",
        type: "credit_card",
        status: "enabled", 
        integrationStatus: "integration_complete",
        transactionFee: 2.9,
        monthlyVolume: 8750000,
        successRate: 0.952,
        totalTransactions: 234560,
        logoUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzFFNDc5OSIvPjx0ZXh0IHg9IjgiIHk9IjE4IiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSI4Ij5WSVNBPC90ZXh0Pjx0ZXh0IHg9IjQiIHk9IjMwIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSI2Ij5NQVNURVJDQVJEPC90ZXh0Pjwvc3ZnPg==",
        features: ["Global Acceptance", "Fraud Protection", "3D Secure", "Recurring Payments"]
      },
      {
        id: "apple_pay",
        name: "Apple Pay", 
        type: "digital_wallet",
        status: "enabled",
        integrationStatus: "integration_complete",
        transactionFee: 2.15,
        monthlyVolume: 3420000,
        successRate: 0.975,
        totalTransactions: 98765,
        logoUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzAwMCIvPjx0ZXh0IHg9IjEwIiB5PSIyNiIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTAiPkFwcGxlPC90ZXh0Pjwvc3ZnPg==",
        features: ["Touch ID/Face ID", "Secure Element", "No Card Details", "Fast Checkout"]
      },
      {
        id: "stc_pay",
        name: "STC Pay",
        type: "digital_wallet",
        status: "enabled",
        integrationStatus: "integration_complete", 
        transactionFee: 1.8,
        monthlyVolume: 2850000,
        successRate: 0.968,
        totalTransactions: 156789,
        logoUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzY2MDBGRiIvPjx0ZXh0IHg9IjYiIHk9IjI2IiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxMCI+U1RDPC90ZXh0Pjwvc3ZnPg==",
        features: ["Saudi Mobile Wallet", "QR Code Payments", "P2P Transfers", "Bill Payments"]
      },
      {
        id: "google_pay",
        name: "Google Pay",
        type: "digital_wallet", 
        status: "disabled",
        integrationStatus: "integration_pending",
        transactionFee: 2.25,
        monthlyVolume: 0,
        successRate: 0,
        totalTransactions: 0,
        logoUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzRBOTBFMiIvPjx0ZXh0IHg9IjgiIHk9IjI2IiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSI5Ij5Hb29nbGU8L3RleHQ+PC9zdmc+",
        features: ["Android Integration", "Tokenization", "Contactless", "In-App Payments"]
      },
      {
        id: "tabby",
        name: "Tabby BNPL",
        type: "buy_now_pay_later",
        status: "testing",
        integrationStatus: "integration_complete",
        transactionFee: 4.5,
        monthlyVolume: 1250000,
        successRate: 0.923,
        totalTransactions: 23456,
        logoUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iI0ZGNkYwMCIvPjx0ZXh0IHg9IjgiIHk9IjI2IiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxMCI+VGFiYnk8L3RleHQ+PC9zdmc+",
        features: ["4 Installments", "No Interest", "Instant Approval", "Young Demographics"]
      },
      {
        id: "bank_transfer",
        name: "Bank Transfer (SADAD)",
        type: "bank_transfer",
        status: "enabled",
        integrationStatus: "integration_complete",
        transactionFee: 0.5,
        monthlyVolume: 5670000,
        successRate: 0.994,
        totalTransactions: 67890,
        logoUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzAwODA1MyIvPjx0ZXh0IHg9IjYiIHk9IjI2IiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSI5Ij5TQURBRDwvdGV4dD48L3N2Zz4=",
        features: ["Direct Bank Transfer", "High Value Transactions", "Lower Fees", "B2B Preferred"]
      }
    ],
    statistics: {
      totalTransactions: 1437880,
      totalVolume: 34435000,
      averageSuccessRate: 0.9578,
      totalFees: 689430
    }
  };
}

// Payment providers action functions
function addPaymentProvider() {
  console.log("Adding new payment provider...");
  // TODO: Implement provider addition
}

function filterProviders() {
  console.log("Filtering payment providers...");
  // TODO: Implement provider filtering
}

function configureProvider(providerId) {
  console.log("Configuring provider:", providerId);
  // TODO: Implement provider configuration
}

function testIntegration(providerId) {
  console.log("Testing integration for:", providerId);
  // TODO: Implement integration testing
}

function enableProvider(providerId) {
  console.log("Enabling provider:", providerId);
  // TODO: Implement provider enabling
}

function disableProvider(providerId) {
  console.log("Disabling provider:", providerId);
  // TODO: Implement provider disabling
}

function viewTransactions(providerId) {
  console.log("Viewing transactions for:", providerId);
  // TODO: Implement transaction viewing
}

function renderShippingProviders(){
  const data = getShippingProvidersData();
  
  qs("#view").innerHTML = html`
    <div class="shipping-providers-dashboard" dir="${isRTL() ? 'rtl' : 'ltr'}">
      <header class="view-header">
        <h1>${t("courier_management")}</h1>
      </header>

      <!-- Shipping Providers Grid -->
      <section class="couriers-section">
        <div class="section-header">
          <h2>${t("shipping_providers")}</h2>
          <button class="btn-primary" onclick="addShippingProvider()">${t("add_courier")}</button>
        </div>
        
        <div class="couriers-filters">
          <select id="statusFilter" onchange="filterCouriers()">
            <option value="all">${t("all")}</option>
            <option value="enabled">${t("enabled")}</option>
            <option value="disabled">${t("disabled")}</option>
            <option value="testing">${t("testing")}</option>
          </select>
          
          <select id="serviceFilter" onchange="filterCouriers()">
            <option value="all">${t("all")}</option>
            <option value="express_delivery">${t("express_delivery")}</option>
            <option value="standard_delivery">${t("standard_delivery")}</option>
            <option value="same_day_delivery">${t("same_day_delivery")}</option>
            <option value="next_day_delivery">${t("next_day_delivery")}</option>
          </select>
        </div>

        <div class="couriers-grid">
          ${data.couriers.map(courier => `
            <div class="courier-card ${courier.status}">
              <div class="courier-header">
                <div class="courier-logo">
                  <img src="${courier.logoUrl}" alt="${courier.name}" class="courier-logo-img">
                </div>
                <div class="courier-info">
                  <h3>${courier.name}</h3>
                  <span class="courier-type">${t(courier.serviceType)}</span>
                </div>
                <div class="courier-badges">
                  <span class="status-badge ${courier.status}">${t(courier.status)}</span>
                  <span class="coverage-badge">${t(courier.coverageArea)}</span>
                </div>
              </div>
              
              <div class="courier-stats">
                <div class="stat">
                  <span class="stat-value">${courier.averageDeliveryTime} ${t("days")}</span>
                  <span class="stat-label">${t("delivery_time")}</span>
                </div>
                <div class="stat">
                  <span class="stat-value">${fmtCurrency(courier.averageCost)}</span>
                  <span class="stat-label">${t("average")} ${t("shipping_cost")}</span>
                </div>
                <div class="stat">
                  <span class="stat-value">${(courier.onTimeRate * 100).toFixed(1)}%</span>
                  <span class="stat-label">${t("on_time_delivery")}</span>
                </div>
              </div>
              
              <div class="courier-features">
                <div class="feature-list">
                  ${courier.features.map(feature => `
                    <div class="feature-item ${feature.available ? 'available' : 'unavailable'}">
                      <span class="feature-icon">${feature.available ? '✓' : '✗'}</span>
                      <span class="feature-name">${t(feature.name)}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
              
              <div class="courier-coverage">
                <h4>${t("service_areas")}</h4>
                <div class="coverage-zones">
                  ${courier.serviceAreas.map(area => `
                    <span class="zone-tag">${area}</span>
                  `).join('')}
                </div>
              </div>
              
              <div class="courier-actions">
                <button class="btn-secondary small" onclick="configureCourier('${courier.id}')">${t("configure_courier")}</button>
                <button class="btn-ghost small" onclick="testCourierAPI('${courier.id}')">${t("test_api")}</button>
                ${courier.status === 'enabled' ? `
                  <button class="btn-warning small" onclick="disableCourier('${courier.id}')">${t("disable_provider")}</button>
                ` : `
                  <button class="btn-success small" onclick="enableCourier('${courier.id}')">${t("enable_provider")}</button>
                `}
                <button class="btn-ghost small" onclick="viewShipments('${courier.id}')">${t("view_shipments")}</button>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Shipping Statistics -->
      <section class="couriers-section">
        <h2>${t("courier_statistics")}</h2>
        
        <div class="shipping-stats">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">📦</div>
              <div class="stat-content">
                <div class="stat-value">${data.statistics.totalShipments.toLocaleString()}</div>
                <div class="stat-label">${t("total_shipments")}</div>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">⏰</div>
              <div class="stat-content">
                <div class="stat-value">${(data.statistics.onTimeDeliveryRate * 100).toFixed(1)}%</div>
                <div class="stat-label">${t("on_time_delivery")}</div>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">🚚</div>
              <div class="stat-content">
                <div class="stat-value">${data.statistics.averageDeliveryTime} ${t("days")}</div>
                <div class="stat-label">${t("average_delivery_time")}</div>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">💰</div>
              <div class="stat-content">
                <div class="stat-value">${fmtCurrency(data.statistics.totalShippingVolume)}</div>
                <div class="stat-label">${t("shipping_volume")}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Courier Performance Table -->
      <section class="couriers-section">
        <h2>${t("courier_performance")}</h2>
        
        <div class="performance-table-container">
          <table class="performance-table">
            <thead>
              <tr>
                <th>${t("courier_name")}</th>
                <th>${t("service_areas")}</th>
                <th>${t("total_shipments")}</th>
                <th>${t("on_time_delivery")}</th>
                <th>${t("average_delivery_time")}</th>
                <th>${t("average")} ${t("shipping_cost")}</th>
                <th>${t("integration_status")}</th>
                <th>${t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              ${data.couriers.map(courier => `
                <tr>
                  <td>
                    <div class="courier-name-cell">
                      <img src="${courier.logoUrl}" alt="${courier.name}" class="courier-mini-logo">
                      <strong>${courier.name}</strong>
                    </div>
                  </td>
                  <td>${courier.serviceAreas.slice(0, 2).join(', ')}${courier.serviceAreas.length > 2 ? '...' : ''}</td>
                  <td>${courier.totalShipments.toLocaleString()}</td>
                  <td>
                    <span class="delivery-rate ${courier.onTimeRate > 0.95 ? 'excellent' : courier.onTimeRate > 0.9 ? 'good' : 'warning'}">
                      ${(courier.onTimeRate * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td>${courier.averageDeliveryTime} ${t("days")}</td>
                  <td>${fmtCurrency(courier.averageCost)}</td>
                  <td>
                    <span class="integration-status ${courier.integrationStatus}">${t(courier.integrationStatus)}</span>
                  </td>
                  <td>
                    <button class="btn-ghost small" onclick="configureCourier('${courier.id}')">${t("configure_courier")}</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `;

  refreshBadges();
}

function getShippingProvidersData() {
  return {
    couriers: [
      {
        id: "aramex",
        name: "Aramex",
        serviceType: "express_delivery",
        status: "enabled",
        integrationStatus: "integration_complete",
        coverageArea: "nationwide",
        averageDeliveryTime: 2,
        averageCost: 25,
        onTimeRate: 0.952,
        totalShipments: 45620,
        logoUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iI0ZGNkYwMCIvPjx0ZXh0IHg9IjgiIHk9IjI2IiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSI5Ij5BcmFtZXg8L3RleHQ+PC9zdmc+",
        serviceAreas: ["الرياض", "جدة", "الدمام", "مكة المكرمة", "المدينة المنورة"],
        features: [
          { name: "tracking_available", available: true },
          { name: "cod_available", available: true },
          { name: "express_delivery", available: true },
          { name: "same_day_delivery", available: false }
        ]
      },
      {
        id: "smsa",
        name: "SMSA Express",
        serviceType: "standard_delivery",
        status: "enabled",
        integrationStatus: "integration_complete",
        coverageArea: "nationwide",
        averageDeliveryTime: 3,
        averageCost: 18,
        onTimeRate: 0.934,
        totalShipments: 67890,
        logoUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzAwODBGRiIvPjx0ZXh0IHg9IjQiIHk9IjI2IiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSI4Ij5TTVNBPC90ZXh0Pjwvc3ZnPg==",
        serviceAreas: ["الرياض", "جدة", "الدمام", "الطائف", "بريدة", "حائل"],
        features: [
          { name: "tracking_available", available: true },
          { name: "cod_available", available: true },
          { name: "express_delivery", available: true },
          { name: "same_day_delivery", available: true }
        ]
      },
      {
        id: "dhl",
        name: "DHL Express",
        serviceType: "express_delivery",
        status: "enabled",
        integrationStatus: "integration_complete",
        coverageArea: "major_cities",
        averageDeliveryTime: 1,
        averageCost: 45,
        onTimeRate: 0.978,
        totalShipments: 23450,
        logoUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iI0ZGQ0MwMCIvPjx0ZXh0IHg9IjEwIiB5PSIyNiIgZmlsbD0iIzAwMCIgZm9udC1zaXplPSIxMCI+REhMPC90ZXh0Pjwvc3ZnPg==",
        serviceAreas: ["الرياض", "جدة", "الدمام"],
        features: [
          { name: "tracking_available", available: true },
          { name: "cod_available", available: false },
          { name: "express_delivery", available: true },
          { name: "same_day_delivery", available: true }
        ]
      },
      {
        id: "fedex",
        name: "FedEx",
        serviceType: "express_delivery",
        status: "disabled",
        integrationStatus: "integration_pending",
        coverageArea: "major_cities",
        averageDeliveryTime: 1,
        averageCost: 52,
        onTimeRate: 0.985,
        totalShipments: 0,
        logoUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzY2MDBGRiIvPjx0ZXh0IHg9IjYiIHk9IjI2IiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSI5Ij5GZWRFeDwvdGV4dD48L3N2Zz4=",
        serviceAreas: ["الرياض", "جدة"],
        features: [
          { name: "tracking_available", available: true },
          { name: "cod_available", available: false },
          { name: "express_delivery", available: true },
          { name: "same_day_delivery", available: false }
        ]
      },
      {
        id: "local_riyadh",
        name: "توصيل الرياض السريع",
        serviceType: "same_day_delivery",
        status: "enabled",
        integrationStatus: "integration_complete",
        coverageArea: "riyadh_jeddah",
        averageDeliveryTime: 0.5,
        averageCost: 15,
        onTimeRate: 0.923,
        totalShipments: 34560,
        logoUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzAwODA1MyIvPjx0ZXh0IHg9IjEwIiB5PSIyNiIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iOCI+UklZQUQ8L3RleHQ+PC9zdmc+",
        serviceAreas: ["الرياض", "جدة"],
        features: [
          { name: "tracking_available", available: true },
          { name: "cod_available", available: true },
          { name: "express_delivery", available: false },
          { name: "same_day_delivery", available: true }
        ]
      },
      {
        id: "eastern_express",
        name: "الشرقية إكسبريس",
        serviceType: "standard_delivery",
        status: "testing",
        integrationStatus: "integration_complete",
        coverageArea: "eastern_province",
        averageDeliveryTime: 2,
        averageCost: 12,
        onTimeRate: 0.897,
        totalShipments: 12340,
        logoUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzAwNzY0MyIvPjx0ZXh0IHg9IjEwIiB5PSIyNiIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iOCI+RUFTVDWVUU4PC90ZXh0Pjwvc3ZnPg==",
        serviceAreas: ["الدمام", "الخبر", "الظهران", "الأحساء"],
        features: [
          { name: "tracking_available", available: true },
          { name: "cod_available", available: true },
          { name: "express_delivery", available: true },
          { name: "same_day_delivery", available: false }
        ]
      }
    ],
    statistics: {
      totalShipments: 183860,
      onTimeDeliveryRate: 0.945,
      averageDeliveryTime: 2.1,
      totalShippingVolume: 4567000
    }
  };
}

// Shipping providers action functions
function addShippingProvider() {
  console.log("Adding new shipping provider...");
  // TODO: Implement courier addition
}

function filterCouriers() {
  console.log("Filtering couriers...");
  // TODO: Implement courier filtering
}

function configureCourier(courierId) {
  console.log("Configuring courier:", courierId);
  // TODO: Implement courier configuration
}

function testCourierAPI(courierId) {
  console.log("Testing courier API:", courierId);
  // TODO: Implement API testing
}

function enableCourier(courierId) {
  console.log("Enabling courier:", courierId);
  // TODO: Implement courier enabling
}

function disableCourier(courierId) {
  console.log("Disabling courier:", courierId);
  // TODO: Implement courier disabling
}

function viewShipments(courierId) {
  console.log("Viewing shipments for:", courierId);
  // TODO: Implement shipments viewing
}

/* -------------------- PDPL logging (demo) -------------------- */
function logPDPL(event, payload){
  if(!state.prefs.pdpl) return;
  state.pdplLogs.push({event, payload, ts: Date.now()});
  save();
}

/* -------------------- Boot -------------------- */
function boot(){
  setLang(getLang());
  applyTheme(state.prefs.theme || "dark");
  qs("#envChip").textContent = state.impersonating ? (t("impersonating")+" "+state.impersonating.role) : t("demo");
  wireHeader();
  refreshBadges();
  route();
}

// Creator management data function
function getCreatorManagementData() {
  return {
    statistics: {
      totalCreators: 342,
      pendingApplications: 28,
      verifiedCreators: 187,
      suspendedCreators: 12
    },
    pendingApplications: [
      {
        id: "APP001",
        type: "new",
        submittedAt: "2024-01-15T10:30:00Z",
        creator: {
          name: "سارة الأحمد",
          category: "fashion",
          location: "الرياض، السعودية",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=100",
          followers: 15000,
          experience: 3,
          productsPlanned: 25
        },
        documents: [
          { type: "national_id", verified: true },
          { type: "business_license", verified: false },
          { type: "tax_certificate", verified: true },
          { type: "bank_details", verified: false }
        ]
      },
      {
        id: "APP002",
        type: "verification",
        submittedAt: "2024-01-15T09:15:00Z",
        creator: {
          name: "Omar Tech Store",
          category: "electronics",
          location: "جدة، السعودية",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
          followers: 45000,
          experience: 5,
          productsPlanned: 150
        },
        documents: [
          { type: "national_id", verified: true },
          { type: "business_license", verified: true },
          { type: "tax_certificate", verified: true },
          { type: "bank_details", verified: true }
        ]
      }
    ],
    activeCreators: [
      {
        id: "CR001",
        name: "ليلى للأزياء",
        category: "fashion",
        location: "الدمام، السعودية",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
        status: "verified",
        followers: 78000,
        products: 45,
        revenue30d: 125000,
        performanceScore: 92
      },
      {
        id: "CR002",
        name: "Tech Solutions KSA",
        category: "electronics",
        location: "الرياض، السعودية",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
        status: "active",
        followers: 123000,
        products: 230,
        revenue30d: 890000,
        performanceScore: 87
      },
      {
        id: "CR003",
        name: "نورا للتجميل",
        category: "beauty",
        location: "مكة، السعودية",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
        status: "warning",
        followers: 56000,
        products: 67,
        revenue30d: 234000,
        performanceScore: 73
      },
      {
        id: "CR004",
        name: "Home Essentials SA",
        category: "home",
        location: "الخبر، السعودية",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100",
        status: "suspended",
        followers: 34000,
        products: 89,
        revenue30d: 0,
        performanceScore: 45
      }
    ],
    topPerformers: [
      {
        name: "Tech Solutions KSA",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
        revenue: 890000
      },
      {
        name: "نورا للتجميل",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
        revenue: 234000
      },
      {
        name: "ليلى للأزياء",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
        revenue: 125000
      }
    ],
    categoryDistribution: {
      fashion: 89,
      electronics: 76,
      beauty: 67,
      home: 54,
      sports: 42
    }
  };
}

function getRiskManagementData() {
  return {
    statistics: {
      activeFraudAlerts: 7,
      suspiciousTransactions: 23,
      blockedAmount: 245000,
      detectionAccuracy: 96.8
    },
    fraudAlerts: [
      {
        id: "FA001",
        type: "payment_fraud",
        account: "khalid.m@email.com",
        amount: 15000,
        riskLevel: "critical",
        detectedAt: "2024-01-15T14:30:00Z",
        confidenceScore: 98,
        indicators: ["unusual_location", "velocity_check", "pattern_anomaly"]
      },
      {
        id: "FA002", 
        type: "account_fraud",
        account: "sara.k@email.com",
        amount: 8500,
        riskLevel: "high",
        detectedAt: "2024-01-15T13:15:00Z",
        confidenceScore: 87,
        indicators: ["device_mismatch", "behavior_anomaly"]
      },
      {
        id: "FA003",
        type: "return_abuse",
        account: "ahmed.h@email.com", 
        amount: 3200,
        riskLevel: "medium",
        detectedAt: "2024-01-15T12:45:00Z",
        confidenceScore: 73,
        indicators: ["frequent_returns", "time_pattern"]
      }
    ],
    detectionRules: [
      {
        id: "DR001",
        name: "High Velocity Transactions",
        enabled: true,
        conditions: ["transaction_count > 10", "time_window < 1h", "amount > 5000"],
        action: "block",
        triggeredCount: 156,
        accuracy: 94.2
      },
      {
        id: "DR002", 
        name: "Unusual Location Pattern",
        enabled: true,
        conditions: ["location_change_rapid", "device_new", "high_amount"],
        action: "flag_for_review",
        triggeredCount: 89,
        accuracy: 87.5
      },
      {
        id: "DR003",
        name: "Payment Method Anomaly",
        enabled: false,
        conditions: ["payment_method_new", "large_amount", "high_risk_merchant"],
        action: "manual_review",
        triggeredCount: 34,
        accuracy: 78.9
      }
    ],
    transactions: [
      {
        id: "TXN001",
        accountId: "ACC123",
        amount: 12500,
        riskScore: 89,
        paymentMethod: "Mada Card ****4567",
        location: "الرياض، السعودية",
        timestamp: "2024-01-15T14:20:00Z",
        status: "flagged"
      },
      {
        id: "TXN002",
        accountId: "ACC456", 
        amount: 5800,
        riskScore: 67,
        paymentMethod: "STC Pay",
        location: "جدة، السعودية",
        timestamp: "2024-01-15T13:45:00Z",
        status: "approved"
      },
      {
        id: "TXN003",
        accountId: "ACC789",
        amount: 25000,
        riskScore: 95,
        paymentMethod: "Apple Pay",
        location: "دبي، الإمارات",
        timestamp: "2024-01-15T12:30:00Z", 
        status: "blocked"
      }
    ],
    securityEvents: [
      {
        id: "SE001",
        type: "login_anomaly",
        accountId: "ACC123",
        severity: "high",
        description: "تسجيل دخول من جهاز جديد من موقع غير مألوف",
        timestamp: "2024-01-15T14:15:00Z"
      },
      {
        id: "SE002",
        type: "password_breach",
        accountId: "ACC456", 
        severity: "critical",
        description: "كلمة مرور مكشوفة في تسريب بيانات",
        timestamp: "2024-01-15T13:30:00Z"
      },
      {
        id: "SE003",
        type: "device_new",
        accountId: "ACC789",
        severity: "medium", 
        description: "تسجيل دخول من جهاز جديد غير معروف",
        timestamp: "2024-01-15T12:45:00Z"
      }
    ]
  };
}

// Creator management action functions
function approveApplication(appId) {
  alert(t("application_approved_success").replace("{appId}", appId));
  renderCreatorManagement();
}

function rejectApplication(appId) {
  const reason = prompt(t("rejection_reason_prompt"));
  if (reason) {
    alert(t("application_rejected_success").replace("{appId}", appId));
    renderCreatorManagement();
  }
}

function requestDocuments(appId) {
  const documents = prompt(t("request_documents_prompt"));
  if (documents) {
    alert(t("documents_requested_success").replace("{appId}", appId));
    renderCreatorManagement();
  }
}

function viewApplicationDetails(appId) {
  const data = getCreatorManagementData();
  const application = data.pendingApplications.find(app => app.id === appId);
  
  if (application) {
    showSheet(html`
      <div class="sheet-header">
        <h2>${t("application_details")}: ${application.id}</h2>
      </div>
      <div class="application-details-view">
        <div class="detail-section">
          <h3>${t("creator_information")}</h3>
          <div class="creator-profile">
            <img src="${application.creator.avatar}" alt="${application.creator.name}" class="creator-avatar-large">
            <div class="creator-info">
              <h4>${application.creator.name}</h4>
              <p>${t(application.creator.category)} • ${application.creator.location}</p>
              <div class="creator-stats">
                <span>${application.creator.followers.toLocaleString()} ${t("followers")}</span>
                <span>${application.creator.experience} ${t("years")} ${t("experience")}</span>
                <span>${application.creator.productsPlanned} ${t("products_planned")}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="detail-section">
          <h3>${t("document_verification")}</h3>
          <div class="documents-verification">
            ${application.documents.map(doc => `
              <div class="document-verification-item">
                <span class="document-name">${t(doc.type)}</span>
                <span class="verification-status ${doc.verified ? 'verified' : 'pending'}">
                  ${doc.verified ? '✅ ' + t("verified") : '⏳ ' + t("pending")}
                </span>
                ${!doc.verified ? `
                  <button class="btn-success small" onclick="verifyDocument('${application.id}', '${doc.type}')">${t("verify")}</button>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>
        
        <div class="detail-actions">
          <button class="btn-success" onclick="approveApplication('${application.id}'); hideSheet();">${t("approve_application")}</button>
          <button class="btn-warning" onclick="requestDocuments('${application.id}'); hideSheet();">${t("request_documents")}</button>
          <button class="btn-danger" onclick="rejectApplication('${application.id}'); hideSheet();">${t("reject_application")}</button>
          <button class="btn-ghost" onclick="hideSheet()">${t("close")}</button>
        </div>
      </div>
    `);
  }
}

function viewCreatorDetails(creatorId) {
  const data = getCreatorManagementData();
  const creator = data.activeCreators.find(c => c.id === creatorId);
  
  if (creator) {
    showSheet(html`
      <div class="sheet-header">
        <h2>${t("creator_profile")}: ${creator.name}</h2>
      </div>
      <div class="creator-profile-view">
        <div class="profile-header">
          <img src="${creator.avatar}" alt="${creator.name}" class="creator-avatar-large">
          <div class="creator-info">
            <h3>${creator.name}</h3>
            <p>${t(creator.category)} • ${creator.location}</p>
            <span class="status-badge ${creator.status}">${t(creator.status)}</span>
          </div>
        </div>
        
        <div class="profile-metrics">
          <div class="metric-item">
            <span class="metric-label">${t("followers")}</span>
            <span class="metric-value">${creator.followers.toLocaleString()}</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">${t("products")}</span>
            <span class="metric-value">${creator.products}</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">${t("revenue_30d")}</span>
            <span class="metric-value">${currency(creator.revenue30d)}</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">${t("performance_score")}</span>
            <span class="metric-value">${creator.performanceScore}%</span>
          </div>
        </div>
      </div>
    `);
  }
}

function filterApplications() {
  const typeFilter = qs("#applicationTypeFilter").value;
  const cards = qsa(".application-card");
  
  cards.forEach(card => {
    const type = card.dataset.type;
    const show = typeFilter === "all" || type === typeFilter;
    card.style.display = show ? "" : "none";
  });
}

function filterCreators() {
  const statusFilter = qs("#creatorStatusFilter").value;
  const categoryFilter = qs("#creatorCategoryFilter").value;
  const rows = qsa(".creator-row");
  
  rows.forEach(row => {
    const status = row.dataset.status;
    const category = row.dataset.category;
    
    let show = true;
    
    if (statusFilter !== "all" && status !== statusFilter) {
      show = false;
    }
    
    if (categoryFilter !== "all" && category !== categoryFilter) {
      show = false;
    }
    
    row.style.display = show ? "" : "none";
  });
}

function suspendCreator(creatorId) {
  const reason = prompt(t("suspension_reason_prompt"));
  if (reason) {
    alert(t("creator_suspended_success").replace("{creatorId}", creatorId));
    renderCreatorManagement();
  }
}

function reactivateCreator(creatorId) {
  if (confirm(t("confirm_reactivate_creator"))) {
    alert(t("creator_reactivated_success").replace("{creatorId}", creatorId));
    renderCreatorManagement();
  }
}

function editCreator(creatorId) {
  alert(t("edit_creator_functionality"));
}

// Make creator management action functions globally accessible
window.approveApplication = approveApplication;
window.rejectApplication = rejectApplication;
window.requestDocuments = requestDocuments;
window.viewApplicationDetails = viewApplicationDetails;
window.viewCreatorDetails = viewCreatorDetails;
window.suspendCreator = suspendCreator;
window.reactivateCreator = reactivateCreator;
window.editCreator = editCreator;

function renderPlatformAnalytics() {
  qs("#view").innerHTML = html`
    <div class="analytics-dashboard" dir="${isRTL() ? 'rtl' : 'ltr'}">
      <header class="view-header">
        <h1>${t("platform_analytics")}</h1>
      </header>

      <!-- Key Metrics Overview -->
      <section class="analytics-section">
        <h2>${t("key_metrics")}</h2>
        <div class="metrics-overview">
          <div class="stats-grid">
            <div class="stat-card info">
              <div class="stat-icon">👥</div>
              <div class="stat-content">
                <div class="stat-value">245K</div>
                <div class="stat-label">${t("total_users")}</div>
                <div class="stat-change positive">+12.5% ${t("this_month")}</div>
              </div>
            </div>
            
            <div class="stat-card success">
              <div class="stat-icon">💰</div>
              <div class="stat-content">
                <div class="stat-value">${currency(12500000)}</div>
                <div class="stat-label">${t("total_revenue")}</div>
                <div class="stat-change positive">+18.3% ${t("this_month")}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `;
  refreshBadges();
}

function renderRiskManagement() {
  const data = getRiskManagementData();
  
  qs("#view").innerHTML = html`
    <div class="risk-dashboard" dir="${isRTL() ? 'rtl' : 'ltr'}">
      <header class="view-header">
        <h1>${t("risk_fraud_detection")}</h1>
      </header>

      <!-- Risk Statistics -->
      <section class="risk-section">
        <h2>${t("risk_overview")}</h2>
        
        <div class="risk-stats">
          <div class="stats-grid">
            <div class="stat-card urgent">
              <div class="stat-icon">🚨</div>
              <div class="stat-content">
                <div class="stat-value">${data.statistics.activeFraudAlerts}</div>
                <div class="stat-label">${t("active_fraud_alerts")}</div>
              </div>
            </div>
            
            <div class="stat-card warning">
              <div class="stat-icon">⚠️</div>
              <div class="stat-content">
                <div class="stat-value">${data.statistics.suspiciousTransactions}</div>
                <div class="stat-label">${t("suspicious_transactions")}</div>
              </div>
            </div>
            
            <div class="stat-card info">
              <div class="stat-icon">🔍</div>
              <div class="stat-content">
                <div class="stat-value">${currency(data.statistics.blockedAmount)}</div>
                <div class="stat-label">${t("amount_blocked")}</div>
              </div>
            </div>
            
            <div class="stat-card success">
              <div class="stat-icon">✅</div>
              <div class="stat-content">
                <div class="stat-value">${(data.statistics.fraudDetectionRate * 100).toFixed(1)}%</div>
                <div class="stat-label">${t("detection_accuracy")}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Active Fraud Alerts -->
      <section class="risk-section">
        <div class="section-header">
          <h2>${t("active_fraud_alerts")}</h2>
          <div class="alert-filters">
            <select id="alertTypeFilter" onchange="filterAlerts()">
              <option value="all">${t("all_alerts")}</option>
              <option value="payment">${t("payment_fraud")}</option>
              <option value="account">${t("account_fraud")}</option>
              <option value="return">${t("return_abuse")}</option>
              <option value="identity">${t("identity_theft")}</option>
            </select>
            
            <select id="riskLevelFilter" onchange="filterAlerts()">
              <option value="all">${t("all_risk_levels")}</option>
              <option value="critical">${t("critical_risk")}</option>
              <option value="high">${t("high_risk")}</option>
              <option value="medium">${t("medium_risk")}</option>
            </select>
          </div>
        </div>
        
        <div class="alerts-grid">
          ${data.fraudAlerts.map(alert => `
            <div class="alert-card ${alert.riskLevel}" data-type="${alert.type}">
              <div class="alert-header">
                <div class="alert-type-badge">${t(alert.type + "_fraud")}</div>
                <div class="risk-level risk-${alert.riskLevel}">${t(alert.riskLevel + "_risk")}</div>
              </div>
              
              <div class="alert-details">
                <h3>${alert.title}</h3>
                <p>${alert.description}</p>
                
                <div class="alert-metadata">
                  <div class="metadata-item">
                    <strong>${t("account")}:</strong> ${alert.accountId}
                  </div>
                  <div class="metadata-item">
                    <strong>${t("amount")}:</strong> ${currency(alert.amount)}
                  </div>
                  <div class="metadata-item">
                    <strong>${t("detected_at")}:</strong> ${new Date(alert.detectedAt).toLocaleString()}
                  </div>
                  <div class="metadata-item">
                    <strong>${t("confidence_score")}:</strong> ${(alert.confidenceScore * 100).toFixed(1)}%
                  </div>
                </div>
                
                <div class="fraud-indicators">
                  <strong>${t("fraud_indicators")}:</strong>
                  <div class="indicators-list">
                    ${alert.indicators.map(indicator => `
                      <span class="indicator-tag">${t(indicator)}</span>
                    `).join('')}
                  </div>
                </div>
              </div>
              
              <div class="alert-actions">
                <button class="btn-danger small" onclick="confirmFraud('${alert.id}')">${t("confirm_fraud")}</button>
                <button class="btn-success small" onclick="markLegitimate('${alert.id}')">${t("mark_legitimate")}</button>
                <button class="btn-warning small" onclick="investigateAlert('${alert.id}')">${t("investigate")}</button>
                <button class="btn-ghost small" onclick="viewAlertDetails('${alert.id}')">${t("view_details")}</button>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Risk Rules Management -->
      <section class="risk-section">
        <div class="section-header">
          <h2>${t("fraud_detection_rules")}</h2>
          <button class="btn-primary" onclick="createRiskRule()">${t("create_rule")}</button>
        </div>
        
        <div class="rules-list">
          ${data.detectionRules.map(rule => `
            <div class="rule-card">
              <div class="rule-header">
                <h3>${rule.name}</h3>
                <div class="rule-status">
                  <label class="toggle-switch">
                    <input type="checkbox" ${rule.enabled ? 'checked' : ''} 
                           onchange="toggleRiskRule('${rule.id}', this.checked)">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>
              
              <div class="rule-details">
                <div class="rule-description">${rule.description}</div>
                <div class="rule-conditions">
                  <strong>${t("conditions")}:</strong> ${rule.conditions.join(', ')}
                </div>
                <div class="rule-action">
                  <strong>${t("action")}:</strong> ${t(rule.action)}
                </div>
                <div class="rule-stats">
                  <span>${t("triggered")}: ${rule.triggeredCount} ${t("times_this_month")}</span>
                  <span class="rule-accuracy">${t("accuracy")}: ${(rule.accuracy * 100).toFixed(1)}%</span>
                </div>
              </div>
              
              <div class="rule-actions">
                <button class="btn-secondary small" onclick="editRiskRule('${rule.id}')">${t("edit")}</button>
                <button class="btn-ghost small" onclick="deleteRiskRule('${rule.id}')">${t("delete")}</button>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Transaction Monitoring -->
      <section class="risk-section">
        <h2>${t("transaction_monitoring")}</h2>
        
        <div class="monitoring-table-container">
          <table class="monitoring-table">
            <thead>
              <tr>
                <th>${t("transaction_id")}</th>
                <th>${t("account")}</th>
                <th>${t("amount")}</th>
                <th>${t("risk_score")}</th>
                <th>${t("payment_method")}</th>
                <th>${t("location")}</th>
                <th>${t("status")}</th>
                <th>${t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              ${data.suspiciousTransactionsList.map(transaction => `
                <tr class="transaction-row">
                  <td><strong>#${transaction.id}</strong></td>
                  <td>${transaction.accountId}</td>
                  <td>${currency(transaction.amount)}</td>
                  <td>
                    <div class="risk-score-display">
                      <span class="score-value ${transaction.riskScore > 70 ? 'high' : transaction.riskScore > 40 ? 'medium' : 'low'}">${transaction.riskScore}</span>
                      <div class="score-bar">
                        <div class="score-fill" style="width: ${transaction.riskScore}%"></div>
                      </div>
                    </div>
                  </td>
                  <td>${transaction.paymentMethod}</td>
                  <td>${transaction.location}</td>
                  <td>
                    <span class="status-badge ${transaction.status}">${t(transaction.status)}</span>
                  </td>
                  <td>
                    <button class="btn-ghost small" onclick="reviewTransaction('${transaction.id}')">${t("review")}</button>
                    ${transaction.status === 'pending' ? `
                      <button class="btn-warning small" onclick="blockTransaction('${transaction.id}')">${t("block")}</button>
                    ` : ''}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </section>

      <!-- Account Security -->
      <section class="risk-section">
        <h2>${t("account_security_monitoring")}</h2>
        
        <div class="security-alerts">
          ${data.securityAlerts.map(alert => `
            <div class="security-alert-card">
              <div class="alert-icon">
                ${alert.type === 'login_anomaly' ? '🔐' : 
                  alert.type === 'password_breach' ? '🚨' : 
                  alert.type === 'device_new' ? '📱' : '⚠️'}
              </div>
              <div class="alert-content">
                <h4>${t(alert.type)}</h4>
                <p>${alert.description}</p>
                <div class="alert-meta">
                  <span class="account-info">${t("account")}: ${alert.accountId}</span>
                  <span class="alert-time">${new Date(alert.timestamp).toLocaleString()}</span>
                </div>
              </div>
              <div class="alert-severity ${alert.severity}">
                ${t(alert.severity)}
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    </div>
  `;

  refreshBadges();
}

document.addEventListener("DOMContentLoaded", boot);
