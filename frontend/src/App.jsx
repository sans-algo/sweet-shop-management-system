import React, { useState, useEffect } from 'react';
import { ShoppingCart, Package, Search, Plus, Edit2, Trash2, LogOut, User, Lock, Mail, DollarSign } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE;


const App = () => {
  const [user, setUser] = useState(null);
  const [sweets, setSweets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
  const [view, setView] = useState('login');
  const [editingSweet, setEditingSweet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [authForm, setAuthForm] = useState({ email: '', password: '', name: '' });
  const [sweetForm, setSweetForm] = useState({
    name: '', category: '', price: '', quantity: '', description: ''
  });

  useEffect(() => {
    const savedUser = sessionStorage.getItem('user');
    const savedToken = sessionStorage.getItem('token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setView('shop');
      fetchSweets(savedToken);
    }
  }, []);

  const showMessage = (text, type = 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const fetchSweets = async (token) => {
    try {
      const tokenToUse = token || user?.token || sessionStorage.getItem('token');
      const response = await fetch(`${API_BASE}/sweets`, {
        headers: {
          'Authorization': `Bearer ${tokenToUse}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setSweets(data);
      }
    } catch (error) {
      console.error('Fetch sweets error:', error);
    }
  };

  const handleRegister = async () => {
    if (!authForm.email || !authForm.password || !authForm.name) {
      showMessage('Please fill all fields', 'error');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authForm)
      });

      const data = await response.json();

      if (response.ok) {
        const userData = { ...data.user, token: data.token };
        setUser(userData);
        sessionStorage.setItem('user', JSON.stringify(userData));
        sessionStorage.setItem('token', data.token);
        setView('shop');
        showMessage('Registration successful!', 'success');
        setAuthForm({ email: '', password: '', name: '' });
        await fetchSweets(data.token);
      } else {
        showMessage(data.error || 'Registration failed', 'error');
      }
    } catch (error) {
      showMessage('Network error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!authForm.email || !authForm.password) {
      showMessage('Please fill all fields', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: authForm.email,
          password: authForm.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        const userData = { ...data.user, token: data.token };
        setUser(userData);
        sessionStorage.setItem('user', JSON.stringify(userData));
        sessionStorage.setItem('token', data.token);
        setView('shop');
        showMessage('Login successful!', 'success');
        setAuthForm({ email: '', password: '', name: '' });
        await fetchSweets(data.token);
      } else {
        showMessage(data.error || 'Login failed', 'error');
      }
    } catch (error) {
      showMessage('Network error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setView('login');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    setSweets([]);
    showMessage('Logged out successfully', 'info');
  };

  const handleAddSweet = async () => {
  if (!sweetForm.name || !sweetForm.category || !sweetForm.price || !sweetForm.quantity || !sweetForm.description) {
    showMessage('Please fill all fields', 'error');
    return;
  }

  setLoading(true);
  try {
    const response = await fetch(`${API_BASE}/sweets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
      body: JSON.stringify({
        name: sweetForm.name,
        category: sweetForm.category,
        price: parseFloat(sweetForm.price),
        quantity: parseInt(sweetForm.quantity),
        description: sweetForm.description
      })
    });

    const data = await response.json();

    if (response.ok) {
      showMessage('Sweet added successfully!', 'success');
      setSweetForm({ name: '', category: '', price: '', quantity: '', description: '' });
      setView('shop');

      // 🔥 THIS IS THE FIX
      await fetchSweets(user.token);
    } else {
      showMessage(data.error || 'Failed to add sweet', 'error');
    }
  } catch (error) {
    showMessage('Network error. Please try again.', 'error');
  } finally {
    setLoading(false);
  }
};


  const handleUpdateSweet = async () => {
    if (!sweetForm.name || !sweetForm.category || !sweetForm.price || !sweetForm.quantity || !sweetForm.description) {
      showMessage('Please fill all fields', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/sweets/${editingSweet._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          name: sweetForm.name,
          category: sweetForm.category,
          price: parseFloat(sweetForm.price),
          quantity: parseInt(sweetForm.quantity),
          description: sweetForm.description
        })
      });

      const data = await response.json();

      if (response.ok) {
        showMessage('Sweet updated successfully!', 'success');
        setEditingSweet(null);
        setSweetForm({ name: '', category: '', price: '', quantity: '', description: '' });
        setView('shop');
        await fetchSweets();
      } else {
        showMessage(data.error || 'Failed to update sweet', 'error');
      }
    } catch (error) {
      showMessage('Network error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSweet = async (id) => {
    if (!window.confirm('Are you sure you want to delete this sweet?')) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/sweets/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (response.ok) {
        showMessage('Sweet deleted successfully!', 'success');
        await fetchSweets();
      } else {
        const data = await response.json();
        showMessage(data.error || 'Failed to delete sweet', 'error');
      }
    } catch (error) {
      showMessage('Network error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/sweets/${id}/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ quantity: 1 })
      });

      const data = await response.json();

      if (response.ok) {
        showMessage('Purchase successful!', 'success');
        await fetchSweets();
      } else {
        showMessage(data.error || 'Purchase failed', 'error');
      }
    } catch (error) {
      showMessage('Network error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRestock = async (id, amount) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/sweets/${id}/restock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ quantity: amount })
      });

      const data = await response.json();

      if (response.ok) {
        showMessage('Restock successful!', 'success');
        await fetchSweets();
      } else {
        showMessage(data.error || 'Restock failed', 'error');
      }
    } catch (error) {
      showMessage('Network error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (sweet) => {
    setEditingSweet(sweet);
    setSweetForm({
      name: sweet.name,
      category: sweet.category,
      price: sweet.price.toString(),
      quantity: sweet.quantity.toString(),
      description: sweet.description
    });
    setView('editSweet');
  };

  const filteredSweets = sweets.filter(sweet => {
    const matchesSearch = sweet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sweet.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || sweet.category === categoryFilter;
    const matchesPrice = sweet.price >= priceRange.min && sweet.price <= priceRange.max;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const categories = ['all', ...new Set(sweets.map(s => s.category))];

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full mb-4">
              <ShoppingCart className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Sweet Shop
            </h1>
            <p className="text-gray-600 mt-2">Your favorite candy destination</p>
          </div>

          {message.text && (
            <div className={`mb-4 p-3 rounded-lg ${
              message.type === 'success' ? 'bg-green-100 text-green-800' :
              message.type === 'error' ? 'bg-red-100 text-red-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {message.text}
            </div>
          )}

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setView('login')}
              className={`flex-1 py-2 rounded-lg font-semibold transition ${
                view === 'login'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setView('register')}
              className={`flex-1 py-2 rounded-lg font-semibold transition ${
                view === 'register'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              Register
            </button>
          </div>

          <div>
            {view === 'register' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={authForm.name}
                    onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your name"
                  />
                </div>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Tip: Use admin@ for admin access</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              onClick={view === 'login' ? handleLogin : handleRegister}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
            >
              {loading ? 'Processing...' : view === 'login' ? 'Login' : 'Register'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'addSweet' || view === 'editSweet') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {view === 'addSweet' ? 'Add New Sweet' : 'Edit Sweet'}
              </h2>
              <button
                onClick={() => {
                  setView('shop');
                  setEditingSweet(null);
                  setSweetForm({ name: '', category: '', price: '', quantity: '', description: '' });
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>

            {message.text && (
              <div className={`mb-4 p-3 rounded-lg ${
                message.type === 'success' ? 'bg-green-100 text-green-800' :
                message.type === 'error' ? 'bg-red-100 text-red-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {message.text}
              </div>
            )}

            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={sweetForm.name}
                    onChange={(e) => setSweetForm({ ...sweetForm, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Sweet name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <input
                    type="text"
                    value={sweetForm.category}
                    onChange={(e) => setSweetForm({ ...sweetForm, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Chocolate, Gummies"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      step="0.01"
                      value={sweetForm.price}
                      onChange={(e) => setSweetForm({ ...sweetForm, price: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <div className="relative">
                    <Package className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={sweetForm.quantity}
                      onChange={(e) => setSweetForm({ ...sweetForm, quantity: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={sweetForm.description}
                  onChange={(e) => setSweetForm({ ...sweetForm, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows="3"
                  placeholder="Describe the sweet..."
                />
              </div>

              <button
                onClick={view === 'addSweet' ? handleAddSweet : handleUpdateSweet}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : view === 'addSweet' ? 'Add Sweet' : 'Update Sweet'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Sweet Shop
              </h1>
              <p className="text-xs text-gray-600">Welcome, {user.name}!</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {user.role === 'admin' ? 'Admin' : 'Customer'}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {message.text && (
        <div className="max-w-7xl mx-auto px-4 mt-4">
          <div className={`p-3 rounded-lg ${
            message.type === 'success' ? 'bg-green-100 text-green-800' :
            message.type === 'error' ? 'bg-red-100 text-red-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {message.text}
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Search sweets..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>

            {user.role === 'admin' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Actions</label>
                <button
                  onClick={() => setView('addSweet')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition"
                >
                  <Plus className="w-5 h-5" />
                  Add Sweet
                </button>
              </div>
            )}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range: ${priceRange.min} - ${priceRange.max}
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSweets.map(sweet => (
            <div
              key={sweet._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
            >
              <div className="h-48 bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 flex items-center justify-center">
                <Package className="w-24 h-24 text-white opacity-50" />
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-800">{sweet.name}</h3>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                    {sweet.category}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{sweet.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-purple-600">
                    ${sweet.price.toFixed(2)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    sweet.quantity === 0 ? 'bg-red-100 text-red-700' : 
                    sweet.quantity < 20 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {sweet.quantity === 0 ? 'Out of Stock' : `${sweet.quantity} in stock`}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handlePurchase(sweet._id)}
                    disabled={sweet.quantity === 0 || loading}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="w-4 h-4 inline mr-2" />
                    Purchase
                  </button>

                  {user.role === 'admin' && (
                    <>
                      <button
                        onClick={() => startEdit(sweet)}
                        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSweet(sweet._id)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>

                {user.role === 'admin' && (
                  <button
                    onClick={() => {
                      const amount = prompt('Restock quantity:', '10');
                      if (amount) handleRestock(sweet._id, parseInt(amount));
                    }}
                    className="w-full mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm"
                  >
                    <Package className="w-4 h-4 inline mr-2" />
                    Restock
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredSweets.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No sweets found matching your criteria</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;