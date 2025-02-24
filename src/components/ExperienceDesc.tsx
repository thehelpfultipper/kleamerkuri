import React from 'react';

interface IExperienceDescProps {
  desc: string[];
}

export default function ExperienceDesc({ desc }: IExperienceDescProps) {
  return desc && desc.map((str, i) => <p key={`item_support_${i}`}>{str}</p>);
}
