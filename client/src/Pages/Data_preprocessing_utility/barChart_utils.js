
// const formatDate = (dateStr, format) => {
//   const date = new Date(dateStr);
//   const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//   if (format === 'day') return `Day ${date.getDate()}`;
//   if (format === 'month') return monthNames[date.getMonth()];
//   if (format === 'year') return date.getFullYear();
// };

// const aggregateData = (orders, granularity) => {
//   return orders.reduce((acc, order) => {
//     const key = formatDate(order.orderDate, granularity);
//     if (!acc[key]) acc[key] = { sales: 0, revenue: 0 };
//     acc[key].sales += order.totalPrice;
//     acc[key].revenue += order.totalProfit;
//     return acc;
//   }, {});
// };

// const toChartData = (aggregatedData) => {
//   return Object.keys(aggregatedData).map(key => ({
//     name: key,
//     sales: aggregatedData[key].sales,
//     revenue: aggregatedData[key].revenue
//   }));
// };

// export { aggregateData, toChartData };

const getDaywiseData = (data) => {
  return data.dailySales.map(sale => ({
    date: sale.date,
    totalPrice: sale.totalPrice,
    totalDiscountedPrice: sale.totalDiscountedPrice,
    GST: sale.GST,
    totalItem: sale.totalItem,
    totalProfit: sale.totalProfit,
    finalPriceWithGST: sale.finalPriceWithGST
  }));
};

const getWeekwiseData = (data) => {
  return data.weekSales.map(sale => ({
    week: sale.week,
    totalPrice: sale.totalPrice,
    totalDiscountedPrice: sale.totalDiscountedPrice,
    GST: sale.GST,
    totalItem: sale.totalItem,
    totalProfit: sale.totalProfit,
    finalPriceWithGST: sale.finalPriceWithGST
  }));
};

const getMonthwiseData = (data) => {
  return {
    month: data.month,
    totalPrice: data.monthTotalPrice,
    totalDiscountedPrice: data.monthTotalDiscountedPrice,
    GST: data.monthGST,
    totalItem: data.monthTotalItem,
    totalProfit: data.monthTotalProfit,
    finalPriceWithGST: data.monthFinalPriceWithGST
  };
};

export {getDaywiseData, getWeekwiseData, getMonthwiseData};