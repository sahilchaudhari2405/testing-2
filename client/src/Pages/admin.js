// import React from 'react';
// import BarGraphWithDropdown from '../component/BarGraphWithDropdown';
// import ChartWithDropdown from '../component/lineGraphSales';
// import ChartofProducts from '../component/lineGraphProduct';
// import ChartofVisitors from '../component/lineGraphVisitors';
// import Chartofdonut from '../component/donutChart';
// import axios from 'axios';
// import { jwtDecode } from 'jwt-decode';
// import { useEffect } from 'react';
// import axiosInstance from '../axiosConfig';
// import { useState } from 'react';




// // { selectedCounter, onCounterChange }
// const Admin = () => {
//   const [ourUsers, setourUsers] = useState([]);

//   const [selectedCounter, setSelectedUserID] = useState('');
//   const [counterUser, setCounterUser] = useState(null);
//   const [orders, setOrders] = useState([]);


//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       try {
//         const decodedToken = jwtDecode(token);
//         fetchUsers(token);
//       } catch (error) {
//         console.error('Error decoding token:', error);
//       }
//     } else {
//       console.error('No token found in localStorage');
//     }
//   }, []);

  
//   const fetchUsers = async (token) => {
//     try {
//       if (!token) {
//         throw new Error('No token found in localStorage');
//       }
//       const response = await axiosInstance.get('/auth/users', {
//         withCredentials: true
//       });
//       const resData = response.data;
//       console.log("CounterUsers: ", resData);
//       setourUsers(resData);
//     } catch (error) {
//       console.error('Error fetching users:', error); 
//     }
//   };

//   const onCounterChange = (event) => {
//     const selectedValue = event.target.value;
//     console.log("isndie counter chaneg: ",selectedValue);
//     setSelectedUserID(selectedValue);

//     const selectedUser = ourUsers.find(
//       (user, index) => (user._id) == selectedValue
//     );
//     const selUser = selectedUser;
//     setCounterUser(selUser);
//     console.log("selecteduser is: ", counterUser);
//   };

//   const fetchOrders = async (token=null) => {
//     try {
//       if (!token) {
//           throw new Error('No token found in localStorage');
//       }
//       const response = await axiosInstance.get('/order/getAllOrderByCounter', {
//           headers: { Authorization: `Bearer ${token}` }
//       });
//         // setOrders(response.data.data);
//         const resData = response.data.data;
//         console.log("getAllOrderByCounter : ",resData);
//         setOrders(matchingOrder);

      
//         const matchingOrder = resData.find(order => order?.user?._id === counterUser?._id);
//         if (matchingOrder) {
//           setOrders(matchingOrder);
//           console.log("matchingOrder is: ",matchingOrder);
//         } else {
//           console.log(`No order found for user ID: ${counterUser._id}`);
//         }
        
//     } catch (error) {
//         console.error('Error fetching orders:', error); 
//     }
//   };

//   useEffect(() => {
//     console.log("indie fetch");
//     const token = localStorage.getItem('token');
//     if (token) {  
//       const decodedToken = jwtDecode(token);
//       console.log("decoded token is: ",decodedToken);
//       console.log("decoded token userid is: ",decodedToken.id);
//       fetchOrders(token);
//     }
//   },[]);


//   return (
//     <div className='flex flex-col justify-center items-center '>

//       <div className="p-8 w-[95vw] mt-20">
//         <h1 className="text-3xl font-bold mb-4">Counter Wise Dashboards</h1>

//         <select className="my-5" value={selectedCounter} onChange={onCounterChange}>
//           {ourUsers.filter(user => user.role !== 'admin').map((user, index) => (
//             <option key={user._id} value={user._id}>
//               {user.counterNumber ? 'Counter Number: ' + user.counterNumber : ''} Name: {user.fullName}
//             </option>
//           ))}
//         </select>


