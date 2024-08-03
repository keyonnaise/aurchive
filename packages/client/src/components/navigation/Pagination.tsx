import { css, Theme } from '@emotion/react';
import Button from '~components/buttons/Button';

interface Props {
  page: number;
  pageCount: number;
  isDisabled?: boolean;
  prev?: () => void;
  next?: () => void;
}

function Pagination({ page, pageCount, isDisabled = false, prev, next }: Props) {
  return (
    <div css={styledContainer}>
      <Button
        as="button"
        colorScheme="info"
        size="sm"
        onClick={prev}
        isDisabled={isDisabled || page <= 1}
      >
        PREV
      </Button>
      <div css={styledCenter}>
        {page} of {pageCount}
      </div>
      <Button
        as="button"
        colorScheme="info"
        size="sm"
        onClick={next}
        isDisabled={isDisabled || pageCount <= page}
      >
        NEXT
      </Button>
    </div>
  );
}

// Styles
const styledContainer = css`
  display: flex;
  align-items: center;
`;

const styledCenter = (theme: Theme) => css`
  flex-grow: 1;
  flex-basis: 0;
  font-size: 14px;
  text-align: center;
  color: ${theme.text.sub};
`;

export default Pagination;
