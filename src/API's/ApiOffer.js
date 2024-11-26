import axios from "axios";

const API_URL = "http://localhost:3004/items";

// Get all offers
export const fetchData = () => {
  return axios.get(API_URL)
    .then(response => response.data)
    .catch(error => {
      console.log('Could not get offers:', error);
      throw error;
    });
};

// Delete one offer
export const deleteOffer = (id) => {
  return axios.delete(`${API_URL}/${id}`)
    .then(response => response.data)
    .catch(error => {
      console.log('Could not delete offer:', error);
      throw error;
    });
};

// Update an offer
export const updateOffer = (id, newOffer) => {
  return axios.put(`${API_URL}/${id}`, newOffer)
    .then(response => response.data)
    .catch(error => {
      console.log('Could not update offer:', error);
      throw error;
    });
};

// Add a new offer
export const addOffer = (newOffer) => {
  return axios.post(API_URL, newOffer)
    .then(response => response.data)
    .catch(error => {
      console.log('Could not add offer:', error);
      throw error;
    });
};

// Turn offer ON
export const enableOffer = (id) => {
  return axios.patch(`${API_URL}/${id}`, { isActive: true })
    .then(response => response.data)
    .catch(error => {
      console.log('Could not enable offer:', error);
      throw error;
    });
};

// Turn offer OFF
export const disableOffer = (id) => {
  return axios.patch(`${API_URL}/${id}`, { isActive: false })
    .then(response => response.data)
    .catch(error => {
      console.log('Could not disable offer:', error);
      throw error;
    });
};
