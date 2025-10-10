/* ai.js — Mock AI Personalization Engine for StoreZ Demo */

import { t } from "./i18n.js?v=20251010-imageFix";

const AI_STORAGE_KEY = "storez_ai_data_v1";

/* ---------- AI Data Storage ---------- */
class AIEngine {
  constructor() {
    this.data = this.loadAIData();
    this.initialized = false;
  }

  loadAIData() {
    try {
      const stored = localStorage.getItem(AI_STORAGE_KEY);
      return stored ? JSON.parse(stored) : this.getDefaultAIData();
    } catch {
      return this.getDefaultAIData();
    }
  }

  saveAIData() {
    try {
      localStorage.setItem(AI_STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.warn("Could not save AI data:", e);
    }
  }

  getDefaultAIData() {
    return {
      userProfile: {
        interests: [],
        categories: {},
        creators: {},
        brands: {},
        priceRange: { min: 0, max: 1000 },
        sessionCount: 0,
        lastActive: Date.now()
      },
      interactions: {
        views: {},
        clicks: {},
        purchases: {},
        searches: [],
        timeSpent: {}
      },
      recommendations: {
        products: [],
        creators: [],
        categories: [],
        lastGenerated: 0
      },
      trends: {
        globalTrending: [],
        personalTrending: [],
        lastUpdated: 0
      }
    };
  }

  /* ---------- User Behavior Tracking ---------- */
  
  trackView(itemId, itemType = 'product', metadata = {}) {
    const key = `${itemType}_${itemId}`;
    this.data.interactions.views[key] = (this.data.interactions.views[key] || 0) + 1;
    
    // Track time spent
    this.data.interactions.timeSpent[key] = metadata.timeSpent || 0;
    
    // Update user profile based on interaction
    this.updateUserProfile(itemId, itemType, 'view', metadata);
    this.saveAIData();
  }

  trackClick(itemId, itemType = 'product', metadata = {}) {
    const key = `${itemType}_${itemId}`;
    this.data.interactions.clicks[key] = (this.data.interactions.clicks[key] || 0) + 1;
    
    this.updateUserProfile(itemId, itemType, 'click', metadata);
    this.saveAIData();
  }

  trackPurchase(itemId, price, metadata = {}) {
    const key = `product_${itemId}`;
    this.data.interactions.purchases[key] = (this.data.interactions.purchases[key] || 0) + 1;
    
    // Update price range preference
    const current = this.data.userProfile.priceRange;
    this.data.userProfile.priceRange = {
      min: Math.min(current.min, price * 0.8),
      max: Math.max(current.max, price * 1.2)
    };
    
    this.updateUserProfile(itemId, 'product', 'purchase', metadata);
    this.saveAIData();
  }

  trackSearch(query, results = []) {
    this.data.interactions.searches.push({
      query: query.toLowerCase(),
      timestamp: Date.now(),
      resultCount: results.length,
      results: results.slice(0, 5) // Store top 5 results
    });
    
    // Keep only last 50 searches
    if (this.data.interactions.searches.length > 50) {
      this.data.interactions.searches = this.data.interactions.searches.slice(-50);
    }
    
    this.saveAIData();
  }

  updateUserProfile(itemId, itemType, action, metadata) {
    // Update categories preference
    if (metadata.category) {
      const categoryWeight = action === 'purchase' ? 3 : action === 'click' ? 2 : 1;
      this.data.userProfile.categories[metadata.category] = 
        (this.data.userProfile.categories[metadata.category] || 0) + categoryWeight;
    }

    // Update creator preference
    if (metadata.creatorId) {
      const creatorWeight = action === 'purchase' ? 5 : action === 'click' ? 3 : 1;
      this.data.userProfile.creators[metadata.creatorId] = 
        (this.data.userProfile.creators[metadata.creatorId] || 0) + creatorWeight;
    }

    // Update brand preference
    if (metadata.brand) {
      const brandWeight = action === 'purchase' ? 4 : action === 'click' ? 2 : 1;
      this.data.userProfile.brands[metadata.brand] = 
        (this.data.userProfile.brands[metadata.brand] || 0) + brandWeight;
    }

    // Update session activity
    this.data.userProfile.lastActive = Date.now();
  }

  /* ---------- Recommendation Engine ---------- */

  generatePersonalizedFeed(products, creators, options = {}) {
    const {
      limit = 20,
      includeCreators = true,
      diversityFactor = 0.3,
      freshnessBoost = 0.2
    } = options;

    // Score products based on user preferences
    const scoredProducts = products.map(product => ({
      ...product,
      aiScore: this.calculateProductScore(product),
      reason: this.getRecommendationReason(product)
    }));

    // Sort by AI score and apply diversity
    let recommendations = scoredProducts
      .sort((a, b) => b.aiScore - a.aiScore)
      .slice(0, limit);

    // Add trending boost
    recommendations = this.applyTrendingBoost(recommendations);

    // Mix in creator content if enabled
    if (includeCreators) {
      const creatorRecommendations = this.getCreatorRecommendations(creators, Math.floor(limit * 0.3));
      recommendations = this.interleaveFeed(recommendations, creatorRecommendations);
    }

    // Apply diversity to avoid same category clustering
    recommendations = this.applyDiversityFilter(recommendations, diversityFactor);

    return recommendations.slice(0, limit);
  }

  calculateProductScore(product) {
    let score = 0;

    // Base popularity score
    score += (product.rating || 4) * 10;

    // Category preference
    const categoryPreference = this.data.userProfile.categories[product.cat] || 0;
    score += categoryPreference * 5;

    // Creator preference
    if (product.creatorId) {
      const creatorPreference = this.data.userProfile.creators[product.creatorId] || 0;
      score += creatorPreference * 8;
    }

    // Price range fit
    const priceRange = this.data.userProfile.priceRange;
    if (product.price >= priceRange.min && product.price <= priceRange.max) {
      score += 15;
    } else if (product.price < priceRange.min) {
      score += 5; // Slight bonus for affordable items
    }

    // Trending boost
    if (this.isTrending(product.id)) {
      score += 20;
    }

    // Recency boost for new products
    const daysSinceLaunch = product.createdAt ? 
      (Date.now() - product.createdAt) / (24 * 60 * 60 * 1000) : 30;
    if (daysSinceLaunch < 7) {
      score += 10 * (7 - daysSinceLaunch);
    }

    // Interaction history boost
    const viewKey = `product_${product.id}`;
    const viewCount = this.data.interactions.views[viewKey] || 0;
    const clickCount = this.data.interactions.clicks[viewKey] || 0;
    
    // Slight boost for viewed items (but not too much to avoid repetition)
    score += Math.min(viewCount * 2, 10);
    score += Math.min(clickCount * 3, 15);

    // Stock urgency
    if (product.stock && product.stock < 10) {
      score += 5; // Slight urgency boost
    }

    return Math.max(0, score);
  }

  getRecommendationReason(product) {
    const reasons = [];

    // Category preference
    const categoryPreference = this.data.userProfile.categories[product.cat] || 0;
    if (categoryPreference > 10) {
      reasons.push(`Popular in ${product.cat}`);
    }

    // Creator preference
    if (product.creatorId) {
      const creatorPreference = this.data.userProfile.creators[product.creatorId] || 0;
      if (creatorPreference > 15) {
        reasons.push(t("from_creator_you_follow"));
      }
    }

    // Trending
    if (this.isTrending(product.id)) {
      reasons.push(t("trending_now"));
    }

    // Price match
    const priceRange = this.data.userProfile.priceRange;
    if (product.price >= priceRange.min && product.price <= priceRange.max) {
      reasons.push(t("in_your_price_range"));
    }

    // Similar purchases
    if (this.hasSimilarPurchases(product)) {
      reasons.push(t("similar_to_your_purchases"));
    }

    return reasons.length > 0 ? reasons[0] : t("recommended_for_you");
  }

  /* ---------- Trending Algorithm ---------- */

  updateTrendingItems(products, creators) {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    // Only update trends every hour
    if (now - this.data.trends.lastUpdated < oneHour) {
      return this.data.trends;
    }

    // Calculate global trending based on mock engagement
    const trending = products.map(product => {
      const engagementScore = this.calculateEngagementScore(product);
      return {
        id: product.id,
        type: 'product',
        score: engagementScore,
        category: product.cat
      };
    }).sort((a, b) => b.score - a.score).slice(0, 10);

    // Calculate personal trending based on user's category preferences
    const userCategories = Object.keys(this.data.userProfile.categories);
    const personalTrending = trending.filter(item => {
      const product = products.find(p => p.id === item.id);
      return userCategories.includes(product?.cat);
    }).slice(0, 5);

    this.data.trends = {
      globalTrending: trending.map(t => t.id),
      personalTrending: personalTrending.map(t => t.id),
      lastUpdated: now
    };

    this.saveAIData();
    return this.data.trends;
  }

  calculateEngagementScore(product) {
    // Mock engagement calculation
    const baseScore = (product.rating || 4) * 20;
    const viewBoost = Math.random() * 30; // Simulate view variations
    const stockBoost = product.stock < 20 ? 15 : 0;
    const newBoost = product.createdAt && (Date.now() - product.createdAt) < 7 * 24 * 60 * 60 * 1000 ? 25 : 0;
    
    return baseScore + viewBoost + stockBoost + newBoost;
  }

  isTrending(productId) {
    return this.data.trends.globalTrending.includes(productId) || 
           this.data.trends.personalTrending.includes(productId);
  }

  /* ---------- Creator Recommendations ---------- */

  getCreatorRecommendations(creators, limit = 5) {
    const scoredCreators = creators.map(creator => ({
      ...creator,
      aiScore: this.calculateCreatorScore(creator),
      type: 'creator'
    }));

    return scoredCreators
      .sort((a, b) => b.aiScore - a.aiScore)
      .slice(0, limit);
  }

  calculateCreatorScore(creator) {
    let score = creator.followers / 1000; // Base follower score

    // User preference boost
    const creatorPreference = this.data.userProfile.creators[creator.id] || 0;
    score += creatorPreference * 10;

    // Live boost
    if (creator.live) {
      score += 50;
    }

    // Category alignment
    const userCategories = Object.keys(this.data.userProfile.categories);
    if (creator.categories && creator.categories.some(cat => userCategories.includes(cat))) {
      score += 30;
    }

    return score;
  }

  /* ---------- Utility Functions ---------- */

  interleaveFeed(products, creators) {
    const mixed = [];
    let pIndex = 0, cIndex = 0;
    
    // Interleave: 3 products, 1 creator, repeat
    while (pIndex < products.length || cIndex < creators.length) {
      // Add 3 products
      for (let i = 0; i < 3 && pIndex < products.length; i++) {
        mixed.push(products[pIndex++]);
      }
      
      // Add 1 creator
      if (cIndex < creators.length) {
        mixed.push(creators[cIndex++]);
      }
    }
    
    return mixed;
  }

  applyDiversityFilter(items, diversityFactor) {
    if (diversityFactor === 0) return items;
    
    const categories = new Set();
    const diversified = [];
    
    for (const item of items) {
      const category = item.cat || item.type;
      
      if (!categories.has(category) || Math.random() > diversityFactor) {
        diversified.push(item);
        categories.add(category);
      }
    }
    
    return diversified;
  }

  applyTrendingBoost(recommendations) {
    return recommendations.map(item => {
      if (this.isTrending(item.id)) {
        return {
          ...item,
          aiScore: item.aiScore * 1.2,
          trending: true
        };
      }
      return item;
    });
  }

  hasSimilarPurchases(product) {
    const purchasedProducts = Object.keys(this.data.interactions.purchases);
    return purchasedProducts.some(key => {
      const productId = key.replace('product_', '');
      // This would normally compare product features, categories, etc.
      return product.cat === product.cat; // Simplified for demo
    });
  }

  /* ---------- Public API ---------- */

  initialize(state) {
    if (this.initialized) return;
    
    // Initialize user profile from state if available
    if (state.user && state.user.interests) {
      this.data.userProfile.interests = state.user.interests;
    }
    
    // Increment session count
    this.data.userProfile.sessionCount++;
    this.data.userProfile.lastActive = Date.now();
    
    this.saveAIData();
    this.initialized = true;
  }

  getPersonalizedRecommendations(products, creators, limit = 10) {
    this.updateTrendingItems(products, creators);
    return this.generatePersonalizedFeed(products, creators, { limit });
  }

  getTrendingProducts(products, limit = 8) {
    this.updateTrendingItems(products, []);
    return products
      .filter(p => this.isTrending(p.id))
      .sort((a, b) => this.calculateProductScore(b) - this.calculateProductScore(a))
      .slice(0, limit);
  }

  getPersonalizedSearch(query, products, limit = 20) {
    // Track the search
    this.trackSearch(query, products);
    
    // Score products for search relevance + personalization
    const searchResults = products
      .filter(p => this.matchesSearch(p, query))
      .map(p => ({
        ...p,
        aiScore: this.calculateProductScore(p) + this.calculateSearchRelevance(p, query)
      }))
      .sort((a, b) => b.aiScore - a.aiScore)
      .slice(0, limit);

    return searchResults;
  }

  matchesSearch(product, query) {
    const searchTerms = query.toLowerCase().split(' ');
    const productText = `${product.name} ${product.cat} ${product.description || ''}`.toLowerCase();
    
    return searchTerms.every(term => productText.includes(term));
  }

  calculateSearchRelevance(product, query) {
    const queryLower = query.toLowerCase();
    const nameLower = product.name.toLowerCase();
    const catLower = product.cat.toLowerCase();
    
    let relevance = 0;
    
    // Exact name match
    if (nameLower.includes(queryLower)) relevance += 100;
    
    // Category match
    if (catLower.includes(queryLower)) relevance += 50;
    
    // Word matches
    const queryWords = queryLower.split(' ');
    const nameWords = nameLower.split(' ');
    
    queryWords.forEach(qWord => {
      nameWords.forEach(nWord => {
        if (nWord.includes(qWord) || qWord.includes(nWord)) {
          relevance += 25;
        }
      });
    });
    
    return relevance;
  }

  getUserInsights() {
    const profile = this.data.userProfile;
    const interactions = this.data.interactions;
    
    // Top categories
    const topCategories = Object.entries(profile.categories)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([cat, score]) => ({ category: cat, score }));
    
    // Top creators
    const topCreators = Object.entries(profile.creators)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([creatorId, score]) => ({ creatorId, score }));
    
