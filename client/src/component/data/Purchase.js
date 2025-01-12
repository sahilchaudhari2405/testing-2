const mockDetails = {
    _id: "INV12345",
    Name: "John Doe",
    Address: "123 Main St, City, Country",
    mobileNumber: "+123456789",
    email: "john.doe@example.com",
    orderItems: [
      {
        productId: { title: "Product A", purchaseRate: 100 },
        quantity: 2,
        GST: 18
      },
      {
        productId: { title: "Product B", purchaseRate: 50 },
        quantity: 1,
        GST: 9
      }
    ],
    totalPurchaseRate: 250,
    GST: 27,
    paymentType: { cash: 150, Card: 100, UPI: 0, borrow: 0 },
    AmountPaid: 250
  };
  export default mockDetails;