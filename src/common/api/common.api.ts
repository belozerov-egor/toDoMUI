import axios from "axios";

export const instance = axios.create({
    baseURL: "https://social-network.samuraijs.com/api/1.1/",
    withCredentials: true,
    headers: {
        "API-KEY": "bb36931e-ec0c-4605-9b68-f20125e9ce40",
    },
});


