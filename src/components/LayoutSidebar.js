import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';

import '../styles/global.scss';

export default function LayoutSidebar({ children }) {
    const data = useStaticQuery(graphql`
        query ProfileData {
          allFile(
            filter: {sourceInstanceName: {eq: "data"}, relativePath: {eq: "profile.json"}}
          ) {
            nodes {
              childDataJson {
                profile {
                  facts
                  name
                  pronouns
                  story
                  employer
                  title
                  contact {
                    email
                    phone
                  }
                  blog {
                    url
                    name
                  }
                  lead
                  about
                }
              }
            }
          }
        }
    `);

    if (!data) {
        console.error('There was an error getting profile data.');
        return;
    }

    const profile = data.allFile.nodes[0].childDataJson.profile;

    return (
        <>
            <div className={`mainBanner container rnd`}>
                <img src={`https://media.licdn.com/dms/image/v2/D5616AQHnojzWiIAvwA/profile-displaybackgroundimage-shrink_350_1400/profile-displaybackgroundimage-shrink_350_1400/0/1722965448088?e=1740009600&v=beta&t=jUn0gy5HbLa19_QTHVeMt4IrAcSNT0ACYc29VQuZ1_Q`}
                    className={`respImg`}
                />
            </div>
            {React.cloneElement(children, { profile: profile })}
        </>
    )
}