import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Theme, css } from '@emotion/react';
import Divider from '~components/atom/Divider';
import Section from '~components/atom/Section';
import Spacer from '~components/atom/Spacer';
import Typography from '~components/atom/Typography';
import { IAccount } from '~lib/api/auth/types';
import { assert } from '~lib/assert';
import useMyAccountStore from '~store/useMyAccountStore';
import ProfileEditorFooter from './ProfileEditorFooter';
import SettingAbout from './SettingAbout';
import SettingBio from './SettingBio';
import SettingDisplayName from './SettingDisplayName';
import SettingLinks from './SettingLinks';
import SettingProfilePhoto from './SettingProfilePhoto';

function ProfileEditor() {
  const { myAccount, setMyAccount } = useMyAccountStore();

  assert(myAccount !== null);

  const handleProfileUpdated = useCallback(
    ({ displayName, photoUrl, ...profile }: Fields) => {
      setMyAccount({ ...myAccount, displayName, photoUrl, profile });
    },
    [myAccount, setMyAccount],
  );

  return (
    <ProfileEditorProvider myAccount={myAccount}>
      <Section>
        <div css={styledBlock}>
          <Typography as="h3" variant="h6" weight="bold">
            내 정보
          </Typography>
          <Divider space={2} />
          <SettingProfilePhoto />
          <SettingDisplayName />
          <SettingBio />
          <SettingAbout />
          <SettingLinks />
        </div>
        <Spacer y={4} />
        <ProfileEditorFooter onProfileUpdated={handleProfileUpdated} />
      </Section>
    </ProfileEditorProvider>
  );
}

// Context API
const fieldKeys = [
  'displayName',
  'photoUrl',
  'bio',
  'about',
  'githubUrl',
  'instagramUrl',
  'linkedinUrl',
  'twitterUrl',
] as const;

export type FieldKey = (typeof fieldKeys)[number];
export type Fields = Record<FieldKey, string>;

interface ContextState {
  id: string;
  fields: Fields;
}

interface ContextActions {
  setField(key: FieldKey, value: string): void;
  setFields(fields: Fields): void;
}

export type ContextType = ContextState & ContextActions;

const ProfileEditorContext = createContext<ContextType | null>(null);

export function useProfileEditorContext() {
  const ctx = useContext(ProfileEditorContext);

  assert(ctx !== null, 'useProfileEditorContext 함수는 ProfileEditorProvider 컴포넌트 내에서만 사용할 수 있습니다.');

  return ctx;
}

interface ProviderProps {
  myAccount: IAccount;
  children: React.ReactNode;
}

function ProfileEditorProvider({ myAccount, children }: ProviderProps) {
  const { id, displayName, photoUrl, profile } = myAccount!;
  const { bio, about, githubUrl, linkedinUrl, instagramUrl, twitterUrl } = profile;

  const [state, setState] = useState<ContextState>({
    id,
    fields: {
      displayName,
      photoUrl: photoUrl || '',
      bio: bio || '',
      about: about || '',
      githubUrl: githubUrl || '',
      instagramUrl: instagramUrl || '',
      linkedinUrl: linkedinUrl || '',
      twitterUrl: twitterUrl || '',
    },
  });

  const actions = useMemo<ContextActions>(
    () => ({
      setField(key, value) {
        setState((prev) => ({ ...prev, fields: { ...prev.fields, [key]: value } }));
      },

      setFields(fields) {
        setState((prev) => ({ ...prev, fields }));
      },
    }),
    [],
  );

  const value = useMemo<ContextType>(() => ({ ...state, ...actions }), [state, actions]);

  return <ProfileEditorContext.Provider value={value}>{children}</ProfileEditorContext.Provider>;
}

// Styles
const styledBlock = (theme: Theme) => css`
  padding: 32px;
  margin: 0 auto;
  color: ${theme.text.main};
  background-color: ${theme.background.elevated};
  border-radius: ${theme.radii.md};
  box-shadow: ${theme.shadows.md};
`;

export default ProfileEditor;
