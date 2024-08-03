import { useCallback, useState } from 'react';
import { Theme, css } from '@emotion/react';
import Icon from '~components/atom/Icon';
import Chip from '~components/data-display/Chip';
import TextField from '~components/form/TextField';
import Scroll from '~components/layout/Scroll';
import { useEditStoryMutation, useGetStoriesQuery } from '~hooks/queries/storyQueries';
import isNonEmptyArray from '~lib/isNonEmptyArray';
import slugify from '~lib/slugify';
import uniqueId from '~lib/uniqueId';
import { usePublishPreviewContext } from './PublishPreviewModal';

function SettingStory() {
  const [searchKeyword, setSearchKeyword] = useState('');

  const { author, fields, setField } = usePublishPreviewContext();

  const { data } = useGetStoriesQuery({
    author,
    limit: 9999,
    page: 1,
    sort: 'desc',
  });
  const { mutateAsync, isPending } = useEditStoryMutation();

  const stories = data.list;
  const filtered = stories.filter((story) => story.name.includes(searchKeyword));

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  }, []);

  const handleSelectStory = useCallback(
    (id: string = '') => {
      setSearchKeyword('');
      setField('story', id);
    },
    [setField],
  );

  const handleEditStory = useCallback(async () => {
    const result = await mutateAsync({
      name: searchKeyword,
      description: null,
      slug: slugify(searchKeyword) || uniqueId(),
    });

    setSearchKeyword('');
    setField('story', result);
  }, [searchKeyword, setField, mutateAsync]);

  return (
    <div>
      <h2 css={styledLabel}>스토리 설정</h2>
      <TextField
        placeholder="스토리 이름을 입력해주세요."
        maxLength={10}
        addonAfter={{
          type: 'ICON',
          icon: 'system/search-eye-line',
        }}
        value={searchKeyword}
        onChange={handleChange}
      />
      <p css={styledCaption}>조회된 스토리 목록</p>
      <Scroll overflowX="auto" padding="8px">
        <div css={styledStoryGroup}>
          {isNonEmptyArray(filtered) ? (
            filtered.map(({ id, name }) => {
              const isActive = id === fields.story;

              return isActive ? (
                <Chip key={id} as="button" colorScheme="info" onClick={() => handleSelectStory()}>
                  {name}
                </Chip>
              ) : (
                <Chip key={id} as="button" onClick={() => handleSelectStory(id)}>
                  {name}
                </Chip>
              );
            })
          ) : searchKeyword === '' ? (
            <p css={styledMessage}>
              <span>조회된 스토리가 없습니다.</span>
            </p>
          ) : isPending ? (
            <p css={styledMessage}>
              <span>스토리를 생성 중입니다&nbsp;</span>
              <Icon icon="system/loader" />
            </p>
          ) : (
            <Chip as="button" onClick={handleEditStory}>
              스토리 생성: {searchKeyword}
            </Chip>
          )}
        </div>
      </Scroll>
    </div>
  );
}

// Styles
const styledLabel = (theme: Theme) => css`
  margin-bottom: 1lh;
  font-size: 20px;
  font-weight: ${theme.weights.extrabold};
`;

const styledCaption = (theme: Theme) => css`
  margin: 16px 0 4px 0;
  color: ${theme.text.third};
  font-size: 12px;
`;

const styledStoryGroup = css`
  display: inline-flex;
  gap: 4px;
`;

const styledMessage = css`
  display: flex;
  align-items: center;
  height: 24px;
  font-size: 14px;
`;

export default SettingStory;
