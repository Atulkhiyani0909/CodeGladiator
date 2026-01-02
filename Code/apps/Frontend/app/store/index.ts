import { create } from 'zustand'
import axios from 'axios';


const useAuth = create((set) => ({
    user: null,
    isLoading: false,
    error: null,

    getUserData: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get('http://localhost:8080/api/v1/auth/current-user',{withCredentials:true});
            set({ user: response.data, isLoading: false });
        } catch (error) {
            set({ error: error, isLoading: false });
        }
    },
}));

export default useAuth;