import React, { useState } from 'react';
import { Calendar, TrendingUp, Package, DollarSign, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { useTranslation } from 'react-i18next';
import { SalesChart } from './components/sales-chart';
import { InventoryChart } from './components/inventory-chart';
import { RevenueChart } from './components/revenue-chart';
import { CustomerChart } from './components/customer-chart';

const timeRanges = [
  { id: 'day', label: 'Today' },
  { id: 'week', label: 'This Week' },
  { id: 'month', label: 'This Month' },
  { id: 'year', label: 'This Year' },
];

const reportTypes = [
  { id: 'sales', label: 'Sales', icon: TrendingUp },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'revenue', label: 'Revenue', icon: DollarSign },
  { id: 'customers', label: 'Customers', icon: Users },
];

export function ReportsPage() {
  const { t } = useTranslation();
  const [selectedTimeRange, setSelectedTimeRange] = useState('month');
  const [selectedReport, setSelectedReport] = useState('sales');
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });

  const renderChart = () => {
    switch (selectedReport) {
      case 'sales':
        return <SalesChart timeRange={selectedTimeRange} />;
      case 'inventory':
        return <InventoryChart timeRange={selectedTimeRange} />;
      case 'revenue':
        return <RevenueChart timeRange={selectedTimeRange} />;
      case 'customers':
        return <CustomerChart timeRange={selectedTimeRange} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('reports.title')}
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {t('reports.description')}
        </p>
      </div>

      {/* Report Type Selection */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {reportTypes.map((type) => (
          <Card
            key={type.id}
            className={`cursor-pointer transition-colors ${
              selectedReport === type.id
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            onClick={() => setSelectedReport(type.id)}
          >
            <CardContent className="p-4 flex items-center space-x-4">
              <div className={`rounded-lg p-2 ${
                selectedReport === type.id
                  ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              }`}>
                <type.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {type.label}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t(`reports.${type.id}Description`)}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Time Range Selection */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t('reports.timeRange')}</CardTitle>
            <div className="flex items-center space-x-2">
              {timeRanges.map((range) => (
                <Button
                  key={range.id}
                  variant={selectedTimeRange === range.id ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTimeRange(range.id)}
                >
                  {t(`reports.${range.id}`)}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="flex items-center"
                onClick={() => setSelectedTimeRange('custom')}
              >
                <Calendar className="h-4 w-4 mr-2" />
                {t('reports.custom')}
              </Button>
            </div>
          </div>
        </CardHeader>
        {selectedTimeRange === 'custom' && (
          <CardContent>
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('reports.startDate')}
                </label>
                <input
                  type="date"
                  value={customDateRange.start}
                  onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('reports.endDate')}
                </label>
                <input
                  type="date"
                  value={customDateRange.end}
                  onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Chart Display */}
      <Card>
        <CardContent className="p-6">
          {renderChart()}
        </CardContent>
      </Card>
    </div>
  );
}