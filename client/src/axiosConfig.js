import axios from 'axios';

const axiosInstance = axios.create({
  baseURL:  'http://localhost:4000/api',// Change this to your API base URL
  withCredentials: true, // Include credentials in requests
});

export default axiosInstance;
 