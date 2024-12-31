import axios from "axios";

const cache = {};
const cacheExpiry = {};

const apiCall = async (method, url, headers = {}, data = null) => {
  const cacheKey = `${method}_${url}_${JSON.stringify(data)}`;

  // Check if cached data is valid
  if (
    method === "GET" &&
    cache[cacheKey] &&
    Date.now() < cacheExpiry[cacheKey]
  ) {
    return cache[cacheKey];
  }

  try {
    const config = {
      method,
      url,
      headers,
      withCredentials: true,
      ...(data && { data }),
    };

    const response = await axios(config);

    // Cache the response with a 5-minute expiry
    if (method === "GET") {
      cache[cacheKey] = response?.data;
      cacheExpiry[cacheKey] = Date.now() + 5 * 60 * 1000; // 5 minutes
    }

    return response?.data;
  } catch (error) {
    return {
      status: false,
      message: error.message || "An error occurred",
    };
  }
};


const addTokenToLocalStorage = (token) => {
    if (typeof token === 'string' && token.trim() !== '') {
        localStorage.setItem('authToken', token); // Store token with a key 'authToken'
        console.log('Token added to localStorage');
    } else {
        console.log('Invalid token format');
    }
};

// Function to get a token from localStorage
const getTokenFromLocalStorage = () => {
    // const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MjY5YjczN2MyNDNkYTBkZTJjM2FiYSIsImlhdCI6MTczMDc0ODM5OSwiZXhwIjoxODE3MTQ4Mzk5fQ.si-Bi6uf83FMZwZ3hz8ebnsPnEPdpHbfFuyjU_0Iim4`
    const token = localStorage.getItem('authToken'); // Retrieve the token using the key 'authToken'
    if (token) {
        return token; // If token exists, return it
    } else {
        console.log('No token found in localStorage');
        return null; // Return null if no token found
    }
}

export { apiCall, addTokenToLocalStorage, getTokenFromLocalStorage };