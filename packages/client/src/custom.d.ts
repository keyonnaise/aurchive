import React from 'react';

declare global {
  interface Window {
    __REACT_QUERY_STATE__: unknown;
  }

  type ComponentProps<T extends React.ElementType, P = object> = React.ComponentPropsWithoutRef<T> & P;
  type ComponentRef<T extends React.ElementType> = React.ComponentPropsWithRef<T>['ref'];

  type Entries<T> = {
    [K in keyof T]: [K, T[K]];
  }[keyof T][];
}

declare module '*.svg' {
  const content: React.FC<React.SVGProps<SVGElement>>;
  export default content;
}
