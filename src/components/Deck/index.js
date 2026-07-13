import React, { useContext, useRef } from 'react';
import {
  JetsContext,
  LOCALES_MAP,
  DEFAULT_LANG,
  DEFAULT_DECK_TITLE_HEIGHT,
  DEFAULT_DECK_PADDING_SIZE,
} from '../../common';
import { JetsBulk } from '../Bulk';
import { JetsDeckExit } from '../DeckExit';
import { JetsDeckTitle } from '../DeckTitle';
import { JetsRow } from '../Row';
import { JetsCabinTitle } from '../CabinTitle';

import './index.css';

export const DECK_LOCALE_KEY = 'deck';

export const JetsDeck = ({ deck, lang, exits, bulks, isSingleDeck }) => {
  const { rows, number, height, width, wingsInfo } = deck || {};

  const { params, wcagFlags } = useContext(JetsContext);
  const elementRef = useRef(null);
  const gridOn = !!wcagFlags?.gridSemantics;

  const deckRows = rows ?? [];
  const gridLabel = () => {
    const loc = LOCALES_MAP[lang] ?? LOCALES_MAP[DEFAULT_LANG] ?? {};
    const base = loc['gridLabel'] || 'Seat map';
    const ctx = number != null ? `${loc['deck'] || 'Deck'} ${number}` : '';
    return ctx ? `${base} — ${ctx}` : base;
  };
  const colCount = deckRows.reduce((max, r) => Math.max(max, r.seats?.length ?? 0), 0);
  const gridAttrs = gridOn
    ? { role: 'grid', 'aria-label': gridLabel(), 'aria-rowcount': deckRows.length, 'aria-colcount': colCount }
    : {};

  const deckStyle = {
    height,
    padding: `0 ${DEFAULT_DECK_PADDING_SIZE}px 0 ${DEFAULT_DECK_PADDING_SIZE}px`,
    margin: '0 auto',
  };

  return (
    <div className="jets-deck" style={deckStyle} ref={elementRef} {...gridAttrs}>
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

      {rows.map((row, i) => (
        <JetsRow key={row.uniqId} seats={row.seats} top={row.topOffset} rowIndex={i + 1} />
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
