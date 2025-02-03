// import axios from 'axios';

// const axiosInstance = axios.create({
//   baseURL: 'http://apalabajar.shop:4000/api',// Change this to your API base URL
//   withCredentials: true, // Include credentials in requests 
//   //process.env.REACT_APP_BASE_URL ||
// }); 

// export default axiosInstance;
 
 
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://13.232.55.157:4000',// Change this to your API base URL
  withCredentials: true, // Include credentials in requests 
  //process.env.REACT_APP_BASE_URL ||
}); 

export default axiosInstance;
