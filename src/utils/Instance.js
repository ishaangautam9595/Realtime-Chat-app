import axios from 'axios';

const token = JSON.parse(localStorage.getItem("token"));
const instance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    headers: {
        Authorization: `Bearer ${token}`,
    }
})

instance.interceptors.request.use((request) => {

    if (token) {

        return request;

    } else {

        window.location = '/login';
        return false;
    }
});

export {
    instance
}