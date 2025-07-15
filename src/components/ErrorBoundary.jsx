import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-lg font-medium text-red-800">Something went wrong.</h2>
          {this.props.fallback || (
            <p className="text-red-700">
              {this.state.error && this.state.error.toString()}
            </p>
          )}
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;