const axios = require("axios");

const axiosRequest = async (method, url, data, headers) => {
  const maxRetries = 3;
  const retryDelay = 300;
  for (let retryCount = 0; retryCount < maxRetries; retryCount++) {
    try {
      const response = await axios({
        method: method,
        url: url,
        data: data,
        headers: headers,
      });
      return response.data;
    } catch (err) {
      if (err.response && err.response.status === 429) {
        console.log("Rate limit exceeded. Retrying in " + retryDelay + "ms...");
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      } else {
        throw err;
      }
    }
  }
};

module.exports = { axiosRequest }; 