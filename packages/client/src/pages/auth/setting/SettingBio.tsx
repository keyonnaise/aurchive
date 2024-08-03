import { useCallback } from 'react';
import TextField from '~components/form/TextField';
import { useProfileEditorContext } from './ProfileEditor';
import ProfileEditorRow from './ProfileEditorRow';

const MAX_LENGTH = 100;

function SettingBio() {
  const { fields, setField } = useProfileEditorContext();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value;

      if (value.length > MAX_LENGTH) return;

      setField('bio', value);
    },
    [setField],
  );

  return (
    <ProfileEditorRow label="한 줄 소개">
      <TextField
        name="displayName"
        maxLength={MAX_LENGTH}
        placeholder="프로필을 소개하는 내용을 적어보세요."
        value={fields.bio}
        onChange={handleChange}
      />
    </ProfileEditorRow>
  );
}

export default SettingBio;
