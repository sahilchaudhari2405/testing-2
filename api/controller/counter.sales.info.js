import OfflineCounterSales from "../model/counter.sales.js";

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

const handleOfflineCounterSales = async (userId, order) => {
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
        totalRetailPrice: order.totalRetailPrice,
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
        totalRetailPrice: order.totalRetailPrice,
        totalProfit: order.totalProfit,
        finalPriceWithGST: order.finalPriceWithGST,
        week: currentWeek,
        orderDate: orderDate,
    };

    let offlineCounterSales = await OfflineCounterSales.findOne({ user: userId, month: currentMonth });

    if (!offlineCounterSales) {
        offlineCounterSales = new OfflineCounterSales({
            user: userId,
            dailySales: [dailySale],
            weekSales: [weekSale],
            monthTotalPrice: dailySale.totalPrice,
            monthTotalDiscountedPrice: dailySale.totalDiscountedPrice,
            monthGST: dailySale.GST,
            MonthsBill: dailySale.DayBill,
            monthDiscount: dailySale.discount,
            monthTotalItem: dailySale.totalItem,
            monthTotalRetailPrice: dailySale.totalRetailPrice,
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
            existingDailySale.totalRetailPrice += dailySale.totalRetailPrice;
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
            existingWeekSale.totalRetailPrice += weekSale.totalRetailPrice;
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
        offlineCounterSales.monthTotalRetailPrice += dailySale.totalRetailPrice;
        offlineCounterSales.monthTotalProfit += dailySale.totalProfit;
        offlineCounterSales.monthFinalPriceWithGST += dailySale.finalPriceWithGST;
    }

    offlineCounterSales.updatedAt = Date.now();
    await offlineCounterSales.save();
};

const updateSalesData = async (userId,oldOrder,newOrder) => {
    const orderDate = new Date(oldOrder.createdAt);
    const currentMonth = orderDate.toISOString().slice(0, 7);
    const currentWeek = `${orderDate.getFullYear()}-W${Math.ceil((orderDate.getDate()) / 7)}`; 
    // Find the existing sales record for the user
    console.log(currentWeek);
    let salesRecord = await OfflineCounterSales.findOne({ month: currentMonth ,user:id});
 
    const dailyIndex = salesRecord.dailySales.findIndex(d => d.date === orderDate.getDate());
    console.log(salesRecord.dailySales[dailyIndex]);
    if (dailyIndex !== -1) {
        salesRecord.dailySales[dailyIndex].totalPrice -= oldOrder.total;
        salesRecord.dailySales[dailyIndex].totalDiscountedPrice += totalDiscountedPrice;
        salesRecord.dailySales[dailyIndex].GST += GST;
        salesRecord.dailySales[dailyIndex].discount += discount;
        salesRecord.dailySales[dailyIndex].totalItem += totalItem;
        salesRecord.dailySales[dailyIndex].totalRetailPrice += totalRetailPrice;
        salesRecord.dailySales[dailyIndex].totalProfit += totalProfit;
        salesRecord.dailySales[dailyIndex].finalPriceWithGST += finalPriceWithGST;
        // update
        salesRecord.dailySales[dailyIndex].totalPrice += totalPrice;
        salesRecord.dailySales[dailyIndex].totalDiscountedPrice += totalDiscountedPrice;
        salesRecord.dailySales[dailyIndex].GST += GST;
        salesRecord.dailySales[dailyIndex].discount += discount;
        salesRecord.dailySales[dailyIndex].totalItem += totalItem;
        salesRecord.dailySales[dailyIndex].totalRetailPrice += totalRetailPrice;
        salesRecord.dailySales[dailyIndex].totalProfit += totalProfit;
        salesRecord.dailySales[dailyIndex].finalPriceWithGST += finalPriceWithGST;
    }

    // Update weekly sales
    const weeklyIndex = salesRecord.weekSales.findIndex(w => w.week === currentWeek);
    console.log(salesRecord.weekSales[weeklyIndex]);
    if (weeklyIndex !== -1) {
        salesRecord.weekSales[weeklyIndex].totalPrice -= totalPrice;
        salesRecord.weekSales[weeklyIndex].totalDiscountedPrice += totalDiscountedPrice;
        salesRecord.weekSales[weeklyIndex].GST += GST;
        salesRecord.weekSales[weeklyIndex].discount += discount;
        salesRecord.weekSales[weeklyIndex].totalItem += totalItem;
        salesRecord.weekSales[weeklyIndex].totalRetailPrice += totalRetailPrice;
        salesRecord.weekSales[weeklyIndex].totalProfit += totalProfit;
        salesRecord.weekSales[weeklyIndex].finalPriceWithGST += finalPriceWithGST;
        //update
        salesRecord.weekSales[weeklyIndex].totalPrice += totalPrice;
        salesRecord.weekSales[weeklyIndex].totalDiscountedPrice += totalDiscountedPrice;
        salesRecord.weekSales[weeklyIndex].GST += GST;
        salesRecord.weekSales[weeklyIndex].discount += discount;
        salesRecord.weekSales[weeklyIndex].totalItem += totalItem;
        salesRecord.weekSales[weeklyIndex].totalRetailPrice += totalRetailPrice;
        salesRecord.weekSales[weeklyIndex].totalProfit += totalProfit;
        salesRecord.weekSales[weeklyIndex].finalPriceWithGST += finalPriceWithGST;
    } 

    if (salesRecord.month === monthIdentifier) {
        salesRecord.monthTotalPrice += totalPrice;
        salesRecord.monthTotalDiscountedPrice += totalDiscountedPrice;
        salesRecord.monthGST += GST;
        salesRecord.monthDiscount += discount;
        salesRecord.monthTotalItem += totalItem;
        salesRecord.monthTotalRetailPrice += totalRetailPrice;
        salesRecord.monthTotalProfit += totalProfit;
        salesRecord.monthFinalPriceWithGST += finalPriceWithGST;
        //update
        salesRecord.monthTotalPrice += totalPrice;
        salesRecord.monthTotalDiscountedPrice += totalDiscountedPrice;
        salesRecord.monthGST += GST;
        salesRecord.monthDiscount += discount;
        salesRecord.monthTotalItem += totalItem;
        salesRecord.monthTotalRetailPrice += totalRetailPrice;
        salesRecord.monthTotalProfit += totalProfit;
        salesRecord.monthFinalPriceWithGST += finalPriceWithGST;
    } 
    salesRecord.updatedAt = new Date();
    await salesRecord.save();
};

export { handleOfflineCounterSales ,updateSalesData};

