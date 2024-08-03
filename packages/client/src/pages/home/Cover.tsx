import React, { useCallback, useRef } from 'react';
import { css, Theme, useTheme } from '@emotion/react';
import { MotionValue, useMotionValueEvent, useScroll } from 'framer-motion';
import Br from '~components/atom/Br';
import ScrollDownButton from '~components/buttons/ScrollDownButton';
import TypingEffect from '~components/effects/TypingEffect';
import { MAIN_SLOGAN } from '~constants';
import { slideIn } from '~styles/keyframes';
import media, { breakpoints } from '~styles/media';
import palette from '~styles/palette';

function Cover() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const handleScrollDown = useCallback(() => {
    const container = containerRef.current!;
    const { bottom } = container.getBoundingClientRect();

    window.scrollTo({
      behavior: 'smooth',
      top: window.scrollY + bottom,
      left: 0,
    });
  }, []);

  return (
    <div ref={containerRef} css={styledContainer}>
      <Layer>
        <Wallpaper />
      </Layer>
      <Layer>
        <Greeting scrollYProgress={scrollYProgress} onScrollDown={handleScrollDown} />
      </Layer>
    </div>
  );
}

// Subcomponent
interface LayerProps {
  children: React.ReactNode;
}

const Layer = ({ children }: LayerProps) => {
  return <div css={styledLayer}>{children}</div>;
};

const Wallpaper = () => {
  const theme = useTheme();
  const patternColor = theme.netural.main.replace('#', '%23');

  return <div css={styledWallpaper({ patternColor })}></div>;
};

interface GreetingProps {
  scrollYProgress: MotionValue<number>;
  onScrollDown(): void;
}

const Greeting = ({ scrollYProgress, onScrollDown }: GreetingProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    const content = contentRef.current!;

    content.style.transform = `translateY(${value * 75}%)`;
    content.style.opacity = `${1 - value}`;
  });

  return (
    <div css={styledGreeting}>
      <div ref={contentRef} css={styledGreetingContent}>
        <p css={styledBallon}>{MAIN_SLOGAN}</p>
        <h2 css={styledTitle}>
          <span css={styledWithBraket}>
            <TypingEffect texts={['Design', 'Development', 'and Others']} />
          </span>
          <Br only={['mobile', 'tablet']} />
          기록보관소
        </h2>
        <p css={styledDescription}>
          멤버들과 운영하는 개발 블로그 입니다.
          <Br />
          여러가지 디자인, 일상 이야기 등도 다루고 있어요!
        </p>
        <p css={styledCaption}>created by keyonnaise</p>
        <br />
      </div>
      <div css={styledGreetingFooter}>
        <ScrollDownButton onScrollDown={onScrollDown} />
      </div>
    </div>
  );
};

// Styles
const styledContainer = css`
  position: relative;
  width: 100vw;
  height: 100vh;
  min-height: 720px;
`;

const styledLayer = css`
  position: absolute;
  inset: 0;
`;

