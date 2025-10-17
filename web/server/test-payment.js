import axios from "axios";

async function testMoMoPayment() {
  const testOrderId = `MOMO${Date.now()}`;
  const testAmount = "50000";

  const paymentData = {
    amount: testAmount,
    orderId: testOrderId,
    orderInfo: "Test order from FastFood",
    items: [
      {
        id: 1,
        name: "Burger Bò Phô Mai",
        price: 65000,
        quantity: 1,
      },
    ],
  };

  try {
    console.log("🔄 Testing MoMo Sandbox Payment...\n");
    console.log("📦 Payment data:", paymentData);

    const response = await axios.post("http://localhost:4001/api/momo/checkout", paymentData);

    if (response.data.success) {
      console.log("\n✅ Success! Payment request created");
      console.log("📝 Order ID:", response.data.orderId);
      console.log("🔗 Pay URL:", response.data.payUrl);
      console.log("\n💡 Open this URL in browser to complete payment in MoMo Sandbox:");
      console.log(response.data.payUrl);
    } else {
      console.log("\n❌ Error:", response.data.message);
    }

    // Lấy danh sách thanh toán
    console.log("\n📊 Fetching all payments...");
    const paymentsResponse = await axios.get("http://localhost:4001/api/payments");
    console.log(`Found ${paymentsResponse.data.length} payment(s)`);
    console.log(JSON.stringify(paymentsResponse.data, null, 2));
  } catch (error) {
    console.error("❌ Error:", error.response?.data || error.message);
    console.error("Make sure the server is running on port 4001");
  }
}

testMoMoPayment();

