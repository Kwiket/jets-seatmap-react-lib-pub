import React, { useContext, useRef } from 'react';
import { JetsContext } from '../../common';
import { JetsDeck } from '../Deck';
import { JetsDeckSeparator } from '../DeckSeparator';
import { JetsTail } from '../Tail';
import { JetsNose } from '../Nose';
import { JetsNoData } from '../NoData';
import { JetsNotInit } from '../NotInit';

import './index.css';



export const JetsPlaneBody = ({ activeDeck, content, exits, bulks, isSeatMapInited, config, showOneDeck }) => {
  const { params, colorTheme, componentOverrides } = useContext(JetsContext);
  const elementRefs = useRef(new Array());
  const ResolvedJetsNotInit = componentOverrides?.JetsNotInit ?? JetsNotInit;

  const { lang, visibleFuselage } = config;

  const { deckHeightSpacing, fuselageStrokeWidth, fuselageStrokeColor, floorColor, wingsWidth, fuselageFillColor } =
    colorTheme;

  const decksWrapperStyle = {
    borderLeft: `${fuselageStrokeWidth}px solid ${fuselageStrokeColor}`,
    borderRight: `${fuselageStrokeWidth}px solid ${fuselageStrokeColor}`,
  };

  const deckFloorStyle = {
    backgroundColor: floorColor,
    padding: `${deckHeightSpacing}px 0`,
    borderLeft: `solid ${fuselageFillColor}`,
    borderRight: `solid ${fuselageFillColor}`,
  };

  const decks = content ? [...content] : [];
  let deckToShow = activeDeck;

  if (config?.horizontal && !config?.rightToLeft) {
    decks.reverse();
    deckToShow = decks.length - 1 - deckToShow;
  }

  const isTailFirst = params?.isHorizontal && !params?.rightToLeft;

  const wingsSpace = params?.visibleWings ? wingsWidth * 2 : 0;
  const bodyWidth = (params?.innerWidth || 0) - wingsSpace;

  const style = {
    width: bodyWidth || config.width,
  };

  const isTailFull = true;
  const isNoseFull = true;

  const isSingleDeck = decks?.length == 1;

  return (
    <div className={`jets-plane-body`} style={style}>
      {visibleFuselage && decks?.length ? (
        isTailFirst ? (
          <JetsTail isFull={isTailFull}></JetsTail>
        ) : (
          <JetsNose isFull={isNoseFull}></JetsNose>
        )
      ) : null}

      {decks?.length ? (
        <div className={'jets-deck-wrapper'} style={decksWrapperStyle}>
          {decks?.map((deck, index) =>
            !showOneDeck || index == deckToShow ? (
              <React.Fragment key={deck.uniqId + index}>
                <div
                  ref={element => {
                    elementRefs.current[index] = element;
                  }}
                  className="deck-floor tooltip-holder"
                  style={{
                    ...deckFloorStyle,
                    height: deck.height + deckHeightSpacing,
                    borderWidth: `${Math.max(
                      (params.innerWidth - deck.width) * 0.5 - fuselageStrokeWidth,
                      fuselageStrokeWidth
                    )}px`,
                  }}
                >
                  <JetsDeck
                    deck={deck}
                    lang={lang}
                    key={deck.uniqId}
                    exits={exits[deck.number - 1]}
                    bulks={bulks[deck.number - 1]}
                    style={{ position: 'absolute' }}
                    isSingleDeck={isSingleDeck}
                  />
                </div>

                {index < decks.length - 1 && !showOneDeck && <JetsDeckSeparator key={index} width={bodyWidth} />}
              </React.Fragment>
            ) : null
          )}
        </div>
      ) : isSeatMapInited ? (
        <JetsNoData />
      ) : (
        <ResolvedJetsNotInit />
      )}
      {visibleFuselage && decks?.length ? (
        isTailFirst ? (
          <JetsNose isFull={isNoseFull}></JetsNose>
        ) : (
          <JetsTail isFull={isTailFull}></JetsTail>
        )
      ) : null}
    </div>
  );
};
