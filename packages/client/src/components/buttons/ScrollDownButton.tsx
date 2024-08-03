import { css } from '@emotion/react';
import { motion } from 'framer-motion';
import Button from '~components/buttons/Button';

interface Props {
  onScrollDown?(): void;
}

function ScrollDownButton({ onScrollDown }: Props) {
  return (
    <Button
      as="button"
      variant="none"
      css={styledContainer}
      onClick={onScrollDown}
    >
      <AnimateIcon />
      <p css={styledCaption}>Scroll Down</p>
    </Button>
  );
}

// Subcomponents
const AnimateIcon = () => {
  const animate = {
    y: [0, 4],
    opacity: [0, 1, 1, 0],
    transition: {
      y: {
        ease: 'easeOut',
        times: [0, 1],
        duration: 1.2,
        repeat: Infinity,
      },
      opacity: {
        ease: 'easeOut',
        times: [0, 0.2, 0.4, 1],
        duration: 1.2,
        repeat: Infinity,
      },
    },
  };

  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13 4H11C8.79086 4 7 5.79086 7 8V16C7 18.2091 8.79086 20 11 20H13C15.2091 20 17 18.2091 17 16V8C17 5.79086 15.2091 4 13 4ZM11 2C7.68629 2 5 4.68629 5 8V16C5 19.3137 7.68629 22 11 22H13C16.3137 22 19 19.3137 19 16V8C19 4.68629 16.3137 2 13 2H11Z"
      />

      <motion.path
        d="M11 6H13V10H11V6Z"
        animate={animate}
      />
      <path d="M9.46973 15.4708L10.5304 14.4102L12.0001 15.8798L13.4697 14.4102L14.5304 15.4708L12.0001 18.0011L9.46973 15.4708Z" />
    </svg>
  );
};

// Styles
const styledContainer = css`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const styledCaption = css`
  margin-top: 1em;
  font-size: 12px;
`;

export default ScrollDownButton;