const styledWallpaper =
  ({ patternColor }: { patternColor: string }) =>
  (theme: Theme) => css`
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url('data:image/svg+xml;utf8,<svg width="24" height="24" viewBox="0 0 24 24" fill="${patternColor}" xmlns="http://www.w3.org/2000/svg"><path d="M0 3V1H24V3H12V21H24V23H0V21H11V3H0Z" opacity="0.05"/></svg>');

    &::before {
      content: '';
      position: absolute;
      inset: auto 0 0 0;
      height: 24px;
      /* background-color: black; */
      background-image: url('data:image/svg+xml;utf8,<svg width="64" height="16" viewBox="0 0 64 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M64 0.927514C63.8883 1.07643 63.7217 1.31309 63.5262 1.59076C63.039 2.28272 62.3725 3.22938 61.93 3.70751C61.58 4.01751 61.22 3.82751 60.9 3.59751C60.0156 2.8439 58.751 3.03678 57.5219 3.22426C56.7775 3.3378 56.0461 3.44935 55.42 3.34751C55.054 3.29522 54.1801 2.82999 53.4154 2.42287C53.1564 2.28499 52.91 2.15377 52.7 2.04751C52.5066 1.95923 52.3225 1.8568 52.1439 1.75742C51.4727 1.38401 50.8787 1.05358 50.16 1.67751C48.3999 3.02205 47.8183 3.55383 47.1762 3.64102C46.5051 3.73215 45.7681 3.33748 43.55 2.87751C42.8994 2.85809 42.0037 3.0791 41.1215 3.29678C40.1866 3.52746 39.2668 3.7544 38.67 3.68751C38.3633 3.61448 37.8592 3.07212 37.4149 2.59403C37.2508 2.41747 37.0948 2.24967 36.96 2.11751C36.6811 1.81604 36.3682 1.48616 36.0811 1.18353C35.9873 1.08464 35.8962 0.988648 35.81 0.897513C35.7535 0.842237 35.7004 0.788066 35.6498 0.736407C35.2976 0.376859 35.0647 0.139021 34.61 0.497514C34.4938 0.603183 34.3664 0.746816 34.2294 0.901229C33.7183 1.47746 33.074 2.2038 32.38 1.66751C32 1.45751 31.63 1.32751 31.29 1.77751C31.0374 2.0452 30.8033 2.44792 30.5614 2.86403C30.1616 3.55159 29.7407 4.2757 29.18 4.48751C28.7925 4.50135 28.3139 4.2949 27.8471 4.0935C27.6394 4.00388 27.434 3.91527 27.24 3.84751C27.1703 3.81796 27.1014 3.78859 27.0334 3.75954C25.9496 3.29701 25.0578 2.91642 23.75 3.21751C22.3464 3.59266 21.6708 2.68344 20.9979 1.7779C20.6305 1.28343 20.2639 0.790066 19.78 0.507514C19.3075 0.440015 18.7803 0.973928 18.3061 1.4542C18.0778 1.68545 17.8618 1.90426 17.67 2.03751C16.56 3.12751 16.4 3.09751 14.88 2.70751C14.6034 2.64114 14.3146 2.574 14.0216 2.50588C13.2552 2.3277 12.46 2.14284 11.78 1.94751C11.2443 1.84678 10.7882 1.40219 10.3379 0.963203C9.80476 0.443483 9.27969 -0.0683809 8.64 0.00751403C7.89889 0.223111 6.96611 0.614227 6.01023 1.01503C4.83795 1.50657 3.63092 2.01269 2.7 2.22751C2.19203 2.16321 1.58897 1.8095 0.986521 1.45615C0.652032 1.25996 0.317732 1.06388 0 0.917514V4.80307C0.317732 4.93119 0.652032 5.10281 0.986521 5.27453C1.58897 5.58381 2.19203 5.8934 2.7 5.94968C3.63092 5.76165 4.83795 5.31866 6.01022 4.88843C6.96611 4.53762 7.89888 4.19528 8.64 4.00658C9.27969 3.94015 9.80476 4.38817 10.3379 4.84307C10.7882 5.2273 11.2443 5.61643 11.78 5.70461C12.46 5.87557 13.2552 6.03738 14.0217 6.19333C14.3147 6.25295 14.6034 6.31172 14.88 6.36981C16.4 6.71117 16.56 6.73743 17.67 5.78338C17.8618 5.66675 18.0778 5.47523 18.3061 5.27282C18.7803 4.85245 19.3075 4.38513 19.78 4.44421C20.2639 4.69152 20.6305 5.12335 20.9979 5.55615C21.6708 6.34874 22.3464 7.14456 23.75 6.8162C25.0578 6.55267 25.9496 6.88578 27.0334 7.29062C27.1014 7.31605 27.1703 7.34176 27.24 7.36762C27.434 7.42692 27.6394 7.50449 27.8471 7.58293C28.3139 7.7592 28.7925 7.93991 29.18 7.9278C29.7407 7.7424 30.1616 7.10861 30.5614 6.50681C30.8033 6.1426 31.0374 5.79011 31.29 5.55581C31.63 5.16194 32 5.27572 32.38 5.45953C33.074 5.92893 33.7183 5.29318 34.2294 4.78882C34.3664 4.65367 34.4938 4.52795 34.61 4.43546C35.0647 4.12168 35.2976 4.32985 35.6498 4.64456C35.7004 4.68977 35.7535 4.73719 35.81 4.78557C35.8962 4.86533 35.9873 4.94934 36.0811 5.0359C36.3682 5.30079 36.6811 5.58952 36.96 5.8534C37.0948 5.96907 37.2508 6.11594 37.4149 6.27048C37.8592 6.68894 38.3633 7.16366 38.67 7.22758C39.2668 7.28612 40.1866 7.08749 41.1215 6.88558C42.0037 6.69505 42.8994 6.50161 43.55 6.51861C45.7851 6.92429 46.5164 7.27194 47.1917 7.18497C47.8276 7.10307 48.414 6.63569 50.16 5.46828C50.8787 4.92217 51.4727 5.21139 52.1439 5.53822C52.3225 5.62521 52.5066 5.71486 52.7 5.79213C52.91 5.88513 53.1564 5.99998 53.4154 6.12067C54.1801 6.47701 55.054 6.88422 55.42 6.92999C56.0461 7.01912 56.7775 6.92148 57.5219 6.8221C58.751 6.65801 60.0156 6.48919 60.9 7.1488C61.22 7.35012 61.58 7.51642 61.93 7.24508C62.3725 6.82659 63.039 5.998 63.5262 5.39235C63.7217 5.14931 63.8883 4.94217 64 4.81183V0.927514Z" fill="white" fill-opacity="0.2"></path><path d="M64 4.81183C63.8883 4.94217 63.7217 5.14931 63.5262 5.39235C63.039 5.998 62.3725 6.82659 61.93 7.24508C61.58 7.51642 61.22 7.35012 60.9 7.1488C60.0156 6.48919 58.751 6.65801 57.5219 6.8221C56.7775 6.92148 56.0461 7.01912 55.42 6.92999C55.054 6.88422 54.1801 6.47701 53.4154 6.12067C53.1564 5.99998 52.91 5.88513 52.7 5.79213C52.5066 5.71486 52.3225 5.62521 52.1439 5.53822C51.4727 5.21139 50.8787 4.92217 50.16 5.46828C48.414 6.63569 47.8276 7.10307 47.1917 7.18497C46.5164 7.27194 45.7851 6.92429 43.55 6.51861C42.8994 6.50161 42.0037 6.69505 41.1215 6.88558C40.1866 7.08749 39.2668 7.28612 38.67 7.22758C38.3633 7.16366 37.8592 6.68894 37.4149 6.27048C37.2508 6.11594 37.0948 5.96907 36.96 5.8534C36.6811 5.58952 36.3682 5.30078 36.0811 5.0359C35.9873 4.94934 35.8962 4.86533 35.81 4.78557C35.7535 4.73719 35.7004 4.68977 35.6498 4.64456C35.2976 4.32985 35.0647 4.12168 34.61 4.43546C34.4938 4.52795 34.3664 4.65367 34.2294 4.78882C33.7183 5.29318 33.074 5.92893 32.38 5.45953C32 5.27572 31.63 5.16194 31.29 5.55581C31.0374 5.79011 30.8033 6.1426 30.5614 6.50681C30.1616 7.10861 29.7407 7.7424 29.18 7.9278C28.7925 7.93991 28.3139 7.7592 27.8471 7.58293C27.6394 7.50449 27.434 7.42692 27.24 7.36762C27.1703 7.34176 27.1014 7.31605 27.0334 7.29062C25.9496 6.88578 25.0578 6.55266 23.75 6.8162C22.3464 7.14456 21.6708 6.34874 20.9979 5.55615C20.6305 5.12335 20.2639 4.69152 19.78 4.44421C19.3075 4.38513 18.7803 4.85245 18.3061 5.27282C18.0778 5.47523 17.8618 5.66675 17.67 5.78338C16.56 6.73743 16.4 6.71117 14.88 6.36981C14.6034 6.31172 14.3147 6.25295 14.0217 6.19333C13.2552 6.03738 12.46 5.87557 11.78 5.7046C11.2443 5.61643 10.7882 5.2273 10.3379 4.84307C9.80476 4.38817 9.27969 3.94015 8.64 4.00658C7.89888 4.19528 6.96611 4.53762 6.01022 4.88843C4.83795 5.31866 3.63092 5.76165 2.7 5.94968C2.19203 5.8934 1.58897 5.58381 0.986521 5.27453C0.652032 5.10281 0.317732 4.93119 0 4.80307V6.80307C0.317732 6.93119 0.652032 7.10281 0.986521 7.27453C1.58897 7.58381 2.19203 7.8934 2.7 7.94968C3.63092 7.76165 4.83795 7.31866 6.01022 6.88843C6.96611 6.53762 7.89888 6.19528 8.64 6.00658C9.27969 5.94015 9.80476 6.38817 10.3379 6.84307C10.7882 7.2273 11.2443 7.61643 11.78 7.7046C12.46 7.87557 13.2552 8.03738 14.0217 8.19333C14.3147 8.25295 14.6034 8.31172 14.88 8.36981C16.4 8.71117 16.56 8.73743 17.67 7.78338C17.8618 7.66675 18.0778 7.47523 18.3061 7.27282C18.7803 6.85245 19.3075 6.38513 19.78 6.44421C20.2639 6.69152 20.6305 7.12335 20.9979 7.55615C21.6708 8.34874 22.3464 9.14456 23.75 8.8162C25.0578 8.55267 25.9496 8.88578 27.0334 9.29062C27.1014 9.31604 27.1703 9.34176 27.24 9.36762C27.434 9.42692 27.6394 9.50449 27.8471 9.58293C28.3139 9.7592 28.7925 9.93991 29.18 9.9278C29.7407 9.7424 30.1616 9.10861 30.5614 8.50681C30.8033 8.1426 31.0374 7.79011 31.29 7.55581C31.63 7.16194 32 7.27572 32.38 7.45953C33.074 7.92893 33.7183 7.29318 34.2294 6.78882C34.3664 6.65367 34.4938 6.52795 34.61 6.43546C35.0647 6.12168 35.2976 6.32985 35.6498 6.64456C35.7004 6.68977 35.7535 6.73719 35.81 6.78557C35.8962 6.86533 35.9873 6.94934 36.0811 7.0359C36.3682 7.30078 36.6811 7.58952 36.96 7.8534C37.0948 7.96907 37.2508 8.11594 37.4149 8.27048C37.8592 8.68894 38.3633 9.16366 38.67 9.22758C39.2668 9.28612 40.1866 9.08749 41.1215 8.88558C42.0037 8.69505 42.8994 8.50161 43.55 8.51861C45.7851 8.92429 46.5164 9.27194 47.1917 9.18497C47.8276 9.10307 48.414 8.63569 50.16 7.46828C50.8787 6.92217 51.4727 7.21139 52.1439 7.53822C52.3225 7.62521 52.5066 7.71486 52.7 7.79213C52.91 7.88513 53.1564 7.99998 53.4154 8.12067C54.1801 8.47701 55.054 8.88422 55.42 8.92999C56.0461 9.01912 56.7775 8.92148 57.5219 8.8221C58.751 8.65801 60.0156 8.48919 60.9 9.1488C61.22 9.35012 61.58 9.51642 61.93 9.24508C62.3725 8.82659 63.039 7.998 63.5262 7.39235C63.7217 7.14931 63.8883 6.94217 64 6.81183V4.81183Z" fill="black" fill-opacity="0.1"></path></svg>'),
        linear-gradient(${theme.dark.alpha(0)} 27.5%, ${theme.background.main} 27.5%);
      background-size: auto 100%;
    }
  `;

