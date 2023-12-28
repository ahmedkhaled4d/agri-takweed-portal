import React from 'react';
import HubButton from './HubButton';
import styles from '../charges.module.css';

function HubsButtons({ BtnsData, selectedHub, handleButtonSelect }) {
  return (
    <>
      <div className={styles.ReportsTableButtons}>
     
        
        
        {BtnsData?.map((el) => {
          return (
            <HubButton
              key={el.hubId}
              selectedHub={selectedHub}
              onClick={(e) => {
                handleButtonSelect(e.target.innerText, el.hubId);
              }}
              text={el?.hubName}
            />
          );
        })
        }
      </div>
         </>
  );
}

export default HubsButtons;
