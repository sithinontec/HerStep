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
        'FLAT15': { type: 'fixed', value: 15 }
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
        sessionStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    },
    
    saveSession: function() {
        if (store.currentUser) {
            sessionStorage.setItem('currentUser', JSON.stringify(store.currentUser));
        }
    },
    
    loadSession: function() {
        const saved = sessionStorage.getItem('currentUser');
        if (saved) {
            store.currentUser = JSON.parse(saved);
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
        sessionStorage.setItem('cart', JSON.stringify(store.cart));
    },
    
    loadCart: function() {
        const saved = sessionStorage.getItem('cart');
        if (saved) {
            store.cart = JSON.parse(saved);
            updateCartCount();
        }
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
        
        store.orders.push(newOrder);
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
            return true;
        }
        return false;
    }
};

// Product Management (Staff)
const products = {
    getAll: function() {
        return store.products;
    },
    
    getById: function(id) {
        return store.products.find(p => p.id === id);
    },
    
    add: function(productData) {
        const newProduct = {
            id: store.products.length + 1,
            ...productData,
            rating: 0,
            stock: productData.stock || 0,
            image: productData.image || '📦'
        };
        store.products.push(newProduct);
        return newProduct;
    },
    
    update: function(id, updates) {
        const product = store.products.find(p => p.id === id);
        if (product) {
            Object.assign(product, updates);
            return true;
        }
        return false;
    },
    
    remove: function(id) {
        const index = store.products.findIndex(p => p.id === id);
        if (index !== -1) {
            store.products.splice(index, 1);
            return true;
        }
        return false;
    },
    
    validate: function(productData) {
        const errors = [];
        
        if (!productData.name || productData.name.trim() === '') {
            errors.push('Product name is required');
        }
        
        if (!productData.category || productData.category.trim() === '') {
            errors.push('Category is required');
        }
        
        if (!productData.price || productData.price <= 0) {
            errors.push('Price must be greater than 0');
        }
        
        if (!productData.description || productData.description.trim() === '') {
            errors.push('Description is required');
        }
        
        return errors;
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
        if (user) {
            let roleLinks = '';
            if (user.role === 'staff') {
                roleLinks = '<a href="staff-dashboard.html">Dashboard</a>';
            } else if (user.role === 'admin') {
                roleLinks = '<a href="admin-dashboard.html">Admin</a>';
            }
            
            authLinks.innerHTML = `
                <a href="profile.html">${user.firstName}</a>
                <a href="orders.html">Orders</a>
                ${roleLinks}
                <a href="#" onclick="auth.logout(); return false;">Logout</a>
            `;
        } else {
            authLinks.innerHTML = `
                <a href="login.html">Login</a>
                <a href="signup.html">Sign Up</a>
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

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', initApp);
