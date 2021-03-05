import axios from "axios";

const base_URL = "http://localhost:8080"

export function get(url) {
    const payload = base_URL + url;
    console.log("sending get request to ", payload)
    return axios.get(payload);
}

export function post(url, data) {
    const payload = base_URL + url;
    console.log("sending get request to ", payload)
    return axios.post(payload);
}