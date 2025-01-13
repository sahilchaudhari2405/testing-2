import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import { logoutUser } from '../Redux/User/userSlices';
import BarGraphWithDropdown from '../component/BarGraphWithDropdown';
import ChartWithDropdown from '../component/lineGraphSales';
import ChartofProducts from '../component/lineGraphProduct';
import ChartofCustomers from '../component/lineGraphVisitors';
import Chartofdonut from '../component/donutChart';
import { toast } from 'react-toastify';
import axios from 'axios';
import axiosInstance from '../axiosConfig';



const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [timeFrame, setTimeFrame] = useState('day');
  const [userId, setuserID] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [orders, setOrders] = useState([]);
  const [daywiseData, setDaywiseData] = useState([]);
  const [weekwiseData, setWeekwiseData] = useState([]);
  const [monthwiseData, setMonthwiseData] = useState({});
  const [latestSale, setlastestSale] = useState('');
  const [latestRevenue, setlastestRevenue] = useState('');
  const [latestDay, setlatestDay] = useState('');
  const [SalesYearandMonthWiseCustomers, SetSalesYearandMonthWiseCustomers] = useState(null);
  const [RevenueYearandMonthWiseCustomers, SetRevenueYearandMonthWiseCustomers] = useState(null);
  const [CustomersYearandMonthWiseCustomers, SetCustomersYearandMonthWiseCustomers] = useState(null);
  const [dateWiseCustomers, setdateWiseCustomers] = useState([]);
  const [weekWiseCustomers, setweekWiseCustomers] = useState('');
  const [monthWiseCustomers, setmonthWiseCustomers] = useState('');
  const [isAdmin, setisAdmin] = useState(false);
  const [TotalView, setTotalView] = useState(false);
  const [Name, setFinalName] = useState("");
  
  const handleTokenExpiration = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          handlenewLogout();  
        }
      } catch (error) {
        console.error("Error decoding token", error);
      }
    }
  };
  useEffect(() => {
    const data = localStorage.getItem("invoiceSettings");
    if (data) {
      try {
        const parsedData = JSON.parse(data); // Parse the string into an object
        setFinalName(parsedData.language?.english?.title || ""); // Safely access the nested address
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
      }
    } else {
      console.warn("No data found in localStorage");
    }
  }, [Name]);
  const handlenewLogout = () => {
    localStorage.removeItem('token');
    axiosInstance.post('/auth/logout').catch((err) => console.error(err));
    // window.location.href = '/login';
    navigate('/');
  };

  React.useEffect(() => {
    handleTokenExpiration(); 
  }, []);
  
  useEffect(() => {
    if (isAdmin){
      console.log("isadmin");
      const { daywise, weekwise, monthwise } = transformDataforAdmin(orders);
      console.log("inside admin daywise: ",daywise);
      console.log("inside admin weekwise: ",weekwise);
      console.log("inside admin monthwise: ",monthwise);

      setDaywiseData(daywise);
      setWeekwiseData(weekwise);
      setMonthwiseData(monthwise);
      const aggregatedDataofCustomers =  calculateCustomersforAdmin(orders);
      const {dateWiseCustomers, weekWiseCustomers, monthWiseCustomers } = aggregatedDataofCustomers;
      console.log("inside admin dateWiseCustomers: ",dateWiseCustomers);
      console.log("inside admin weekWiseCustomers: ",weekWiseCustomers);
      console.log("inside admin monthWiseCustomers: ",monthWiseCustomers);
      setdateWiseCustomers(dateWiseCustomers);
      setweekWiseCustomers(weekWiseCustomers);
      setmonthWiseCustomers(monthWiseCustomers);
    }
    else {
      console.log("else o gis admin");
      const { daywise, weekwise, monthwise } = transformData(orders);
      setDaywiseData(daywise);
      setWeekwiseData(weekwise);
      setMonthwiseData(monthwise);

      const {dateWiseCustomers, weekWiseCustomers, monthWiseCustomers } = calculateCustomers(orders);
      setdateWiseCustomers(dateWiseCustomers);
      setweekWiseCustomers(weekWiseCustomers);
      setmonthWiseCustomers(monthWiseCustomers);

      console.log("daywise: ",daywiseData);
      console.log("dateWiseCustomers: ",dateWiseCustomers);
      console.log("weekWiseCustomers: ",weekWiseCustomers);
      console.log("monthWiseCustomers: ",monthWiseCustomers);
    }
  }, [orders]);

  const transformData = (data) => {
    console.log("This is the order inside transform: ",data);
    const daywise = (data.dailySales || []).map((sale, index) => ({
      name: `Day ${index + 1}`,
      sales: sale.finalPriceWithGST,
      revenue: sale.totalProfit.toFixed(2),
      date: sale.date
    }));

    const weekwise = ( data.weekSales || [] ).map((sale, index) => ({
      name: `Week ${index + 1}`,
      sales: sale.finalPriceWithGST,
      revenue: sale.totalProfit.toFixed(2)
    }));

    const monthwise = [
      {
        name: new Date(data.month + '-01').toLocaleString('default', { month: 'short' }),
        sales: data.monthFinalPriceWithGST,
        revenue: data.monthTotalProfit
      }
    ];

    if (daywise.length > 0) {
        setlastestSale(daywise[daywise.length - 1].sales);
        setlastestRevenue(daywise[daywise.length - 1].revenue);
        const latestSaleDate = new Date(daywise[daywise.length - 1].date);
        const today = new Date();
        
        if (latestSaleDate.toDateString() === today.toDateString()) {
            setlatestDay('Today');
        } else {
          setlatestDay('Last Day');
        }
    }

    return { daywise, weekwise, monthwise };
  };
