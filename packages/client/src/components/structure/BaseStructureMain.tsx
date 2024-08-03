import { css } from '@emotion/react';
import { Outlet } from 'react-router-dom';

function BaseStructureMain() {
  return (
    <main css={styledContainer}>
      <Outlet />
    </main>
  );
}

// Styles
const styledContainer = css`
  min-height: 100vh;
`;

export default BaseStructureMain;
