import axios from "axios";

const fetchProtectedData = async () => {
  try {
    const response = await axios.get("http://localhost:3000/dashboard", {
      headers: {
        Authorization: `Bearer ${userToken}`, // Pass token
      },
    });

    // Handle successful response
    console.log(response.data);
  } catch (error) {
    if (error.response?.status === 401) {
      // Session expired
      alert("Logged out, please log back in");
      // Redirect user to login screen
      navigation.navigate("Login");
    } else {
      console.error("Error fetching data:", error);
    }
  }
};
