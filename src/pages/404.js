import * as React from "react";
import { Link } from "gatsby";

import * as s from '../styles/404.module.css';

export default function NotFoundPage() {
    return (
        <div className={`container`}>
            <div className={ `${s.wrapper}`}>
                <h1 className={ `${s.title}` }>{`< 404 />`}</h1>
                <h2 className={`${s.subTitle}`}>Page Not Found</h2>
                <p>It seems like you've stumbled upon a page that doesn't exist. Don't worry, it happens to the best of us. Here are a few things you can try:</p>
                <ol className={ `${s.optionsList}` }>
                    <li><strong>Check the URL:</strong> Make sure you've entered the correct URL. Sometimes a small typo can lead you astray.</li>
                    <li><strong>Go Back to the Homepage:</strong> Click <Link to='/'>here</Link> to return to the homepage and explore from there.</li>
                    <li><strong>Explore My Portfolio:</strong> While you're here, why not take a look at some of my recent projects? Click <Link to='/portfolio/'>here</Link> to browse through my portfolio.</li>
                    <li><strong>Get in Touch:</strong> If you still can't find what you're looking for, feel free to <Link to='/about/'>contact me</Link>. I'll be happy to assist you in any way I can.</li>
                </ol>
                <p>Thanks for visiting!</p>
            </div>
        </div>
    );
}
