import React from 'react';
import ActionLinks from './ActionLinks';

import '../styles/footer.scss';

export default function Footer() {
  return (
    <footer className="footerContainer">
      <div className="footer1">
        <div className="signOff">
          <h3>Klea Merkuri</h3>
          <p>
            <span className="note">✦</span> Each new project is a new challenge with a fresh
            approach.
          </p>
        </div>
        <ActionLinks />
      </div>
      <div className="footer2">
        <div className="copyRight">
          <p>
            <span className="copyYr">© {new Date().getFullYear()}</span>{' '}
            <span>Portfolio by Klea Merkuri. All Rights Reserved.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
