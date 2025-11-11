'use client';

import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, BarChart, Bar } from "recharts";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

export default function Page() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [compareSymbols, setCompareSymbols] = useState<string[]>([]);

  const apiBase = "https://finfixed-backend.onrender.com";

  async function fetchData(symbol: string) {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/financials/${symbol.toUpperCase()}`);
      const data = await res.json();
      setResults((prev) => [...prev, data]);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  const handleSearch = () => {
    if (!query.trim()) return;
    if (compareMode) {
      if (compareSymbols.length >= 2) {
        alert("Maximum 2 companies can be compared at once");
        return;
      }
      const upperSymbol = query.toUpperCase();
      if (compareSymbols.includes(upperSymbol)) {
        alert("This symbol is already added");
        return;
      }
      setCompareSymbols((prev) => [...prev, upperSymbol]);
    } else {
      setResults([]);
      fetchData(query);
    }
    setQuery("");
  };

  const handleCompare = async () => {
    if (compareSymbols.length < 2) {
      alert("Please add 2 companies to compare");
      return;
    }
    setResults([]);
    for (const sym of compareSymbols) {
      await fetchData(sym);
    }
  };

  const handleRemoveSymbol = (symbol: string) => {
    setCompareSymbols((prev) => prev.filter((s) => s !== symbol));
  };

  const handleClearComparison = () => {
    setCompareSymbols([]);
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-950 to-black text-white">
      {/* Header Section */}
      <div className="sticky top-0 z-50 backdrop-blur-lg bg-black/30 border-b border-emerald-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="text-center mb-4 sm:mb-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent mb-2">
              FinFixed
            </h1>
            <p className="text-xs sm:text-sm text-emerald-300/70">Real-time Financial Analytics Dashboard</p>
          </div>

          {/* Search Section */}
          <div className="flex flex-col items-center gap-3 sm:gap-4">
            <div className="flex w-full max-w-2xl gap-2">
              <Input
                placeholder="Enter stock symbol (e.g., AAPL, MSFT)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="bg-neutral-900/80 border-emerald-500/50 text-white placeholder:text-gray-500 focus:border-emerald-400 focus:ring-emerald-400/20 h-10 sm:h-12 text-sm sm:text-base"
              />
              <Button
                onClick={handleSearch}
                disabled={loading || !query.trim()}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold px-4 sm:px-8 h-10 sm:h-12 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
              >
                {compareMode ? "Add" : "Search"}
              </Button>
            </div>

            {/* Compare Mode Controls */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <div className="flex items-center gap-2 bg-neutral-900/50 px-4 py-2 rounded-lg border border-emerald-500/30">
                <Switch
                  id="compare-mode"
                  checked={compareMode}
                  onCheckedChange={(checked) => {
                    setCompareMode(checked);
                    if (!checked) {
                      setCompareSymbols([]);
                      setResults([]);
                    }
                  }}
                />
                <Label htmlFor="compare-mode" className="cursor-pointer text-sm">Compare Companies (Max 2)</Label>
              </div>
              
              {compareMode && compareSymbols.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  {compareSymbols.map((symbol) => (
                    <div
                      key={symbol}
                      className="flex items-center gap-1 bg-emerald-600/20 border border-emerald-500/50 px-3 py-1 rounded-full text-sm"
                    >
                      <span>{symbol}</span>
                      <button
                        onClick={() => handleRemoveSymbol(symbol)}
                        className="hover:bg-red-500/20 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  
                  {compareSymbols.length === 2 && (
                    <Button
                      onClick={handleCompare}
                      className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 shadow-lg shadow-teal-500/20 text-sm"
                    >
                      Compare Now
                    </Button>
                  )}
                  
                  <Button
                    onClick={handleClearComparison}
                    variant="outline"
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10 text-sm"
                  >
                    Clear
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {loading && (
          <div className="flex flex-col items-center justify-center py-12 sm:py-20">
            <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
            <p className="text-emerald-300 animate-pulse text-sm sm:text-base">Loading financial data...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && results.length === 0 && (
          <div className="text-center py-12 sm:py-20">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-emerald-400 mb-2">No Data Yet</h3>
            <p className="text-sm sm:text-base text-gray-400">
              {compareMode ? "Add 2 companies to compare their financials" : "Search for a stock symbol to get started"}
            </p>
          </div>
        )}

        {/* Results Grid - Fixed for comparison mode */}
        <div className={`grid gap-4 sm:gap-6 ${
          results.length === 2 ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {results.map((res, i) => {
            const info = res.metrics || {};
            const stock = res.stock;

            const valuationData = [
              { name: "P/E", value: info.pe_ratio || 0 },
              { name: "P/B", value: info.price_to_book || 0 },
              { name: "P/S", value: info.price_to_sales || 0 },
            ];

            const profitabilityData = [
              { name: "Profit Margin", value: (info.profit_margin || 0) * 100 },
              { name: "ROE", value: (info.return_on_equity || 0) * 100 },
              { name: "ROA", value: (info.return_on_assets || 0) * 100 },
            ];

            return (
              <div
                key={i}
                className="opacity-0 animate-[fadeIn_0.5s_ease-in-out_forwards]"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <Card className="bg-gradient-to-br from-neutral-900/90 to-neutral-900/50 backdrop-blur-sm border border-emerald-700/30 text-white shadow-xl hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 h-full">
                  <CardHeader className="pb-3 sm:pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                        {stock}
                      </CardTitle>
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div className="bg-neutral-800/50 p-3 sm:p-4 rounded-lg border border-emerald-500/20">
                        <p className="text-xs text-gray-400 mb-1">Current Price</p>
                        <p className="text-lg sm:text-xl font-bold text-emerald-300">
                          ${info.current_price || "N/A"}
                        </p>
                      </div>
                      <div className="bg-neutral-800/50 p-3 sm:p-4 rounded-lg border border-emerald-500/20">
                        <p className="text-xs text-gray-400 mb-1">Market Cap</p>
                        <p className="text-lg sm:text-xl font-bold text-emerald-300">
                          {info.market_cap_formatted || "N/A"}
                        </p>
                      </div>
                      <div className="bg-neutral-800/50 p-3 sm:p-4 rounded-lg border border-emerald-500/20">
                        <p className="text-xs text-gray-400 mb-1">Sector</p>
                        <p className="text-sm sm:text-base font-medium truncate" title={info.sector || "N/A"}>
                          {info.sector || "N/A"}
                        </p>
                      </div>
                      <div className="bg-neutral-800/50 p-3 sm:p-4 rounded-lg border border-emerald-500/20">
                        <p className="text-xs text-gray-400 mb-1">Industry</p>
                        <p className="text-sm sm:text-base font-medium truncate" title={info.industry || "N/A"}>
                          {info.industry || "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Valuation Ratios Chart */}
                    <div className="bg-neutral-800/30 p-3 sm:p-4 rounded-lg border border-emerald-500/10">
                      <h3 className="text-sm sm:text-base text-emerald-400 font-semibold mb-3 flex items-center gap-2">
                        <span className="w-1 h-4 bg-emerald-500 rounded"></span>
                        Valuation Ratios
                      </h3>
                      <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={valuationData}>
                          <XAxis 
                            dataKey="name" 
                            stroke="#6B7280" 
                            tick={{ fontSize: 12 }}
                            tickLine={false}
                          />
                          <YAxis 
                            stroke="#6B7280" 
                            tick={{ fontSize: 12 }}
                            tickLine={false}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1F2937', 
                              border: '1px solid #10B981',
                              borderRadius: '8px',
                              fontSize: '12px'
                            }}
                          />
                          <Bar 
                            dataKey="value" 
                            fill="#10B981" 
                            radius={[8, 8, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Profitability Chart */}
                    <div className="bg-neutral-800/30 p-3 sm:p-4 rounded-lg border border-emerald-500/10">
                      <h3 className="text-sm sm:text-base text-emerald-400 font-semibold mb-3 flex items-center gap-2">
                        <span className="w-1 h-4 bg-teal-500 rounded"></span>
                        Profitability (%)
                      </h3>
                      <ResponsiveContainer width="100%" height={180}>
                        <LineChart data={profitabilityData}>
                          <XAxis 
                            dataKey="name" 
                            stroke="#6B7280" 
                            tick={{ fontSize: 10 }}
                            tickLine={false}
                          />
                          <YAxis 
                            stroke="#6B7280" 
                            tick={{ fontSize: 12 }}
                            tickLine={false}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1F2937', 
                              border: '1px solid #14B8A6',
                              borderRadius: '8px',
                              fontSize: '12px'
                            }}
                          />
                          <Legend 
                            wrapperStyle={{ fontSize: '12px' }}
                          />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#14B8A6"
                            strokeWidth={3}
                            dot={{ fill: '#14B8A6', r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}