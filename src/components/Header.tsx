import React from 'react';
import ProfileLogo from './ProfileLogo';
import Profile from './Profile';
import { IProfile } from '../helpers/interfaces';

export default function Header({ profile }: { profile: IProfile }) {
  return (
    <aside>
      <ProfileLogo />
      <Profile profile={profile} />
    </aside>
  );
}
