import { FC, PropsWithChildren } from 'react';
import Icon from '../icon';
import styles from './layout.module.css';

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.title}>React Currency Converter</h1>
      </header>
      <main className={styles.main}>
        {children}
      </main>
      <footer className={styles.footer}>
        <p className={styles.copyrights}>
          <Icon id="copyright"/>
          All rights reserved
        </p>
      </footer>
    </>
  );
};

export default Layout;
