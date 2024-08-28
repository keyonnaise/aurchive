import { useParams } from 'react-router-dom';
import SEO from '~components/utils/SEO';
import { MAIN_SLOGAN } from '~constants';
import { useGetPostQuery } from '~hooks/queries/postQueries';
import stripTags from '~lib/stripTags';
import useMyAccountStore from '~store/useMyAccountStore';
import Content from './Content';
import Cover from './Cover';
import Footer from './Footer';

function Index() {
  const myAccount = useMyAccountStore(({ myAccount }) => myAccount);

  const { id = '' } = useParams();
  const { data } = useGetPostQuery(id);
  const { author, publishedAt, title, tags, cover, thumbnail, body } = data;

  const isAuthor = myAccount !== null && myAccount.id === author?.id;

  return (
    <>
      <SEO
        title={`${title} | ${MAIN_SLOGAN}`}
        canonical={`posts/${id}`}
        description={stripTags(body).slice(0, 150)}
        keywords={tags}
        image={thumbnail || undefined}
      />
      <Cover id={id} publishedAt={publishedAt} title={title} cover={cover} tags={tags} isAuthor={isAuthor} />
      <Content body={body} />
      <Footer author={author} />
    </>
  );
}

export default Index;
