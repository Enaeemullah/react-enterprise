import React, { useRef, useEffect, useState } from 'react';
import { Camera, X, Flashlight, FlashlightOff } from 'lucide-react';
import { Button } from './button';

interface BarcodeScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (barcode: string) => void;
  title?: string;
}

export function BarcodeScanner({ isOpen, onClose, onScan, title = "Scan Barcode" }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasFlash, setHasFlash] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    try {
      setError(null);
      setIsScanning(true);

      // Request camera access with back camera preference
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' }, // Prefer back camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();

        // Check if flash is available
        const track = mediaStream.getVideoTracks()[0];
        const capabilities = track.getCapabilities();
        setHasFlash(!!capabilities.torch);

        // Start scanning when video is ready
        videoRef.current.onloadedmetadata = () => {
          startBarcodeDetection();
        };
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please ensure camera permissions are granted.');
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }

    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }

    setIsScanning(false);
    setFlashOn(false);
  };

  const toggleFlash = async () => {
    if (!stream || !hasFlash) return;

    try {
      const track = stream.getVideoTracks()[0];
      await track.applyConstraints({
        advanced: [{ torch: !flashOn }]
      });
      setFlashOn(!flashOn);
    } catch (err) {
      console.error('Error toggling flash:', err);
    }
  };

  const startBarcodeDetection = () => {
    if (!videoRef.current || !canvasRef.current) return;

    // Simple barcode detection simulation
    // In a real implementation, you would use a library like QuaggaJS or ZXing
    scanIntervalRef.current = setInterval(() => {
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (ctx && video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0);

          // Simulate barcode detection
          // In a real app, you would process the canvas data to detect barcodes
          // For demo purposes, we'll simulate finding a barcode after a few seconds
          if (Math.random() < 0.1) { // 10% chance per scan
            const simulatedBarcode = generateSimulatedBarcode();
            handleBarcodeDetected(simulatedBarcode);
          }
        }
      }
    }, 500); // Scan every 500ms
  };

  const generateSimulatedBarcode = () => {
    // Generate a random barcode for demo purposes
    const barcodes = [
      '1234567890123',
      '9876543210987',
      'ABC123DEF456',
      'SKU001234567',
      'PROD789012345'
    ];
    return barcodes[Math.floor(Math.random() * barcodes.length)];
  };

  const handleBarcodeDetected = (barcode: string) => {
    onScan(barcode);
    stopCamera();
    onClose();
  };

  const handleManualInput = () => {
    const barcode = prompt('Enter barcode manually:');
    if (barcode && barcode.trim()) {
      handleBarcodeDetected(barcode.trim());
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="relative w-full h-full max-w-md mx-auto bg-black">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-black bg-opacity-50 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white text-lg font-medium">{title}</h3>
            <div className="flex items-center space-x-2">
              {hasFlash && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFlash}
                  className="text-white hover:bg-white hover:bg-opacity-20"
                >
                  {flashOn ? (
                    <FlashlightOff className="h-5 w-5" />
                  ) : (
                    <Flashlight className="h-5 w-5" />
                  )}
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white hover:bg-opacity-20"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Camera View */}
        <div className="relative w-full h-full">
          {error ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <Camera className="h-16 w-16 text-gray-400 mb-4" />
              <p className="text-white text-lg mb-2">Camera Error</p>
              <p className="text-gray-300 text-sm mb-6">{error}</p>
              <Button onClick={handleManualInput} className="mb-4">
                Enter Barcode Manually
              </Button>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                muted
              />
              <canvas
                ref={canvasRef}
                className="hidden"
              />
              
              {/* Scanning Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Scanning Frame */}
                  <div className="w-64 h-40 border-2 border-white border-opacity-50 relative">
                    {/* Corner indicators */}
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-white"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-white"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-white"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-white"></div>
                    
                    {/* Scanning line animation */}
                    {isScanning && (
                      <div className="absolute inset-x-0 top-0 h-0.5 bg-red-500 animate-pulse"></div>
                    )}
                  </div>
                  
                  <p className="text-white text-center mt-4 text-sm">
                    Position barcode within the frame
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-black bg-opacity-50">
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              onClick={handleManualInput}
              className="bg-white bg-opacity-20 text-white border-white border-opacity-30 hover:bg-opacity-30"
            >
              Manual Input
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="bg-white bg-opacity-20 text-white border-white border-opacity-30 hover:bg-opacity-30"
            >
              Cancel
            </Button>
          </div>
          
          {isScanning && (
            <p className="text-center text-white text-xs mt-3 opacity-75">
              Scanning for barcodes...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}