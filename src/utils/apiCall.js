import axios from 'axios';
const apiCall = async (method, url, headers = {}, data = null) => {
    try {
        const config = {
            method,
            url,
            headers,
            ...(data && { data }), // Include data only if it exists
        };

        const response = await axios(config);

        // Check if the response contains a failure message in 'message'
        if (response?.data?.success === false) {
            const errorMessage = response?.data?.message || 'An unknown error occurred';
            console.error(`API call failed. Method: ${method}, URL: ${url}, Message: ${errorMessage}`);
            // return { success: false, message: errorMessage, data: response.data.data };
              return response?.data?.data;
        }

        return response?.data?.data; // Return data if the response was successful
    } catch (error) {
        const status = error.response?.status || 500;
        const errorMessage = error.response?.data?.message || error.message || 'An error occurred';

        console.error(`API call failed. Method: ${method}, URL: ${url}, Status: ${status}`, errorMessage);
        throw new Error(errorMessage);
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
    const token =`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MjY5YjczN2MyNDNkYTBkZTJjM2FiYSIsImlhdCI6MTczMDc0ODM5OSwiZXhwIjoxODE3MTQ4Mzk5fQ.si-Bi6uf83FMZwZ3hz8ebnsPnEPdpHbfFuyjU_0Iim4`
    // const token = localStorage.getItem('authToken'); // Retrieve the token using the key 'authToken'
    if (token) {
        return token; // If token exists, return it
    } else {
        console.log('No token found in localStorage');
        return null; // Return null if no token found
    }
}

export { apiCall, addTokenToLocalStorage, getTokenFromLocalStorage };