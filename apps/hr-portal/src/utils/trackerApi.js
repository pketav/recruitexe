// In-memory cache store with automatic expiration
const cache = new Map();

/**
 * Fetch data with caching
 * @param {string} url - The URL to fetch
 * @param {number} cacheDurationMinutes - How long to cache the response (in minutes)
 * @param {Object} options - Fetch options, including headers and query params
 * @returns {Promise<any>} - The response data
 */
export const fetchWithCache = async (url, cacheDurationMinutes = 5, options = {}) => {
  // Generate cache key from URL and options
  const cacheKey = `${url}-${JSON.stringify(options)}`;
  
  // Check if we have a valid cached response
  const cachedItem = cache.get(cacheKey);
  if (cachedItem && Date.now() < cachedItem.expiry) {
    console.log(`Cache hit for ${url}`);
    return cachedItem.data;
  }
  
  console.log(`Fetching ${url} with options:`, options);
  
  try {
    // Build query string from params if provided
    let fetchUrl = url;
    if (options.params) {
      const queryString = new URLSearchParams(
        Object.entries(options.params).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null) {
            acc[key] = value;
          }
          return acc;
        }, {})
      ).toString();
      fetchUrl = queryString ? `${url}?${queryString}` : url;
    }

    // If no cache or expired, make the fetch request
    const response = await fetch(fetchUrl, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'token': localStorage.getItem('authToken') || '', // Add authentication token
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }
    
    // Parse the response
    const data = await response.json();
    const result = data?.data || data;
    
    // Cache the response with expiration time
    cache.set(cacheKey, {
      data: result,
      expiry: Date.now() + (cacheDurationMinutes * 60 * 1000),
    });
    
    console.log(`Successfully fetched ${url}`);
    return result;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error.message);
    
    // If we have stale cache data, return it instead of failing
    if (cachedItem) {
      console.log(`Returning stale cache data for ${url}`);
      return cachedItem.data;
    }
    
    throw error;
  }
};

/**
 * Clear all cached data or specific cached items
 * @param {string|null} urlPattern - Optional URL pattern to match for clearing specific cache entries
 */
export const clearCache = (urlPattern = null) => {
  if (urlPattern) {
    // Clear specific cache entries
    for (const key of cache.keys()) {
      if (key.includes(urlPattern)) {
        cache.delete(key);
      }
    }
  } else {
    // Clear all cache
    cache.clear();
  }
};

/**
 * Preload data into cache
 * @param {string} url - The URL to fetch
 * @param {number} cacheDurationMinutes - How long to cache the response (in minutes)
 * @param {Object} options - Fetch options
 */
export const preloadCache = async (url, cacheDurationMinutes = 5, options = {}) => {
  try {
    await fetchWithCache(url, cacheDurationMinutes, options);
    console.log(`Preloaded ${url} into cache`);
  } catch (error) {
    console.error(`Failed to preload ${url}:`, error);
  }
};