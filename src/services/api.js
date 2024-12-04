import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const getHotelInfo = async (hotelId) => {
  const response = await axios.get(`${API_BASE_URL}/hotel/hotel-info?hotelId=${hotelId}`);
  return response.data;
};

export const getUserInfo = async (userId) => {
    const response = await axios.get(`${API_BASE_URL}/user/user-info?userId=${userId}`);
    return response.data;
  };
  
  export const calculatePayment = async (data) => {
    const response = await axios.post(`${API_BASE_URL}/payment/calculate-payment`, data);
    return response.data;
  };

  export const getPaymentMethods = async () => {
    const response = await axios.get(`${API_BASE_URL}/payment/payment-methods`);
    return response.data;
  };