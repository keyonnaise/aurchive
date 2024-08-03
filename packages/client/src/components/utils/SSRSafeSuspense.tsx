import { Suspense } from 'react';
import { useIsMounted } from '~hooks/useIsMounted';

type Props = ComponentProps<typeof Suspense>;

function SSRSafeSuspense(props: Props) {
  const { fallback } = props;
  const isMounted = useIsMounted();

  if (isMounted) return <Suspense {...props} />;

  return fallback;
}

export default SSRSafeSuspense;
