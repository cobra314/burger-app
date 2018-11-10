import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-burger-app-5061b.firebaseio.com/'
});

export default instance;