import axios from 'axios';

const axiosInstance = axios.create({
  baseURL:process.env.REACT_APP_BASE_URL || 'http://localhost:4000/api',// Change this to your API base URL
  withCredentials: true, // Include credentials in requests 
  //process.env.REACT_APP_BASE_URL ||
}); 

export default axiosInstance;
 
