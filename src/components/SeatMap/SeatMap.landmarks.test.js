import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { JetsSeatMap } from './SeatMap';
import { flightDetails } from './__fixtures__/seatMapApiGetPlaneFeatures';
import { CONFIG_MOCK } from '../Demo/constants';
import {
  cabin,
  entertainment,
  power,
  seatDetails,
  wifi,
  deck,
  row,
  seat,
} from './__fixtures__/seatMapApiPostDataResponse';

const setup = ({ flight, configOverrides }) => {
  const config = {
    ...CONFIG_MOCK,
    ...configOverrides,
  };
  return render(
    <JetsSeatMap
      flight={flight}
      availability={null}
      passengers={null}
      currentDeckIndex={0}
      config={config}
      onSeatMapInited={() => {}}
      onAvailabilityApplied={() => {}}
      onSeatSelected={() => {}}
      onSeatUnselected={() => {}}
    />
  );
};

const mockPostData = jest.fn();

jest.mock('./api', () => {
  const module = jest.requireActual('./api');
  return {
    ...module,
    JetsSeatMapApiService: class extends module.JetsSeatMapApiService {
      postData = mockPostData;
    },
  };
});

describe('SeatMap landmarks + skip link', () => {
  const flight = flightDetails();

  beforeEach(() => {
    const oneRowDeck = deck({
      rows: [row({ uniqId: '_row33', number: 33, seats: [seat({ letter: 'A' })] })],
    });

    const singleCabinResponseFixture = [
      {
        id: '1111',
        cabin: cabin(),
        entertainment: entertainment(),
        power: power(),
        wifi: wifi(),
        seatDetails: seatDetails({ decks: [oneRowDeck] }),
      },
    ];
    mockPostData.mockImplementation(() => singleCabinResponseFixture);
  });

  it('renders no region, no skip link and no target span when wcag.landmarksAndSkipLink is off (zero-change)', async () => {
    setup({ flight, configOverrides: {} });

    await waitFor(() => {
      expect(screen.getByText(/33A/)).toBeInTheDocument();
    });

    expect(screen.queryByRole('region')).toBeNull();
    expect(document.querySelector('.jets-skip-link')).toBeNull();
    expect(document.querySelector('a[href^="#jets-seat-map-content-"]')).toBeNull();
    expect(document.querySelector('span[tabindex="-1"]')).toBeNull();

    // The seat-map root itself is untouched.
    const container = screen.getByTestId('jets-seat-map');
    expect(container.tagName).toBe('DIV');
  });

  it('renders no region when wcag is enabled but landmarksAndSkipLink is explicitly off', async () => {
    setup({ flight, configOverrides: { wcag: { enabled: true, landmarksAndSkipLink: false } } });

    await waitFor(() => {
      expect(screen.getByText(/33A/)).toBeInTheDocument();
    });

    expect(screen.queryByRole('region')).toBeNull();
    expect(document.querySelector('.jets-skip-link')).toBeNull();
  });

  it('renders a region landmark with a heading and aria-labelledby when wcag.landmarksAndSkipLink is on', async () => {
    setup({ flight, configOverrides: { wcag: { enabled: true } } });

    await waitFor(() => {
      expect(screen.getByText(/33A/)).toBeInTheDocument();
    });

    const region = screen.getByRole('region');
    expect(region).toBeInTheDocument();

    const headingId = region.getAttribute('aria-labelledby');
    expect(headingId).toBeTruthy();

    const heading = document.getElementById(headingId);
    expect(heading).not.toBeNull();
    expect(heading.tagName).toBe('H2');
    expect(heading.textContent).toBe('Seat map');
    expect(heading.className).toContain('jets-visually-hidden');
  });

  it('renders the skip link as the first focusable element inside the region, visually hidden by default', async () => {
    setup({ flight, configOverrides: { wcag: { enabled: true } } });

    await waitFor(() => {
      expect(screen.getByText(/33A/)).toBeInTheDocument();
    });

    const region = screen.getByRole('region');
    const skipLink = region.querySelector('a.jets-skip-link');
    expect(skipLink).not.toBeNull();
    expect(skipLink.textContent).toBe('Skip seat map');

    // First focusable element inside the region.
    const focusable = region.querySelectorAll('a, button, [tabindex]');
    expect(focusable[0]).toBe(skipLink);

    // Hidden by default via the clip/sr-only class, not top:-40px.
    expect(skipLink.className).toBe('jets-skip-link');
  });

  it('skip link href points at the target span id, rendered after the map content', async () => {
    setup({ flight, configOverrides: { wcag: { enabled: true } } });

    await waitFor(() => {
      expect(screen.getByText(/33A/)).toBeInTheDocument();
    });

    const region = screen.getByRole('region');
    const skipLink = region.querySelector('a.jets-skip-link');
    const href = skipLink.getAttribute('href');
    expect(href).toMatch(/^#jets-seat-map-content-/);

    const targetId = href.slice(1);
    const target = document.getElementById(targetId);
    expect(target).not.toBeNull();
    expect(target.tagName).toBe('SPAN');
    expect(target.getAttribute('tabindex')).toBe('-1');

    // Target comes after the seat-map content in the region.
    const seatMapRoot = screen.getByTestId('jets-seat-map');
    expect(seatMapRoot.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('clicking the skip link prevents default and moves focus to the target span', async () => {
    setup({ flight, configOverrides: { wcag: { enabled: true } } });

    await waitFor(() => {
      expect(screen.getByText(/33A/)).toBeInTheDocument();
    });

    const region = screen.getByRole('region');
    const skipLink = region.querySelector('a.jets-skip-link');
    const targetId = skipLink.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);

    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
    const preventDefaultSpy = jest.spyOn(clickEvent, 'preventDefault');
    fireEvent(skipLink, clickEvent);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(document.activeElement).toBe(target);
  });
});
