import {API} from '../config';

export const signup = user => {
    // console.log(name," ", email, " ", password);
    return fetch(`${API}/users/signup`, {
        method: "POST",
        headers: {
            Accept: 'application/json',
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    }).then(response => {
        return response.json();
    }).catch(err => {
        console.log(err);
    });
};
export const signin = user => {
    // console.log(name," ", email, " ", password);
    return fetch(`${API}/auth/signin`, {
        method: "POST",
        headers: {
            Accept: 'application/json',
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: user.email,
            password: user.password
        })
    }).then(response => {
        return response.json();
    }).catch(err => {
        console.log(err);
    });
};
export const authenticate = (data, next) => {
    // console.log(data,"auth");
    if (typeof window != undefined) {
        localStorage.setItem('jwt', JSON.stringify(data));
        next();
    }
};

export const signout = (next) => {
    if (typeof window != undefined) {
        localStorage.removeItem('jwt');
        next();
        return console.log('signout success');
    }
};

export const isAuthenticated = () => {
    if (typeof window === undefined) {
        return false;
    }
    if (localStorage.getItem('jwt')) {
        return JSON.parse(localStorage.getItem('jwt'));
    } else {
        return false;
    }
};