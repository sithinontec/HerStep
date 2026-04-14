// ========================================
// HersStep - Main Application Data & State
// ========================================

// Mock Data Store
const store = {
    products: [
        {
            id: 1,
            name: 'Classic Red Heels',
            category: 'Heels',
            price: 89.99,
            description: 'Elegant red heels perfect for special occasions',
            rating: 4.5,
            stock: 15,
            image: '👠'
        },
        {
            id: 2,
            name: 'Comfortable Flats',
            category: 'Flats',
            price: 59.99,
            description: 'All-day comfort with stylish design',
            rating: 4.3,
            stock: 25,
            image: '🥿'
        },
        {
            id: 3,
            name: 'Sporty Sneakers',
            category: 'Sneakers',
            price: 79.99,
            description: 'Perfect blend of style and comfort',
            rating: 4.7,
            stock: 30,
            image: '👟'
        },
        {
            id: 4,
            name: 'Elegant Sandals',
            category: 'Sandals',
            price: 69.99,
            description: 'Summer-ready elegant sandals',
            rating: 4.2,
            stock: 20,
            image: '👡'
        },
        {
            id: 5,
            name: 'Professional Pumps',
            category: 'Heels',
            price: 99.99,
            description: 'Classic pumps for the modern professional',
            rating: 4.6,
            stock: 12,
            image: '👠'
        },
        {
            id: 6,
            name: 'Casual Loafers',
            category: 'Flats',
            price: 64.99,
            description: 'Effortless style for everyday wear',
            rating: 4.4,
            stock: 18,
            image: '🥿'
        }
    ],
    users: [
        {
            id: 1,
            firstName: 'Admin',
            lastName: 'User',
            age: 30,
            email: 'admin@hersstep.com',
            phone: '+1-555-0001',
            password: 'admin123',
            role: 'admin',
            active: true,
            createdAt: new Date().toISOString()
        },
        {
            id: 2,
            firstName: 'Staff',
            lastName: 'Member',
            age: 25,
            email: 'staff@hersstep.com',
            phone: '+1-555-0002',
            password: 'staff123',
            role: 'staff',
            active: true,
            createdAt: new Date().toISOString()
        },
        {
            id: 3,
            firstName: 'John',
            lastName: 'Doe',
            age: 28,
            email: 'customer@example.com',
            phone: '+1-555-0003',
            password: 'customer123',
            role: 'customer',
            active: true,
            createdAt: new Date().toISOString()
        }
    ],
    currentUser: null,
    cart: [],
    orders: [],
    promoCodes: {
        'WELCOME10': { type: 'percent', value: 10 },
        'SAVE20': { type: 'percent', value: 20 },
        'FLAT15': { type: 'fixed', value: 15 },
        'TEST50': { type: 'percent', value: 50 }
    }
};

// User Management
const auth = {
    register: function(firstName, lastName, age, email, phone, password, role = 'customer') {
        // Check for duplicate email or phone
        const existingUser = store.users.find(u => 
            u.email === email || (phone && u.phone === phone)
        );
        
        if (existingUser) {
            throw new Error('Account with this email/phone number already exists');
        }
        
        const newUser = {
            id: store.users.length + 1,
            firstName,
            lastName,
            age,
            email,
            phone,
            password, // In production, this would be hashed
            role,
            createdAt: new Date().toISOString()
        };
        
        store.users.push(newUser);
        store.currentUser = newUser;
        this.saveSession();
        return newUser;
    },
    
    login: function(email, password) {
        const user = store.users.find(u => u.email === email && u.password === password);
        
        if (!user) {
            throw new Error('Invalid email or password');
        }
        
        store.currentUser = user;
        this.saveSession();
        return user;
    },
    
    logout: function() {
        store.currentUser = null;
        localStorage.removeItem('hersstep_currentUser');
        window.location.href = 'index.html';
    },
    
    saveSession: function() {
        if (store.currentUser) {
            localStorage.setItem('hersstep_currentUser', JSON.stringify(store.currentUser));
        }
    },
    
    loadSession: function() {
        const saved = localStorage.getItem('hersstep_currentUser');
        if (saved) {
            try {
                store.currentUser = JSON.parse(saved);
            } catch (e) {
                // ignore parse errors
            }
        }
    },
    
    updateProfile: function(updates) {
        if (!store.currentUser) return false;
        
        const userIndex = store.users.findIndex(u => u.id === store.currentUser.id);
        if (userIndex === -1) return false;
        
        store.users[userIndex] = { ...store.users[userIndex], ...updates };
        store.currentUser = store.users[userIndex];
        this.saveSession();
        return true;
    },
    
    resetPassword: function(email) {
        const user = store.users.find(u => u.email === email);
        if (!user) {
            throw new Error('No account found with this email');
        }
        // In production, this would send an email
        return true;
    }
};

