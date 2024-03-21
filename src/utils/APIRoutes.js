
import axios from "axios";
let token = JSON.parse(localStorage.getItem("token"));

export const host = process.env.REACT_APP_API_BASE_URL;
axios.defaults.headers = {
    Authorization: `Bearer ${token}`,
};

export const loginRoute = `${host}/login/users`;
export const registerRoute = `${host}/create/users`;
export const allUsersRoute = `${host}/all/users`;
export const sendMessageRoute = `${host}/api/addmsg`;
export const fetchMessageRoute = `${host}/messages/:roomId/:userId`;
export const fetchMember = `${host}/group/member/:roomId`;

