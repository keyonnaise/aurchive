import { Fragment } from 'react';
import { useShallow } from 'zustand/react/shallow';
import useOverlayGroupStore from '~store/useOverlayGroupStore';

function OverlayGroup() {
  const group = useOverlayGroupStore(useShallow(({ group }) => group));

  if (group.size === 0) return null;

  return (
    <>
      {[...group.entries()].map(([id, element]) => (
        <Fragment key={id}>{element}</Fragment>
      ))}
    </>
  );
}

export default OverlayGroup;
