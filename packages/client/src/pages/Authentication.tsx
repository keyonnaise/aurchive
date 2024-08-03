import { useEffect } from 'react';
import { useAuthenticationQuery } from '~hooks/queries/authQueries';
import usePreservedCallback from '~hooks/usePreservedCallback';
import { IAccount } from '~lib/api/auth/types';

interface Props {
  onAuthenticated(myAccount: IAccount): void;
}

function Authentication({ onAuthenticated: _onAuthenticated }: Props) {
  const { data } = useAuthenticationQuery();
  const onAuthenticated = usePreservedCallback(_onAuthenticated);

  useEffect(() => {
    onAuthenticated(data);
  }, [data, onAuthenticated]);

  return null;
}

export default Authentication;
