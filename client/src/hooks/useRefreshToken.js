import axios from '../utils/axios';
import AuthContext from '../context/authContext';
import { useContext } from 'react';

const useRefreshToken = () => {
    const { setAuth } =  useContext(AuthContext);


    const refresh = async () => {
        const response = await axios.get('/api/auth/refreshtoken', {
            withCredentials: true
        });
        setAuth(prev => {
            console.log(JSON.stringify(prev));
            console.log(response.data.accessToken);
            return {
                ...prev,
                
                accessToken: response.data.accessToken
            }
        });
        return response.data.accessToken;
    }
    return refresh;
};

export default useRefreshToken;