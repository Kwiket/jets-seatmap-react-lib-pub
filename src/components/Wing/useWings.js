import { useContext, useMemo } from 'react';
import { JetsContext } from '../../common';

const LEADING_VERTICAL_OVERLAP_OFFSET = 3;
const LEADING_HORIZONTAL_OVERLAP_OFFSET = 4;
const DEFAULT_LEADING_BACKGROUND_COLOR = '#fff';

/**
 * Сustom hook for handling wings-related calculations.
 *
 * @param {Object} wingsInfo - Data containing the wings configuration (position, length, etc).
 *
 * @returns {Object} An object containing:
 *  - `isWingLeadingVisible` {boolean} - Indicates whether the wing leadings should be displayed or not.
 *  - `style` {Object} - Style properties for the wings, including:
 *      - `wrapper` {Object} - Styles for the wings alignment wrapper element.
 *      - `container` {Object} - Styles for the wings container element.
 *      - `wing` {Object} - Styles for the wing element.
 *      - `leading` {Object|undefined} - Styles for the left and right wing leading elements.
 */
export const useWings = wingsInfo => {
  const { colorTheme, params } = useContext(JetsContext);

  const _getWingsLeadingsStyle = () => {
    if (!colorTheme?.wingsWidth) return;

    // here we multiply LEADING_HORIZONTAL_OVERLAP_OFFSET * 2 to include an overlap on both sides of the leading
    const leadingWidth = colorTheme?.wingsWidth + LEADING_HORIZONTAL_OVERLAP_OFFSET * 2;

    const commonStyle = {
      width: `${leadingWidth}px`,
      top: `-${LEADING_VERTICAL_OVERLAP_OFFSET}px`,
      background: colorTheme?.seatMapBackgroundColor || DEFAULT_LEADING_BACKGROUND_COLOR,
    };

    return {
      left: {
        ...commonStyle,
        left: `-${LEADING_HORIZONTAL_OVERLAP_OFFSET}px`,
      },
      right: {
        ...commonStyle,
        right: `-${LEADING_HORIZONTAL_OVERLAP_OFFSET}px`,
      },
    };
  };

  const computedStyle = useMemo(() => {
    return {
      wrapper: {
        top: wingsInfo.start,
      },
      container: {
        height: wingsInfo.length,
        width: params.innerWidth,
      },
      wing: {
        background: `${colorTheme?.fuselageWingsColor}`,
      },
      leading: _getWingsLeadingsStyle(),
    };
  }, [params, colorTheme, wingsInfo]);

  // show leadings only if the wings and the leadings visibility are enabled and there are computed styles
  const isWingLeadingVisible = Boolean(
    params?.visibleWings && wingsInfo?.visibleWingsLeadings && computedStyle.leading
  );

  return { isWingLeadingVisible, style: computedStyle };
};
