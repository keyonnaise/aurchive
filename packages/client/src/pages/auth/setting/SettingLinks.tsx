import { useCallback } from 'react';
import Spacer from '~components/atom/Spacer';
import TextField from '~components/form/TextField';
import { Fields, useProfileEditorContext } from './ProfileEditor';
import ProfileEditorRow from './ProfileEditorRow';

function SettingLinks() {
  const { fields, setField } = useProfileEditorContext();

  const getFieldAttribute = useCallback(
    (key: keyof Fields) => ({
      name: key,
      value: fields[key],
      placeholder: 'https://',

      onChange(e: React.ChangeEvent<HTMLInputElement>) {
        setField(key, e.currentTarget.value);
      },
    }),
    [fields, setField],
  );

  return (
    <ProfileEditorRow label="소셜 정보">
      <TextField
        {...getFieldAttribute('githubUrl')}
        addonBefore={{
          type: 'ICON',
          icon: 'logos/github-line',
        }}
      />
      <Spacer />
      <TextField
        {...getFieldAttribute('instagramUrl')}
        addonBefore={{
          type: 'ICON',
          icon: 'logos/instagram-line',
        }}
      />
      <Spacer />
      <TextField
        {...getFieldAttribute('linkedinUrl')}
        addonBefore={{
          type: 'ICON',
          icon: 'logos/linkedin-line',
        }}
      />
      <Spacer />
      <TextField
        {...getFieldAttribute('twitterUrl')}
        addonBefore={{
          type: 'ICON',
          icon: 'logos/twitter-line',
        }}
      />
    </ProfileEditorRow>
  );
}

export default SettingLinks;
