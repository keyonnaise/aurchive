import { Outlet } from 'react-router-dom';
import Section from '~components/atom/Section';
import { useUserContext } from '..';

function Index() {
  const user = useUserContext();

  return (
    <Section>
      <Outlet context={user} />
    </Section>
  );
}

export default Index;
