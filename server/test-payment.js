import axios from "axios";

async function testPaymentAPI() {
  const testData = {
    amount: 100000,
    orderId: `TEST_ORDER_${Date.now()}`,
    orderInfo: "Test order",
    items: [
      {
        id: 1,
        name: "Burger Bò Phô Mai",
        price: 65000,
      },
      {
        id: 2,
        name: "Gà Rán Giòn Cay",
        price: 55000,
      },
    ],
  };

  try {
    console.log("Sending payment request...");
    const response = await axios.post(
      "http://localhost:4001/api/momo/checkout",
      testData
    );
    console.log("Payment successful:", response.data);

    console.log("\nFetching all payments...");
    const paymentsResponse = await axios.get("http://localhost:4001/api/payments");
    console.log("All payments:", paymentsResponse.data);
  } catch (error) {
    console.error("Error:", error.message);
    console.error("Make sure the server is running on port 4001");
  }
}

testPaymentAPI();
