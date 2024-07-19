import OfflineCounterSales from "../model/counter.sales.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const updateSalesData = async (req,res) => {
    const {month,dated}=req.body;
    const {id} = req.user;
    const orderDate = new Date(dated);
    const currentMonth = orderDate.toISOString().slice(0, 7); // YYYY-MM
    const currentWeek = `${orderDate.getFullYear()}-W${Math.ceil((orderDate.getDate()) / 7)}`; 
    // Find the existing sales record for the user
    console.log(currentWeek);
    let salesRecord = await OfflineCounterSales.findOne({ month: month ,user:id});
 


    // Update daily sales
    const dailyIndex = salesRecord.dailySales.findIndex(d => d.date === orderDate.getDate());
    console.log(salesRecord.dailySales[dailyIndex]);
    // if (dailyIndex !== -1) {
    //     salesRecord.dailySales[dailyIndex].totalPrice += totalPrice;
    //     salesRecord.dailySales[dailyIndex].totalDiscountedPrice += totalDiscountedPrice;
    //     salesRecord.dailySales[dailyIndex].GST += GST;
    //     salesRecord.dailySales[dailyIndex].discount += discount;
    //     salesRecord.dailySales[dailyIndex].totalItem += totalItem;
    //     salesRecord.dailySales[dailyIndex].totalRetailPrice += totalRetailPrice;
    //     salesRecord.dailySales[dailyIndex].totalProfit += totalProfit;
    //     salesRecord.dailySales[dailyIndex].finalPriceWithGST += finalPriceWithGST;
    //     salesRecord.dailySales[dailyIndex].DayBill += 1;
    // } else {
    //     salesRecord.dailySales.push({
    //         totalPrice,
    //         totalDiscountedPrice,
    //         GST,
    //         discount,
    //         totalItem,
    //         totalRetailPrice,
    //         totalProfit,
    //         finalPriceWithGST,
    //         DayBill: 1,
    //         date: dayIdentifier,
    //         orderDate: date,
    //     });
    // }

    // Update weekly sales
    const weeklyIndex = salesRecord.weekSales.findIndex(w => w.week === currentWeek);
    console.log(salesRecord.weekSales[weeklyIndex]);
    // if (weeklyIndex !== -1) {
    //     salesRecord.weekSales[weeklyIndex].totalPrice += totalPrice;
    //     salesRecord.weekSales[weeklyIndex].totalDiscountedPrice += totalDiscountedPrice;
    //     salesRecord.weekSales[weeklyIndex].GST += GST;
    //     salesRecord.weekSales[weeklyIndex].discount += discount;
    //     salesRecord.weekSales[weeklyIndex].totalItem += totalItem;
    //     salesRecord.weekSales[weeklyIndex].totalRetailPrice += totalRetailPrice;
    //     salesRecord.weekSales[weeklyIndex].totalProfit += totalProfit;
    //     salesRecord.weekSales[weeklyIndex].finalPriceWithGST += finalPriceWithGST;
    //     salesRecord.weekSales[weeklyIndex].WeekBill += 1;
    // } else {
    //     salesRecord.weekSales.push({
    //         totalPrice,
    //         totalDiscountedPrice,
    //         GST,
    //         discount,
    //         totalItem,
    //         totalRetailPrice,
    //         totalProfit,
    //         finalPriceWithGST,
    //         WeekBill: 1,
    //         week: weekIdentifier,
    //         orderDate: date,
    //     });
    // }

    // Update monthly sales
    // if (salesRecord.month === monthIdentifier) {
    //     salesRecord.monthTotalPrice += totalPrice;
    //     salesRecord.monthTotalDiscountedPrice += totalDiscountedPrice;
    //     salesRecord.monthGST += GST;
    //     salesRecord.monthDiscount += discount;
    //     salesRecord.monthTotalItem += totalItem;
    //     salesRecord.monthTotalRetailPrice += totalRetailPrice;
    //     salesRecord.monthTotalProfit += totalProfit;
    //     salesRecord.monthFinalPriceWithGST += finalPriceWithGST;
    //     salesRecord.MonthsBill += 1;
    // } else {
    //     salesRecord.month = monthIdentifier;
    //     salesRecord.monthTotalPrice = totalPrice;
    //     salesRecord.monthTotalDiscountedPrice = totalDiscountedPrice;
    //     salesRecord.monthGST = GST;
    //     salesRecord.monthDiscount = discount;
    //     salesRecord.monthTotalItem = totalItem;
    //     salesRecord.monthTotalRetailPrice = totalRetailPrice;
    //     salesRecord.monthTotalProfit = totalProfit;
    //     salesRecord.monthFinalPriceWithGST = finalPriceWithGST;
    //     salesRecord.MonthsBill = 1;
    // }

    // salesRecord.updatedAt = new Date();
    // await salesRecord.save();
};

export default updateSalesData;