const styledGreeting = (theme: Theme) => css`
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
  width: 100%;
  height: 100%;
  color: ${theme.text.main};
`;

const styledGreetingContent = css`
  width: min(${breakpoints.xl}px, calc(100% - 48px));
  margin: 0 auto;
  text-align: center;
`;

const styledGreetingFooter = (theme: Theme) => css`
  z-index: ${theme.elevation.fab};
  position: absolute;
  inset: auto auto 64px 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  margin: 0 auto;
`;

const styledTitle = (theme: Theme) => css`
  margin: 0.5em 0 1em 0;
  font-weight: ${theme.weights.extrabold};
  line-height: 1.6;

  ${media.xs} {
    font-size: 36px;
  }

  ${media.md} {
    font-size: 48px;
  }

  ${media.xl} {
    font-size: 64px;
  }
`;

const styledDescription = (theme: Theme) => css`
  margin-bottom: 1em;
  color: ${theme.text.sub};
  line-height: 1.8;

  ${media.xs} {
    font-size: 16px;
  }

  ${media.md} {
    font-size: 18px;
  }
`;

const styledCaption = (theme: Theme) => css`
  opacity: 0.6;
  font-family: 'Ubuntu Sans Mono', monospace;
  font-size: 14px;
  font-weight: ${theme.weights.bold};
`;

