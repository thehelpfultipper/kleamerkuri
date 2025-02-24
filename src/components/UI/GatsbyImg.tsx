import React from 'react';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';

interface IGatsbyImg {
  data: any;
  alt?: string;
  cs?: string;
}

const GatsbyImg = ({ data, alt = '', cs = '' }: IGatsbyImg) => {
  if (!data) return null;
  const image = getImage(data.file);

  return (
    <GatsbyImage
      image={image as any}
      alt={alt}
      loading="lazy"
      className={`${cs} respImg rnd`}
    />
  );
};

export default GatsbyImg;