//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <div className="bg-purple-500 text-white p-6 rounded-lg">
//             <h2 className="text-xl">Current Users</h2>
//             <h3 className="text-2xl font-bold">500</h3>
//             <p className='flex flex-row gap-2'>Increased by 45% <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-graph-up" viewBox="0 0 16 16">
//               <path fill-rule="evenodd" d="M0 0h1v15h15v1H0zm14.817 3.113a.5.5 0 0 1 .07.704l-4.5 5.5a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61 4.15-5.073a.5.5 0 0 1 .704-.07" />
//             </svg></p>
//           </div>
//           <div className="bg-orange-500 text-white p-6 rounded-lg">
//             <h2 className="text-xl">Sales Today</h2>
//             <h3 className="text-2xl font-bold">600</h3>
//             <p className='flex flex-row gap-2'>Above Average by 45% <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-graph-up" viewBox="0 0 16 16">
//               <path fill-rule="evenodd" d="M0 0h1v15h15v1H0zm14.817 3.113a.5.5 0 0 1 .07.704l-4.5 5.5a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61 4.15-5.073a.5.5 0 0 1 .704-.07" />
//             </svg></p>
//           </div>
//           <div className="bg-blue-500 text-white p-6 rounded-lg">
//             <h2 className="text-xl">Revenue today</h2>
//             <h3 className="text-2xl font-bold">44400</h3>
//             <p className='flex flex-row gap-2'>More than 45% <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-graph-up" viewBox="0 0 16 16">
//               <path fill-rule="evenodd" d="M0 0h1v15h15v1H0zm14.817 3.113a.5.5 0 0 1 .07.704l-4.5 5.5a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61 4.15-5.073a.5.5 0 0 1 .704-.07" />
//             </svg></p>
//           </div>
//           <div className="bg-red-500 text-white p-6 rounded-lg">
//             <h2 className="text-xl">Total Visitors Today</h2>
//             <h3 className="text-2xl font-bold">100</h3>
//             <p className='flex flex-row gap-2'>User Increased 45% <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-graph-up" viewBox="0 0 16 16">
//               <path fill-rule="evenodd" d="M0 0h1v15h15v1H0zm14.817 3.113a.5.5 0 0 1 .07.704l-4.5 5.5a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61 4.15-5.073a.5.5 0 0 1 .704-.07" />
//             </svg></p>
//           </div>
//         </div>
//       </div>

//       <div className='flex m-20 mt-0 mb-20 rounded-md  flex-row w-[90vw]'>
//         <BarGraphWithDropdown />
//         <ChartWithDropdown />
//       </div>

//       <div className='flex mb-10 bg-white shadow-3xl rounded shadow-xl flex-row items-center justify-center  w-[90vw]'>

//         <div className=''>
//           <ChartofProducts />
//         </div>
//         <div className=''>
//           <ChartofVisitors />
//         </div>
//         <div className=''>
//           <Chartofdonut />
//         </div>

//       </div>
//     </div>
//   );
// }

// export default Admin;

import React, { useEffect, useState } from 'react';
import BarGraphWithDropdown from '../component/BarGraphWithDropdown';
import ChartWithDropdown from '../component/lineGraphSales';
import ChartofProducts from '../component/lineGraphProduct';
import ChartofCustomers from '../component/lineGraphVisitors';
import Chartofdonut from '../component/donutChart';
import axiosInstance from '../axiosConfig';
import { jwtDecode } from 'jwt-decode';


