import React from 'react';

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error caught by GlobalErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-base flex flex-col items-center justify-center p-6 text-white font-sans">
          <div className="max-w-md w-full bg-surface border border-white/[0.08] p-8 rounded-2xl shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold font-display mb-3">Something went wrong</h1>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              We encountered an unexpected error. Please try refreshing the page. If the issue persists, our team has been notified.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full h-12 bg-white text-[#0A0B0F] rounded-xl font-bold hover:bg-slate-200 transition-colors"
            >
              Reload Workspace
            </button>
            <p className="mt-4 text-xs text-slate-500 truncate max-w-full">
              {this.state.error?.message}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;
