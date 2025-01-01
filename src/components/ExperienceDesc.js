import React from 'react'

export default function ExperienceDesc({desc}) {
  return (
    desc && desc.map((str, i) => {
        return <p key={`item_support_${i}`}>{str}</p>
    })
  )
};