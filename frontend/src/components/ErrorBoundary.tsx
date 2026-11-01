import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught application error:", error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isAr =
        (typeof document !== "undefined" && document.documentElement.lang === "ar") ||
        (typeof localStorage !== "undefined" && localStorage.getItem("roots_locale") === "ar");

      return (
        <div
          dir={isAr ? "rtl" : "ltr"}
          className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex items-center justify-center p-6"
        >
          <div className="surface-card max-w-lg w-full p-8 rounded-xl border border-[var(--gold)]/40 shadow-2xl text-center space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 text-[var(--gold)]">
              <AlertTriangle className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-[var(--gold)] font-bold">
                {isAr ? "استثناء في التطبيق" : "Application Exception"}
              </span>
              <h1 className="font-display text-2xl font-bold">
                {isAr ? "حدث خطأ غير متوقع" : "Something went wrong"}
              </h1>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                {isAr
                  ? "حدث خطأ غير متوقع أثناء عرض هذه الصفحة. جلستك وبياناتك المحفوظة في أمان."
                  : "An unexpected interface error occurred while rendering this view. Your session and saved archival work remain safe."}
              </p>
            </div>

            {process.env.NODE_ENV !== "production" && this.state.error && (
              <pre className="text-left text-xs bg-black/40 p-4 rounded border border-white/10 overflow-x-auto text-red-300 max-h-40">
                {this.state.error.message}
              </pre>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="btn-base btn-gold w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                {isAr ? "إعادة تحميل الصفحة" : "Reload Page"}
              </button>
              <a
                href="/"
                className="btn-base btn-outline-light w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <Home className="h-4 w-4" />
                {isAr ? "العودة إلى الصفحة الرئيسية" : "Return to Home"}
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
