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
  // Format date for receipt (Epson compatible)
  const formatReceiptDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(date).replace(/\//g, '-');
  };

  // Truncate text to fit receipt width (42 characters for 80mm paper)
  const truncateText = (text: string, maxLength: number = 42) => {
    return text.length > maxLength ? text.substring(0, maxLength - 3) + '...' : text;
  };

  // Center text within specified width
  const centerText = (text: string, width: number = 42) => {
    const padding = Math.max(0, Math.floor((width - text.length) / 2));
    return ' '.repeat(padding) + text;
  };

  // Right align text
  const rightAlign = (text: string, width: number = 42) => {
    const padding = Math.max(0, width - text.length);
    return ' '.repeat(padding) + text;
  };

  // Format currency for receipt
  const formatCurrency = (amount: number) => {
    return amount.toFixed(2);
  };

  // Create item line with proper spacing
  const formatItemLine = (name: string, qty: number, price: number, total: number) => {
    const maxNameLength = 20;
    const truncatedName = truncateText(name, maxNameLength);
    const qtyStr = `${qty}x`;
    const priceStr = `$${formatCurrency(price)}`;
    const totalStr = `$${formatCurrency(total)}`;
    
    // First line: item name and total
    const line1 = truncatedName.padEnd(maxNameLength) + rightAlign(totalStr, 22);
    
    // Second line: quantity and unit price (indented)
    const line2 = `  ${qtyStr} @ ${priceStr}`;
    
    return `${line1}\n${line2}`;
  };

  // Generate ESC/POS compatible receipt content
  const generateReceiptContent = () => {
    const width = 42;
    const divider = '='.repeat(width);
    const lightDivider = '-'.repeat(width);
    
    let content = '';
    
    // Header - Store Info (Centered and Bold)
    content += centerText(storeName.toUpperCase()) + '\n';
    content += centerText(storeAddress) + '\n';
    content += centerText(`Tel: ${storePhone}`) + '\n';
    content += '\n';
    content += divider + '\n';
    
    // Transaction Info
    content += `Date: ${formatReceiptDate(date)}\n`;
    content += `Receipt #: ${transactionId}\n`;
    content += `Cashier: ${cashierName}\n`;
    content += divider + '\n';
    content += '\n';
    
    // Items Header
    content += 'ITEMS:\n';
    content += lightDivider + '\n';
    
    // Items List
    items.forEach(item => {
      const itemTotal = item.quantity * item.price;
      content += formatItemLine(item.name, item.quantity, item.price, itemTotal) + '\n';
    });
    
    content += lightDivider + '\n';
    content += '\n';
    
    // Totals Section
    const subtotalLine = 'Subtotal:'.padEnd(30) + rightAlign(`$${formatCurrency(subtotal)}`, 12);
    const taxLine = 'Tax:'.padEnd(30) + rightAlign(`$${formatCurrency(tax)}`, 12);
    const totalLine = 'TOTAL:'.padEnd(30) + rightAlign(`$${formatCurrency(total)}`, 12);
    
    content += subtotalLine + '\n';
    content += taxLine + '\n';
    content += divider + '\n';
    content += totalLine + '\n';
    content += divider + '\n';
    content += '\n';
    
    // Payment Info
    content += `Payment Method: ${paymentMethod}\n`;
    content += '\n';
    content += divider + '\n';
    content += '\n';
    
    // Footer Message (Centered)
    content += centerText('Thank you for your purchase!') + '\n';
    content += centerText('Please keep this receipt') + '\n';
    content += centerText('for warranty and returns') + '\n';
    content += '\n';
    content += centerText('* * * * * * * * * *') + '\n';
    content += '\n';
    content += '\n';
    content += '\n'; // Extra lines for paper cutting
    
    return content;
  };

  const receiptContent = generateReceiptContent();

  // ESC/POS Commands for Epson printers
  const escPosCommands = {
    init: '\x1B\x40', // Initialize printer
    bold: '\x1B\x45\x01', // Bold on
    boldOff: '\x1B\x45\x00', // Bold off
    center: '\x1B\x61\x01', // Center alignment
    left: '\x1B\x61\x00', // Left alignment
    right: '\x1B\x61\x02', // Right alignment
    cut: '\x1D\x56\x00', // Cut paper
    doubleHeight: '\x1B\x21\x10', // Double height
    normal: '\x1B\x21\x00', // Normal text
    lineFeed: '\x0A', // Line feed
  };

  // Generate ESC/POS command string for direct printer communication
  const generateEscPosCommands = () => {
    let commands = '';
    
    commands += escPosCommands.init; // Initialize
    commands += escPosCommands.center; // Center alignment
    commands += escPosCommands.bold; // Bold on
    commands += escPosCommands.doubleHeight; // Double height
    commands += storeName.toUpperCase() + escPosCommands.lineFeed;
    commands += escPosCommands.normal; // Normal text
    commands += escPosCommands.boldOff; // Bold off
    commands += storeAddress + escPosCommands.lineFeed;
    commands += `Tel: ${storePhone}` + escPosCommands.lineFeed;
    commands += escPosCommands.lineFeed;
    
    commands += escPosCommands.left; // Left alignment
    commands += '='.repeat(42) + escPosCommands.lineFeed;
    commands += `Date: ${formatReceiptDate(date)}` + escPosCommands.lineFeed;
    commands += `Receipt #: ${transactionId}` + escPosCommands.lineFeed;
    commands += `Cashier: ${cashierName}` + escPosCommands.lineFeed;
    commands += '='.repeat(42) + escPosCommands.lineFeed;
    commands += escPosCommands.lineFeed;
    
    // Items
    commands += 'ITEMS:' + escPosCommands.lineFeed;
    commands += '-'.repeat(42) + escPosCommands.lineFeed;
    
    items.forEach(item => {
      const itemTotal = item.quantity * item.price;
      const line1 = truncateText(item.name, 20).padEnd(20) + rightAlign(`$${formatCurrency(itemTotal)}`, 22);
      const line2 = `  ${item.quantity}x @ $${formatCurrency(item.price)}`;
      commands += line1 + escPosCommands.lineFeed;
      commands += line2 + escPosCommands.lineFeed;
    });
    
    commands += '-'.repeat(42) + escPosCommands.lineFeed;
    commands += escPosCommands.lineFeed;
    
    // Totals
    commands += 'Subtotal:'.padEnd(30) + rightAlign(`$${formatCurrency(subtotal)}`, 12) + escPosCommands.lineFeed;
    commands += 'Tax:'.padEnd(30) + rightAlign(`$${formatCurrency(tax)}`, 12) + escPosCommands.lineFeed;
    commands += '='.repeat(42) + escPosCommands.lineFeed;
    commands += escPosCommands.bold;
    commands += 'TOTAL:'.padEnd(30) + rightAlign(`$${formatCurrency(total)}`, 12) + escPosCommands.lineFeed;
    commands += escPosCommands.boldOff;
    commands += '='.repeat(42) + escPosCommands.lineFeed;
    commands += escPosCommands.lineFeed;
    
    // Payment
    commands += `Payment Method: ${paymentMethod}` + escPosCommands.lineFeed;
    commands += escPosCommands.lineFeed;
    commands += '='.repeat(42) + escPosCommands.lineFeed;
    commands += escPosCommands.lineFeed;
    
    // Footer
    commands += escPosCommands.center;
    commands += 'Thank you for your purchase!' + escPosCommands.lineFeed;
    commands += 'Please keep this receipt' + escPosCommands.lineFeed;
    commands += 'for warranty and returns' + escPosCommands.lineFeed;
    commands += escPosCommands.lineFeed;
    commands += '* * * * * * * * * *' + escPosCommands.lineFeed;
    commands += escPosCommands.lineFeed;
    commands += escPosCommands.lineFeed;
    commands += escPosCommands.lineFeed;
    
    commands += escPosCommands.cut; // Cut paper
    
    return commands;
  };

  // Function to send to Epson printer (for web apps with printer access)
  const printToEpsonPrinter = async () => {
    try {
      // For modern browsers with Web Serial API or USB access
      if ('serial' in navigator) {
        const port = await (navigator as any).serial.requestPort();
        await port.open({ baudRate: 9600 });
        
        const writer = port.writable.getWriter();
        const encoder = new TextEncoder();
        const commands = generateEscPosCommands();
        
        await writer.write(encoder.encode(commands));
        writer.releaseLock();
        await port.close();
      } else {
        // Fallback: Open print dialog with formatted content
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head>
                <title>Receipt</title>
                <style>
                  body {
                    font-family: 'Courier New', monospace;
                    font-size: 12px;
                    line-height: 1.2;
                    margin: 0;
                    padding: 10px;
                    width: 80mm;
                    background: white;
                  }
                  pre {
                    white-space: pre-wrap;
                    margin: 0;
                    font-family: inherit;
                  }
                  @media print {
                    body {
                      width: 80mm;
                      margin: 0;
                      padding: 0;
                    }
                    @page {
                      size: 80mm auto;
                      margin: 0;
                    }
                  }
                </style>
              </head>
              <body>
                <pre>${receiptContent}</pre>
                <script>
                  window.onload = function() {
                    window.print();
                    setTimeout(() => window.close(), 1000);
                  };
                </script>
              </body>
            </html>
          `);
          printWindow.document.close();
        }
      }
    } catch (error) {
      console.error('Printing failed:', error);
      // Fallback to browser print
      window.print();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 font-mono text-xs leading-tight max-w-sm mx-auto border">
      {/* Preview of the receipt */}
      <div className="bg-white p-4 border border-gray-300 rounded">
        <pre className="whitespace-pre-wrap text-xs font-mono leading-tight">
          {receiptContent}
        </pre>
      </div>
      
      {/* Print button for Epson printer */}
      <div className="mt-4 text-center">
        <button
          onClick={printToEpsonPrinter}
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
        >
          Print to Epson Printer
        </button>
      </div>
      
      {/* Hidden div for ESC/POS commands (for debugging) */}
      <div className="hidden" id="escpos-commands">
        {generateEscPosCommands()}
      </div>
    </div>
  );
}