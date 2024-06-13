import React, { useContext, useRef } from 'react';
import { JetsContext, LOCALES_MAP, DEFAULT_DECK_TITLE_HEIGHT, DEFAULT_DECK_PADDING_SIZE } from '../../common';
import { JetsBulk } from '../Bulk';
import { JetsDeckExit } from '../DeckExit';
import { JetsDeckTitle } from '../DeckTitle';
import { JetsWing } from '../Wing';
import { JetsRow } from '../Row';
import { JetsCabinTitle } from '../CabinTitle';

import './index.css';

const DECK_LOCALE_KEY = 'deck';

export const JetsDeck = ({ deck, lang, exits, bulks, isSingleDeck }) => {
  const { rows, number, height, width, wingsInfo } = deck || {};

  const { params } = useContext(JetsContext);
  const elementRef = useRef(null);

  const deckStyle = {
    height,
    padding: `0 ${DEFAULT_DECK_PADDING_SIZE}px 0 ${DEFAULT_DECK_PADDING_SIZE}px`,
    transform: params?.isHorizontal && !params.rightToLeft ? 'rotate(180deg)' : '',
    margin: '0 auto',
  };

  return (
    <div className="jets-deck" style={deckStyle} ref={elementRef}>
      {params?.visibleWings && <JetsWing wingsInfo={wingsInfo} />}

      {params?.visibleCabinTitles &&
        rows
          .filter(r => r.isFirstInCabin)
          .map(row => (
            <JetsCabinTitle
              key={row.classCode + row.uniqId}
              top={row.topOffset}
              height={row.cabinHeight}
              lang={lang}
              localeKey={row.classCode}
            />
          ))}

      {number && !isSingleDeck && <JetsDeckTitle number={number} lang={lang} localeKey={DECK_LOCALE_KEY} />}

      {rows.map(row => (
        <JetsRow key={row.uniqId} seats={row.seats} top={row.topOffset} />
      ))}

      {exits && exits.length
        ? exits.map(({ topOffset, type, uniqId }, index) => (
            <JetsDeckExit key={uniqId} type={type} index={index} topOffset={topOffset} />
          ))
        : null}
      {bulks && bulks.length
        ? bulks.map(({ id, uniqId, type, align, width, height, iconType, xOffset, topOffset }) => (
            <JetsBulk
              id={id}
              key={uniqId}
              type={type}
              align={align}
              width={width}
              height={height}
              iconType={iconType}
              xOffset={xOffset}
              topOffset={topOffset}
            />
          ))
        : null}
    </div>
  );
};
