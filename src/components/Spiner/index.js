import React from 'react';

import styles from './Spiner.module.scss';

const Spiner = ({ status }) => {
  return (
    <div className={styles.spinnerWraper}>
      {/* {status && <p style={{ color: 'black' }}>{status}</p>} */}
      <div className={styles.spinner}></div>
    </div>
  );
};

export default Spiner;