const transformDataforAdmin = (data) => {
  if (!data || data.length === 0) {
    return { daywise: [], weekwise: [], monthwise: [] };
  }

  const daywiseArray = [];
  const weekwiseArray = [];
  const monthwiseArray = [];

  data.forEach(order => {
    (order.dailySales || []).forEach(sale => {
      daywiseArray.push({
        name: `Day ${sale.date}`,
        sales: sale.finalPriceWithGST,
        revenue: sale.totalProfit.toFixed(2),
        date: sale.date
      });
    });

    (order.weekSales || []).forEach(sale => {
      weekwiseArray.push({
        name: `Week ${sale.week}`,
        sales: sale.finalPriceWithGST,
        revenue: sale.totalProfit.toFixed(2),
      });
    });

    monthwiseArray.push({
      name: new Date(order.month).toLocaleString('default', { month: 'short', year: 'numeric' }),
      sales: order.monthFinalPriceWithGST,
      revenue: order.monthTotalProfit.toFixed(2),
    });
  });

  // Determine the latest sale details
  if (daywiseArray.length > 0) {
    const latestDaywiseSale = daywiseArray[daywiseArray.length - 1];
    setlastestSale(latestDaywiseSale.sales);
    setlastestRevenue(latestDaywiseSale.revenue);
    const latestSaleDate = new Date(latestDaywiseSale.date);
    const today = new Date();
    console.log("check",latestDaywiseSale.date);
    console.log("check",today.getDate());
    if (latestDaywiseSale.date == today.getDate()) {
 console.log("yes")
      setlatestDay('Today');
    } else {
      setlatestDay('Last Day');
    }
  }

  return {
    daywise: daywiseArray,
    weekwise: weekwiseArray,
    monthwise: monthwiseArray,
  };
};

