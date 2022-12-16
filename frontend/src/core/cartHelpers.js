export const addItem = (item, next) => {
    let cart = [];
    let jwt = {}
    if (typeof window !== undefined) {
        if (localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart'));
        }
        if (localStorage.getItem('jwt')) {
            jwt = JSON.parse(localStorage.getItem('jwt'));
        }
        cart.push({
            ...item,
            count: 1,
            email: jwt.email
        });
        cart = Array.from(new Set(cart.map((p) => (p.id)))).map(id => {
            return cart.find(p => p.id === id);
        });
        localStorage.setItem('cart', JSON.stringify(cart));
        next();
    }
};

export const itemTotal = () => {
    if (typeof window !== undefined) {
        if (localStorage.getItem('cart')) {
            return JSON
                .parse(localStorage.getItem('cart'))
                .length;
        }
    }
    return 0;
};
export const getCart = () => {
    if (typeof window !== undefined) {
        if (localStorage.getItem('cart')) {
            const jwt = JSON.parse(localStorage.getItem('jwt'));
            const carts =  (JSON.parse(localStorage.getItem('cart'))).filter((cart)=> cart.email === jwt.email)
            if (carts.length === 0) localStorage.setItem('cart', JSON.stringify([]));
            return carts 
        }
    }
    return [];
};

export const updateItem = (productId, count) => {
    let cart = [];
    if (typeof window !== undefined) {
        if (localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart'));
        }
        cart.map((product, id) => {
            if (product.id === productId) {
                cart[id].count = count;
            }
        });
        localStorage.setItem('cart', JSON.stringify(cart));
    }
};
export const deleteItem = (productId) => {
    let cart = [];
    if (typeof window !== undefined) {
        if (localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart'));
        }
        cart.map((product, id) => {
            if (product.id === productId) {
                cart.splice(id, 1);
            }
        });
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    return cart;
};

export const emptyCart = next => {
    if (typeof window !== undefined) {
        localStorage.removeItem('cart');
        next();
    }
};