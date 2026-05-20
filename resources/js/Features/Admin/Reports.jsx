import { formatRupiah } from "@/Utils/currency";
import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { 
    TrendingUp, 
    ShoppingBag, 
    DollarSign, 
    Calendar, 
    Filter,
    BarChart3,
    ArrowUpRight,
    Award,
    Clock,
    Download
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    AreaChart,
    Area,
} from 'recharts';

export default function Reports({ stats, bestSellingProducts, chartData, orders, filters, availableYears }) {
    const { translations } = usePage().props;
    const a = translations?.admin ?? {};
    const months = [
        { value: 'all', label: a.all_months ?? 'All Months' },
        { value: '01', label: a.january ?? 'January' },
        { value: '02', label: a.february ?? 'February' },
        { value: '03', label: a.march ?? 'March' },
        { value: '04', label: a.april ?? 'April' },
        { value: '05', label: a.may ?? 'May' },
        { value: '06', label: a.june ?? 'June' },
        { value: '07', label: a.july ?? 'July' },
        { value: '08', label: a.august ?? 'August' },
        { value: '09', label: a.september ?? 'September' },
        { value: '10', label: a.october ?? 'October' },
        { value: '11', label: a.november ?? 'November' },
        { value: '12', label: a.december ?? 'December' },
    ];

    const days = Array.from({ length: 31 }, (_, i) => {
        const val = String(i + 1).padStart(2, '0');
        return { value: val, label: val };
    });

    const currentMonthLabel = months.find(m => m.value === filters.month)?.label || (a.all_months ?? 'All Months');

    const handleExport = () => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
        window.open(route('admin.reports.export') + '?' + params.toString(), '_blank');
    };

    // Format chart data for recharts
    const formattedChartData = chartData.map(data => {
        let name, fullName;
        if (filters.year === 'lifetime') {
            name = `${data.label}`;
            fullName = `Year ${data.label}`;
        } else if (filters.month === 'all') {
            name = months.find(m => parseInt(m.value) === data.label)?.label.slice(0, 3);
            fullName = months.find(m => parseInt(m.value) === data.label)?.label;
        } else {
            name = `Day ${data.label}`;
            fullName = `Day ${data.label}`;
        }
        return {
            name,
            revenue: parseFloat(data.value),
            fullName,
        };
    });

    // Custom tooltip for the chart
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
                    <p className="font-bold text-gray-900">{payload[0].payload.fullName}</p>
                    <p className="text-green-600 font-semibold">{formatRupiah(payload[0].value)}</p>
                </div>
            );
        }
        return null;
    };

    const handleFilterChange = (key, value) => {
        router.get(route('admin.reports.index'), {
            ...filters,
            [key]: value
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    return (
        <AdminLayout>
            <Head title={a.performance_reports ?? "Performance Reports"} />
            
            <div className="p-6 md:p-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 border-l-4 border-orange-500 pl-4 italic">
                            {a.performance_analytics ?? "Performance Analytics"}
                        </h1>
                        <p className="text-gray-600 mt-2 font-medium">
                            {a.monitoring_label ?? "Monitoring"} <span className="text-orange-600">{filters.year === 'lifetime' ? (a.all_time ?? 'All Time') : `${currentMonthLabel} ${filters.year}`}</span> {a.performance_label ?? "store performance"}
                        </p>
                    </div>

                    {/* Filter Controls */}
                    <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-2 px-3 text-gray-500">
                            <Filter size={18} />
                            <span className="text-sm font-bold uppercase tracking-wider">{a.filters ?? "Filters"}</span>
                        </div>
                        
                        <select 
                            value={filters.month}
                            onChange={(e) => handleFilterChange('month', e.target.value)}
                            className="bg-gray-50 border-none rounded-xl text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-orange-500 transition-all cursor-pointer"
                        >
                            {months.map(m => (
                                <option key={m.value} value={m.value}>{m.label}</option>
                            ))}
                        </select>

                        {filters.month !== 'all' && filters.year !== 'lifetime' && (
                            <select 
                                value={filters.day || 'all'}
                                onChange={(e) => handleFilterChange('day', e.target.value)}
                                className="bg-gray-50 border-none rounded-xl text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-orange-500 transition-all cursor-pointer"
                            >
                                <option value="all">{a.all_days ?? "All Days"}</option>
                                {days.map(d => (
                                    <option key={d.value} value={d.value}>{d.label}</option>
                                ))}
                            </select>
                        )}

                        <select 
                            value={filters.year}
                            onChange={(e) => handleFilterChange('year', e.target.value)}
                            className="bg-gray-50 border-none rounded-xl text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-orange-500 transition-all cursor-pointer"
                        >
                            <option value="lifetime">{a.lifetime ?? "Lifetime"}</option>
                            {availableYears.length > 0 ? availableYears.map(y => (
                                <option key={y} value={y}>{y}</option>
                            )) : (
                                <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
                            )}
                        </select>

                        <div className="flex items-center gap-2">
                            <input
                                type="date"
                                value={filters.date || ''}
                                onChange={(e) => {
                                    router.get(route('admin.reports.index'), {
                                        ...filters,
                                        date: e.target.value,
                                        end_date: '',
                                    }, { preserveState: true, preserveScroll: true });
                                }}
                                className="bg-gray-50 border border-gray-200 rounded-xl text-sm px-3 py-2 focus:ring-2 focus:ring-orange-500 transition-all"
                            />
                            {filters.date && (
                                <>
                                    <span className="text-gray-400">—</span>
                                    <input
                                        type="date"
                                        value={filters.end_date || ''}
                                        onChange={(e) => {
                                            router.get(route('admin.reports.index'), {
                                                ...filters,
                                                end_date: e.target.value,
                                            }, { preserveState: true, preserveScroll: true });
                                        }}
                                        className="bg-gray-50 border border-gray-200 rounded-xl text-sm px-3 py-2 focus:ring-2 focus:ring-orange-500 transition-all"
                                    />
                                    <button
                                        onClick={() => {
                                            router.get(route('admin.reports.index'), {
                                                year: filters.year,
                                                month: filters.month,
                                            }, { preserveState: true, preserveScroll: true });
                                        }}
                                        className="text-xs text-gray-500 hover:text-red-500 font-semibold"
                                    >
                                        ✕
                                    </button>
                                </>
                            )}
                        </div>

                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-green-700 transition shadow-sm"
                        >
                            <Download size={16} />
                            {a.export ?? "Export CSV"}
                        </button>
                    </div>
                </div>

                {/* KPI Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 transform transition-all hover:shadow-xl hover:-translate-y-1 overflow-hidden relative group">
                        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <DollarSign size={120} className="text-green-600" />
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 rounded-2xl bg-green-50 text-green-600">
                                <TrendingUp size={24} />
                            </div>
                            <h3 className="text-gray-500 font-bold text-sm uppercase tracking-widest">{a.total_revenue ?? "Total Revenue"}</h3>
                        </div>
                        <p className="text-4xl font-extrabold text-gray-900 tracking-tight">{formatRupiah(stats.total_revenue)}</p>
                        <div className="mt-4 flex items-center gap-2 text-green-600 text-sm font-bold">
                            <ArrowUpRight size={16} />
                            <span>{a.verified_earnings ?? "Verified Earnings"}</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 transform transition-all hover:shadow-xl hover:-translate-y-1 overflow-hidden relative group">
                        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <ShoppingBag size={120} className="text-blue-600" />
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
                                <ShoppingBag size={24} />
                            </div>
                            <h3 className="text-gray-500 font-bold text-sm uppercase tracking-widest">{a.orders_handled ?? "Orders Handled"}</h3>
                        </div>
                        <p className="text-4xl font-extrabold text-gray-900 tracking-tight">{stats.total_orders}</p>
                        <div className="mt-4 flex items-center gap-2 text-blue-600 text-sm font-bold">
                            <ArrowUpRight size={16} />
                            <span>{a.total_completed ?? "Total Completed"}</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 transform transition-all hover:shadow-xl hover:-translate-y-1 overflow-hidden relative group">
                        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Award size={120} className="text-orange-600" />
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 rounded-2xl bg-orange-50 text-orange-600">
                                <BarChart3 size={24} />
                            </div>
                            <h3 className="text-gray-500 font-bold text-sm uppercase tracking-widest">{a.avg_order_value ?? "Avg Order Value"}</h3>
                        </div>
                        <p className="text-4xl font-extrabold text-gray-900 tracking-tight">{formatRupiah(stats.avg_order_value)}</p>
                        <div className="mt-4 flex items-center gap-2 text-orange-600 text-sm font-bold">
                            <ArrowUpRight size={16} />
                            <span>{a.per_transaction ?? "Per Transaction"}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Best Selling Products */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-lg transition-all">
                        <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 italic underline decoration-orange-500 decoration-2 underline-offset-4">{a.top_offerings ?? "Top Offerings"}</h2>
                                <p className="text-sm text-gray-500 font-medium">{a.bestsellers ?? "Bestsellers by quantity sold"}</p>
                            </div>
                            <Award className="text-orange-500" size={24} />
                        </div>
                        <div className="p-6 space-y-6 flex-1">
                            {bestSellingProducts.length > 0 ? bestSellingProducts.map((item, index) => (
                                <div key={item.product_id} className="relative group">
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center font-bold text-lg shadow-lg group-hover:rotate-12 transition-transform">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-gray-900 font-bold truncate group-hover:text-orange-600 transition-colors">{item.product?.name || (a.unknown_product ?? "Unknown Product")}</p>
                                            <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
                                                <span>{(a.units_sold ?? "units").replace(":count", item.total_sold)}</span>
                                                <span className="text-gray-300">|</span>
                                                <span className="text-green-600">{formatRupiah(item.total_revenue)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Simple progress bar representation */}
                                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full transition-all duration-1000"
                                            style={{ width: `${(item.total_sold / bestSellingProducts[0].total_sold) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            )) : (
                                <div className="h-full flex flex-col items-center justify-center py-12 text-gray-400">
                                    <Clock size={48} className="mb-4 opacity-20" />
                                    <p className="font-bold">{a.no_data_period ?? "No data for this period"}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Revenue Breakdown */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-lg transition-all">
                        <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 italic underline decoration-blue-500 decoration-2 underline-offset-4">{a.periodic_insights ?? "Periodic Insights"}</h2>
                                <p className="text-sm text-gray-500 font-medium">{(a.revenue_distribution ?? "Revenue distribution across :type").replace(":type", filters.month === 'all' ? 'months' : 'days')}</p>
                            </div>
                            <Calendar className="text-blue-500" size={24} />
                        </div>
                        <div className="p-6 flex-1">
                            {formattedChartData.length > 0 ? (
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={formattedChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                            <XAxis 
                                                dataKey="name" 
                                                tick={{ fontSize: 12, fill: '#6b7280' }}
                                                axisLine={{ stroke: '#e5e7eb' }}
                                            />
                                            <YAxis 
                                                tick={{ fontSize: 12, fill: '#6b7280' }}
                                                axisLine={{ stroke: '#e5e7eb' }}
                                                tickFormatter={(value) => formatRupiah(value)}
                                            />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Bar 
                                                dataKey="revenue" 
                                                fill="url(#colorGradient)" 
                                                radius={[8, 8, 0, 0]}
                                            />
                                            <defs>
                                                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#f97316" />
                                                    <stop offset="100%" stopColor="#fb923c" />
                                                </linearGradient>
                                            </defs>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center py-12 text-gray-400">
                                    <Clock size={48} className="mb-4 opacity-20" />
                                    <p className="font-bold">{a.no_activity ?? "No activity recorded"}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Revenue Trend Chart - Full Width */}
                {formattedChartData.length > 0 && (
                    <div className="mt-8 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all">
                        <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 italic underline decoration-green-500 decoration-2 underline-offset-4">{a.revenue_trend ?? "Revenue Trend"}</h2>
                                <p className="text-sm text-gray-500 font-medium">{a.revenue_trend_desc ?? "Visualizing revenue flow over time"}</p>
                            </div>
                            <TrendingUp className="text-green-500" size={24} />
                        </div>
                        <div className="p-6">
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={formattedChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis 
                                            dataKey="name" 
                                            tick={{ fontSize: 12, fill: '#6b7280' }}
                                            axisLine={{ stroke: '#e5e7eb' }}
                                        />
                                        <YAxis 
                                            tick={{ fontSize: 12, fill: '#6b7280' }}
                                            axisLine={{ stroke: '#e5e7eb' }}
                                            tickFormatter={(value) => formatRupiah(value)}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area 
                                            type="monotone" 
                                            dataKey="revenue" 
                                            stroke="#22c55e" 
                                            strokeWidth={3}
                                            fill="url(#areaGradient)" 
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
