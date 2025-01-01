import React from 'react';
import ProfileLogo from './ProfileLogo';
import Profile from './Profile';

export default function Header({ profile }) {
    return (
        <aside>
            <ProfileLogo />
            <Profile profile={profile} />
        </aside>
    )
}
