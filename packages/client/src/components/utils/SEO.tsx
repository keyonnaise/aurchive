import { Helmet } from 'react-helmet-async';
import { MAIN_SLOGAN } from '~constants';

const DOMAIN = 'https://aurchive.com';

const LOCALES = {
  en: 'en_US',
  kr: 'ko_KR',
} as const;

interface Props {
  locale?: keyof typeof LOCALES;
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  image?: string;
}

function SEO({
  locale = 'kr',
  title = MAIN_SLOGAN,
  description = '크루들과 운영하는 개발 블로그 입니다. 여러가지 디자인, 일상 이야기 등도 다루고 있어요!',
  keywords = ['웹', '개발', 'HTML', 'CSS', 'Javascript', 'Typescript'],
  canonical = '',
  image = '',
}: Props) {
  const lang = LOCALES[locale];

  return (
    <>
      <Helmet>
        <html lang={lang} />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords.join(', ')} />
        <link rel="canonical" href={`${DOMAIN}/${canonical}`} />
        <link rel="alternate" hrefLang="kr" href={`${DOMAIN}/`} />
        <link rel="image_src" href={image} />
        <meta itemProp="image" content={image} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content={lang} />
        <meta property="og:site_name" content={title} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={`${DOMAIN}/${canonical}`} />
        <meta property="og:image" content={image} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="600" />
        <meta property="fb:pages" content={title} />
        <meta name="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={image} />
        <meta name="twitter:site" content={`@${title}`} />
        <meta name="naver-site-verification" content="730d7c39081babc401c51859ae6d5803e295da07" />
      </Helmet>
      <h1 className="sr-only">{title}</h1>
    </>
  );
}

export default SEO;
