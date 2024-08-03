import { useCallback, useEffect, useRef, useState } from 'react';

interface LoadableState<TData> {
  data: TData | undefined;
  error: Error | null;
  isError: boolean;
  isIdle: boolean;
  isPending: boolean;
  isSuccess: boolean;
}

const loadableHandlers = {
  initial<TData>(): LoadableState<TData> {
    return {
      data: undefined,
      error: null,
      isError: false,
      isIdle: true,
      isPending: false,
      isSuccess: false,
    };
  },

  load<TData>(initialData: TData | undefined = undefined): LoadableState<TData> {
    return {
      data: initialData,
      error: null,
      isError: false,
      isIdle: false,
      isPending: true,
      isSuccess: false,
    };
  },

  success<TData>(data: TData) {
    return {
      data,
      error: null,
      isError: false,
      isIdle: false,
      isPending: false,
      isSuccess: true,
    };
  },

  error(error: Error) {
    return {
      error,
      data: undefined,
      isError: true,
      isIdle: false,
      isPending: false,
      isSuccess: false,
    };
  },
};

export default function useAsync<TParams extends any[], TData = any>(asyncFn: (...params: TParams) => Promise<TData>) {
  const [loadableState, setLoadableState] = useState<LoadableState<TData>>(loadableHandlers.initial());
  const asyncFnRef = useRef(asyncFn);

  const mutate = useCallback((...params: TParams) => {
    setLoadableState(loadableHandlers.load());

    asyncFnRef
      .current(...params)
      .then((data) => {
        setLoadableState(loadableHandlers.success(data));
      })
      .catch((error: Error) => {
        setLoadableState(loadableHandlers.error(error));
        throw error;
      });
  }, []);

  const mutateAsync = useCallback(async (...params: TParams) => {
    setLoadableState(loadableHandlers.load());

    return asyncFnRef
      .current(...params)
      .then((data) => {
        setLoadableState(loadableHandlers.success(data));

        return data;
      })
      .catch((error: Error) => {
        setLoadableState(loadableHandlers.error(error));
        throw error;
      });
  }, []);

  useEffect(() => {
    return () => {
      setLoadableState(loadableHandlers.initial());
    };
  }, []);

  return {
    mutate,
    mutateAsync,
    isError: loadableState.isError,
    isIdle: loadableState.isIdle,
    isPending: loadableState.isPending,
    isSuccess: loadableState.isSuccess,
    data: loadableState.data,
    error: loadableState.error,
  };
}
