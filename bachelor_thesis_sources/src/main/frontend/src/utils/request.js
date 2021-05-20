import axios from "axios";

const local_URL = "http://localhost:8080"
const deploy_URL = "http://fem.felk.cvut.cz:8080/fem"

const base_URL = deploy_URL
// const base_URL = local_URL

const token = "Bearer "
const enableJWT = true

const config = (jwt) => {
    return {
        headers: {
            'Authorization': token.concat(jwt)
        }
    }
}

export function get(url) {
    const URL = base_URL + url;
    const jwt = getLSToken();

    if (!enableJWT) {
        const payload = base_URL + url;
        console.log("sending get request to ", payload)
        return axios.get(payload);
    } else {

        if (jwt) {
            console.log("sending get request with token to ", URL, config(jwt))
            return axios.get(URL, config(jwt));
        } else if (url.startsWith('/util')) {
            console.log("sending get auth request to ", URL)
            return axios.get(URL);
        } else {
            console.log("there are not jwt token for get request. Login first!")
            window.location.href = '/fem/index.html'
        }
    }

}

export function download(url, payload) {
    const URL = base_URL + url;
    const jwt = getLSToken();
    const config = {
        responseType: 'blob', // important
        headers: {
            'Authorization': token.concat(jwt),
        },
    }
    if (!enableJWT) {
        const payload = base_URL + url;
        console.log("sending get request to ", payload)
        return axios.get(payload);
    } else {

        if (jwt) {
            console.log("sending download request with token to ", URL, config)
            axios.post(URL, payload, config).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'table.xlsx');
                document.body.appendChild(link);
                link.click();
            });
        } else {
            console.log("there are not jwt token for download request. Login first!")
            window.location.href = '/fem/index.html'
        }
    }
}

export function post(url, payload) {
    const URL = base_URL + url;
    const jwt = JSON.parse(localStorage.getItem('token'));

    if (!enableJWT) {
        const urll = base_URL + url;
        console.log("sending post request to ", URL)
        return axios.post(URL, payload);
    } else {
        if (url === '/auth') {
            console.log("sending post auth request to ", URL)
            return axios.post(URL, payload);
        } else if (jwt) {
            console.log("sending post request with token to ", URL, config(jwt))
            return axios.post(URL, payload, config(jwt));
        } else if (url.startsWith('/util')) {
            console.log("sending post util request to ", URL)
            return axios.post(URL, payload);
        } else {
            console.log("there are not jwt token for post request. Login first!")
            window.location.href = '/fem/index.html'
        }
    }
}

export function del(url) {
    const URL = base_URL + url;
    const jwt = getLSToken();

    if (jwt) {
        console.log("sending del request with token to ", URL, config(jwt))
        return axios.delete(URL, config(jwt));
    } else if (url === '/auth') {
        console.log("sending del auth request to ", URL)
        return axios.delete(URL);

    } else if (url.startsWith('/util')) {
        console.log("sending del auth request to ", URL)
    } else {
        console.log("there are not jwt token for del request. Login first!")
        window.location.href = '/fem/index.html'
    }
}

export function handleResponseError(err) {
    console.log("Error ", err)
    if (!enableJWT) {
        // const payload = base_URL + url;
        // console.log("sending get request to ", payload)
        // return axios.get(payload);
    } else {
        if (err) {
            if (err.response) {
                console.log("Error code ", err.response.status)
                if (err.response.status === 400) {
                    console.log("Http 400 Bad Request")
                }
                if (err.response.status === 401) {
                    console.log("Http 401 ")
                    localStorage.clear()
                    window.location.href = '/fem/index.html'
                }
                if (err.response.status === 403) {
                    console.log("Http 403 ")
                    localStorage.clear()
                    window.location.href = '/fem/index.html'
                }
                if (err.response.status === 415) {
                    console.log("Http 415 Unsupported Media type error with JSON")
                }
            }
        }
    }
}

export function getUserFromLS() {
    return JSON.parse(localStorage.getItem('user'))
}

function getLSToken() {
    return JSON.parse(localStorage.getItem('token'))
}
