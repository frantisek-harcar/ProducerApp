const API_BASE_URL = process.env.REACT_APP_API_BASE_URL === 'production'
  ? 'https://producer-app-server.onrender.com'
  : 'http://localhost:4000';

export default API_BASE_URL;
