import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const dataDay = [
    { name: 'Day 1', value: 4000 },
    { name: 'Day 2', value: 3000 },
    { name: 'Day 3', value: 3000 },
    { name: 'Day 4', value: 2780 },
    { name: 'Day 5', value: 1890 },
    { name: 'Day 6', value: 2890 },
    { name: 'Day 7', value: 490 },
];

const dataWeek = [
    { name: 'Week 1', value: 31000 },
    { name: 'Week 2', value: 4000 },
    { name: 'Week 3', value: 2000 },
    { name: 'Week 4', value: 25000 },
];

const dataYear = [
    { name: 'Jan', value: 80000 },
    { name: 'Feb', value: 30000 },
    { name: 'Mar', value: 75000 },
    { name: 'Apr', value: 60000 },
    { name: 'May', value: 65000 },
    { name: 'Jun', value: 50000 },
    { name: 'Jul', value: 80000 },
    { name: 'Aug', value: 25000 },
    { name: 'Sep', value: 5000 },
    { name: 'Oct', value: 65000 },
    { name: 'Nov', value: 70000 },
    { name: 'Dec', value: 90000 },
];

const COLORS = ['#ff6361', '#ffa600', '#bc5090', '#58508d', '#003f5c', '#8b0000', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2'];

const Chartofdonut = () => {
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
        <div className='mx-3 my-10 p-5 rounded-md bg-white flex flex-col shadow-2xl' style={{ width: '400px', height: '350px' }}>
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
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        fill="#8884d8"
                        paddingAngle={1}
                        dataKey="value"
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Chartofdonut;
