import axios from 'axios';

const API = 'http://localhost:3001/marketplace';

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const getPersonals = async () => {
  const res = await axios.get(`${API}/personal`, authHeaders());
  return res.data;
};

export const getNutritionists = async () => {
  const res = await axios.get(`http://localhost:3001/marketplace/nutricionist`, authHeaders());
  return res.data;
};

