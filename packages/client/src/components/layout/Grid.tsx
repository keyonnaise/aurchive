import { Children, createContext, isValidElement, useContext, useMemo } from 'react';
import { css } from '@emotion/react';
import { P, match } from 'ts-pattern';
import contains from '~lib/contains';
import media, { Breakpoint } from '~styles/media';

const MAX_COLUMNS = 12;

type Direction = 'row' | 'row-reverse' | 'column' | 'column-reverse';
type Wrap = 'wrap' | 'wrap-reverse';
type JustifyContent = 'start' | 'center' | 'end';
type AlignItems = 'start' | 'center' | 'end' | 'stretch';
type Gap = [number, number] | number;
type Size = true | 'auto' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

interface ContainerProps {
  container: true;
  item?: undefined;
  direction?: Direction;
  wrap?: Wrap;
  justifyContent?: JustifyContent;
  alignItems?: AlignItems;
  gap?: Gap;
  xs?: undefined;
  sm?: undefined;
  md?: undefined;
  lg?: undefined;
  xl?: undefined;
  children?: React.ReactNode;
}

interface ItemProps {
  container?: undefined;
  item: true;
  direction?: undefined;
  wrap?: undefined;
  justifyContent?: undefined;
  alignItems?: undefined;
  gap?: undefined;
  xs?: Size;
  sm?: Size;
  md?: Size;
  lg?: Size;
  xl?: Size;
  children?: React.ReactNode;
}

type Props = ContainerProps | ItemProps;

function Grid(props: Props) {
  return match(props)
    .with({ container: true }, (props) => <Container {...props} />)
    .with({ item: true }, (props) => <Item {...props} />)
    .exhaustive();
}

// Context API
interface ContextValue {
  direction: Direction;
  wrap: Wrap;
  justifyContent: JustifyContent;
  alignItems: AlignItems;
  gap: Gap;
}

const GridContext = createContext<ContextValue | null>(null);

function useGridContext() {
  return useContext(GridContext);
}

// Subcontents
const Container = ({
  direction = 'row',
  wrap = 'wrap',
  justifyContent = 'start',
  alignItems = 'stretch',
  gap = 16,
  children,
}: ContainerProps) => {
  const value = useMemo(
    () => ({ direction, wrap, justifyContent, alignItems, gap }),
    [direction, wrap, justifyContent, alignItems, gap],
  );
  const validChildren = Children.map(children, (child) => {
    if (isValidElement(child) && child.type === Grid && child.props.item) {
      return child;
    } else {
      console.warn('Grid 컨테이너에는 Grid 아이템 요소만 포함될 수 있습니다.');
      return null;
    }
  });

  return (
    <GridContext.Provider value={value}>
      <div css={styledContainer({ direction, wrap, justifyContent, alignItems, gap })}>{validChildren}</div>
    </GridContext.Provider>
  );
};

const Item = ({ xs, sm, md, lg, xl, children }: ItemProps) => {
  const parent = useGridContext();

  if (parent === null) {
    console.warn('Grid 아이템 요소는 반드시 Grid 컨테이너 요소 하위에 있어야 합니다.');
    return null;
  }

  return (
    <GridContext.Provider value={null}>
      <div css={styledItem({ parent, queries: { xs, sm, md, lg, xl } })}>{children}</div>
    </GridContext.Provider>
  );
};

// Styles
const styledContainer = ({
  direction,
  wrap,
  justifyContent,
  alignItems,
  gap,
}: {
  direction: Direction;
  wrap: Wrap;
  justifyContent: JustifyContent;
  alignItems: AlignItems;
  gap: Gap;
}) => css`
  display: flex;
  flex-direction: ${direction};
  flex-wrap: ${wrap};
  justify-content: ${justifyContent};
  align-items: ${alignItems};
  gap: ${Array.isArray(gap) ? `${gap[0]}px ${gap[1]}px` : typeof gap === 'number' ? `${gap}px` : undefined};
  width: ${contains(['row', 'row-reverse'], direction) && '100%'};
  height: ${contains(['column', 'column-reverse'], direction) && '100%'};
`;

const styledItem = ({ parent, queries }: { parent: ContextValue; queries: Record<Breakpoint, Size | undefined> }) => [
  css`
    max-width: 100%;
    max-height: 100%;

    ${(Object.entries(queries) as Entries<typeof queries>)
      .filter((query): query is [Breakpoint, Size] => query[1] !== undefined)
      .map((query) =>
        match({ parent, query })
          .with(
            {
              parent: { direction: P.union('row', 'row-reverse') },
              query: [P.string, true],
            },
            ({ query: [key] }) => css`
              ${media[key]} {
                flex-grow: 1;
                flex-basis: 0;
                min-width: 0;
              }
            `,
          )
          .with(
            {
              parent: { direction: P.union('row', 'row-reverse') },
              query: [P.string, 'auto'],
            },
            ({ query: [key] }) => css`
              ${media[key]} {
                flex-grow: 0;
                flex-basis: auto;
              }
            `,
          )
          .with(
            {
              parent: { direction: P.union('row', 'row-reverse') },
              query: [P.string, P.number],
            },
            ({ parent, query: [key, value] }) => {
              const gap = Array.isArray(parent.gap) ? parent.gap[1] : parent.gap;
              const ratio = value / MAX_COLUMNS;
              const adjustment = gap * (1 - ratio);

              return css`
                min-width: 0;

                ${media[key]} {
                  flex-grow: 0;
                  flex-basis: calc(${ratio} * 100% - ${adjustment}px);
                }
              `;
            },
          )
          .with(
            {
              parent: { direction: P.union('column', 'column-reverse') },
              query: [P.string, true],
            },
            ({ query: [key] }) => css`
              ${media[key]} {
                flex-grow: 1;
                flex-basis: 0;
                min-height: 0;
              }
            `,
          )
          .with(
            {
              parent: { direction: P.union('column', 'column-reverse') },
              query: [P.string, 'auto'],
            },
            ({ query: [key] }) => css`
              ${media[key]} {
                flex-grow: 0;
                flex-basis: auto;
              }
            `,
          )
          .with(
            {
              parent: { direction: P.union('column', 'column-reverse') },
              query: [P.string, P.number],
            },
            ({ parent, query: [key, value] }) => {
              const gap = Array.isArray(parent.gap) ? parent.gap[0] : parent.gap;
              const ratio = value / MAX_COLUMNS;
              const adjustment = gap * (1 - ratio);

              return css`
                min-height: 0;

                ${media[key]} {
                  flex-grow: 0;
                  flex-basis: calc(${ratio} * 100% - ${adjustment}px);
                }
              `;
            },
          )
          .exhaustive(),
      )}
  `,
];

export default Grid;