const calculateCustomersforAdmin = (ordersArray) => {
  const aggregatedData = {
    dateWiseCustomers: [],
    weekWiseCustomers: [],
    monthWiseCustomers: []
  };

  ordersArray.forEach(orders_data => {
    orders_data.dailySales?.forEach(entry => {
      const existingEntry = aggregatedData.dateWiseCustomers.find(item => item.name === entry.date);
      if (existingEntry) {
        existingEntry.bills += entry.DayBill;
      } else {
        aggregatedData.dateWiseCustomers.push({
          name: entry.date,
          bills: entry.DayBill
        });
      }
    });

    orders_data.weekSales?.forEach(entry => {
      const existingEntry = aggregatedData.weekWiseCustomers.find(item => item.name === entry.week);
      if (existingEntry) {
        existingEntry.bills += entry.WeekBill;
      } else {
        aggregatedData.weekWiseCustomers.push({
          name: entry.week,
          bills: entry.WeekBill
        });
      }
    });

    const existingMonthEntry = aggregatedData.monthWiseCustomers.find(item => item.name === orders_data.month);
    if (existingMonthEntry) {
      existingMonthEntry.bills += orders_data.MonthsBill;
    } else {
      aggregatedData.monthWiseCustomers.push({
        name: orders_data.month,
        bills: orders_data.MonthsBill
      });
    }
  });

  return aggregatedData;
};


const fetchOrders = async (token=null) => {
  try {
    if (!token) {
        throw new Error('No token found in localStorage');
    }
    const response = await axiosInstance.get('users/admin/getTotalOfflineSale', );

    const resData = response.data.data;
    setisAdmin(true);
    setOrders(resData);
    console.log("getTotalOfflineSale : ",resData);
      
  } catch (error) {
      console.error('Error fetching orders:', error); 
  }
};

