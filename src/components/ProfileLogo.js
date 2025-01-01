import React from "react";

import '../styles/profile.scss';

export default function ProfileLogo() {
    const profileImg = 'https://media.licdn.com/dms/image/v2/D5603AQG9CDAIsbyhZQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1673115526742?e=1740009600&v=beta&t=s_j3gu-1gIYsQzA4HkYPKToG0w63KskITwUuj4RPMWk';
    return (
        <div className={`profileImg`}>
            <img src={profileImg} alt='Profile pic' className={`respImg`} />
        </div>
    )
}