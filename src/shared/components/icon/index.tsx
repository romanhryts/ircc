import { FC } from 'react';

type Props = {
  id: string;
  classes?: string;
};

const Icon: FC<Props> = ({ id, classes }) => {
  const classNames = `material-symbols-outlined ${classes ?? ''}`;
  return <span className={classNames}>{id}</span>;
};

export default Icon;
