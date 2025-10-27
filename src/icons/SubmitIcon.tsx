import React from 'react';

const SubmitIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="24"
    height="24"
    {...props}>
    <title>Submit</title>
    <path
      d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"
      fill="currentColor"></path>
  </svg>
);

export default SubmitIcon;
