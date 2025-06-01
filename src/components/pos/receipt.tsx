import React from "react";

interface ReceiptItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface ReceiptProps {
  items: ReceiptItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  transactionId: string;
  date: Date;
  cashierName: string;
  storeName: string;
  storeAddress: string;
  storePhone: string;
}

export function Receipt({
  items,
  subtotal,
  tax,
  total,
  paymentMethod,
  transactionId,
  date,
  cashierName,
  storeName,
  storeAddress,
  storePhone,
}: ReceiptProps) {
  // Format date for receipt
  const formatReceiptDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  // Create divider line
  const dividerLine = "-".repeat(40);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 font-mono text-sm leading-tight" style={{ maxWidth: '300px', margin: '0 auto' }}>
      <pre className="whitespace-pre-wrap break-words">
{`
${storeName.toUpperCase()}
${storeAddress}
Tel: ${storePhone}

${dividerLine}
Date: ${formatReceiptDate(date)}
Trans ID: ${transactionId}
Cashier: ${cashierName}
${dividerLine}

${items.map(item => `
${item.name}
  ${item.quantity} x $${item.price.toFixed(2)}
${(item.quantity * item.price).toFixed(2).padStart(40)}`).join('')}

${dividerLine}

${"Subtotal:".padEnd(30)}$${subtotal.toFixed(2)}
${"Tax:".padEnd(30)}$${tax.toFixed(2)}
${dividerLine}
${"TOTAL:".padEnd(30)}$${total.toFixed(2)}

Payment Method: ${paymentMethod}
${dividerLine}

       Thank you for your purchase!
    Please keep this receipt for your
         warranty and returns

         * * * * * * * * * *
`}</pre>
    </div>
  );
}