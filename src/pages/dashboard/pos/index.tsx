import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package } from "lucide-react";
import { useAuth } from "../../../contexts/auth-context";
import { useInventory, InventoryItem } from "../../../contexts/inventory-context";
import { inventoryService } from "../../../services/inventory.service";
import { useGlobal } from "../../../contexts/global-context";
import { generateId } from "../../../lib/utils";

// Components
import { POSFilters } from "../../../components/pos/pos-filters";
import { ProductGrid } from "../../../components/pos/product-grid";
import { ProductList } from "../../../components/pos/product-list";
import { POSCart } from "../../../components/pos/pos-cart";
import { CustomerSearchModal } from "../../../components/pos/customer-search-modal";
import { PaymentModal } from "../../../components/pos/payment-modal";
import { ReceiptModal } from "../../../components/pos/receipt-modal";

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export function POSPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, setItems } = useInventory();
  const { showError, setIsLoading } = useGlobal();

  // Cart and transaction states
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Modal states
  const [showPayment, setShowPayment] = useState(false);
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<{
    items: CartItem[];
    subtotal: number;
    tax: number;
    total: number;
    paymentMethod: string;
    transactionId: string;
    date: Date;
    customer?: Customer;
  } | null>(null);

  // Filter and view states
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'quantity'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Load inventory items on component mount
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setIsLoading(true);
        const data = await inventoryService.getItems();
        setItems(data);
      } catch (error) {
        showError("Failed to fetch inventory items");
      } finally {
        setIsLoading(false);
      }
    };

    if (items.length === 0) {
      fetchInventory();
    }
  }, [items.length, setItems, setIsLoading, showError]);

  // Get unique categories for filter
  const categories = [...new Set(items.map(item => item.category))];

  // Filter and sort items
  const filteredItems = items
    .filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.sku.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'in-stock' && item.status === 'in-stock') ||
                           (statusFilter === 'low-stock' && item.status === 'low-stock') ||
                           (statusFilter === 'out-of-stock' && item.status === 'out-of-stock');
      
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'quantity':
          aValue = a.quantity;
          bValue = b.quantity;
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const addToCart = (item: InventoryItem) => {
    if (item.status === "out-of-stock") {
      showError("This item is out of stock");
      return;
    }

    setCart((currentCart) => {
      const existingItem = currentCart.find((cartItem) => cartItem.id === item.id);
      
      if (existingItem) {
        if (existingItem.quantity >= item.quantity) {
          showError(`Only ${item.quantity} units available`);
          return currentCart;
        }
        
        return currentCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      
      return [...currentCart, { id: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const inventoryItem = items.find(item => item.id === itemId);
    if (inventoryItem && newQuantity > inventoryItem.quantity) {
      showError(`Only ${inventoryItem.quantity} units available`);
      return;
    }
    
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handlePaymentComplete = (paymentMethod: string) => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    const transaction = {
      items: cart,
      subtotal,
      tax,
      total,
      paymentMethod,
      transactionId: generateId(),
      date: new Date(),
      customer: selectedCustomer || undefined,
    };
    setLastTransaction(transaction);
    setShowPayment(false);
    setShowReceipt(true);
  };

  const handleNewTransaction = () => {
    setShowReceipt(false);
    setLastTransaction(null);
    setCart([]);
    setSelectedCustomer(null);
  };

  const handleAddNewCustomer = () => {
    setShowCustomerSearch(false);
    navigate("/dashboard/customers");
  };

  const handleSortChange = (value: string) => {
    const [field, order] = value.split('-');
    setSortBy(field as 'name' | 'price' | 'quantity');
    setSortOrder(order as 'asc' | 'desc');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-stock":
        return "bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400";
      case "low-stock":
        return "bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-400";
      case "out-of-stock":
        return "bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-none p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Point of Sale
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Process transactions and manage sales
            </p>
          </div>
          
          <POSFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
            categories={categories}
            filteredCount={filteredItems.length}
            totalCount={items.length}
          />
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Products Section */}
        <div className="flex-1 overflow-auto p-6">
          {viewMode === 'grid' ? (
            <ProductGrid
              items={filteredItems}
              onAddToCart={addToCart}
              getStatusColor={getStatusColor}
            />
          ) : (
            <ProductList
              items={filteredItems}
              onAddToCart={addToCart}
              getStatusColor={getStatusColor}
            />
          )}

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
                No products found
              </p>
              <p className="text-gray-400 dark:text-gray-500">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>

        {/* Cart Section */}
        <div className="w-96 border-l border-gray-200 dark:border-gray-700 flex flex-col bg-white dark:bg-gray-800">
          <POSCart
            cart={cart}
            onUpdateQuantity={updateQuantity}
            onRemoveFromCart={removeFromCart}
            selectedCustomer={selectedCustomer}
            onSelectCustomer={() => setShowCustomerSearch(true)}
            onCheckout={() => setShowPayment(true)}
          />
        </div>
      </div>

      {/* Modals */}
      {showCustomerSearch && (
        <CustomerSearchModal
          onClose={() => setShowCustomerSearch(false)}
          onSelect={(customer) => {
            setSelectedCustomer(customer);
            setShowCustomerSearch(false);
          }}
          onAddNew={handleAddNewCustomer}
        />
      )}

      {showPayment && (
        <PaymentModal
          total={cart.reduce((sum, item) => sum + item.price * item.quantity, 0) * 1.1}
          customer={selectedCustomer}
          onSelectCustomer={() => setShowCustomerSearch(true)}
          onClose={() => setShowPayment(false)}
          onComplete={handlePaymentComplete}
        />
      )}

      {showReceipt && lastTransaction && (
        <ReceiptModal
          transaction={lastTransaction}
          onClose={() => setShowReceipt(false)}
          onNewTransaction={handleNewTransaction}
          cashierName={user?.firstName || "Unknown"}
        />
      )}
    </div>
  );
}