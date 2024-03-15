import React from 'react';
import { FallbackProps } from 'react-error-boundary';

export const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  if (error) {
    return (
      <div>
        <p>{error.toString()}</p>
        <p>오류가 발생했습니다.</p>
        <p>재시도 해주세요.</p>
        <button onClick={resetErrorBoundary}>재시도</button>
      </div>
    );
  }
};
