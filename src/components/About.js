import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';

import { links } from '../helpers/variables';
import Title from './Title';

import * as s from '../styles/About.module.css';

export default function About({mainLogo}) {
    const data = useStaticQuery(graphql`
        query ProfileQuery {
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
                    }
                }
                }
            }
        }
    `);

    const profile = data.allFile.nodes[0].childDataJson.profile;
    const { name, pronouns, title, employer, story, facts, contact, blog} = profile;
    const { linkedin, github, codepen } = links;

    return (
        <>
            <header className={ `${s.aboutHeadContainer} container` }>
                <div className={ `${s.profileContainer} ${s?.dMedium}` }>
                    <div className={ s.profilePic }>
                        <GatsbyImage image={ mainLogo } alt='Profile pic' className={s.profileImg} />
                    </div>
                    <div className={ s.profileInfo }>
                        <h2>{ name } <span className={ s.pronouns }>{ pronouns }</span></h2>
                        <div className={ s.profileMeta }>
                            <span>{ title } @{ employer }</span>
                            <span>Blog: <a href={ blog.url } target='_blank' rel='noreferrer'>{ blog.name }</a></span>
                            <span>📍LA, SoCal</span>
                            <span>
                                <a href={ github.url } target='_blank' rel='noreferrer'>{ github.text }</a> | <a href={ codepen.url } target='_blank' rel='noreferrer'>{ codepen.text }</a> | <a href={ linkedin.url } target='_blank' rel='noreferrer'>{ linkedin.text }</a>
                            </span>
                        </div>
                    </div>
                </div>
            </header>
            <section className={ `${s.aboutBodyContainer} ${s?.dMedium} container`}>
                <Title cs={ `${s.storyWrapper} ${s.my60}`}>
                    <p className={s.storyContent}>{ story }</p>
                </Title>
                <div className={ `${s.my60}`}>
                    <h3 className={ `${s.fs1R}`}>Facts</h3>
                    <ul className={s.list}>
                        { facts.map((fact, index) => <li key={ index } className={ `${s.factItem} ${s.listItem}` }>{ fact }</li>) }
                    </ul>
                </div>
                <div className={s.contactWrapper}>
                    <h3 className={ `${s.fs1R}`}>Contact</h3>
                    <ul className={s.list}>
                        <li className={ s.listItem }>Email: <a href={ `mailto:${contact.email}` }>{ contact.email }</a></li>
                        <li className={ s.listItem }>Phone: <a href={ `tel:${contact.phone}` }>{ contact.phone }</a></li>
                    </ul>
                </div>
            </section>
        </>
    )
}