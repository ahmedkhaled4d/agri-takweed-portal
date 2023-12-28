import React from 'react';

function ImgWithFallback({
  srcSet,
  fallback,
  type = 'image/webp',
  alt,
  ...restProps
}) {
  return (
    <picture>
      <source srcSet={srcSet} type={type} />
      <img src={fallback} alt={alt} {...restProps} />
    </picture>
  );
}

export default ImgWithFallback;
