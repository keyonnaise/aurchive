import { useCallback } from 'react';
import TextField from '~components/form/TextField';
import { useProfileEditorContext } from './ProfileEditor';
import ProfileEditorRow from './ProfileEditorRow';

const MAX_LENGTH = 10;

function SettingDisplayName() {
  const { fields, setField } = useProfileEditorContext();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value;

      if (value.length > MAX_LENGTH) return;

      setField('displayName', value);
    },
    [setField],
  );

  return (
    <ProfileEditorRow label="프로필 명">
      <TextField
        name="displayName"
        maxLength={MAX_LENGTH}
        placeholder="프로필 명을 작성해주세요."
        value={fields.displayName}
        onChange={handleChange}
      />
    </ProfileEditorRow>
  );
}

export default SettingDisplayName;