const Admin = () => {
  const [ourUsers, setOurUsers] = useState([]);
  const [selectedCounter, setSelectedUserID] = useState('');
  const [counterUser, setCounterUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  
  const [dateWiseCustomers, setdateWiseCustomers] = useState([]);
  const [weekWiseCustomers, setweekWiseCustomers] = useState('');
  const [monthWiseCustomers, setmonthWiseCustomers] = useState('');

  const [daywiseData, setDaywiseData] = useState([]);
  const [weekwiseData, setWeekwiseData] = useState([]);
  const [monthwiseData, setMonthwiseData] = useState({});
  const [latestSale, setlastestSale] = useState('');
  const [latestRevenue, setlastestRevenue] = useState('');
  const [latestDay, setlatestDay] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        fetchUsers(token);
        fetchOrders(token);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    } else {
      console.error('No token found in localStorage');
    }
  }, []);

  const fetchUsers = async (token) => {
    try {
      if (!token) {
        throw new Error('No token found in localStorage');
      }
      const response = await axiosInstance.get('/auth/users', {
        withCredentials: true
      });
      const resData = response.data;
      console.log("CounterUsers: ", resData);
      setOurUsers(resData);
      setSelectedUserID(resData[0]);
    } catch (error) {
      console.error('Error fetching users:', error); 
    }
  };

  const fetchOrders = async (token) => {
    try {
      if (!token) {
        throw new Error('No token found in localStorage');
      }
      const response = await axiosInstance.get('/order/getAllCounterSales', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const resData = response.data.data;
      console.log("getAllOrderByCounter : ", resData);
      setOrders(resData);
      setFilteredOrders(resData[0])

    } catch (error) {
      console.error('Error fetching orders:', error); 
    }
  };

  const fetchCounterSale = async (token) => {
    try {
      if (!token) {
        throw new Error('No token found in localStorage');
      }
      const response = await axiosInstance.get(`/order/getCounterSale/${selectedCounter}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const resData = response.data.data;
      console.log("getCounterSale : ", resData);
      // setOrders(resData);
      // setFilteredOrders(resData[0])

    } catch (error) {
      console.error('Error fetching orders:', error); 
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        fetchCounterSale(token);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    } else {
      console.error('No token found in localStorage');
    }

  }, [counterUser])

  const onCounterChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedUserID(selectedValue);

    const selectedUser = ourUsers.find(user => user._id === selectedValue);
    setCounterUser(selectedUser);

    const matchingOrders = orders.filter(order => order.user && order.user._id === selectedValue);
    setFilteredOrders(matchingOrders.length > 0 ? matchingOrders[0] : {});
    console.log("for selecter counter user: ",selectedUser);
    console.log("matchingOrders : ",matchingOrders);
  };

  const transformData = (data) => {
    console.log("This is the order inside transform: ",data);
    const daywise = (data?.dailySales || []).map((sale, index) => ({
      name: `Day ${index + 1}`,
      sales: sale.finalPriceWithGST,
      revenue: sale.totalProfit.toFixed(2),
      date: sale.date
    }));

    const weekwise = ( data?.weekSales || [] ).map((sale, index) => ({
      name: `Week ${index + 1}`,
      sales: sale.finalPriceWithGST,
      revenue: sale.totalProfit.toFixed(2)
    }));

    const monthwise = [
      {
        name: new Date(data?.month + '-01').toLocaleString('default', { month: 'short' }),
        sales: data?.monthFinalPriceWithGST,
        revenue: data?.monthTotalProfit
      }
    ];

    if (daywise.length > 0) {
        setlastestSale(daywise[daywise.length - 1].sales);
        setlastestRevenue(daywise[daywise.length - 1].revenue);
        const latestSaleDate = new Date(daywise[daywise.length - 1].date);
        const today = new Date();
        
        if (daywise[daywise.length - 1].date == today.getDate()) {
            setlatestDay('Today');
        } else {
          setlatestDay('Last Day');
        }
    }

    return { daywise, weekwise, monthwise };
  };

  const calculateCustomers = (orders_data = {}) => {
    const dateWiseCustomers = orders_data.dailySales?.map(entry => ({
      name: entry.date,
      bills: entry.DayBill
    })) || [];
  
    const weekWiseCustomers = orders_data.weekSales?.map(entry => ({
      name: entry.week,
      bills: entry.WeekBill
    })) || [];
  
    const monthWiseCustomers = orders_data.month && orders_data.MonthsBill ? {
      name: orders_data.month,
      bills: orders_data.MonthsBill
    } : { name: null, bills: null };
  
    return { dateWiseCustomers, weekWiseCustomers, monthWiseCustomers };
  };
  

  useEffect(() => {
      const { daywise, weekwise, monthwise } = transformData(filteredOrders);
      setDaywiseData(daywise);
      setWeekwiseData(weekwise);
      setMonthwiseData(monthwise);

      const {dateWiseCustomers, weekWiseCustomers, monthWiseCustomers } = calculateCustomers(filteredOrders);
      setdateWiseCustomers(dateWiseCustomers);
      setweekWiseCustomers(weekWiseCustomers);
      setmonthWiseCustomers(monthWiseCustomers);

      console.log("daywise: ",daywiseData);
      console.log("dateWiseCustomers: ",dateWiseCustomers);
      console.log("weekWiseCustomers: ",weekWiseCustomers);
      console.log("monthWiseCustomers: ",monthWiseCustomers);
    
  }, [filteredOrders]);

  return (
    <div className='flex flex-col justify-center items-center '>
      <div className="p-8 w-[95vw] mt-20">
        <h1 className="text-3xl font-bold mb-4">Counter Wise Dashboards</h1>
        <select className="my-5" value={selectedCounter} onChange={onCounterChange}>
          {ourUsers.map((user) => (
            <option key={user._id} value={user._id}>
              {user.counterNumber ? 'Counter Number: ' + user.counterNumber : ''} Name: {user.fullName}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-purple-500 text-white p-6 rounded-lg">
          <h2 className="text-xl">Customers on the latest Day</h2>
              <h3 className="text-2xl font-bold">{dateWiseCustomers?.length ? dateWiseCustomers[dateWiseCustomers?.length - 1].bills : 'N/A'}
              </h3>
            {/* <p className='flex flex-row gap-2'>Increased by 45% <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-graph-up" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M0 0h1v15h15v1H0zm14.817 3.113a.5.5 0 0 1 .07.704l-4.5 5.5a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61 4.15-5.073a.5.5 0 0 1 .704-.07" />
            </svg></p> */}
          </div>
          <div className="bg-orange-500 text-white p-6 rounded-lg">
          <h2 className="text-xl">Sales {latestDay}</h2>
          <h3 className="text-2xl font-bold">{latestSale}</h3>
            {/* <p className='flex flex-row gap-2'>Above Average by 45% <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-graph-up" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M0 0h1v15h15v1H0zm14.817 3.113a.5.5 0 0 1 .07.704l-4.5 5.5a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61 4.15-5.073a.5.5 0 0 1 .704-.07" />
            </svg></p> */}
          </div>
          <div className="bg-blue-500 text-white p-6 rounded-lg">
          <h2 className="text-xl">Revenue {latestDay}</h2>
          <h3 className="text-2xl font-bold">{latestRevenue}</h3>
            {/* <p className='flex flex-row gap-2'>More than 45% <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-graph-up" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M0 0h1v15h15v1H0zm14.817 3.113a.5.5 0 0 1 .07.704l-4.5 5.5a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61 4.15-5.073a.5.5 0 0 1 .704-.07" />
            </svg></p> */}
          </div>
          <div className="bg-red-500 text-white p-6 rounded-lg">
          <h2 className="text-xl">Customers on the latest week </h2>
          <h3 className="text-2xl font-bold">{weekWiseCustomers?.length ? weekWiseCustomers[weekWiseCustomers?.length - 1].bills : 'N/A'}</h3>
            {/* <p className='flex flex-row gap-2'>User Increased 45% <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-graph-up" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M0 0h1v15h15v1H0zm14.817 3.113a.5.5 0 0 1 .07.704l-4.5 5.5a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61 4.15-5.073a.5.5 0 0 1 .704-.07" />
            </svg></p> */}
          </div>
        </div>
      </div>
      <div className="flex m-20 mt-0 rounded-md flex-row w-[90vw]">
          <BarGraphWithDropdown daywiseData={daywiseData} weekwiseData={weekwiseData} monthwiseData={monthwiseData} />
          <ChartWithDropdown daywiseData={daywiseData} weekwiseData={weekwiseData} monthwiseData={monthwiseData} />
        </div>
        <div className="flex mb-10 bg-white shadow-3xl rounded shadow-xl flex-row items-center justify-center w-[90vw]">
          <div>
            <ChartofCustomers dateWiseCustomers={dateWiseCustomers} weekWiseCustomers = {weekWiseCustomers}  />
          </div>
          {<div>
            <Chartofdonut dateWiseCustomers={dateWiseCustomers} weekWiseCustomers = {weekWiseCustomers} monthWiseCustomers ={monthWiseCustomers} />
          </div>}
        </div>

      
    </div>
  );
}

export default Admin;
