import OfflineCounterSales from "../model/counter.sales.js";
import TotalCollectionSales from "../model/total.collection.data.js";
import TotalOfflineSales from "../model/total.offline.sales.js";

const isSameDay = (date1, date2) => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
};

const isSameWeek = (date1, date2) => {
    const startOfWeek = (date) => {
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        return new Date(date.setDate(diff));
    };
    return startOfWeek(date1).toISOString().slice(0, 10) === startOfWeek(date2).toISOString().slice(0, 10);
};

const isSameMonth = (date1, date2) => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth(); 
};

const handleAllTotalOfflineSales = async (order) => {
    // const dummyDate = new Date('2024-08-11T00:00:00Z');
    let orderDate = new Date();
    const currentMonth = orderDate.toISOString().slice(0, 7); // YYYY-MM
    const currentWeek = `${orderDate.getFullYear()}-W${Math.ceil((orderDate.getDate()) / 7)}`; // YYYY-WW

    const dailySale = {
        totalPrice: order.totalPrice,
        totalDiscountedPrice: order.totalDiscountedPrice,
        GST: order.GST,
        discount: order.discount,
        totalItem: order.totalItem,
        DayBill: 1,
        totalPurchaseRate: order.totalPurchaseRate,
        totalProfit: order.totalProfit,
        finalPriceWithGST: order.finalPriceWithGST,
        date: orderDate.getDate(),
        orderDate: orderDate,
    };

    const weekSale = {
        totalPrice: order.totalPrice,
        totalDiscountedPrice: order.totalDiscountedPrice,
        GST: order.GST,
        discount: order.discount,
        totalItem: order.totalItem,
        WeekBill: 1,
        totalPurchaseRate: order.totalPurchaseRate,
        totalProfit: order.totalProfit,
        finalPriceWithGST: order.finalPriceWithGST,
        week: currentWeek,
        orderDate: orderDate,
    };

    let offlineCounterSales = await TotalCollectionSales.findOne({ month: currentMonth });

    if (!offlineCounterSales) {
        offlineCounterSales = new TotalCollectionSales({
            dailySales: [dailySale],
            weekSales: [weekSale],
            monthTotalPrice: dailySale.totalPrice,
            monthTotalDiscountedPrice: dailySale.totalDiscountedPrice,
            monthGST: dailySale.GST,
            MonthsBill: dailySale.DayBill,
            monthDiscount: dailySale.discount,
            monthTotalItem: dailySale.totalItem,
            monthTotalPurchaseRate: dailySale.totalPurchaseRate,
            monthTotalProfit: dailySale.totalProfit,
            monthFinalPriceWithGST: dailySale.finalPriceWithGST,
            month: currentMonth,
        });
    } else {
        const lastSale = offlineCounterSales.dailySales.length > 0
            ? offlineCounterSales.dailySales[offlineCounterSales.dailySales.length - 1]
            : null;

         const existingDailySale = lastSale; 

        if (existingDailySale && existingDailySale.date===orderDate.getDate()) {
            existingDailySale.totalPrice += dailySale.totalPrice;
            existingDailySale.totalDiscountedPrice += dailySale.totalDiscountedPrice;
            existingDailySale.GST += dailySale.GST;
            existingDailySale.discount += dailySale.discount;
            existingDailySale.totalItem += dailySale.totalItem;
            existingDailySale.DayBill += dailySale.DayBill;
            existingDailySale.totalPurchaseRate += dailySale.totalPurchaseRate;
            existingDailySale.totalProfit += dailySale.totalProfit;
            existingDailySale.finalPriceWithGST += dailySale.finalPriceWithGST;
        } else {
            offlineCounterSales.dailySales.push(dailySale);
        }

        const existingWeekSale = offlineCounterSales.weekSales.find((sale) =>
            isSameWeek(new Date(sale.orderDate), orderDate)
        );

        if (existingWeekSale) {
            existingWeekSale.totalPrice += weekSale.totalPrice;
            existingWeekSale.totalDiscountedPrice += weekSale.totalDiscountedPrice;
            existingWeekSale.GST += weekSale.GST;
            existingWeekSale.discount += weekSale.discount;
            existingWeekSale.totalItem += weekSale.totalItem;
            existingWeekSale.WeekBill += weekSale.WeekBill;
            existingWeekSale.totalPurchaseRate += weekSale.totalPurchaseRate;
            existingWeekSale.totalProfit += weekSale.totalProfit;
            existingWeekSale.finalPriceWithGST += weekSale.finalPriceWithGST;
        } else {
            offlineCounterSales.weekSales.push(weekSale);
        }

        offlineCounterSales.monthTotalPrice += dailySale.totalPrice;
        offlineCounterSales.monthTotalDiscountedPrice += dailySale.totalDiscountedPrice;
        offlineCounterSales.monthGST += dailySale.GST;
        offlineCounterSales.monthDiscount += dailySale.discount;
        offlineCounterSales.monthTotalItem += dailySale.totalItem;
        offlineCounterSales.MonthsBill += dailySale.DayBill;
        offlineCounterSales.monthTotalPurchaseRate += dailySale.totalPurchaseRate;
        offlineCounterSales.monthTotalProfit += dailySale.totalProfit;
        offlineCounterSales.monthFinalPriceWithGST += dailySale.finalPriceWithGST;
    }
    offlineCounterSales.updatedAt = Date.now();
    await offlineCounterSales.save();
};
const TotalAllupdateSalesData = async (oldOrder, newOrder) => {
    const orderDate = new Date(oldOrder.createdAt);
    const currentMonth = orderDate.toISOString().slice(0, 7);
    const currentWeek = `${orderDate.getFullYear()}-W${Math.ceil((orderDate.getDate()) / 7)}`; 

    // Find the existing sales record for the user
    let salesRecord = await TotalCollectionSales.findOne({ month: currentMonth });
    if (!salesRecord) {
        console.error("Sales record not found for the given user and month.");
        return;
    }

    const dailyIndex = salesRecord.dailySales.findIndex(d => d.date === orderDate.getDate());
    if (dailyIndex !== -1) {
        // Subtract old order values
        salesRecord.dailySales[dailyIndex].totalPrice -= oldOrder.totalPrice;
        salesRecord.dailySales[dailyIndex].totalDiscountedPrice -= oldOrder.totalDiscountedPrice;
        salesRecord.dailySales[dailyIndex].GST -= oldOrder.GST;
        salesRecord.dailySales[dailyIndex].discount -= oldOrder.discount;
        salesRecord.dailySales[dailyIndex].totalItem -= oldOrder.totalItem;
        salesRecord.dailySales[dailyIndex].totalPurchaseRate -= oldOrder.totalPurchaseRate;
        salesRecord.dailySales[dailyIndex].totalProfit -= oldOrder.totalProfit;
        salesRecord.dailySales[dailyIndex].finalPriceWithGST -= oldOrder.finalPriceWithGST;
        
        // Add new order values
        salesRecord.dailySales[dailyIndex].totalPrice += newOrder.totalPrice;
        salesRecord.dailySales[dailyIndex].totalDiscountedPrice += newOrder.totalDiscountedPrice;
        salesRecord.dailySales[dailyIndex].GST += newOrder.GST;
        salesRecord.dailySales[dailyIndex].discount += newOrder.discount;
        salesRecord.dailySales[dailyIndex].totalItem += newOrder.totalItem;
        salesRecord.dailySales[dailyIndex].totalPurchaseRate += newOrder.totalPurchaseRate;
        salesRecord.dailySales[dailyIndex].totalProfit += newOrder.totalProfit;
        salesRecord.dailySales[dailyIndex].finalPriceWithGST += newOrder.finalPriceWithGST;
    } else {
        console.error("Daily sales record not found for the given date.");
    }

    const weeklyIndex = salesRecord.weekSales.findIndex(w => w.week === currentWeek);
    if (weeklyIndex !== -1) {
        // Subtract old order values
        salesRecord.weekSales[weeklyIndex].totalPrice -= oldOrder.totalPrice;
        salesRecord.weekSales[weeklyIndex].totalDiscountedPrice -= oldOrder.totalDiscountedPrice;
        salesRecord.weekSales[weeklyIndex].GST -= oldOrder.GST;
        salesRecord.weekSales[weeklyIndex].discount -= oldOrder.discount;
        salesRecord.weekSales[weeklyIndex].totalItem -= oldOrder.totalItem;
        salesRecord.weekSales[weeklyIndex].totalPurchaseRate -= oldOrder.totalPurchaseRate;
        salesRecord.weekSales[weeklyIndex].totalProfit -= oldOrder.totalProfit;
        salesRecord.weekSales[weeklyIndex].finalPriceWithGST -= oldOrder.finalPriceWithGST;
        
        // Add new order values
        salesRecord.weekSales[weeklyIndex].totalPrice += newOrder.totalPrice;
        salesRecord.weekSales[weeklyIndex].totalDiscountedPrice += newOrder.totalDiscountedPrice;
        salesRecord.weekSales[weeklyIndex].GST += newOrder.GST;
        salesRecord.weekSales[weeklyIndex].discount += newOrder.discount;
        salesRecord.weekSales[weeklyIndex].totalItem += newOrder.totalItem;
        salesRecord.weekSales[weeklyIndex].totalPurchaseRate += newOrder.totalPurchaseRate;
        salesRecord.weekSales[weeklyIndex].totalProfit += newOrder.totalProfit;
        salesRecord.weekSales[weeklyIndex].finalPriceWithGST += newOrder.finalPriceWithGST;
    } else {
        console.error("Weekly sales record not found for the given week.");
    }

    // Update monthly sales
    if (salesRecord.month === currentMonth) {
        salesRecord.monthTotalPrice -= oldOrder.totalPrice;
        salesRecord.monthTotalDiscountedPrice -= oldOrder.totalDiscountedPrice;
        salesRecord.monthGST -= oldOrder.GST;
        salesRecord.monthDiscount -= oldOrder.discount;
        salesRecord.monthTotalItem -= oldOrder.totalItem;
        salesRecord.monthTotalPurchaseRate -= oldOrder.totalPurchaseRate;
        salesRecord.monthTotalProfit -= oldOrder.totalProfit;
        salesRecord.monthFinalPriceWithGST -= oldOrder.finalPriceWithGST;
        
        // Add new order values
        salesRecord.monthTotalPrice += newOrder.totalPrice;
        salesRecord.monthTotalDiscountedPrice += newOrder.totalDiscountedPrice;
        salesRecord.monthGST += newOrder.GST;
        salesRecord.monthDiscount += newOrder.discount;
        salesRecord.monthTotalItem += newOrder.totalItem;
        salesRecord.monthTotalPurchaseRate += newOrder.totalPurchaseRate;
        salesRecord.monthTotalProfit += newOrder.totalProfit;
        salesRecord.monthFinalPriceWithGST += newOrder.finalPriceWithGST;
    } else {
        console.error("Monthly sales record does not match the current month.");
    }

    salesRecord.updatedAt = new Date();
    await salesRecord.save();
};

export { handleAllTotalOfflineSales ,TotalAllupdateSalesData};