const calculateCustomers = (orders_data) => {
  const dateWiseCustomers = orders_data.dailySales?.map(entry => ({
    name: entry.date,
    bills: entry.DayBill
  }));

  const weekWiseCustomers = orders_data.weekSales?.map(entry => ({
    name: entry.week,
    bills: entry.WeekBill
  }));

  const monthWiseCustomers = {
    name: orders_data.month,
    bills: orders_data.MonthsBill
  };

  return {dateWiseCustomers, weekWiseCustomers, monthWiseCustomers };
};


  

  useEffect(() => {
    console.log("indie fetch");
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      console.log("decoded token is: ",decodedToken);
      console.log("decoded token userid is: ",decodedToken.id);
        const uid = decodedToken.id;
        setuserID(uid);
        setUserRole(decodedToken.role);
        setFullName(decodedToken.fullName);
        fetchOrders(token);
    }
  },[]);
  const handleTimeFrameChange = (event) => {
    const value = event.target.value;
    setTimeFrame(value); // Update state when the selection changes
  
    // Conditional logic for TotalView
    if (value === 'day') {
      setlatestDay('latest day');
      setTotalView(false);
    } else if (value === 'year') {
      setlatestDay('latest year');
      let revenue = 0;
      let sale = 0;
      let Customers = 0;
  
      // Iterate over the `orders` array correctly 
      for (const data of orders) {
        Customers += data.MonthsBill || 0;
        revenue += data.monthTotalProfit || 0;
        sale += data.monthFinalPriceWithGST || 0;
      }
  
      // Update the state with calculated totals
      SetCustomersYearandMonthWiseCustomers(Customers);
      SetRevenueYearandMonthWiseCustomers(revenue);
      SetSalesYearandMonthWiseCustomers(sale);
      setTotalView(true);
    } else if (value === 'month') {
      setlatestDay('latest month');
  
      const latestOrder = orders[orders.length - 1];
  
      // Make sure there is an order available
      if (latestOrder) {
        SetCustomersYearandMonthWiseCustomers(latestOrder.MonthsBill || 0);
        SetRevenueYearandMonthWiseCustomers(latestOrder.monthTotalProfit || 0);
        SetSalesYearandMonthWiseCustomers(latestOrder.monthFinalPriceWithGST || 0);
      }
  
      setTotalView(true);
    }
  };
  

  useEffect(() => {
    console.log("the user role is: ",userRole);
    console.log("the user id is: ",userId);
    const token = localStorage.getItem('token');
    fetchOrders(token);

  }, [userId,userRole]);

  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     const decodedToken = jwtDecode(token);

  //     setFullName(decodedToken.fullName);
  //     setuserID(decodedToken._id);
  //   } else { // Redirect to login if no token found
  //   }
  // }, [navigate]);

  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.removeItem('token');
    toast.error("Logout Successfully!")
    navigate('/');
  };

  return (
    <div className="bg-white border-[1px] mt-28 mx-6 rounded-lg shadow-lg">
      <div className="bg-teal-700 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm">Online Orders | Hi, <span className="font-bold">{fullName}</span></span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            LogOut
          </button>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center">
        <div className="p-8 w-[95vw] mt-4">
        <p className="mb-12 text-black text-xm font-semibold">
            Welcome to <span className="font-bold text-4xl text-gray-600">{Name}</span>
          </p>
        <div className='flex flex-row justify-between mx-5 my-5'>
        <select className='bg-gray-300' value={timeFrame} onChange={handleTimeFrameChange}>
        <option value="day">Day</option>
        <option value="month">Month</option>
        <option value="year">Year</option>
      </select>
      </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-purple-500 text-white p-6 rounded-lg">
            <h2 className="text-xl">Customers on the {latestDay}</h2>
    <h3 className="text-2xl font-bold">
      {(CustomersYearandMonthWiseCustomers || (dateWiseCustomers && dateWiseCustomers[dateWiseCustomers.length - 1]?.bills))
        ? (TotalView ? CustomersYearandMonthWiseCustomers : dateWiseCustomers[dateWiseCustomers.length - 1]?.bills)
        : 'NA'}
    </h3>
              {/* <p className="flex flex-row gap-2">
                Increased by 45% <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-graph-up" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M0 0h1v15h15v1H0zm14.817 3.113a.5.5 0 0 1 .07.704l-4.5 5.5a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61 4.15-5.073a.5.5 0 0 1 .704-.07" />
                </svg>
              </p> */}
            </div>
            <div className="bg-orange-500 text-white p-6 rounded-lg">
              <h2 className="text-xl">Sales {latestDay}</h2>
              <h3 className="text-2xl font-bold">{(latestSale || SalesYearandMonthWiseCustomers)? (TotalView)? SalesYearandMonthWiseCustomers?.toFixed(2):latestSale:'NA'}</h3>
              {/* <p className="flex flex-row gap-2">
                Above Average by 45% <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-graph-up" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M0 0h1v15h15v1H0zm14.817 3.113a.5.5 0 0 1 .07.704l-4.5 5.5a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61 4.15-5.073a.5.5 0 0 1 .704-.07" />
                </svg>
              </p> */}
            </div>
            <div className="bg-blue-500 text-white p-6 rounded-lg">
              <h2 className="text-xl">Revenue {latestDay}</h2>
              <h3 className="text-2xl font-bold">{(latestSale || RevenueYearandMonthWiseCustomers)? (TotalView)? RevenueYearandMonthWiseCustomers?.toFixed(2):latestRevenue:'NA'}</h3>
              {/* <p className="flex flex-row gap-2">
                More than 45% <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-graph-up" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M0 0h1v15h15v1H0zm14.817 3.113a.5.5 0 0 1 .07.704l-4.5 5.5a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61 4.15-5.073a.5.5 0 0 1 .704-.07" />
                </svg>
              </p> */}
            </div>
            <div className="bg-red-500 text-white p-6 rounded-lg">
              <h2 className="text-xl">Customers on the latest week </h2>
              <h3 className="text-2xl font-bold">{weekWiseCustomers?.length ? weekWiseCustomers[weekWiseCustomers?.length - 1].bills : 'N/A'}</h3>
              {/* <p className="flex flex-row gap-2">
                User Increased 45% <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-graph-up" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M0 0h1v15h15v1H0zm14.817 3.113a.5.5 0 0 1 .07.704l-4.5 5.5a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61 4.15-5.073a.5.5 0 0 1 .704-.07" />
                </svg>
              </p> */}
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
          { <div>
            <Chartofdonut dateWiseCustomers={dateWiseCustomers} weekWiseCustomers = {weekWiseCustomers} monthWiseCustomers ={monthWiseCustomers} />
           </div>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
