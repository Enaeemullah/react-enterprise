import React from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="space-y-6">
          {/* 404 Text */}
          <h1 className="text-9xl font-bold text-primary-600 dark:text-primary-400">
            404
          </h1>
          
          {/* Error Message */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Page Not Found
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Sorry, we couldn't find the page you're looking for. Perhaps you've mistyped the URL or the page has been moved.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="w-full sm:w-auto flex items-center justify-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
            
            <Link to="/" className="w-full sm:w-auto">
              <Button className="w-full flex items-center justify-center">
                <Home className="mr-2 h-4 w-4" />
                Return Home
              </Button>
            </Link>
          </div>

          {/* Help Links */}
          <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Need assistance? Try these:
            </p>
            <div className="mt-2 flex items-center justify-center space-x-4 text-sm">
              <Link
                to="/contact"
                className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
              >
                Contact Support
              </Link>
              <span className="text-gray-300 dark:text-gray-700">|</span>
              <Link
                to="/help"
                className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
              >
                Help Center
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}