const styledBallon = (theme: Theme) => css`
  position: relative;
  display: inline-flex;
  align-items: center;
  height: 40px;
  padding: 0 12px;
  color: ${theme.netural.contrast};
  background-color: ${theme.netural.main};
  border-radius: ${theme.radii.xs};
  box-shadow: ${theme.shadows.md};

  animation-name: ${slideIn('top')};
  animation-timing-function: ease;
  animation-duration: 400ms;
  animation-fill-mode: both;

  &::after {
    position: absolute;
    content: '';
    inset: 40px auto auto 50%;
    transform: translateX(-50%);
    border-top: 8px solid ${theme.netural.main};
    border-right: 8px solid transparent;
    border-bottom: 0;
    border-left: 8px solid transparent;
  }

  ${media.xs} {
    font-size: 14px;
  }

  ${media.md} {
    font-size: 16px;
  }
`;

const styledWithBraket = (theme: Theme) => css`
  color: ${palette.primary};
  font-weight: bolder;

  &::before,
  &::after {
    position: relative;
    bottom: 0.125ex;
  }

  &::before {
    content: '{';
    margin: 0 0.25ch 0 0.5ch;
    color: ${theme.text.main};
  }

  &::after {
    content: '}';
    margin: 0 0.5ch 0 0.25ch;
    color: ${theme.text.main};
  }
`;

export default Cover;
