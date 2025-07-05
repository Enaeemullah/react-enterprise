// Epson ESC/POS Printer Utility Functions
export class EpsonPrinter {
  private static readonly ESC = '\x1B';
  private static readonly GS = '\x1D';
  private static readonly LF = '\x0A';
  private static readonly CR = '\x0D';

  // ESC/POS Commands
  static readonly commands = {
    // Printer initialization
    init: '\x1B\x40',
    
    // Text formatting
    bold: '\x1B\x45\x01',
    boldOff: '\x1B\x45\x00',
    underline: '\x1B\x2D\x01',
    underlineOff: '\x1B\x2D\x00',
    doubleHeight: '\x1B\x21\x10',
    doubleWidth: '\x1B\x21\x20',
    doubleSize: '\x1B\x21\x30',
    normal: '\x1B\x21\x00',
    
    // Text alignment
    alignLeft: '\x1B\x61\x00',
    alignCenter: '\x1B\x61\x01',
    alignRight: '\x1B\x61\x02',
    
    // Line spacing
    defaultLineSpacing: '\x1B\x32',
    setLineSpacing: (n: number) => `\x1B\x33${String.fromCharCode(n)}`,
    
    // Paper handling
    lineFeed: '\x0A',
    formFeed: '\x0C',
    carriageReturn: '\x0D',
    cutPaper: '\x1D\x56\x00',
    cutPaperPartial: '\x1D\x56\x01',
    
    // Cash drawer
    openDrawer: '\x1B\x70\x00\x19\xFA',
    
    // Character sets
    selectCharacterSet: (n: number) => `\x1B\x52${String.fromCharCode(n)}`,
    selectCodeTable: (n: number) => `\x1B\x74${String.fromCharCode(n)}`,
  };

  // Format text to fit receipt width (default 42 chars for 80mm paper)
  static formatText(text: string, width: number = 42): string {
    return text.length > width ? text.substring(0, width - 3) + '...' : text;
  }

  // Center text within specified width
  static centerText(text: string, width: number = 42): string {
    const padding = Math.max(0, Math.floor((width - text.length) / 2));
    return ' '.repeat(padding) + text;
  }

  // Right align text
  static rightAlign(text: string, width: number = 42): string {
    const padding = Math.max(0, width - text.length);
    return ' '.repeat(padding) + text;
  }

  // Create a line with text on left and right
  static createLine(left: string, right: string, width: number = 42): string {
    const availableSpace = width - left.length - right.length;
    const padding = Math.max(1, availableSpace);
    return left + ' '.repeat(padding) + right;
  }

  // Generate divider line
  static divider(char: string = '=', width: number = 42): string {
    return char.repeat(width);
  }

  // Format currency
  static formatCurrency(amount: number, symbol: string = '$'): string {
    return `${symbol}${amount.toFixed(2)}`;
  }

  // Generate receipt header
  static generateHeader(storeName: string, address: string, phone: string): string {
    let header = this.commands.init;
    header += this.commands.alignCenter;
    header += this.commands.bold;
    header += this.commands.doubleHeight;
    header += storeName.toUpperCase() + this.commands.lineFeed;
    header += this.commands.normal;
    header += this.commands.boldOff;
    header += address + this.commands.lineFeed;
    header += `Tel: ${phone}` + this.commands.lineFeed;
    header += this.commands.lineFeed;
    header += this.commands.alignLeft;
    return header;
  }

  // Generate receipt footer
  static generateFooter(): string {
    let footer = this.commands.alignCenter;
    footer += this.commands.lineFeed;
    footer += 'Thank you for your purchase!' + this.commands.lineFeed;
    footer += 'Please keep this receipt' + this.commands.lineFeed;
    footer += 'for warranty and returns' + this.commands.lineFeed;
    footer += this.commands.lineFeed;
    footer += '* * * * * * * * * *' + this.commands.lineFeed;
    footer += this.commands.lineFeed;
    footer += this.commands.lineFeed;
    footer += this.commands.cutPaper;
    return footer;
  }

  // Print via Web Serial API (Chrome/Edge)
  static async printViaSerial(content: string): Promise<void> {
    try {
      if (!('serial' in navigator)) {
        throw new Error('Web Serial API not supported');
      }

      const port = await (navigator as any).serial.requestPort({
        filters: [
          { usbVendorId: 0x04b8 }, // Epson vendor ID
        ]
      });

      await port.open({ 
        baudRate: 9600,
        dataBits: 8,
        stopBits: 1,
        parity: 'none',
        flowControl: 'none'
      });

      const writer = port.writable.getWriter();
      const encoder = new TextEncoder();
      
      await writer.write(encoder.encode(content));
      
      writer.releaseLock();
      await port.close();
    } catch (error) {
      console.error('Serial printing failed:', error);
      throw error;
    }
  }

