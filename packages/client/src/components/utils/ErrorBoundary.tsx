import React from 'react';

interface FallbackProps {
  error: Error | null;
  isError: boolean;
  onResolveError(): void;
}

interface Props {
  fallback?: ((props: FallbackProps) => React.ReactNode) | React.ReactNode;
  children: React.ReactNode;
}

interface State {
  error: Error | null;
  isError: boolean;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      error: null,
      isError: false,
    };
  }

  static getDerivedStateFromError(error: Error) {
    return { error, isError: true };
  }

  componentDidCatch() {
    // TODO: submit error to server
  }

  handleResolveError = () => {
    this.setState({
      error: null,
      isError: false,
    });
  };

  render() {
    const { fallback = null, children } = this.props;
    const { error, isError } = this.state;

    if (isError) {
      return typeof fallback === 'function'
        ? fallback({ error, isError, onResolveError: this.handleResolveError })
        : fallback;
    }

    return children;
  }
}
