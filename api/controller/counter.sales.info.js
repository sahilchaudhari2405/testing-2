import OfflineCounterSales from "../model/counter.sales.js";
const isSameDay = (date1, date2) => {
  return date1===date2;
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
  
    const orderDate =  new Date();
    const currentMonth = orderDate.toISOString().slice(0, 7); // YYYY-MM
    const currentWeek = `${orderDate.getFullYear()}-W${Math.ceil((orderDate.getDate() ) / 7)}`; // YYYY-WW

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

    const week = {
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
            weekSales: [week],
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

        
          
        if (lastSale && lastSale.date===orderDate.getDate()) {
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
            existingWeekSale.totalPrice += dailySale.totalPrice;
            existingWeekSale.totalDiscountedPrice += dailySale.totalDiscountedPrice;
            existingWeekSale.GST += dailySale.GST;
            existingWeekSale.discount += dailySale.discount;
            existingWeekSale.totalItem += dailySale.totalItem;
            existingWeekSale.WeekBill += dailySale.DayBill;
            existingWeekSale.totalRetailPrice += dailySale.totalRetailPrice;
            existingWeekSale.totalProfit += dailySale.totalProfit;
            existingWeekSale.finalPriceWithGST += dailySale.finalPriceWithGST;
        } else {
            offlineCounterSales.weekSales.push(week);
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
export {handleOfflineCounterSales};