// Cart Management
const cart = {
    add: function(product, quantity = 1) {
        const existingItem = store.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            store.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity,
                stock: product.stock
            });
        }
        
        this.saveCart();
        updateCartCount();
    },
    
    remove: function(productId) {
        store.cart = store.cart.filter(item => item.id !== productId);
        this.saveCart();
        updateCartCount();
    },
    
    updateQuantity: function(productId, quantity) {
        const item = store.cart.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.remove(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
            }
            updateCartCount();
        }
    },
    
    clear: function() {
        store.cart = [];
        this.saveCart();
        updateCartCount();
    },
    
    getTotal: function() {
        return store.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    
    getItemCount: function() {
        return store.cart.reduce((count, item) => count + item.quantity, 0);
    },
    
    saveCart: function() {
        localStorage.setItem('hersstep_cart', JSON.stringify(store.cart));
    },
    
    loadCart: function() {
        const saved = localStorage.getItem('hersstep_cart');
        if (saved) {
            try {
                store.cart = JSON.parse(saved);
            } catch (e) {
                store.cart = [];
            }
        }
        updateCartCount();
    }
};

// Order Management
const orders = {
    place: function(orderData) {
        const newOrder = {
            id: 'ORD-' + Date.now(),
            userId: store.currentUser.id,
            items: [...store.cart],
            total: orderData.total,
            discount: orderData.discount || 0,
            paymentMethod: orderData.paymentMethod,
            status: 'placed',
            shippingAddress: orderData.shippingAddress,
            createdAt: new Date().toISOString()
        };
        
        // Update stock
        newOrder.items.forEach(item => {
            const product = store.products.find(p => p.id === item.id);
            if (product) {
                product.stock -= item.quantity;
            }
        });
        // persist updated product stock
        if (typeof products !== 'undefined' && typeof products.saveProducts === 'function') {
            products.saveProducts();
        }

        store.orders.push(newOrder);
        // persist orders so confirmation page can read them after redirect
        if (typeof this.saveOrders === 'function') this.saveOrders();
        cart.clear();
        return newOrder;
    },
    
    getUserOrders: function() {
        if (!store.currentUser) return [];
        return store.orders.filter(o => o.userId === store.currentUser.id);
    },
    
    getAllOrders: function() {
        return store.orders;
    },
    
    updateStatus: function(orderId, status) {
        const order = store.orders.find(o => o.id === orderId);
        if (order) {
            order.status = status;
            if (typeof this.saveOrders === 'function') this.saveOrders();
            return true;
        }
        return false;
    },
    
    cancel: function(orderId) {
        const order = store.orders.find(o => o.id === orderId);
        if (order && order.status === 'placed') {
            order.status = 'cancelled';
            // Restore stock
            order.items.forEach(item => {
                const product = store.products.find(p => p.id === item.id);
                if (product) {
                    product.stock += item.quantity;
                }
            });
            if (typeof this.saveOrders === 'function') this.saveOrders();
            return true;
        }
        return false;
    }
    ,
    saveOrders: function() {
        try {
            localStorage.setItem('hersstep_orders', JSON.stringify(store.orders));
        } catch (e) {
            // ignore storage errors
        }
    },
    loadOrders: function() {
        try {
            const saved = localStorage.getItem('hersstep_orders');
            if (saved) {
                store.orders = JSON.parse(saved);
            } else {
                store.orders = [];
            }
        } catch (e) {
            store.orders = [];
        }
    }
};

