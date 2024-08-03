import { Navigate, Outlet, useOutletContext, useParams } from 'react-router-dom';
import { useGetUserQuery } from '~hooks/queries/userQueries';
import { IUser } from '~lib/api/users/types';

function Index() {
  const { uid = '' } = useParams();

  if (uid.match(/^@/) === null) {
    return <Navigate to="not-found" />;
  }

  return <UserProvider uid={uid.split('@')[1]} />;
}

// Context API
interface ContextValue extends IUser {}

export function useUserContext() {
  return useOutletContext<ContextValue>();
}

interface ProviderProps {
  uid: string;
}

function UserProvider({ uid }: ProviderProps) {
  const { data } = useGetUserQuery(uid);

  return <Outlet context={data satisfies ContextValue} />;
}

export default Index;