    // Activity stats
    const totalViews = Object.values(interactions.views).reduce((a, b) => a + b, 0);
    const totalClicks = Object.values(interactions.clicks).reduce((a, b) => a + b, 0);
    const totalPurchases = Object.values(interactions.purchases).reduce((a, b) => a + b, 0);
    
    return {
      topCategories,
      topCreators,
      activityStats: {
        totalViews,
        totalClicks,
        totalPurchases,
        sessionCount: profile.sessionCount
      },
      priceRange: profile.priceRange,
      interests: profile.interests
    };
  }

  /* ---------- Search Enhancement Methods ---------- */

  getSearchSuggestions() {
    const searches = this.data.interactions.searches;
    const profile = this.data.userProfile;
    
    // Get recent searches (last 10)
    const recent = searches.slice(-10).reverse()
      .map(s => s.term)
      .filter((term, index, arr) => arr.indexOf(term) === index);
    
    // Get trending searches (mock based on categories)
    const trending = [
      "sneakers", "sustainable fashion", "tech accessories", 
      "workout gear", "minimalist design", "vintage style"
    ].filter(term => !recent.includes(term));
    
    // Get personalized suggestions based on interests
    const personalized = Object.keys(profile.categories)
      .sort((a, b) => profile.categories[b] - profile.categories[a])
      .slice(0, 5)
      .map(cat => `${cat} collection`)
      .filter(term => !recent.includes(term));
    
    // Get recommended tags based on user behavior
    const recommendedTags = Object.keys(profile.categories)
      .filter(cat => profile.categories[cat] > 0.2)
      .slice(0, 4);
    
    return {
      recent: recent.slice(0, 6),
      trending: trending.slice(0, 5),
      personalized: personalized.slice(0, 4),
      recommendedTags
    };
  }

  getSemanticSearchResults(query) {
    // Mock semantic search - in real app would use vector similarity
    const allProducts = this.getAllProducts();
    const queryWords = query.toLowerCase().split(' ');
    
    return allProducts.filter(product => {
      // Check for semantic matches in product attributes
      const searchableText = `${product.name} ${product.cat} ${product.description || ''}`.toLowerCase();
      
      // Score products based on word matches and user preferences
      let score = 0;
      queryWords.forEach(word => {
        if (searchableText.includes(word)) score += 1;
        // Boost score for preferred categories
        if (this.data.userProfile.categories[product.cat]) {
          score += this.data.userProfile.categories[product.cat];
        }
      });
      
      return score > 0;
    }).sort((a, b) => {
      // Sort by relevance score
      const scoreA = this.calculateProductScore(a, query);
      const scoreB = this.calculateProductScore(b, query);
      return scoreB - scoreA;
    });
  }

  rankSearchResults(products, query) {
    return products.sort((a, b) => {
      const scoreA = this.calculateProductScore(a, query);
      const scoreB = this.calculateProductScore(b, query);
      return scoreB - scoreA;
    });
  }

  calculateProductScore(product, query = '') {
    let score = 0;
    
    // Base relevance score
    if (query) {
      const queryLower = query.toLowerCase();
      const productText = `${product.name} ${product.cat}`.toLowerCase();
      if (productText.includes(queryLower)) score += 10;
    }
    
    // User preference boost
    const categoryScore = this.data.userProfile.categories[product.cat] || 0;
    score += categoryScore * 5;
    
    // Creator preference boost
    const creatorScore = this.data.userProfile.creators[product.creatorId] || 0;
    score += creatorScore * 3;
    
    // Interaction history boost
    const viewCount = this.data.interactions.views[product.id] || 0;
    score += Math.min(viewCount * 0.5, 2);
    
    // Price preference alignment
    const userPriceRange = this.data.userProfile.priceRange;
    if (product.price >= userPriceRange.min && product.price <= userPriceRange.max) {
      score += 2;
    }
    
    // Trending boost
    score += this.getTrendingScore(product.id);
    
    return score;
  }

  getTrendingScore(productId) {
    // Mock trending algorithm based on recent interactions
    const recentViews = this.data.interactions.views[productId] || 0;
    const totalViews = Object.values(this.data.interactions.views).reduce((sum, count) => sum + count, 0);
    
    if (totalViews === 0) return 0;
    
    const popularity = recentViews / totalViews;
    return popularity * 5; // Max trending boost of 5
  }

  getSearchInsights(query, results) {
    const categoryDistribution = {};
    results.forEach(product => {
      categoryDistribution[product.cat] = (categoryDistribution[product.cat] || 0) + 1;
    });
    
    const topCategory = Object.keys(categoryDistribution)
      .sort((a, b) => categoryDistribution[b] - categoryDistribution[a])[0];
    
    const insights = [
      `Found ${results.length} personalized results`,
      topCategory ? `Mostly ${topCategory} items` : '',
      this.data.userProfile.categories[topCategory] > 0.3 ? 'Matches your interests' : 'New category for you'
    ].filter(Boolean).join(' • ');
    
    return insights;
  }

  trackSearch(term) {
    if (!term || term.length < 2) return;
    
    this.data.interactions.searches.push({
      term: term.toLowerCase(),
      timestamp: Date.now()
    });
    
    // Keep only last 50 searches
    if (this.data.interactions.searches.length > 50) {
      this.data.interactions.searches = this.data.interactions.searches.slice(-50);
    }
    
    this.saveAIData();
  }

  getFilterSuggestions(query) {
    const profile = this.data.userProfile;
    
    if (query) {
      return `Based on "${query}", try filtering by price range ${this.formatPrice(profile.priceRange.min)}-${this.formatPrice(profile.priceRange.max)} or your favorite categories.`;
    }
    
    const topCategory = Object.keys(profile.categories)
      .sort((a, b) => profile.categories[b] - profile.categories[a])[0];
    
    if (topCategory) {
      return `You love ${topCategory}! Try filtering by this category or similar price ranges.`;
    }
    
    return t("try_filtering_by_budget");
  }

  getRecommendedPriceRange() {
    const profile = this.data.userProfile;
    return {
      min: Math.max(profile.priceRange.min * 0.8, 50),
      max: Math.min(profile.priceRange.max * 1.2, 1000)
    };
  }

  trackFilterUsage(filters) {
    // Track filter usage patterns for learning
    const filterData = {
      timestamp: Date.now(),
      priceRange: filters.minPrice || filters.maxPrice ? true : false,
      categoryFilters: filters.creators.length > 0,
      sortBy: filters.sortBy
    };
    
    // Store filter patterns (keep last 20)
    if (!this.data.interactions.filterUsage) {
      this.data.interactions.filterUsage = [];
    }
    
    this.data.interactions.filterUsage.push(filterData);
    if (this.data.interactions.filterUsage.length > 20) {
      this.data.interactions.filterUsage = this.data.interactions.filterUsage.slice(-20);
    }
    
    this.saveAIData();
  }

  getSearchAnalytics() {
    const searches = this.data.interactions.searches;
    const clicks = this.data.interactions.clicks;
    
    // Calculate search stats
    const totalSearches = searches.length;
    const uniqueTerms = [...new Set(searches.map(s => s.term))].length;
    
    // Calculate click-through rate
    const searchClicks = Object.values(clicks).reduce((sum, count) => sum + count, 0);
    const avgResultClicks = totalSearches > 0 ? Math.round((searchClicks / totalSearches) * 10) / 10 : 0;
    
    // Get top search terms
    const termCounts = {};
    searches.forEach(search => {
      termCounts[search.term] = (termCounts[search.term] || 0) + 1;
    });
    
    const topSearches = Object.entries(termCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([term, count]) => ({ term, count }));
    
    return {
      totalSearches,
      uniqueTerms,
      avgResultClicks,
      topSearches
    };
  }

  getCategoryScore(category) {
    return this.data.userProfile.categories[category] || 0;
  }

  getCreatorScore(creatorId) {
    return this.data.userProfile.creators[creatorId] || 0;
  }

  formatPrice(price) {
    return `${price} SAR`;
  }

  getAllProducts() {
    // This would normally come from the data layer
    // For now, return empty array and let the search system handle it
    return [];
  }
}


// Create singleton instance
export const aiEngine = new AIEngine();

// Expose for debugging in console
if (typeof window !== 'undefined') {
  window.StoreZ_AI = aiEngine;
}