  // Print via USB (WebUSB API)
  static async printViaUSB(content: string): Promise<void> {
    try {
      if (!('usb' in navigator)) {
        throw new Error('WebUSB API not supported');
      }

      const device = await (navigator as any).usb.requestDevice({
        filters: [
          { vendorId: 0x04b8 }, // Epson vendor ID
        ]
      });

      await device.open();
      await device.selectConfiguration(1);
      await device.claimInterface(0);

      const encoder = new TextEncoder();
      const data = encoder.encode(content);

      await device.transferOut(1, data);
      
      await device.close();
    } catch (error) {
      console.error('USB printing failed:', error);
      throw error;
    }
  }

  // Fallback print method using browser print dialog
  static printViaBrowser(content: string): void {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Receipt</title>
            <style>
              body {
                font-family: 'Courier New', monospace;
                font-size: 12px;
                line-height: 1.2;
                margin: 0;
                padding: 5mm;
                width: 80mm;
                background: white;
                color: black;
              }
              pre {
                white-space: pre-wrap;
                margin: 0;
                font-family: inherit;
                font-size: inherit;
              }
              @media print {
                body {
                  width: 80mm;
                  margin: 0;
                  padding: 2mm;
                }
                @page {
                  size: 80mm auto;
                  margin: 0;
                }
              }
            </style>
          </head>
          <body>
            <pre>${content}</pre>
            <script>
              window.onload = function() {
                setTimeout(() => {
                  window.print();
                  setTimeout(() => window.close(), 1000);
                }, 100);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  }

  // Main print method with fallbacks
  static async print(content: string): Promise<void> {
    try {
      // Try Web Serial API first (most reliable for Epson printers)
      await this.printViaSerial(content);
    } catch (serialError) {
      try {
        // Try WebUSB as fallback
        await this.printViaUSB(content);
      } catch (usbError) {
        // Use browser print dialog as final fallback
        console.warn('Direct printer access failed, using browser print dialog');
        this.printViaBrowser(content);
      }
    }
  }
}

// Receipt formatting utilities
export class ReceiptFormatter {
  private width: number;

  constructor(width: number = 42) {
    this.width = width;
  }

  // Format item line for receipt
  formatItemLine(name: string, quantity: number, price: number, total: number): string {
    const maxNameLength = Math.floor(this.width * 0.5);
    const truncatedName = EpsonPrinter.formatText(name, maxNameLength);
    const totalStr = EpsonPrinter.formatCurrency(total);
    
    // First line: item name and total
    const line1 = truncatedName.padEnd(maxNameLength) + 
                  EpsonPrinter.rightAlign(totalStr, this.width - maxNameLength);
    
    // Second line: quantity and unit price (indented)
    const qtyPrice = `  ${quantity}x @ ${EpsonPrinter.formatCurrency(price)}`;
    
    return line1 + EpsonPrinter.commands.lineFeed + qtyPrice;
  }

  // Format transaction details
  formatTransactionInfo(transactionId: string, date: Date, cashier: string): string {
    const dateStr = date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(/\//g, '-');

    let info = EpsonPrinter.divider('=', this.width) + EpsonPrinter.commands.lineFeed;
    info += `Date: ${dateStr}` + EpsonPrinter.commands.lineFeed;
    info += `Receipt #: ${transactionId}` + EpsonPrinter.commands.lineFeed;
    info += `Cashier: ${cashier}` + EpsonPrinter.commands.lineFeed;
    info += EpsonPrinter.divider('=', this.width) + EpsonPrinter.commands.lineFeed;
    
    return info;
  }

  // Format totals section
  formatTotals(subtotal: number, tax: number, total: number): string {
    let totals = EpsonPrinter.divider('-', this.width) + EpsonPrinter.commands.lineFeed;
    totals += EpsonPrinter.createLine('Subtotal:', EpsonPrinter.formatCurrency(subtotal), this.width) + EpsonPrinter.commands.lineFeed;
    totals += EpsonPrinter.createLine('Tax:', EpsonPrinter.formatCurrency(tax), this.width) + EpsonPrinter.commands.lineFeed;
    totals += EpsonPrinter.divider('=', this.width) + EpsonPrinter.commands.lineFeed;
    totals += EpsonPrinter.commands.bold;
    totals += EpsonPrinter.createLine('TOTAL:', EpsonPrinter.formatCurrency(total), this.width) + EpsonPrinter.commands.lineFeed;
    totals += EpsonPrinter.commands.boldOff;
    totals += EpsonPrinter.divider('=', this.width) + EpsonPrinter.commands.lineFeed;
    
    return totals;
  }
}