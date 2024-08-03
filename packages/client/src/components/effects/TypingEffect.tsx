import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { NonEmptyArray } from '~lib/isNonEmptyArray';
import wait from '~lib/wait';
import { blink } from '~styles/keyframes';

interface Props {
  texts: NonEmptyArray<string>;
  speed?: number;
  delay?: number;
}

function TypingEffect({ texts, speed = 100, delay = 1000 }: Props) {
  const [currentText, setCurrentText] = useState('');

  useEffect(() => {
    let isEnded = false;
    let i = 0;

    const typing = async () => {
      const letters = texts[i].split('');

      for (const letter of letters) {
        await wait(speed);

        if (isEnded) return;

        setCurrentText((prev) => prev + letter);
      }

      await wait(2000);
      remove();
    };

    const remove = async () => {
      const letters = texts[i].split('');

      for (const _ of letters) {
        await wait(speed);

        if (isEnded) return;

        setCurrentText((prev) => prev.slice(0, -1));
      }

      i = texts[i + 1] !== undefined ? i + 1 : 0;

      typing();
    };

    setTimeout(typing, delay);

    return () => {
      setCurrentText('');

      isEnded = true;
    };
  }, [texts, speed, delay]);

  return <span css={styledSpan}>{currentText}</span>;
}

// Styles
const styledSpan = css`
  &::after {
    content: '';
    position: relative;
    display: inline-block;
    width: 0.25ch;
    height: 1ex;
    background-color: currentColor;
    vertical-align: middle;
    animation: ${blink} 800ms step-end infinite;
  }
`;

export default TypingEffect;
