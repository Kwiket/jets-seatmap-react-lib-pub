# Seatmap integration and communication

This document describes how to integrate JetsSeatMap lib (further "seatmap") into any React.js application. Also,
communication between the seatmap and a parent layer that embeds seatmap (further just "parent layer").

&nbsp;

## Installation

Need to `clone` this repository and install dependencies:

`npm i`

Here you have 2 options:

1. rename _.env-sample_ to _.env_. Also you need to get the `APP_ID` and `PRIVATE_KEY` from Quicket GmbH support team
   and put them into fields in _.env_ file.
2. or directly change `config-mock.js`:

```
  apiUrl: process.env.JETS_BASE_API_URL,
  apiAppId: process.env.JETS_APP_ID,
  apiKey: process.env.JETS_PRIVATE_KEY,
```

replace reading of env-variables with your credentials.

Run storybook:

`npm run dev`

By default you will see a loading progress bar - just input your flight parameters and press `INIT SEAT MAP`.

Now you can customize the source code of the library, first of all apply you CSS styles.

Before use, you have to build lib:

`npm run build-lib`

After that, you can publish library to new or already exisiting github repository, or publish it to your NPM account.

To connect the library to the project, you need to run:

`npm install name-of-your-lib-variation`

or include this string into your package.json dependencies if you use the github repo:

`"jets-seatmap-react-lib": "git+ssh://git@github.com/path-to-your-repo.git#branch"`

&nbsp;

## Integration

This section explains how to integrate seatmap into React.js application.

