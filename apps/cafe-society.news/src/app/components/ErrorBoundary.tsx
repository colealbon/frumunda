import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback: ReactNode;
}

interface State {
  hasError: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errorInfo?: any;
}

class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({...this.state, errorInfo: error.toString()})
    console.error('Uncaught error:', error, errorInfo);
  }

  public override render() {
    if (this.state.hasError) {
      return <>
        <h1>Sorry.. there was an error</h1>
        <div />
        <pre style={{color: 'red'}}>
          {this.state.errorInfo}
        </pre>
      </>
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

// https://stackoverflow.com/questions/63916900/how-to-properly-type-a-react-errorboundary-class-component-in-typescript
