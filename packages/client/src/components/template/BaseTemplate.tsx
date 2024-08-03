import { useCallback } from 'react';
import { useShallow } from 'zustand/react/shallow';
import Spacer from '~components/atom/Spacer';
import IconButton from '~components/buttons/IconButton';
import Avatar from '~components/data-display/Avatar';
import DropdownMenu from '~components/menu/DropdownMenu';
import BaseStructure, { useBaseStructureContext } from '~components/structure/BaseStructure';
import { IAccount } from '~lib/api/auth/types';
import useMyAccountStore from '~store/useMyAccountStore';
import useSystemStore from '~store/useSystemStore';

function BaseTemplate() {
  return (
    <BaseStructure>
      <BaseStructure.Header>
        <Toolbar />
      </BaseStructure.Header>
      <BaseStructure.Main />
      <BaseStructure.Footer />
    </BaseStructure>
  );
}

// Subcomponents
const Toolbar = () => {
  const { headerColorScheme } = useBaseStructureContext();
  const colorScheme = headerColorScheme === 'dark' ? 'light' : headerColorScheme === 'light' ? 'dark' : 'netural';

  const { config, setConfig } = useSystemStore();
  const myAccount = useMyAccountStore(useShallow(({ myAccount }) => myAccount));

  const { themeMode } = config;

  const toggleThemeMode = useCallback(() => {
    setConfig((prev) => ({ themeMode: prev.themeMode === 'dark' ? 'light' : 'dark' }));
  }, [setConfig]);

  return (
    <>
      <IconButton
        as="button"
        shape="round"
        variant="text"
        colorScheme={colorScheme}
        size="sm"
        icon={themeMode === 'dark' ? 'weather/moon-line' : 'weather/sun-line'}
        onClick={toggleThemeMode}
      />
      {myAccount !== null && (
        <>
          <Spacer />
          <UserMenu colorScheme={colorScheme} myAccount={myAccount} />
        </>
      )}
    </>
  );
};

interface UserMenuProps {
  colorScheme: 'netural' | 'dark' | 'light';
  myAccount: IAccount;
}

const UserMenu = ({ colorScheme, myAccount }: UserMenuProps) => {
  const { id, displayName, photoUrl } = myAccount;

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild={false}>
        <Avatar colorScheme={colorScheme} size="xs" photoUrl={photoUrl} name={displayName} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" alignOffset={-8}>
        <DropdownMenu.Item as="anchor" to={`/@${id}`}>
          프로필
        </DropdownMenu.Item>
        <DropdownMenu.Item as="anchor" to="/post-editor">
          글 쓰기
        </DropdownMenu.Item>
        <DropdownMenu.Item as="anchor" to="/saves">
          임시 글
        </DropdownMenu.Item>
        <DropdownMenu.Item as="anchor" to="/auth/setting">
          설정
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};

export default BaseTemplate;
