import { useParams } from 'react-router-dom';
import SEO from '~components/utils/SEO';
import { MAIN_SLOGAN } from '~constants';
import { useGetPostQuery } from '~hooks/queries/postQueries';
import stripTags from '~lib/stripTags';
import Content from './Content';
import Cover from './Cover';
import Footer from './Footer';

function Index() {
  const { id = '' } = useParams();

  const { data } = useGetPostQuery(id);
  const { author, publishedAt, title, tags, cover, thumbnail, body } = data;

  return (
    <>
      <SEO
        title={`${title} | ${MAIN_SLOGAN}`}
        canonical={`posts/${id}`}
        description={stripTags(body).slice(0, 150)}
        keywords={tags}
        image={thumbnail || undefined}
      />
      <Cover id={id} author={author} publishedAt={publishedAt} title={title} cover={cover} tags={tags} />
      <Content body={body} />
      <Footer />
    </>
  );
}

// Subcomponents

export default Index;
