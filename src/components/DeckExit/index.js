import React, { useState, useContext } from 'react';
import { DEFAULT_STYLE_POSITION, JetsContext } from '../../common';

import './index.css';

const leftArrow =
  '<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="114pt" height="114pt" viewBox="0 0 114 114" preserveAspectRatio="xMidYMid meet"><g transform="translate(0,114) scale(0.1,-0.1)" fill="#d00434" stroke="none"><path d="M635 922 c-115 -85 -269 -198 -341 -251 l-132 -96 344 -252 344 -252 0 129 0 129 95 -54 95 -54 0 354 0 354 -95 -54 -94 -53 -3 127 -3 127 -210 -154z"/></g></svg>';
const rightArrow =
  '<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="114pt" height="114pt" viewBox="0 0 114 114" preserveAspectRatio="xMidYMid meet"><g transform="translate(0,114) scale(0.1,-0.1)" fill="#d00434" stroke="none"><path d="M290 950 l0 -129 -95 54 -95 54 0 -354 0 -354 95 54 95 54 0 -129 0 -129 344 252 c334 245 343 252 322 268 -11 9 -166 122 -343 252 l-323 236 0 -129z"/></g></svg>';

export const JetsDeckExit = ({ type, topOffset }) => {
  const { colorTheme } = useContext(JetsContext);
  const { exitIconUrlLeft, exitIconUrlRight } = colorTheme;
  const isBuiltInIcons = !exitIconUrlLeft || !exitIconUrlRight;

  const [style, setStyle] = useState(() => {
    const xOffset = 0;

    return {
      top: topOffset,
      left: type === 'left' ? xOffset : DEFAULT_STYLE_POSITION,
      right: type === 'right' ? xOffset : DEFAULT_STYLE_POSITION,
    };
  });

  return (
    <div className="deck-exit" style={style} data-testid="jets-exit">
      {isBuiltInIcons ? (
        <span
          className="deck-exit__image"
          dangerouslySetInnerHTML={{ __html: type === 'left' ? leftArrow : rightArrow }}
        ></span>
      ) : (
        <img className="deck-exit__image" src={type === 'left' ? exitIconUrlLeft : exitIconUrlRight}></img>
      )}
    </div>
  );
};
