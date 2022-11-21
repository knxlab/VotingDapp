import React from 'react';
import styles from './styles.module.css';

export function RowSpaceBetween({ children }: { children: React.ReactNode }) {
    return (
        <div className={styles.rowSpaceBetween}>{children}</div>
    );
}