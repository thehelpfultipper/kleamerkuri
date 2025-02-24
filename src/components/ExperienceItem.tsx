import React, { useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import ExperienceDesc from './ExperienceDesc';
import DisableItem from './UI/DisableItem';
import { IResumeExperience, IMouseEvents } from '../helpers/interfaces';

interface IExperienceItemProps {
  exp: IResumeExperience;
  isDisabled: boolean;
  onMouseLeave: IMouseEvents;
  onMouseEnter: IMouseEvents;
}

export default function ExperienceItem({
  exp,
  isDisabled,
  onMouseLeave,
  onMouseEnter,
}: IExperienceItemProps) {
  const { dates, title, company, desc } = exp;
  const [activeSectionVal, setActiveSectionVal] = useState(`desc_${1}`);

  const filterBtnHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLElement;
    const newSection = target.getAttribute('aria-controls');
    if (newSection) setActiveSectionVal(newSection);
  };

  let actionItems = null;
  let supportItems = null;
  if (desc) {
    actionItems = desc.map((item, index) => {
      const target = `desc_${index + 1}`;
      return (
        <button
          id={`action_${item.action}`}
          key={`action_${index + 1}`}
          type="button"
          className={`filterBtn ${target === activeSectionVal ? 'active' : ''}`}
          aria-controls={target}
          onClick={filterBtnHandler}>
          {item.action}
        </button>
      );
    });
    supportItems = desc.map((item, index) => {
      const target = `desc_${index + 1}`;
      return (
        <div
          role="tabpanel"
          hidden={activeSectionVal !== target}
          aria-labelledby={`action_${item.action}`}
          id={target}
          key={target}>
          <ExperienceDesc desc={item.support} />
        </div>
      );
    });
  }
  return (
    <DisableItem
      cs="expItem displayItem rnd"
      isDisabled={isDisabled}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}>
      <Grid
        container
        flexDirection={{ xs: 'column', md: 'row' }}>
        <Grid md={3}>
          <div className="expDate">{dates}</div>
        </Grid>
        <Grid md={9}>
          <div className="expTitle">
            <span>{`${title} ·`}</span>
            <span className="expCompany">{company}</span>
          </div>
          <div className="expDesc">
            <div id="actionList">{actionItems}</div>
            {supportItems}
          </div>
        </Grid>
      </Grid>
    </DisableItem>
  );
}
