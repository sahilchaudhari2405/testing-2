import React, { useState } from 'react';
import { BarChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const dataDay = [
    { name: 'Day 1', sales: 4000, revenue: 2400 },
    { name: 'Day 2', sales: 3000, revenue: 1398 },
    { name: 'Day 3', sales: 3000, revenue: 9800 },
    { name: 'Day 4', sales: 2780, revenue: 3908 },
    { name: 'Day 5', sales: 1890, revenue: 4800 },
    { name: 'Day 6', sales: 2890, revenue: 3800 },
    { name: 'Day 7', sales: 490, revenue: 4300 },
];

const dataWeek = [
    { name: 'Week 1', sales: 31000, revenue: 14000 },
    { name: 'Week 2', sales: 4000, revenue: 13980 },
    { name: 'Week 3', sales: 2000, revenue: 19000 },
    { name: 'Week 4', sales: 25000, revenue: 15000 },
];

const dataYear = [
    { name: 'Jan', sales: 80000, revenue: 65000 },
    { name: 'Feb', sales: 30000, revenue: 58000 },
    { name: 'Mar', sales: 75000, revenue: 60000 },
    { name: 'Apr', sales: 60000, revenue: 54000 },
    { name: 'May', sales: 65000, revenue: 56000 },
    { name: 'Jun', sales: 50000, revenue: 60000 },
    { name: 'Jul', sales: 80000, revenue: 65000 },
    { name: 'Aug', sales: 25000, revenue: 70000 },
    { name: 'Sep', sales: 5000, revenue: 62000 },
    { name: 'Oct', sales: 65000, revenue: 57000 },
    { name: 'Nov', sales: 70000, revenue: 61000 },
    { name: 'Dec', sales: 90000, revenue: 75000 },
];

const ChartofVisitors = () => {
    const [timeFrame, setTimeFrame] = useState('day');
    const [chartData, setChartData] = useState(dataDay);

    const handleTimeFrameChange = (event) => {
        const value = event.target.value;
        setTimeFrame(value);
        if (value === 'day') {
            setChartData(dataDay);
        } else if (value === 'week') {
            setChartData(dataWeek);
        } else if (value === 'year') {
            setChartData(dataYear);
        }
    };

    return (
        <div className='mx-3 my-10 p-5 bg-white rounded-md flex flex-col shadow-2xl' style={{ width: '400px', height: '350px' }}>
            <div className='flex flex-row justify-between mb-2'>
                <label className='text-lg font-semibold'>
                    Total Visitors
                </label>
                <select value={timeFrame} onChange={handleTimeFrameChange} className='border rounded p-1'>
                    <option value="day">Day</option>
                    <option value="week">Week</option>
                    <option value="year">Year</option>
                </select>
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="sales" stroke="#ff6361" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ChartofVisitors;
