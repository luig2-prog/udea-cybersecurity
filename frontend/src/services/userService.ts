import axios from 'axios';
import { RandomUser } from '../types';

export const fetchRandomUser = async (): Promise<RandomUser> => {
  try {
    const response = await axios.get('https://randomuser.me/api/');
    return response.data.results[0];
  } catch (error) {
    console.error('Error fetching random user:', error);
    throw error;
  }
};
