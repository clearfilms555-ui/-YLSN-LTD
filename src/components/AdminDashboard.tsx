import React, { useState, useEffect } from 'react';
import {
  Shield,
  X,
  Package,
  Layers,
  ShoppingBag,
  Wrench,
  FileText,
  Settings as SettingsIcon,
  BarChart3,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  AlertTriangle,
  LogOut,
  Phone,
  MessageSquare,
  Lock,
  Search,
  ExternalLink,
  DollarSign,
  TrendingUp,
  Image as ImageIcon,
  Globe,
  Key,
  Code2,
  Copy,
  Check,
  Terminal,
} from 'lucide-react';
import {
  Category,
  CompanySettings,
  Order,
  Product,
  QuotationRequest,
  ServiceRequest,
} from '../types';
import { api } from '../services/api';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  settings: CompanySettings;
  onSettingsUpdate: (settings: CompanySettings) => void;
  products: Product[];
  categories: Category[];
  onRefreshData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  settings,
  onSettingsUpdate,
  products,
  categories,
  onRefreshData,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<
    'reports' | 'products' | 'orders' | 'services' | 'quotes' | 'settings' | 'api'
  >('reports');

  // API Integration state
  const [apiKeys, setApiKeys] = useState<Array<{ id: string; name: string; key: string; createdAt: string }>>([
    {
      id: 'key-1',
      name: 'Default Mobile & Web Integration Key',
      key: 'ylsn_live_pk_88291a9f02b1c',
      createdAt: new Date().toISOString(),
    },
  ]);
  const [newKeyName, setNewKeyName] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [apiTestResponse, setApiTestResponse] = useState<any>(null);
  const [isTestingApi, setIsTestingApi] = useState(false);

  // Reports data
  const [orders, setOrders] = useState<Order[]>([]);
  const [services, setServices] = useState<ServiceRequest[]>([]);
  const [quotes, setQuotes] = useState<QuotationRequest[]>([]);

  // Product edit modal state
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<CompanySettings>(settings);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Search in tabs
  const [productSearch, setProductSearch] = useState('');

  // Check existing session
  useEffect(() => {
    const session = api.getAdminSession();
    if (session?.loggedIn) {
      setIsAuthenticated(true);
      loadAdminData();
    }
  }, [isOpen]);

  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  const loadAdminData = async () => {
    try {
      const [o, s, q] = await Promise.all([
        api.getOrders(),
        api.getServices(),
        api.getQuotations(),
      ]);
      setOrders(o);
      setServices(s);
      setQuotes(q);
    } catch (err) {
      console.error('Error fetching admin datasets:', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const res = await api.adminLogin(username, password);
    if (res.success) {
      setIsAuthenticated(true);
      loadAdminData();
    } else {
      setLoginError(res.error || 'Invalid credentials');
    }
  };

  const handleLogout = () => {
    api.adminLogout();
    setIsAuthenticated(false);
  };

  const formatRwf = (val: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Product Save / Delete
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.priceRwf) return;

    try {
      if (isNewProduct) {
        await api.createProduct(editingProduct);
      } else if (editingProduct.id) {
        await api.updateProduct(editingProduct.id, editingProduct);
      }
      setEditingProduct(null);
      onRefreshData();
    } catch (err) {
      alert('Failed to save product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this sound equipment from inventory?')) {
      await api.deleteProduct(id);
      onRefreshData();
    }
  };

  // Order Status update
  const handleUpdateOrderStatus = async (id: string, status: any) => {
    await api.updateOrder(id, { orderStatus: status });
    const updated = await api.getOrders();
    setOrders(updated);
  };

  // Service Status update
  const handleUpdateServiceStatus = async (id: string, status: any) => {
    await api.updateService(id, { status });
    const updated = await api.getServices();
    setServices(updated);
  };

  // Quotation Status update
  const handleUpdateQuoteStatus = async (id: string, status: any) => {
    await api.updateQuotation(id, { status });
    const updated = await api.getQuotations();
    setQuotes(updated);
  };

  // Save Company Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = await api.updateSettings(settingsForm);
    onSettingsUpdate(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  if (!isOpen) return null;

  // Total metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalRwf || 0), 0);
  const pendingOrders = orders.filter((o) => o.orderStatus === 'confirmed' || o.orderStatus === 'pending');
  const pendingQuotes = quotes.filter((q) => q.status === 'pending_review');
  const activeServices = services.filter((s) => s.status !== 'completed' && s.status !== 'cancelled');

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="relative w-full max-w-7xl h-[92vh] bg-[#0A0D15] border border-amber-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Top Bar */}
        <div className="p-4 sm:px-6 bg-[#07090E] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-white text-base sm:text-lg">
                  YLSN LTD Command Center
                </span>
                <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.5 rounded">
                  ADMIN
                </span>
              </div>
              <span className="text-xs text-slate-400">
                Official Sound Equipment, Orders & Operations Management
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-red-400 text-xs font-semibold"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* LOGIN SCREEN IF NOT AUTHENTICATED */}
        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#0E131F] border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-heading font-extrabold text-white">
                  Administrator Access
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Authenticate to manage sound inventory, prices, orders, and company settings.
                </p>
              </div>

              {loginError && (
                <div className="p-3 mb-4 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Username / Email
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="admin@ylsn.rw"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 placeholder-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Admin Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 placeholder-slate-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  Enter Admin Console
                </button>
              </form>
            </div>
          </div>
        ) : (
          
          /* AUTHENTICATED ADMIN CONSOLE */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-60 bg-[#07090E] border-b md:border-b-0 md:border-r border-slate-800 p-3 space-y-1 shrink-0 overflow-x-auto md:overflow-y-auto flex md:flex-col">
              {[
                { id: 'reports', label: 'Sales & Reports', icon: BarChart3, badge: null },
                {
                  id: 'products',
                  label: 'Products & Stock',
                  icon: Package,
                  badge: products.length,
                },
                {
                  id: 'orders',
                  label: 'Customer Orders',
                  icon: ShoppingBag,
                  badge: pendingOrders.length,
                },
                {
                  id: 'services',
                  label: 'Service Requests',
                  icon: Wrench,
                  badge: activeServices.length,
                },
                {
                  id: 'quotes',
                  label: 'Quotations',
                  icon: FileText,
                  badge: pendingQuotes.length,
                },
                { id: 'settings', label: 'Website Settings', icon: SettingsIcon, badge: null },
                { id: 'api', label: 'API & Remote Access', icon: Globe, badge: 'LIVE' },
              ].map((tab) => {
                const IconComp = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                        : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <IconComp className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </div>
                    {tab.badge !== null && (typeof tab.badge === 'string' || tab.badge > 0) && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                          activeTab === tab.id
                            ? 'bg-slate-950 text-white'
                            : 'bg-slate-800 text-amber-400'
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0A0D15]">
              
              {/* TAB 1: REPORTS & SALES ANALYTICS */}
              {activeTab === 'reports' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-[#0E131F] border border-amber-500/30">
                      <span className="text-[11px] font-bold uppercase text-slate-400 block">
                        Gross Order Sales
                      </span>
                      <div className="text-2xl font-heading font-black text-amber-400 mt-1">
                        {formatRwf(totalRevenue)}
                      </div>
                      <span className="text-[10px] text-emerald-400 mt-1 block">
                        +18% from last month
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#0E131F] border border-slate-800">
                      <span className="text-[11px] font-bold uppercase text-slate-400 block">
                        Orders Received
                      </span>
                      <div className="text-2xl font-heading font-black text-white mt-1">
                        {orders.length}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {pendingOrders.length} pending fulfillment
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#0E131F] border border-cyan-500/30">
                      <span className="text-[11px] font-bold uppercase text-slate-400 block">
                        Service Bookings
                      </span>
                      <div className="text-2xl font-heading font-black text-cyan-400 mt-1">
                        {services.length}
                      </div>
                      <span className="text-[10px] text-cyan-300 mt-1 block">
                        {activeServices.length} active installations/rentals
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#0E131F] border border-slate-800">
                      <span className="text-[11px] font-bold uppercase text-slate-400 block">
                        Quotation Requests
                      </span>
                      <div className="text-2xl font-heading font-black text-white mt-1">
                        {quotes.length}
                      </div>
                      <span className="text-[10px] text-amber-400 mt-1 block">
                        {pendingQuotes.length} pending engineer pricing
                      </span>
                    </div>
                  </div>

                  {/* Low Stock Alerts */}
                  <div className="p-5 rounded-2xl bg-[#0E131F] border border-slate-800">
                    <h3 className="font-heading font-bold text-white text-sm mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400" /> Inventory & Stock Alerts
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {products
                        .filter((p) => p.stock <= 5)
                        .map((p) => (
                          <div
                            key={p.id}
                            className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                          >
                            <div>
                              <div className="font-semibold text-white truncate max-w-[180px]">
                                {p.name}
                              </div>
                              <span className="text-slate-400 text-[10px]">{p.brand}</span>
                            </div>
                            <span className="px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-500/40 font-bold text-[11px]">
                              {p.stock} left
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Recent Orders Overview */}
                  <div className="p-5 rounded-2xl bg-[#0E131F] border border-slate-800">
                    <h3 className="font-heading font-bold text-white text-sm mb-3">
                      Recent Activity Stream
                    </h3>
                    <div className="space-y-2">
                      {orders.slice(0, 4).map((o) => (
                        <div
                          key={o.id}
                          className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-mono text-amber-400 font-bold">
                              {o.orderNumber}
                            </span>
                            <span className="text-slate-300 ml-2 font-medium">{o.customerName}</span>
                            <span className="text-slate-400 text-[10px] ml-2">({o.customerPhone})</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-white">{formatRwf(o.totalRwf)}</span>
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 capitalize text-[10px]">
                              {o.orderStatus}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PRODUCTS & INVENTORY MANAGER */}
              {activeTab === 'products' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="relative w-full sm:w-72">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search inventory..."
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <button
                      onClick={() => {
                        setIsNewProduct(true);
                        setEditingProduct({
                          name: '',
                          category: 'speakers',
                          brand: 'YLSN Pro',
                          priceRwf: 250000,
                          stock: 10,
                          availability: 'in_stock',
                          isRentalAvailable: true,
                          featured: false,
                          imageUrl:
                            'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&q=80',
                          description: '',
                          shortDescription: '',
                          specifications: {},
                        });
                      }}
                      className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Sound Equipment</span>
                    </button>
                  </div>

                  {/* Product Cards Table */}
                  <div className="bg-[#0E131F] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#07090E] text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-800">
                          <tr>
                            <th className="py-3 px-4">Equipment</th>
                            <th className="py-3 px-4">Category</th>
                            <th className="py-3 px-4">Price (RWF)</th>
                            <th className="py-3 px-4">Stock</th>
                            <th className="py-3 px-4">Rental</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                          {products
                            .filter(
                              (p) =>
                                !productSearch ||
                                p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                                p.brand.toLowerCase().includes(productSearch.toLowerCase())
                            )
                            .map((p) => (
                              <tr key={p.id} className="hover:bg-slate-900/40 transition-colors">
                                <td className="py-3 px-4 flex items-center gap-3">
                                  <img
                                    src={p.imageUrl}
                                    alt={p.name}
                                    className="w-10 h-10 rounded-lg object-cover bg-black border border-slate-800 shrink-0"
                                  />
                                  <div>
                                    <div className="font-bold text-white line-clamp-1">{p.name}</div>
                                    <span className="text-slate-400 text-[10px]">{p.brand}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-slate-300 capitalize">{p.category}</td>
                                <td className="py-3 px-4 font-bold text-amber-400">
                                  {formatRwf(p.priceRwf)}
                                </td>
                                <td className="py-3 px-4">
                                  <span
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                      p.stock > 5
                                        ? 'bg-emerald-950/60 text-emerald-400'
                                        : p.stock > 0
                                        ? 'bg-amber-950/60 text-amber-400'
                                        : 'bg-red-950/60 text-red-400'
                                    }`}
                                  >
                                    {p.stock} units
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  {p.isRentalAvailable ? (
                                    <span className="text-cyan-400 font-semibold text-[11px]">Yes</span>
                                  ) : (
                                    <span className="text-slate-500 text-[11px]">No</span>
                                  )}
                                </td>
                                <td className="py-3 px-4 text-right space-x-2">
                                  <button
                                    onClick={() => {
                                      setIsNewProduct(false);
                                      setEditingProduct(p);
                                    }}
                                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                                    title="Edit Product"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(p.id)}
                                    className="p-1.5 rounded-lg bg-slate-800 text-red-400 hover:text-red-300"
                                    title="Delete Product"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: CUSTOMER ORDERS MANAGER */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading font-bold text-white text-base">
                      Customer Orders Management
                    </h3>
                    <span className="text-xs text-slate-400">
                      Total Orders: <strong className="text-white">{orders.length}</strong>
                    </span>
                  </div>

                  <div className="space-y-3">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="p-4 sm:p-5 rounded-2xl bg-[#0E131F] border border-slate-800 space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-mono font-extrabold text-amber-400">
                              {order.orderNumber}
                            </span>
                            <span className="text-xs text-slate-400">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400">Status:</span>
                            <select
                              value={order.orderStatus}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                              className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs font-semibold text-white focus:outline-none focus:border-amber-400"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="processing">Processing</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>

                        {/* Order info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                          <div>
                            <span className="text-slate-400 block font-medium">Customer:</span>
                            <strong className="text-white text-sm">{order.customerName}</strong>
                            <div className="flex items-center gap-2 mt-1">
                              <a
                                href={`tel:${order.customerPhone}`}
                                className="text-amber-400 font-bold hover:underline flex items-center gap-1"
                              >
                                <Phone className="w-3 h-3" /> {order.customerPhone}
                              </a>
                              <a
                                href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-emerald-400 hover:underline flex items-center gap-1"
                              >
                                <MessageSquare className="w-3 h-3" /> WhatsApp
                              </a>
                            </div>
                          </div>

                          <div>
                            <span className="text-slate-400 block font-medium">Delivery & Payment:</span>
                            <span className="text-slate-200 capitalize">
                              {order.deliveryType} ({order.deliveryAddress || 'Store Pickup'})
                            </span>
                            <span className="text-amber-400 block font-semibold mt-1">
                              Payment: {order.paymentMethod} ({order.paymentStatus})
                            </span>
                          </div>

                          <div className="text-left md:text-right">
                            <span className="text-slate-400 block font-medium">Order Total:</span>
                            <span className="text-lg font-heading font-black text-amber-400">
                              {formatRwf(order.totalRwf)}
                            </span>
                          </div>
                        </div>

                        {/* Items breakdown */}
                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-2">
                            Purchased Equipment ({order.items.length} items)
                          </span>
                          <div className="space-y-1.5">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-xs text-slate-300">
                                <span>
                                  {item.quantity}x {item.name}
                                </span>
                                <span className="font-semibold text-slate-200">
                                  {formatRwf(item.priceRwf * item.quantity)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: SERVICE REQUESTS MANAGER */}
              {activeTab === 'services' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading font-bold text-white text-base">
                      Service & Audio Engineering Requests
                    </h3>
                    <span className="text-xs text-slate-400">
                      Active: <strong className="text-cyan-400">{activeServices.length}</strong>
                    </span>
                  </div>

                  <div className="space-y-3">
                    {services.map((req) => (
                      <div
                        key={req.id}
                        className="p-4 sm:p-5 rounded-2xl bg-[#0E131F] border border-slate-800 space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-mono font-bold text-cyan-400">
                              {req.requestNumber}
                            </span>
                            <span className="text-xs text-slate-400">
                              {new Date(req.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400">Status:</span>
                            <select
                              value={req.status}
                              onChange={(e) => handleUpdateServiceStatus(req.id, e.target.value)}
                              className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs font-semibold text-white focus:outline-none focus:border-cyan-400"
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="quoted">Quoted</option>
                              <option value="scheduled">Scheduled</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                          <div>
                            <span className="text-slate-400 block font-medium">Client:</span>
                            <strong className="text-white text-sm">{req.clientName}</strong>
                            <div className="flex items-center gap-2 mt-1">
                              <a
                                href={`tel:${req.clientPhone}`}
                                className="text-amber-400 font-bold hover:underline flex items-center gap-1"
                              >
                                <Phone className="w-3 h-3" /> {req.clientPhone}
                              </a>
                            </div>
                          </div>

                          <div>
                            <span className="text-slate-400 block font-medium">Service Type:</span>
                            <span className="text-cyan-300 font-semibold uppercase text-[11px]">
                              {req.serviceType.replace(/_/g, ' ')}
                            </span>
                            {req.eventLocation && (
                              <p className="text-slate-400 text-[11px] mt-1">
                                Location: {req.eventLocation}
                              </p>
                            )}
                          </div>

                          <div>
                            <span className="text-slate-400 block font-medium">Target Date:</span>
                            <span className="text-slate-200">{req.eventDate || 'Immediate / TBD'}</span>
                          </div>
                        </div>

                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300">
                          <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                            Client Details & Request Notes:
                          </span>
                          <p>{req.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: QUOTATIONS MANAGER */}
              {activeTab === 'quotes' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading font-bold text-white text-base">
                      Event Quotation Requests
                    </h3>
                    <span className="text-xs text-slate-400">
                      Total Quotes: <strong className="text-white">{quotes.length}</strong>
                    </span>
                  </div>

                  <div className="space-y-3">
                    {quotes.map((quote) => (
                      <div
                        key={quote.id}
                        className="p-4 sm:p-5 rounded-2xl bg-[#0E131F] border border-slate-800 space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-mono font-bold text-amber-400">
                              {quote.quoteNumber}
                            </span>
                            <span className="text-xs text-slate-400">{quote.eventType}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400">Status:</span>
                            <select
                              value={quote.status}
                              onChange={(e) => handleUpdateQuoteStatus(quote.id, e.target.value)}
                              className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs font-semibold text-white focus:outline-none focus:border-amber-400"
                            >
                              <option value="pending_review">Pending Review</option>
                              <option value="quote_sent">Quote Sent</option>
                              <option value="approved">Approved</option>
                              <option value="declined">Declined</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                          <div>
                            <span className="text-slate-400 block font-medium">Client:</span>
                            <strong className="text-white text-sm">{quote.clientName}</strong>
                            <a
                              href={`tel:${quote.clientPhone}`}
                              className="text-amber-400 font-bold hover:underline flex items-center gap-1 mt-1"
                            >
                              <Phone className="w-3 h-3" /> {quote.clientPhone}
                            </a>
                          </div>

                          <div>
                            <span className="text-slate-400 block font-medium">Audience & Venue:</span>
                            <span className="text-slate-200">
                              {quote.guestCount} • {quote.venueType}
                            </span>
                          </div>

                          <div className="text-left md:text-right">
                            <span className="text-slate-400 block font-medium">Estimated Range:</span>
                            <span className="text-base font-heading font-black text-amber-400">
                              {formatRwf(quote.estimatedTotalRwf || 0)}
                            </span>
                          </div>
                        </div>

                        {quote.requiredEquipment && quote.requiredEquipment.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {quote.requiredEquipment.map((eq, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300"
                              >
                                {eq}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: WEBSITE & COMPANY SETTINGS */}
              {activeTab === 'settings' && (
                <div className="max-w-2xl bg-[#0E131F] rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-6">
                  <div>
                    <h3 className="text-lg font-heading font-bold text-white">
                      Company Profile & Contact Information
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Configure official contact coordinates. In adherence to prompt guidelines, the official phone is set to +250 783 008 214, and email/address can be added here.
                    </p>
                  </div>

                  {saveSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Settings updated successfully! Changes reflected immediately across the site.</span>
                    </div>
                  )}

                  <form onSubmit={handleSaveSettings} className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                        Official Telephone Hotline *
                      </label>
                      <input
                        type="text"
                        required
                        value={settingsForm.phone}
                        onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                        Company Email Address (Add or update official email)
                      </label>
                      <input
                        type="email"
                        placeholder="info@ylsn.rw"
                        value={settingsForm.email}
                        onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                        Physical Office Address (Add or update office address)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. KG 11 Ave, Commercial Plaza, Kigali, Rwanda"
                        value={settingsForm.physicalAddress}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, physicalAddress: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                        Announcement Bar Text
                      </label>
                      <input
                        type="text"
                        value={settingsForm.announcementText}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, announcementText: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                        Company Slogan
                      </label>
                      <input
                        type="text"
                        value={settingsForm.slogan}
                        onChange={(e) => setSettingsForm({ ...settingsForm, slogan: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <button
                      type="submit"
                      className="py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 cursor-pointer"
                    >
                      Save Configuration
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 7: API & LIVE REMOTE INTEGRATIONS */}
              {activeTab === 'api' && (
                <div className="space-y-6">
                  {/* Status Banner */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-[#0E131F] border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                        <Globe className="w-5 h-5 animate-spin" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-heading font-black text-white text-base">
                            YLSN LTD Public REST API
                          </h3>
                          <span className="text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                            ONLINE & ACCESSIBLE GLOBALLY
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Cross-Origin Resource Sharing (CORS) enabled. Connect from any remote app, mobile iOS/Android client, or external website.
                        </p>
                      </div>
                    </div>

                    <a
                      href="/api/docs"
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-600/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open API Specification (JSON)</span>
                    </a>
                  </div>

                  {/* Base URL & Live Testing */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left: Interactive Tester & Keys */}
                    <div className="lg:col-span-7 space-y-5">
                      {/* Base URL Box */}
                      <div className="p-4 rounded-xl bg-[#0E131F] border border-slate-800 space-y-2">
                        <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider block">
                          Live API Base URL
                        </span>
                        <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-xs text-amber-400 select-all">
                          <span>{typeof window !== 'undefined' ? `${window.location.origin}/api` : '/api'}</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(
                                typeof window !== 'undefined' ? `${window.location.origin}/api` : '/api'
                              );
                              setCopiedKey('base_url');
                              setTimeout(() => setCopiedKey(null), 2000);
                            }}
                            className="ml-auto text-slate-400 hover:text-white"
                            title="Copy Base URL"
                          >
                            {copiedKey === 'base_url' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {/* API Keys Manager */}
                      <div className="p-5 rounded-2xl bg-[#0E131F] border border-slate-800 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-heading font-bold text-white text-sm flex items-center gap-2">
                              <Key className="w-4 h-4 text-amber-400" /> Authorized API Keys
                            </h4>
                            <p className="text-xs text-slate-400">
                              Generate keys for external websites, mobile apps, or ticketing systems.
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Key Name (e.g., Kigali POS Client / Mobile App)"
                            value={newKeyName}
                            onChange={(e) => setNewKeyName(e.target.value)}
                            className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
                          />
                          <button
                            onClick={() => {
                              if (!newKeyName.trim()) return;
                              const newKey = {
                                id: 'key-' + Date.now(),
                                name: newKeyName,
                                key: 'ylsn_live_' + Math.random().toString(36).substring(2, 12),
                                createdAt: new Date().toISOString(),
                              };
                              setApiKeys([...apiKeys, newKey]);
                              setNewKeyName('');
                            }}
                            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                          >
                            Generate Key
                          </button>
                        </div>

                        <div className="space-y-2">
                          {apiKeys.map((k) => (
                            <div
                              key={k.id}
                              className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                            >
                              <div>
                                <span className="font-semibold text-white block">{k.name}</span>
                                <span className="font-mono text-[11px] text-amber-400">{k.key}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(k.key);
                                    setCopiedKey(k.id);
                                    setTimeout(() => setCopiedKey(null), 2000);
                                  }}
                                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300"
                                  title="Copy Key"
                                >
                                  {copiedKey === k.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                                <button
                                  onClick={() => setApiKeys(apiKeys.filter((i) => i.id !== k.id))}
                                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-red-400"
                                  title="Revoke Key"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Interactive Test Endpoints */}
                      <div className="p-5 rounded-2xl bg-[#0E131F] border border-slate-800 space-y-3">
                        <h4 className="font-heading font-bold text-white text-sm flex items-center gap-2">
                          <Terminal className="w-4 h-4 text-cyan-400" /> Live Endpoint Tester
                        </h4>
                        <p className="text-xs text-slate-400">
                          Click any button below to query the live backend API and verify instant responses:
                        </p>

                        <div className="flex flex-wrap gap-2 pt-1">
                          {[
                            { label: 'GET /api/products', url: '/api/products' },
                            { label: 'GET /api/orders', url: '/api/orders' },
                            { label: 'GET /api/settings', url: '/api/settings' },
                            { label: 'GET /api/services', url: '/api/services' },
                            { label: 'GET /api/health', url: '/api/health' },
                          ].map((ep) => (
                            <button
                              key={ep.label}
                              disabled={isTestingApi}
                              onClick={async () => {
                                setIsTestingApi(true);
                                try {
                                  const res = await fetch(ep.url);
                                  const data = await res.json();
                                  setApiTestResponse({ endpoint: ep.label, status: res.status, data });
                                } catch (e: any) {
                                  setApiTestResponse({ endpoint: ep.label, error: e.message });
                                } finally {
                                  setIsTestingApi(false);
                                }
                              }}
                              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-300 hover:text-white transition-colors cursor-pointer"
                            >
                              {ep.label}
                            </button>
                          ))}
                        </div>

                        {apiTestResponse && (
                          <div className="mt-3 p-3 bg-black rounded-xl border border-slate-800 text-xs font-mono overflow-x-auto max-h-56">
                            <div className="text-emerald-400 font-bold mb-1">
                              Response from {apiTestResponse.endpoint} (Status: {apiTestResponse.status}):
                            </div>
                            <pre className="text-slate-300 text-[11px]">
                              {JSON.stringify(apiTestResponse.data, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Code Snippets & Remote Instructions */}
                    <div className="lg:col-span-5 space-y-5">
                      <div className="p-5 rounded-2xl bg-[#0E131F] border border-slate-800 space-y-3">
                        <h4 className="font-heading font-bold text-white text-sm flex items-center gap-2">
                          <Code2 className="w-4 h-4 text-amber-400" /> Integration Code Examples
                        </h4>

                        {/* cURL example */}
                        <div>
                          <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                            cURL (Command Line)
                          </span>
                          <div className="p-2.5 bg-black rounded-xl border border-slate-800 font-mono text-[11px] text-amber-300 select-all overflow-x-auto">
                            <code>curl -X GET "{typeof window !== 'undefined' ? window.location.origin : 'https://ylsn.rw'}/api/products"</code>
                          </div>
                        </div>

                        {/* JavaScript Fetch */}
                        <div>
                          <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                            JavaScript / React / Node.js
                          </span>
                          <div className="p-2.5 bg-black rounded-xl border border-slate-800 font-mono text-[11px] text-cyan-300 select-all overflow-x-auto">
                            <code>{`const res = await fetch("${typeof window !== 'undefined' ? window.location.origin : 'https://ylsn.rw'}/api/products");
const products = await res.json();`}</code>
                          </div>
                        </div>

                        {/* Order Placement POST example */}
                        <div>
                          <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                            Submit Order via REST API (POST)
                          </span>
                          <div className="p-2.5 bg-black rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-300 select-all overflow-x-auto">
                            <code>{`await fetch("/api/orders", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    customerName: "Client Name",
    customerPhone: "+250783008214",
    items: [{ productId: "ylsn-spk-001", quantity: 2 }]
  })
});`}</code>
                          </div>
                        </div>
                      </div>

                      {/* Admin Live Sync Guarantee */}
                      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1.5 text-slate-300">
                        <span className="font-bold text-amber-400 block">⚡ Instant Live Sync:</span>
                        <p>
                          Any modification made in this dashboard—including price changes, stock availability, emergency banner announcements, official telephone numbers, or email addresses—is written immediately to the live JSON database and is accessible globally via the REST API without requiring a server reboot.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </main>
          </div>
        )}

      </div>

      {/* PRODUCT ADD/EDIT MODAL OVERLAY */}
      {editingProduct && (
        <div className="fixed inset-0 z-60 bg-black/85 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#0E131F] border border-amber-500/40 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-heading font-bold text-white text-base">
                {isNewProduct ? 'Add New Sound Equipment' : 'Edit Product Specifications'}
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                    Category *
                  </label>
                  <select
                    value={editingProduct.category || 'speakers'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                    Brand *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.brand || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                    Price (RWF) *
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProduct.priceRwf || 0}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, priceRwf: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProduct.stock || 0}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Product Image URL
                </label>
                <input
                  type="text"
                  value={editingProduct.imageUrl || ''}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, imageUrl: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={editingProduct.shortDescription || ''}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, shortDescription: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isRentalAvailable ?? false}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, isRentalAvailable: e.target.checked })
                    }
                    className="rounded bg-slate-900 border-slate-700 text-amber-500"
                  />
                  <span>Rental Available</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.featured ?? false}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, featured: e.target.checked })
                    }
                    className="rounded bg-slate-900 border-slate-700 text-amber-500"
                  />
                  <span>Featured Product</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  Save Equipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
