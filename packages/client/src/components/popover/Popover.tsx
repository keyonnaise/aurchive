import { useEffect, useRef } from 'react';
import { css } from '@emotion/react';
import * as PopoverPrimitives from '@radix-ui/react-popover';
import _ from 'lodash';

export interface VirtualElement {
  getBoundingClientRect(): DOMRect;
}

export type Reference = Element | VirtualElement | null;
export type Boundary = Element | null;

interface Props {
  reference?: Reference;
  boundary?: Boundary;
  open?: boolean;
  onOpenChange?(open: boolean): void;
  children: React.ReactNode;
}

function Popover({ reference, boundary, open, onOpenChange, children }: Props) {
  return (
    <Root
      open={open}
      onOpenChange={onOpenChange}
    >
      <Anchor reference={reference} />
      <Content boundary={boundary}>{children}</Content>
    </Root>
  );
}

// Subcomponents
interface RootProps {
  open?: boolean;
  onOpenChange?(open: boolean): void;
  children: React.ReactNode;
}

const Root = ({ open, onOpenChange, children }: RootProps) => {
  return (
    <PopoverPrimitives.Root
      open={open}
      onOpenChange={onOpenChange}
    >
      {children}
    </PopoverPrimitives.Root>
  );
};

interface AnchorProps {
  reference?: Reference;
}

const Anchor = ({ reference }: AnchorProps) => {
  const anchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (_.isNil(reference)) return;

    const anchor = anchorRef.current!;
    const { top, left, width, height } = reference.getBoundingClientRect();

    anchor.style.top = `${top}px`;
    anchor.style.left = `${left}px`;
    anchor.style.width = `${width || 1}px`;
    anchor.style.height = `${height || 1}px`;
  }, [reference]);

  return (
    <PopoverPrimitives.Anchor
      ref={anchorRef}
      css={styledTrigger}
    />
  );
};

interface ContentProps {
  boundary?: Boundary;
  children: React.ReactNode;
}

const Content = ({ children, boundary }: ContentProps) => {
  return (
    <PopoverPrimitives.Content
      collisionBoundary={boundary}
      sideOffset={8}
      onOpenAutoFocus={(e) => e.preventDefault()}
    >
      {children}
    </PopoverPrimitives.Content>
  );
};

// Styles
const styledTrigger = css`
  position: fixed;
  background: none;
  border: 0;
  opacity: 0;
`;

export default Popover;
