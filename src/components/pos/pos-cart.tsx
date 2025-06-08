import React from "react";
import { ShoppingCart, X } from "lucide-react";
import { CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";

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

interface POSCartProps {
  cart: CartItem[];
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveFromCart: (itemId: string) => void;
  selectedCustomer: Customer | null;
  onSelectCustomer: () => void;
  onCheckout: () => void;
}

export function POSCart({
  cart,
  onUpdateQuantity,
  onRemoveFromCart,
  selectedCustomer,
  onSelectCustomer,
  onCheckout,
}: POSCartProps) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  return (
    <>
      <CardHeader className="border-b border-gray-200 dark:border-gray-700">
        <CardTitle className="flex items-center">
          <ShoppingCart className="h-5 w-5 mr-2" />
          Cart ({cart.length})
        </CardTitle>
      </CardHeader>
      
      <div className="flex-1 overflow-auto p-4">
        {cart.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Cart is empty</p>
            <p className="text-sm mt-1">Add items to get started</p>
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
                    ${item.price.toFixed(2)} each
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Total: ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    className="h-8 w-8 p-0"
                  >
                    -
                  </Button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="h-8 w-8 p-0"
                  >
                    +
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveFromCart(item.id)}
                    className="text-error-600 hover:text-error-700 h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
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
                onClick={onSelectCustomer}
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
          onClick={onCheckout}
        >
          Checkout ({cart.length} items)
        </Button>
      </div>
    </>
  );
}