// Product Management (Staff)
const products = {
    getAll: function() {
        return store.products;
    },

    getById: function(id) {
        return store.products.find(p => p.id === Number(id));
    },

    add: function(productData) {
        const nextId = store.products.reduce((m, p) => Math.max(m, Number(p.id) || 0), 0) + 1;
        // Price: parse, clamp to >=0 and round to 2 decimals
        const rawPrice = parseFloat(productData.price);
        const priceVal = isNaN(rawPrice) ? 0 : Math.max(0, Math.round(rawPrice * 100) / 100);
        // Stock: integer >= 0
        const rawStock = parseInt(productData.stock, 10);
        const stockVal = isNaN(rawStock) ? 0 : Math.max(0, rawStock);
        // Rating: clamp to [0,5] and round to 1 decimal
        const rawRating = (productData.rating !== undefined && productData.rating !== null && productData.rating !== '') ? parseFloat(productData.rating) : 0;
        const ratingVal = isNaN(rawRating) ? 0 : Math.round(Math.max(0, Math.min(5, rawRating)) * 10) / 10;

        const newProduct = {
            id: nextId,
            name: productData.name || 'Untitled',
            category: productData.category || 'Uncategorized',
            price: priceVal,
            description: productData.description || '',
            rating: ratingVal,
            stock: stockVal,
            image: productData.image || '👟'
        };
        store.products.push(newProduct);
        if (typeof this.saveProducts === 'function') this.saveProducts();
        return newProduct;
    },

    update: function(id, updates) {
        const product = store.products.find(p => p.id === Number(id));
        if (product) {
            if (updates.price !== undefined) {
                const rp = parseFloat(updates.price);
                updates.price = isNaN(rp) ? 0 : Math.max(0, Math.round(rp * 100) / 100);
            }
            if (updates.stock !== undefined) {
                const rs = parseInt(updates.stock, 10);
                updates.stock = isNaN(rs) ? 0 : Math.max(0, rs);
            }
            if (updates.rating !== undefined) {
                const rv = parseFloat(updates.rating);
                const rvClamped = isNaN(rv) ? 0 : Math.max(0, Math.min(5, rv));
                updates.rating = Math.round(rvClamped * 10) / 10;
            }
            Object.assign(product, updates);
            if (typeof this.saveProducts === 'function') this.saveProducts();
            return true;
        }
        return false;
    },

    remove: function(id) {
        const index = store.products.findIndex(p => p.id === Number(id));
        if (index !== -1) {
            store.products.splice(index, 1);
            if (typeof this.saveProducts === 'function') this.saveProducts();
            return true;
        }
        return false;
    },

    validate: function(productData, excludeId) {
        const errors = [];

        if (!productData.name || productData.name.trim() === '') {
            errors.push('Product name is required');
        }

        if (!productData.category || productData.category.trim() === '') {
            errors.push('Category is required');
        }

        // Price must be numeric and non-negative
        if (productData.price === undefined || isNaN(Number(productData.price)) || Number(productData.price) < 0) {
            errors.push('Price must be 0 or greater');
        }

        if (!productData.description || productData.description.trim() === '') {
            errors.push('Description is required');
        }

        // Rating is clamped automatically on add/update; no validation error produced here.

        // Stock should not be negative
        if (productData.stock !== undefined && (isNaN(Number(productData.stock)) || Number(productData.stock) < 0)) {
            errors.push('Stock cannot be negative');
        }

        // Check for duplicate product name (case-insensitive), excluding an optional product id
        if (productData.name && productData.name.trim() !== '') {
            const nameNormalized = productData.name.trim().toLowerCase();
            const duplicate = store.products.some(p => p.name && p.name.trim().toLowerCase() === nameNormalized && Number(p.id) !== Number(excludeId));
            if (duplicate) {
                errors.push('Product with this name already exists');
            }
        }

        return errors;
    },

    saveProducts: function() {
        try {
            localStorage.setItem('hersstep_products', JSON.stringify(store.products));
        } catch (e) {
            // ignore storage errors
        }
    },

    loadProducts: function() {
        try {
            const saved = localStorage.getItem('hersstep_products');
            if (saved) {
                store.products = JSON.parse(saved);
            } else {
                // initialize storage with defaults
                this.saveProducts();
            }
        } catch (e) {
            // ignore parse errors
        }
    }
};

// Initialize App
function initApp() {
    auth.loadSession();
    cart.loadCart();
    updateCartCount();
    updateNav();
}

// Update Cart Count Display
function updateCartCount() {
    const countEl = document.querySelector('.cart-count');
    if (countEl) {
        const count = cart.getItemCount();
        countEl.textContent = count > 0 ? count : '';
        countEl.style.display = count > 0 ? 'flex' : 'none';
    }
}

// Update Navigation Based on User State
function updateNav() {
    const navContainer = document.querySelector('.nav-menu');
    if (!navContainer) return;
    
    const user = store.currentUser;
    const authLinks = navContainer.querySelector('.auth-links');
    if (authLinks) {
        // Determine prefix depending on whether we're in /pages/ or root
        const inPages = window.location.pathname.includes('/pages/') || window.location.href.includes('/pages/');
        const prefix = inPages ? '' : 'pages/';

        if (user) {
            let roleLinks = '';
            if (user.role === 'staff') {
                roleLinks = `<a href="${prefix}staff-dashboard.html">Dashboard</a>`;
            }

            authLinks.innerHTML = `
                <a href="${prefix}profile.html">${user.firstName}</a>
                <a href="${prefix}orders.html">Orders</a>
                ${roleLinks}
                <a href="#" onclick="auth.logout(); return false;">Logout</a>
            `;
        } else {
            authLinks.innerHTML = `
                <a href="${prefix}login.html">Login</a>
                <a href="${prefix}signup.html">Sign Up</a>
            `;
        }
    }
}

// Show Notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Format Currency
function formatCurrency(amount) {
    return '$' + amount.toFixed(2);
}

// Preload session and cart immediately so inline page scripts can read store state
auth.loadSession();
// Load persisted products (if any)
if (typeof products !== 'undefined' && typeof products.loadProducts === 'function') products.loadProducts();
cart.loadCart();
orders.loadOrders();
updateCartCount();

// Initialize on DOM Load (run immediately if document already parsed)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
