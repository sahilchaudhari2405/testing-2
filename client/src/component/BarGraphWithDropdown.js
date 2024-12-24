import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


// const dataDay = [
//   { name: 'Day 1', sales: 4000, revenue: 2400 },
//   { name: 'Day 2', sales: 3000, revenue: 1398 },
//   { name: 'Day 3', sales: 2000, revenue: 9800 },
//   { name: 'Day 4', sales: 2780, revenue: 3908 },
//   { name: 'Day 5', sales: 1890, revenue: 4800 },
//   { name: 'Day 6', sales: 2390, revenue: 3800 },
//   { name: 'Day 7', sales: 3490, revenue: 4300 },
// ];

// const dataWeek = [
//   { name: 'Week 1', sales: 21000, revenue: 14000 },
//   { name: 'Week 2', sales: 20000, revenue: 13980 },
//   { name: 'Week 3', sales: 22000, revenue: 19000 },
//   { name: 'Week 4', sales: 25000, revenue: 15000 },


// ];

// const dataYear = [
//   { name: 'Jan', sales: 80000, revenue: 65000 },
//   { name: 'Feb', sales: 70000, revenue: 58000 },
//   { name: 'Mar', sales: 75000, revenue: 60000 },
//   { name: 'Apr', sales: 60000, revenue: 54000 },
//   { name: 'May', sales: 65000, revenue: 56000 },
//   { name: 'Jun', sales: 70000, revenue: 60000 },
//   { name: 'Jul', sales: 80000, revenue: 65000 },
//   { name: 'Aug', sales: 85000, revenue: 70000 },
//   { name: 'Sep', sales: 75000, revenue: 62000 },
//   { name: 'Oct', sales: 65000, revenue: 57000 },
//   { name: 'Nov', sales: 70000, revenue: 61000 },
//   { name: 'Dec', sales: 90000, revenue: 75000 },
// ];

const BarGraphWithDropdown = ({daywiseData,weekwiseData,monthwiseData}) => {
  const [timeFrame, setTimeFrame] = useState('day');
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
      setChartData(daywiseData);
  },[daywiseData]);
  

  const handleTimeFrameChange = (event) => {
    const value = event.target.value;
    setTimeFrame(value);
    if (value === 'day') {
      setChartData(daywiseData);
    } else if (value === 'week') {
      setChartData(weekwiseData);
    }else if (value === 'month') {
      setChartData(monthwiseData);
    }
  };

  return (
    <div className=' mt-10 rounded-md flex bg-white flex-col w-[70vw] shadow-2xl'>
      <div className='flex flex-row justify-between mx-5 my-5'>
        <div className='text-3xl font-semibold'>Statistics</div>
        <select className='bg-gray-300 ' value={timeFrame} onChange={handleTimeFrameChange}>
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
        </select>
      </div>


      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="sales" fill="#8884d8" />
          <Bar dataKey="revenue" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarGraphWithDropdown;
