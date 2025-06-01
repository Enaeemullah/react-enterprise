export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Redmatic. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}