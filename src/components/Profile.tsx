import React, { useState, useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import CircleIcon from '@mui/icons-material/Circle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ActionLinks from './ActionLinks';
import { IProfile } from '../helpers/interfaces';

import '../styles/profile.scss';

const sections = [
  { id: 'about', name: 'About' },
  { id: 'experience', name: 'Experience' },
  { id: 'projects', name: 'Projects' },
];

function Profile({ profile }: { profile: IProfile }) {
  const [activeSection, setActiveSection] = useState(sections[0].id);

  const CustomList = styled(List)({
    '&': {
      position: 'relative',
    },
    '& .MuiTypography-root': {
      fontSize: 18,
      fontWeight: 600,
      opacity: '50%',
    },
    '& .active .MuiTypography-root': {
      opacity: '100%',
    },
    '& .MuiListItemIcon-root': {
      minWidth: 0,
      marginRight: 12,
    },
    '& .MuiSvgIcon-root': {
      // fontSize: 18,
      fontSize: 20,
      color: '#d2439d',
      opacity: '50%',
      position: 'absolute',
      top: '30%',
      left: '0',
      // transform: 'scale(.5)',
      transition: 'all 0.5s ease-out',
    },
    '& .dot': {
      transform: 'scale(1)',
    },
    '& .eye': {
      transform: 'scale(0)',
      opacity: '0',
    },
    '& .active .dot': {
      transform: 'scale(0)',
      opacity: '0',
    },
    '& .active .eye': {
      transform: 'scale(1)',
      opacity: '1',
    },
    '& .active .MuiSvgIcon-root': {
      // opacity: '100%',
      // transform: 'scale(1)',
      // fontSize: 20,
    },
  });

  const observerRef = useRef<IntersectionObserver | null>(null);
  const isScrollingRef = useRef(false);

  useEffect(() => {
    const options = {
      rootMargin: '0px 0px -50% 0px',
      threshold: [0.1, 0.5, 0.9],
    };

    observerRef.current = new IntersectionObserver((entries) => {
      if (isScrollingRef.current) return;
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, options);

    // Observe each section
    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (observerRef.current) {
        if (element) {
          observerRef.current.observe(element);
        } else {
          console.warn(`Element with ID ${section.id} not found`);
        }
      }
    });

    return () => {
      // Cleanup observer on unmount
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const navLinkClickHandler = (id: string) => {
    isScrollingRef.current = true;
    setActiveSection(id);

    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    setTimeout(() => {
      isScrollingRef.current = false; // Re-enable observer updates after scrolling completes.
    }, 500); // Adjust timeout to match scroll animation duration.
  };

  return (
    <>
      <div className="profileLead">
        <h1>{profile.name}</h1>
        <h2>{profile.title}</h2>
        <p>{profile.lead}</p>
      </div>
      <nav className="sidebarMenu">
        <CustomList>
          {sections.map((item, index) => {
            const isActive = item.id === activeSection;
            return (
              <ListItem
                key={index + 1}
                className={`${isActive ? 'active' : ''}`}>
                <ListItemIcon>
                  <VisibilityIcon className="eye" />
                  <CircleIcon className="dot" />
                </ListItemIcon>
                <ListItemText>
                  <button
                    className="noBtn"
                    type="button"
                    onClick={() => navLinkClickHandler(item.id)}>
                    {item.name}
                  </button>
                </ListItemText>
              </ListItem>
            );
          })}
        </CustomList>
      </nav>
      <div className="sidebarContact">
        <ActionLinks />
      </div>
    </>
  );
}

export default Profile;
