import { createContext, useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import SEO from '~components/utils/SEO';
import { useGetStoryQuery } from '~hooks/queries/storyQueries';
import { IStory } from '~lib/api/stories/types';
import { assert } from '~lib/assert';
import { useUserContext } from '~pages/user';
import Cover from './Cover';
import Section01 from './Section01';

function Index() {
  const user = useUserContext();
  const { slug = '' } = useParams();

  const { data: story } = useGetStoryQuery({ slug, author: user.id });

  return (
    <StoryProvider story={story}>
      <SEO title={`${story.name} - ${user.displayName}`} canonical={`@${user.id}/stories/${slug}`} />
      <Cover />
      <Section01 />
    </StoryProvider>
  );
}

// Context API
interface ContextValue extends IStory {}

const StoryContext = createContext<ContextValue | null>(null);

export function useStoryContext() {
  const ctx = useContext(StoryContext);

  assert(ctx !== null, 'useStoryContext 함수는 StoryProvider 컴포넌트 내에서만 사용할 수 있습니다.');

  return ctx;
}

interface StoryProviderProps {
  story: IStory;
  children: React.ReactNode;
}

function StoryProvider({ story, children }: StoryProviderProps) {
  const value = useMemo<ContextValue>(() => story, [story]);

  return <StoryContext.Provider value={value}>{children}</StoryContext.Provider>;
}

export default Index;
