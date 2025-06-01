import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Package, Plus, X, CreditCard, Banknote, Printer, UserPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Receipt } from "../../../components/pos/receipt";
import { generateId } from "../../../lib/utils";
import { useAuth } from "../../../contexts/auth-context";
import { useInventory } from "../../../contexts/inventory-context";

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

// Mock customers data
const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567"
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+1 (555) 987-6543"
  }
];

interface CustomerSearchModalProps {
  onClose: () => void;
  onSelect: (customer: Customer) => void;
  onAddNew: () => void;
}

function CustomerSearchModal({ onClose, onSelect, onAddNew }: CustomerSearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredCustomers = MOCK_CUSTOMERS.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Select Customer
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="max-h-60 overflow-y-auto mb-4">
          {filteredCustomers.map((customer) => (
            <div
              key={customer.id}
              className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md cursor-pointer"
              onClick={() => onSelect(customer)}
            >
              <div className="font-medium text-gray-900 dark:text-white">
                {customer.name}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {customer.email} • {customer.phone}
              </div>
            </div>
          ))}

          {filteredCustomers.length === 0 && (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              No customers found
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <Button
            onClick={onAddNew}
            className="w-full flex items-center justify-center"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add New Customer
          </Button>
        </div>
      </div>
    </div>
  );
}

interface PaymentModalProps {
  total: number;
  customer: Customer | null;
  onSelectCustomer: () => void;
  onClose: () => void;
  onComplete: (method: string) => void;
}

function PaymentModal({ total, customer, onSelectCustomer, onClose, onComplete }: PaymentModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Payment
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-500 dark:text-gray-400">Customer</span>
            {customer ? (
              <div className="text-right">
                <div className="font-medium text-gray-900 dark:text-white">
                  {customer.name}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {customer.email}
                </div>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={onSelectCustomer}>
                Select Customer
              </Button>
            )}
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white text-center">
            ${total.toFixed(2)}
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => onComplete("Credit Card")}
            className="w-full flex items-center justify-center"
          >
            <CreditCard className="mr-2 h-5 w-5" />
            Pay with Card
          </Button>
          <Button
            onClick={() => onComplete("Cash")}
            className="w-full flex items-center justify-center"
            variant="outline"
          >
            <Banknote className="mr-2 h-5 w-5" />
            Pay with Cash
          </Button>
        </div>
      </div>
    </div>
  );
}

interface ReceiptModalProps {
  transaction: {
    items: CartItem[];
    subtotal: number;
    tax: number;
    total: number;
    paymentMethod: string;
    transactionId: string;
    date: Date;
    customer?: Customer;
  };
  onClose: () => void;
  onNewTransaction: () => void;
}

function ReceiptModal({ transaction, onClose, onNewTransaction }: ReceiptModalProps) {
  const receiptRef = React.useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const handlePrint = () => {
    if (receiptRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Print Receipt</title>
              <style>
                body {
                  font-family: monospace;
                  margin: 0;
                  padding: 20px;
                  width: 300px;
                }
                pre {
                  white-space: pre-wrap;
                  margin: 0;
                  font-size: 12px;
                  line-height: 1.2;
                }
                @media print {
                  body {
                    width: 80mm;
                  }
                  @page {
                    margin: 0;
                    size: 80mm auto;
                  }
                }
              </style>
            </head>
            <body>
              ${receiptRef.current.innerHTML}
              <script>
                window.onload = function() {
                  window.print();
                  window.close();
                };
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  React.useEffect(() => {
    const timer = setTimeout(handlePrint, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Receipt
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div ref={receiptRef}>
          <Receipt
            {...transaction}
            cashierName={user?.name || "Unknown"}
            storeName="Enterprise Store"
            storeAddress="123 Main St, City, State 12345"
            storePhone="(555) 123-4567"
          />
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <Button onClick={handlePrint} className="flex items-center">
            <Printer className="h-4 w-4 mr-2" />
            Print Again
          </Button>
          <Button onClick={onNewTransaction}>
            New Transaction
          </Button>
        </div>
      </div>
    </div>
  );
}

export function POSPage() {
  const navigate = useNavigate();
  const { items } = useInventory();
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
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

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      item.status !== "out-of-stock"
  );

  const addToCart = (item: typeof items[0]) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find((cartItem) => cartItem.id === item.id);
      
      if (existingItem) {
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
    
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const handlePaymentComplete = (paymentMethod: string) => {
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

  return (
    <div className="h-full flex flex-col">
      <div className="flex-none p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Point of Sale
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Process transactions and manage sales
            </p>
          </div>
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Products Section */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <Card key={item.id} className="relative group">
                <CardContent className="p-4">
                  <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                    <Package className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{item.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.category}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                      ${item.price.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Stock: {item.quantity}
                    </span>
                  </div>
                  <Button
                    onClick={() => addToCart(item)}
                    className="w-full mt-4 bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}

            {filteredItems.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  No products found. Try adjusting your search.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Cart Section */}
        <div className="w-96 border-l border-gray-200 dark:border-gray-700 flex flex-col bg-white dark:bg-gray-800">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <CardTitle className="flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Cart ({cart.length})
            </CardTitle>
          </CardHeader>
          
          <div className="flex-1 overflow-auto p-4">
            {cart.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                Cart is empty
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="text-error-600 hover:text-error-700"
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                <span className="text-gray-900 dark:text-white">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Tax (10%)</span>
                <span className="text-gray-900 dark:text-white">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <span className="text-gray-900 dark:text-white">Total</span>
                <span className="text-primary-600 dark:text-primary-400">${total.toFixed(2)}</span>
              </div>
            </div>

            {selectedCustomer && (
              <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {selectedCustomer.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedCustomer.email}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCustomer(null)}
                  >
                    Change
                  </Button>
                </div>
              </div>
            )}

            <Button
              className="w-full"
              size="lg"
              disabled={cart.length === 0}
              onClick={() => setShowPayment(true)}
            >
              Checkout ({cart.length} items)
            </Button>
          </div>
        </div>
      </div>

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
          total={total}
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
        />
      )}
    </div>
  );
}