import { axiosInstance } from './Api';

<<<<<<< HEAD
const API_URL = "http://localhost:3004/items";
=======
const ITEMS_ENDPOINT = '/items';
>>>>>>> 40bdd4fd4d7588b04c9a6d0d87da9071121eb869

export const ApiOffer = {
  getAllOffers: async () => {
    try {
      const response = await axiosInstance.get(ITEMS_ENDPOINT);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch offers');
    }
  },
  
  deleteOffer: async (id) => {
    try {
      // Corrected line: Added backticks (`) around the URL
      await axiosInstance.delete(`${ITEMS_ENDPOINT}/${id}`);
      return true;
    } catch (error) {
      throw new Error('Failed to delete offer');
    }
  },

  searchOffers: async (searchTerm) => {
    try {
      // Corrected line: Added backticks (`) around the URL
      const response = await axiosInstance.get(`${ITEMS_ENDPOINT}/search`, {
        params: { q: searchTerm }
      });
      return response.data;
    } catch (error) {
      // Corrected the string interpolation inside the error message
      throw new Error(`Failed to search offers: ${error.message}`);
    }
  },

  updateOffer: async (id, offer) => {
    try {
      // Corrected line: Added backticks (`) around the URL
      const response = await axiosInstance.put(`${ITEMS_ENDPOINT}/${id}`, offer);
      return response.data;
    } catch (error) {
      throw new Error('Failed to update offer');
    }
  },

  createOffer: async (offer) => {
    try {
      const response = await axiosInstance.post(ITEMS_ENDPOINT, offer);
      return response.data;
    } catch (error) {
      throw new Error('Failed to create offer');
    }
  },

  
};
