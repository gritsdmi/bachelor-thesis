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
    } else if (url.startsWith('/util')) {
        console.log("sending get auth request to ", URL)
        return axios.get(URL);
    } else {
        console.log("there are not jwt token for get request. Login first!")
        window.location.href = '/login'
    }
}

export function download(url, payload) {
    const URL = base_URL + url;
    const jwt = JSON.parse(localStorage.getItem('token'));
    const config = {
        responseType: 'blob', // important
        headers: {
            'Authorization': token.concat(jwt),
        },
    }

    if (jwt) {
        console.log("sending download request with token to ", URL, config)
        axios.post(URL, payload, config).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'table.csv');
            document.body.appendChild(link);
            link.click();
        });
    } else {
        console.log("there are not jwt token for download request. Login first!")
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
    const URL = base_URL + url;
    const jwt = JSON.parse(localStorage.getItem('token'));

    if (jwt) {
        console.log("sending post request with token to ", URL, config(jwt))
        return axios.delete(URL, config(jwt));
    } else if (url === '/auth') {
        console.log("sending post auth request to ", URL)
        return axios.delete(URL);

    } else if (url.startsWith('/util')) {
        console.log("sending post auth request to ", URL)
    } else {
        console.log("there are not jwt token for post request. Login first!")
        window.location.href = '/login'
    }
}

export function handleResponseError(err) {
    console.log("Error ", err)
    if (err) {
        if (err.response) {
            console.log("Error code ", err.response.status)
            if (err.response.status === 403) {
                localStorage.clear()
                window.location.href = '/login'
            }
            if (err.response.status === 415) {
                console.log("Http 415 Unsupported Media type error with JSON")
            }
        }
    }

}
