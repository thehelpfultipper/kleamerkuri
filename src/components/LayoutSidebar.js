import React from 'react';

import '../styles/global.scss';

export default function LayoutSidebar({ children }) {
  return (
    <>
      <div className={`mainBanner container rnd`}>
        <img
          src={`https://media.licdn.com/dms/image/v2/D5616AQHnojzWiIAvwA/profile-displaybackgroundimage-shrink_350_1400/profile-displaybackgroundimage-shrink_350_1400/0/1722965448088?e=1740009600&v=beta&t=jUn0gy5HbLa19_QTHVeMt4IrAcSNT0ACYc29VQuZ1_Q`}
          className={`respImg`}
          alt=''
        />
      </div>
      {children}
    </>
  )
}