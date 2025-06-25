
import axios from 'axios';

const DEVIN_API_KEY = process.env.DEVIN_API_KEY;
const DEVIN_API_URL = "https://api.devin.ai/v1";

export const devinApi = axios.create({
    baseURL: DEVIN_API_URL,
    headers: {
        'Authorization': `Bearer ${DEVIN_API_KEY}`,
        'Content-Type': 'application/json',
    },
});
