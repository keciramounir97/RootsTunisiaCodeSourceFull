import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { api } from "../api/client";

export interface CurrencyItem {
  id: number;
  code: string;
  name: string;
  symbol: string;
  rate: number;
  is_base?: boolean;
  is_active?: boolean;
}

const DEFAULT_CURRENCIES: CurrencyItem[] = [
  { id: 1, code: "USD", name: "US Dollar", symbol: "$", rate: 1.0, is_base: true, is_active: true },
  { id: 2, code: "TND", name: "Dinar Tunisien", symbol: "DT", rate: 3.15, is_base: false, is_active: true },
  { id: 3, code: "EUR", name: "Euro", symbol: "€", rate: 0.92, is_base: false, is_active: true },
  { id: 4, code: "GBP", name: "Livre Sterling", symbol: "£", rate: 0.79, is_base: false, is_active: true },
  { id: 5, code: "CAD", name: "Dollar Canadien", symbol: "CA$", rate: 1.38, is_base: false, is_active: true },
  { id: 6, code: "SAR", name: "Riyal Saoudien", symbol: "SAR", rate: 3.75, is_base: false, is_active: true },
];

interface CurrencyContextValue {
  currencies: CurrencyItem[];
  selectedCurrency: CurrencyItem;
  setCurrencyCode: (code: string) => void;
  convertPrice: (priceInUSD: number) => { amount: number; formatted: string; symbol: string; code: string };
  formatPrice: (priceInUSD: number) => string;
  refreshCurrencies: () => Promise<void>;
  loading: boolean;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currencies, setCurrencies] = useState<CurrencyItem[]>(DEFAULT_CURRENCIES);
  const [loading, setLoading] = useState(false);
  const [selectedCode, setSelectedCode] = useState<string>(() => {
    try {
      return localStorage.getItem("roots_currency") || "USD";
    } catch {
      return "USD";
    }
  });

  const refreshCurrencies = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/currencies");
      const items = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
      const valid = items.filter((c: CurrencyItem) => String(c?.code || "").trim());
      if (valid.length > 0) {
        setCurrencies(valid);
      }
    } catch {
      // Keep defaults gracefully
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refreshCurrencies();
  }, []);

  const setCurrencyCode = (code: string) => {
    const next = String(code || "USD");
    setSelectedCode(next);
    try {
      localStorage.setItem("roots_currency", next);
    } catch {
      /* private mode / blocked storage — keep in-memory selection */
    }
  };

  const selectedCurrency = useMemo(() => {
    const selected = String(selectedCode || "").toUpperCase();
    const found = currencies.find(
      (c) => String(c?.code || "").toUpperCase() === selected,
    );
    return found || currencies[0] || DEFAULT_CURRENCIES[0];
  }, [currencies, selectedCode]);

  const convertPrice = (priceInUSD: number) => {
    const rate = Number(selectedCurrency?.rate) > 0 ? Number(selectedCurrency.rate) : 1.0;
    const base = Number(priceInUSD);
    const safeBase = Number.isFinite(base) ? base : 0;
    const converted = safeBase * rate;
    const formattedAmount = Number.isFinite(converted) ? converted.toFixed(2) : "0.00";

    const symbol = selectedCurrency?.symbol || selectedCurrency?.code || "$";
    const code = String(selectedCurrency?.code || "USD");
    const isPrefixSymbol = ["$", "€", "£", "CA$"].includes(symbol);
    const formatted = isPrefixSymbol ? `${symbol}${formattedAmount}` : `${formattedAmount} ${symbol}`;

    return {
      amount: parseFloat(formattedAmount),
      formatted,
      symbol,
      code,
    };
  };

  const formatPrice = (priceInUSD: number): string => {
    return convertPrice(priceInUSD).formatted;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currencies,
        selectedCurrency,
        setCurrencyCode,
        convertPrice,
        formatPrice,
        refreshCurrencies,
        loading,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    return {
      currencies: DEFAULT_CURRENCIES,
      selectedCurrency: DEFAULT_CURRENCIES[0],
      setCurrencyCode: () => {},
      convertPrice: (p: number) => {
        const n = Number(p);
        const amount = Number.isFinite(n) ? n : 0;
        return { amount, formatted: `$${amount.toFixed(2)}`, symbol: "$", code: "USD" };
      },
      formatPrice: (p: number) => {
        const n = Number(p);
        const amount = Number.isFinite(n) ? n : 0;
        return `$${amount.toFixed(2)}`;
      },
      refreshCurrencies: async () => {},
      loading: false,
    };
  }
  return ctx;
}