Create your [config](#config) and embed seatmap into your component page via `<JetsSeatMap>` tag:

```jsx
<JetsSeatMap
  flight={flight_data}
  availability={availability_data}
  passengers={passengers_data}
  config={config_data}
  currentDeckIndex={deckIndex}            // could be used to specify rendered deck or to switch decks on the fly from external UI
  onSeatMapInited={seatMapInitedHandler}
  onSeatSelected={seatSelectedHandler}
  onSeatUnselected={seatUnselectedHandler}
  onLayoutUpdated={layoutUpdatedHandler}
  onTooltipRequested={tooltipRequestedHandler}
/>
```

&nbsp;

## Properties

- [Seatmap integration and communication](#seatmap-integration-and-communication)
  - [Installation](#installation)
  - [Integration](#integration)
  - [Properties](#properties)
    - [ Flight](#-flight)
    - [ Availability](#-availability)
    - [ Passengers](#-passengers)
    - [ Config](#-config)
    - [ onSeatMapInited](#-onseatmapinited)
    - [ onLayoutUpdated](#-onlayoutupdated)
    - [ onTooltipRequested](#-ontooltiprequested)
    - [ onSeatSelected](#-onseatselected)
    - [ onSeatUnselected](#-onseatunselected)
    - [ onSeatMouseLeave](#-onseatmouseleave)
    - [ onSeatMouseClick](#-onseatmouseclick)
    

The `flight` prop is requred.

&nbsp;

### <a name="flight"></a> Flight

This prop is required. It provides the data about cabin class, airline code, arrival, departure etc.

Interface, describing data types:

```typescript
interface IFlight {
  id: string;
  airlineCode: string;
  flightNo: string;
  departureDate: string;
  departure: string;
  arrival: string;
  cabinClass: string;
  passengerType?: string;
  planeCode?: number;
  startRow?: string; // string [ 3 .. 24 ] characters
  endRow?: string; // string [ 3 .. 24 ] characters
}
```

Example of data seatmap receives:

```javascript
{
  id: '1111',
  airlineCode: 'BA',
  flightNo: '106',
  departureDate: '2023-09-28',
  departure: 'DXB',
  arrival: 'LHR',
  cabinClass: 'E',
  passengerType: 'ADT',
  planeCode: null,
};
```

Cabin class vslues: `E` - economy, `P` - economy premium, `B` - business, `F` - first, `A` - whole plane

The **departure** and **arrival** fields must consist the codes of airports. The **departureDate** field must be in
`yyyy-mm-dd` format.

`startRow` - first of available row numbers and its letters, colon as divider, upper case, e.g. `10` or `10:ABCDEF`. If startRow parameter is set `endRow` also needs to be set, otherwise, it will be `ignored`.
`endRow` - last of available row numbers and its letters, colon as divider, upper case, e.g. `32` or `32:ACDF`. If endRow parameter is set `startRow` also needs to be set, otherwise, it will be `ignored`.

&nbsp;

### <a name="availability"></a> Availability

The availability property is array of objects and describes which seats are able for passengers. You can pass it
asynchronously or not pass at all, it is `optional`.

Interface, describing data types:

```typescript
interface IIncomingSeat {
  currency: string;
  label: string;
  price: number;
  color?: string;                                 // color of the seat
  onlyForPassengerType?: TPassengerType[];
  additionalProps?: TAdditionalProp[];            // additionalProps from individual seats would exted the list of seat's features
                                                  // up to 12 features and props could be displayed in tooltip for a seat 
}

type TSeatAvailability = IIncomingSeat[];

type TAdditionalProp = {
   label: String; 
   icon: String;            // suported icons are ["+", "-", "dot", "wifi", "movie", "power"], "dot' is default
}
```

Example of data seatmap receives:

```javascript
[
  {
    currency: 'USD',
    label: '*',               // properties from wildcard would be used to replace unspecified properties for individual seats
    price: 33,
    onlyForPassengerType: ['ADT', 'CHD', 'INF'],
    additionalProps: [        // additionalProps from wildcard would be merged with specified additionalProps for individual seats (applied to all seats)
      { label: 'Test prop for all', icon: 'dot' },
      { label: 'Another test prop for all', icon: 'wifi' },
    ],
    color: 'lightgrey'        // all the seats that don't have individual colors set will be colored with wildcard color value
  },
  {
    currency: 'USD',
    label: '20E',
    price: 33,
    onlyForPassengerType: ['ADT', 'CHD', 'INF'],
    additionalProps: [        
      { label: 'Clear air', icon: null, cssClass: 'clear-air-style' },
      { label: 'USB plug', icon: 'power' },
    ],
    color: 'green'            // individual seat's color
  },
  {
    currency: 'USD',
    label: '20K',
    price: 33,
    onlyForPassengerType: 'ADT',
  },
  {
    currency: 'USD',
    label: '21F',
    price: 13,
    onlyForPassengerType: ['ADT', 'CHD', 'INF'],
  },
  {
    currency: 'USD',
    label: '31B',
    price: 13,
    onlyForPassengerType: ['CHD', 'INF'],
  },
];
```

You can pass seat with `label` **"\*"**. This label work like **all** selector for seats. In example below all seats
with `classCode` equals **"E"** will be enabled with `price` of _50_. However next seat configuration **"12F"** will
override `price` and set it to _75_. You can pass seat with `price` **0**. Also you can pass seat without `price` field
and it would be the same as pass it with **0** value.

If `onlyForPassengerType` field is empty or doesn't exist, then it has no restrictions value by default.

Coloring seats tip: `color` field has next set of priorities: individual > wildcard > internal. If `wildcard` color is present - it's highly recommended to add `color` property to all individual seats for visual distinction.

All `additionalProps` can have property `cssClass`that will be assigned to the container, icon and label. For example, if `cssClass: 'cssClass: 'clear-air-style''` in the HTML you will have 3 additional CSS classes:
  *  `clear-air-style` - class of seat feature container
  *  `clear-air-style-icon` - class of seat feature icon
  *  `clear-air-style-label`- class of seat feature label

These CSS classes can be defined at the host level CSS.

Max count of visible seat features/props = `12`.

&nbsp;

### <a name="passengers"></a> Passengers

The passengers property is array of objects and describes the passengers for seating according to the cabin map . You
can pass it asynchronously or not pass at all, it is `optional`. If you don't pass the passengers list - seat selection
will not work.

Interface, describing data types:

```typescript
interface IPassenger {
  readonly id: string;
  seat: ISeat;
  passengerType?: TPassengerType;
  passengerLabel?: string;
  passengerColor?: string;
}

interface ISeat {
  price: number;
  seatLabel: string;
}

type TAllocatablePassengers = IPassenger[];

type TPassengerType = 'ADT' | 'CHD' | 'INF';
```

Example of data seatmap receives:

```javascript
[
      {
        "id": "1",
        "seat": null
      },
      {
        "id": "2",
        "seat": {
          "price": 0,
          "seatLabel": "12F"
        }
        "passengerLabel": "Alex",
        "passengerColor": "brown",
        "readOnly": true
      },
      {
        "id": "3",
        "passengerType": "CHD",
        "seat": null
        "passengerLabel": "John Snow",
        "passengerColor": "#ccc",
      }
    ]
```

Or even like this:

```javascript
{
  "data": {
    "passengers": [
      { "id": "1" },
      { "id": "2" },
      { "id": "3" }
    ]
  },
  "type": "SYNC_PASSENGERS"
}
```

`seat`, `passengerType`, `passengerLabel` and `passengerColor` are not required fields.

If you will not pass `passengerType`, `passengerLabel` and `passengerColor` fields the values will be set by default.

Please notice, that seatmap identifies how many passengers to allocate by a length of `passengers` array. Therefore, for
example, to allocate 2 passengers without any predefined seat or its type, `passengers` array shall contain 2 items.

For passengers with property `readOnly: true` not possible to unselect assigned seat.

&nbsp;

### <a name="config"></a> Config

The config property describes basic configuration of seat map.

Interface, describing data types:

```typescript
interface IConfig {
  width: number;
  lang: string;
  units: TUnit;
  apiUrl: string;
  apiAppId: string;
  apiKey: string;
  colorTheme: IColorTheme;
}

type TUnit = 'metric' | 'imperials';

type TLang = 'CN' | 'DE' | 'EN' | 'ES' | 'PL' | 'RU' | 'AR' | 'CS' | 'FR' | 'PT' | 'UK' | 'IT' | 'JA' | 'KO' | 'TR';
```

Minimal config could look like this:

```javascript
width: 400;
lang: 'EN';
units: 'metric';
apiUrl: 'PROVIDED_API_URL',               
apiAppId: 'PROVIDED_APP_ID',
apiKey: 'PROVIDED_API_KEY',
```

Full config looks like this:

```javascript

{
  width: 400,                               // width of seatmap, height will be dynamic and depends on amount of decks/rows in decks
                                            // if `horizontal` flag is set to true - height and width will swap around (height being static)
  lang: 'EN',                                            
  horizontal: true,                         // should seatmap be rendered horizontally or vertically
  rightToLeft: false,                       // changes tooltip text alignment (and decks placement) for RTL languages support
  visibleFuselage: true,                    // should nose and tail graphics be rendered
  visibleWings: false,                      // should position of wings be shown (helps to see how far/close they are from/to certain seats)

  builtInDeckSelector: false,               // if there's only one deck on the flight it doesn't do anything
                                            // if there's more it's possible to render all decks at once or only one with ability to switch them
  singleDeckMode: true,                     // if false, double-deck mode enabled - to show 2 decks at a time, without deck switcher

  builtInTooltip: true,                     // see `onTooltipRequested` section
  externalPassengerManagement: false,       // see `onTooltipRequested` section
  tooltipOnHover: false,                    // see `onTooltipRequested` section

  apiUrl: 'PROVIDED_API_URL',               
  apiAppId: 'PROVIDED_APP_ID',
  apiKey: 'PROVIDED_API_KEY',

  colorTheme: {                             // most values are CSS-compatible
    deckLabelTitleColor: 'white',
    deckHeightSpacing: 100,                 // additional space on both ends of a deck (for aesthetics only)

    wingsWidth: 50,                          
    deckSeparation: 0,

    floorColor: 'rgb(30,60,90)',            // color of decks floor
    seatLabelColor: 'white',
    seatStrokeColor: 'rgb(237, 237, 237)',
    seatStrokeWidth: 1,
    seatArmrestColor: '#cccccc',
    notAvailableSeatsColor: 'lightgray',    // fill color for seats that are not available, applied when seat `availability` has been set

    bulkBaseColor : 'dimgrey',              // colors for bulks 
    bulkCutColor : 'lightgrey',
    bulkIconColor: 'darkslategray',

    defaultPassengerBadgeColor: 'darkred',
    fontFamily: 'Montserrat, sans-serif',

    tooltipBackgroundColor: 'rgb(255,255,255)',
    tooltipHeaderColor: '#4f6f8f',
    tooltipBorderColor: 'rgb(255,255,255)',
    tooltipFontColor: '#4f6f8f',
    tooltipIconColor: '#4f6f8f',            // applied to measurements icons, feature icons have set colors
    tooltipIconBorderColor: '#4f6f8f',
    tooltipIconBackgroundColor: '#fff',
    tooltipSelectButtonTextColor: '#fff',
    tooltipSelectButtonBackgroundColor: 'rgb(42, 85, 128)',
    tooltipCancelButtonTextColor: '#fff',
    tooltipCancelButtonBackgroundColor: 'rgb(55, 55, 55)',

    deckSelectorStrokeColor: '#fff',
    deckSelectorFillColor: 'rgba(55, 55, 55, 0.5)',
    deckSelectorSize: 25,

    fuselageStrokeWidth: 16,                // surrounds the whole plane including tail\nose if enabled (min = 10, max = 18)

    fuselageFillColor: 'lightgrey',
    fuselageStrokeColor: 'darkgrey',

    fuselageWindowsColor: 'darkgrey',
    fuselageWingsColor: 'rgba(55, 55, 55, 0.5)',

    exitIconUrlLeft: 'https://panorama.quicket.io/icons/exit-left.svg', // URL to override built-in left exit icon, optional
    exitIconUrlRight: 'https://panorama.quicket.io/icons/exit-right.svg', // URL to override built-in right exit icon, optional
  },
};

```

To override exits need to set `both` fields in the config - `exitIconUrlLeft` && `exitIconUrlRight` + define CSS style for exits:

```css
.deck-exit__image {
  /* custom size, for instance */
  width: 72px; 
  height: 72px;
}
```

If you will not pass `optional config params` then the properties will be set with default values.

&nbsp;

### <a name="seat_map_inited"></a> onSeatMapInited

This event fires up when seatmap (DOM tree, content) is initialized. It provides internal data such as

```typescript
interface iInitialLayoutData {
  currentDeckIndex: number;     // shows current deck if "builtInDeckSelector" flag is set in config, otherwise 0
  decksCount: number;           // number of decks available for provided flight
  heightInPx: number;           // sum of lengths of all elements of the plane (decks, fuselage, separators) using internal units. Multiply by "scaleFactor" to get real pixel value on screen
  scaleFactor: number;          // scale applied to fit into provided boundaries
  widthInPx: number;            // outer width of the plane. CAUTION: if "horizontal" flag is set - height and width are swapped around to reflect that
  error: string;                // error message if not possible to build a seat map
}
```

&nbsp;

### <a name="layout_updated"></a> onLayoutUpdated

Event is fired after `onSeatMapInited` and on every deck switch if `builtInDeckSelector` flag is set to `true` in config and more than one deck available. See `onSeatMapInited` above

```typescript
interface iLayoutData {
  currentDeckIndex: number;     
  decksCount: number;           
  heightInPx: number;           // when fired after deck switch - reflects the size of plane with current deck visible, not total length 
  scaleFactor: number;          
  widthInPx: number;            
}
```

&nbsp;

### <a name="tooltip_requested"></a> onTooltipRequested

Event is fired when user clicks a seat or puts cursor over it (if `tooltipOnHover` flag is set to `true` in config).

If `builtInTooltip` flag is set to `false` - native tooltip will not show up and custom tooltip could be shown based on the event's data.

If `tooltipOnHover` flag is set to `true` user will be able to select/deselect seats by clicking it even if `builtInTooltip` is set to `false`. To disable it completely set `externalPassengerManagement` to `true`

Most usefult behaviors could be covered like this:

| `builtInTooltip` | `tooltipOnHover` | `externalPassengerManagement` | result                                                              |
| :--------------: | :--------------: | :---------------------------: | ------------------------------------------------------------------- |
| true             | false            | false                         | native tooltip on `click`, select seat with tooltip buttons
| true             | true             | false                         | native tooltip on `hover`, select seat by clicking on seat
| false            | true             | false                         | `no tooltip` shown, `select seat by clicking` on it
| false            | true             | true                          | `no tooltip`, select/deselect `must be treated externally`


```typescript
interface iTooltipData {
  element: HTMLElement;       // HTML element of clicked/hovered seat, may be used for tooltip positioning
  event: DOMEvent;            // DOM event for more precise coordinates processing
  seat: ISeatData             // detailed seat info, see below
}

interface ISeatData {
  additionalProps: ISeatFeature[]   // additional props for seat converted to ISeatFeature, see Availability section 
  uniqId: string;
  color: string;                    // how seat is shown on seatmap
  features: ISeatFeature[];         // seat features like wifi, leg room, etc
  letter: string;                   // letter in the row
  measurements: IMeasurement[];     // shown in tooltip
  status: string;                   // is seat available or not, see Availability section
  type: string;                     // in most cases just "seat"
  label: string;                    // includes row number and letter
  classType: string;                // Economy, Business, etc
  classCode: string;                // short for classType
  rowName: string;                  // if rows inside current cabin class have special marks - it would be here ("World Traveller" as an example)
  seatType: string;                 // format is "classCode-number", number indicates specific code of a seat in class
}

interface ISeatFeature {
  icon: string;           // SVG icon for the feature
  title: string;          // generic name for the feature
  uniqId: string;
  value: string;          // text shown in tooltip
  key: string;            // used to get translated "value" (i18n)
}

// similar to ISeatFeature but uses different icons and displayed separately in the tooltip
interface IMeasurement {
  icon: string;           // SVG icon for the measurement
  title: string;          // name like "Pitch", "Recline"
  uniqId: string;
  value: string;          // value shown in tooltip
}

```

`Hint:` use [Element.getBoundingClientRect](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) to align custom tooltip to the selected seat.

&nbsp;

### <a name="seat_selected"></a> onSeatSelected

This event fires up when seat is selected. It provides the array of passengers with seat occupancy data. Only when `externalPassengerManagement=false` in config.

Interface, describing data types:

```typescript
interface IPassenger {
  readonly id: string;
  seat: ISeat;
  passengerType?: TPassengerType;
  passengerLabel?: string;
  passengerColor?: string;
}

interface ISeat {
  price: number;
  seatLabel: string;
}
```

&nbsp;

### <a name="seat_unselected"></a> onSeatUnselected

This event fires up when seat is unselected. It provides the array of passengers with seat occupancy data.

```typescript
interface IPassenger {
  readonly id: string;
  seat: ISeat;
  passengerType?: TPassengerType;
  passengerLabel?: string;
  passengerColor?: string;
}

interface ISeat {
  price: number;
  seatLabel: string;
}
```

### <a name="onseatmouseleave"></a> onSeatMouseLeave

This event fires up when cursor leave seat boudaries. It provides the same data like [onTooltipRequested](#-ontooltiprequested).

### <a name="onseatmouseclick"></a> onSeatMouseClick

This event is triggered when the mouse is clicked on the seat, but only `externalPassengerManagement == true && tooltipOnHover == true`. It provides the same data like [onTooltipRequested](#-ontooltiprequested).

## Advanced: Overriding Components

An optional `componentOverrides` object can be passed into `<JetsSeatMap />` to override either the `<JetsSeat />` component or 
the `<JetsNotInit />` (loading state before seat map is initialized).

Note: If you override `<JetsSeat />` you will need to build the seat component and ensure that interaction events are handled correctly.

```jsx
const componentOverrides = {
  JetsSeat: MyCustomJetsSeat,
  JetsNotInit: MyCustomLoader,
};

<JetsSeatMap
  ...
  componentOverrides={componentOverrides}
  ...
/>
```