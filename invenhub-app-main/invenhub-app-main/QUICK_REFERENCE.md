/\*\*

- QUICK REFERENCE GUIDE
-
- Common imports and usage patterns for Inventory MVP
  \*/

// ============================================================================
// AUTHENTICATION & HOOKS
// ============================================================================

import { useAuth } from '@/context/AuthContext';

// Usage:
const { user, login, register, logout, isAuthenticated, isLoading, error } = useAuth();

// ============================================================================
// API SERVICES
// ============================================================================

import { authApi, productApi, stockApi, saleApi, purchaseApi } from '@/api';

// OR individual imports:
import { authApi } from '@/api/auth.api';
import { productApi } from '@/api/product.api';
import { stockApi } from '@/api/stock.api';
import { saleApi } from '@/api/sale.api';
import { purchaseApi } from '@/api/purchase.api';

// Usage:
const products = await productApi.getAll();
const sales = await saleApi.getAll();
const purchases = await purchaseApi.getAll();

// ============================================================================
// TYPES
// ============================================================================

import type {
User,
Product,
Sale,
Purchase,
StockItem
} from '@/types';

// OR specific type imports:
import type { Product, CreateProductRequest } from '@/types/product.types';
import type { Sale, SalesStats } from '@/types/sale.types';

// ============================================================================
// UTILITIES & FORMATTING
// ============================================================================

import {
formatCurrency,
formatNumber,
formatDecimal
} from '@/utils/formatNumber';

import {
formatDate,
formatDateTime,
formatTime,
formatRelativeTime
} from '@/utils/formatDate';

// Usage:
formatCurrency(1000); // "$1,000"
formatNumber(5000); // "5,000"
formatDate('2026-01-15'); // "Jan 15, 2026"

// ============================================================================
// NAVIGATION
// ============================================================================

import { useNavigate } from 'react-router-dom';

// Usage:
const navigate = useNavigate();
navigate('/dashboard');
navigate('/products');

// ============================================================================
// ROUTING SETUP (in App.tsx)
// ============================================================================

import { Routes, Route, Navigate } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';

// Protected pages:
<Route path="/dashboard" element={<Dashboard />} />
<Route path="/products" element={<Products />} />

// Public pages:
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />

// ============================================================================
// UI COMPONENTS
// ============================================================================

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

// ============================================================================
// COMMON PAGE PATTERN
// ============================================================================

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { productApi } from '@/api';
import type { Product } from '@/types';

export default function Products() {
const navigate = useNavigate();
const { isAuthenticated } = useAuth();
const [products, setProducts] = useState<Product[]>([]);
const [isLoading, setIsLoading] = useState(true);

// Check authentication
useEffect(() => {
if (!isAuthenticated) {
navigate('/login');
}
}, [isAuthenticated, navigate]);

// Load data
useEffect(() => {
const loadData = async () => {
try {
const data = await productApi.getAll();
setProducts(data);
} catch (error) {
console.error('Error loading products:', error);
} finally {
setIsLoading(false);
}
};
loadData();
}, []);

if (isLoading) return <div>Loading...</div>;

return (
<div>
<h1>Products ({products.length})</h1>
</div>
);
}

// ============================================================================
// AUTHENTICATION PATTERN
// ============================================================================

import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const { login } = useAuth();
const navigate = useNavigate();

const handleLogin = async (email: string, password: string) => {
try {
await login(email, password);
toast.success('Logged in!');
navigate('/dashboard');
} catch (error) {
toast.error('Login failed');
}
};

// ============================================================================
// API CALL PATTERN WITH ERROR HANDLING
// ============================================================================

import axios from 'axios';
import { toast } from 'sonner';

const handleCreateProduct = async (data: CreateProductRequest) => {
try {
const newProduct = await productApi.create(data);
toast.success('Product created');
// Refresh list or update state
} catch (error) {
if (axios.isAxiosError(error)) {
toast.error(error.response?.data?.message || 'Failed to create product');
} else {
toast.error('Failed to create product');
}
}
};

// ============================================================================
// LAYOUT WRAPPER PATTERN
// ============================================================================

import Layout from '@/components/layout/Layout';

export default function Dashboard() {
return (
<Layout>
<div className="space-y-6">
<h1>Dashboard</h1>
{/_ Content here _/}
</div>
</Layout>
);
}

// ============================================================================
// FORM INPUT PATTERN
// ============================================================================

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

<form onSubmit={handleSubmit}>
  <div className="space-y-2">
    <Label htmlFor="email">Email</Label>
    <Input
      id="email"
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
  </div>
  <Button type="submit">Submit</Button>
</form>

// ============================================================================
// ICON USAGE (from lucide-react)
// ============================================================================

import { Package, DollarSign, ShoppingCart, AlertTriangle, Plus, Trash2 } from 'lucide-react';

<Package className="h-5 w-5" />
<DollarSign className="h-5 w-5" />
<ShoppingCart className="h-5 w-5" />

// ============================================================================
// CARD COMPONENT PATTERN
// ============================================================================

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Products</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>

// ============================================================================
// RESPONSIVE GRID PATTERN
// ============================================================================

<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Cards */}
</div>

<div className="grid lg:grid-cols-2 gap-4">
  {/* Charts */}
</div>

// ============================================================================
// TABLE PATTERN
// ============================================================================

<div className="overflow-x-auto">
  <table className="w-full text-sm">
    <thead>
      <tr className="text-left text-muted-foreground border-b">
        <th className="py-2 font-medium">Column 1</th>
        <th className="py-2 font-medium">Column 2</th>
      </tr>
    </thead>
    <tbody>
      {items.map((item) => (
        <tr key={item.id} className="border-b last:border-0">
          <td className="py-2.5">{item.name}</td>
          <td className="py-2.5">{item.value}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

// ============================================================================
// CHART PATTERN (Recharts)
// ============================================================================

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

<ResponsiveContainer width="100%" height="100%">
  <LineChart data={data}>
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip />
    <Line dataKey="value" stroke="var(--chart-1)" />
  </LineChart>
</ResponsiveContainer>

// ============================================================================
// CONFIGURATION
// ============================================================================

import { API_CONFIG, APP_CONFIG } from '@/lib/config';

// API_CONFIG.baseURL → '/api'
// API_CONFIG.timeout → 10000
// APP_CONFIG.name → 'Inventory MVP'
// APP_CONFIG.environment → 'development'

// ============================================================================
// AVAILABLE API ENDPOINTS (Reference)
// ============================================================================

/\*
Authentication:

- POST /api/auth/login
- POST /api/auth/register
- GET /api/auth/me
- POST /api/auth/logout

Products:

- GET /api/products
- GET /api/products/:id
- POST /api/products
- PUT /api/products/:id
- DELETE /api/products/:id

Stock:

- GET /api/stocks
- GET /api/stocks?low=true
- PATCH /api/stocks/:productId/adjust
- PATCH /api/stocks/:productId/set

Sales:

- GET /api/sales
- GET /api/sales/:id
- POST /api/sales
- DELETE /api/sales/:id
- GET /api/sales/stats
- GET /api/sales?productId=:id

Purchases:

- GET /api/purchases
- GET /api/purchases/:id
- POST /api/purchases
- DELETE /api/purchases/:id
- GET /api/purchases/stats
- GET /api/purchases?productId=:id
  \*/
