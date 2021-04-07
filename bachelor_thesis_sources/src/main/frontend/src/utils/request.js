import axios from "axios";

const base_URL = "http://localhost:8080"

const token = "Bearer "

const config = (jwt) => {
    return {
        headers: {
            'Authorization': token.concat(jwt)
        }
    }
}

export function get(url) {
    const URL = base_URL + url;
    const jwt = JSON.parse(localStorage.getItem('token'));

    if (jwt) {
        console.log("sending get request with token to ", URL, config(jwt))
        return axios.get(URL, config(jwt)); // no 'Access-Control-Allow-Origin header //next error: no http ok status
        // return axios.get(URL, {headers}); //no http ok status
    } else if (url.startsWith('/util')) {
        console.log("sending get auth request to ", URL)
        return axios.get(URL);
    } else {
        console.log("there are not jwt token for get request. Login first!")
        window.location.href = '/login'
    }
}

export function post(url, payload) {
    const URL = base_URL + url;
    const jwt = JSON.parse(localStorage.getItem('token'));

    if (jwt) {
        console.log("sending post request with token to ", URL, config(jwt))
        return axios.post(URL, payload, config(jwt));
    } else if (url === '/auth') {
        console.log("sending post auth request to ", URL)
        return axios.post(URL, payload);
    } else if (url.startsWith('/util')) {
        console.log("sending post auth request to ", URL)
        return axios.post(URL, payload);
    } else {
        console.log("there are not jwt token for post request. Login first!")
        window.location.href = '/login'
    }
}

export function del(url) {
    const payload = base_URL + url;
    // console.log("sending del request to ", payload)
    return axios.delete(payload);
}

// function myFunc(requiredArg, optionalArg = 'defaultValue') {
//     // do stuff
// }