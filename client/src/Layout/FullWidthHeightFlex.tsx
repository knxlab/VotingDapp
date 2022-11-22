import React from 'react';
import styles from './styles.module.css';

export function FullWithHeightFlex({ children }: { children: React.ReactNode }) {
    return (
        <div className={styles.fullWithHeightFlex}>{children}</div>
    );
}