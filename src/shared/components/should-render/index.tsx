import { FC, PropsWithChildren } from 'react';

type Props = {
  if: unknown;
};

const ShouldRender: FC<PropsWithChildren<Props>> = ({
  if: condition,
  children,
}) => {
  return <>{condition ? children : ''}</>;
};

export default ShouldRender;
