export const BULK_TEMPLATE_MAP = new Map();

BULK_TEMPLATE_MAP.set(
  '0',
  `
  <svg id="bulk-0" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  </svg>
`
);

BULK_TEMPLATE_MAP.set(
  '1',
  `
  <svg
    id="bulk-1"
    viewBox="0 0 420 119"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      class="bulk-base"
      fill="$baseColor"
      d="M0,4V108.6A10.42,10.42,0,0,0,10.44,119H409.56A10.42,10.42,0,0,0,420,108.6V4Z"
    />
    <path
      class="bulk-cut" fill="$cutColor"
      d="M416.06,0H3.94A4,4,0,0,0,0,4,4,4,0,0,0,3.94,8H416.06A4,4,0,0,0,420,4,4,4,0,0,0,416.06,0Z"
    />
  </svg>
`
);

BULK_TEMPLATE_MAP.set(
  '2',
  `
  <svg id="bulk-2" viewBox="0 0 420 93" xmlns="http://www.w3.org/2000/svg">
    <path
      class="bulk-base"
      fill="$baseColor"
      d="M0,4.5V82.8A10.2,10.2,0,0,0,10.2,93H409.8A10.2,10.2,0,0,0,420,82.8V4.5Z"
    />
    <path
      class="bulk-cut" fill="$cutColor"
      d="M415.52,0H4.48A4.49,4.49,0,0,0,0,4.5C0,8,3,9,5.48,9h409C417,9,420,8.17,420,4.5A4.49,4.49,0,0,0,415.52,0Z"
    />
  </svg>
`
);

BULK_TEMPLATE_MAP.set(
  '3',
  `
  <svg id="bulk-3" viewBox="0 0 420 133" xmlns="http://www.w3.org/2000/svg">
    <path
      class="bulk-base"
      fill="$baseColor"
      d="M0,13.5v97.88A21.64,21.64,0,0,0,21.67,133H398.33A21.64,21.64,0,0,0,420,111.38V13.5Z"
    />
    <path
      class="bulk-cut" fill="$cutColor"
      d="M407.29,0H12.71C5.69,0,0,6,0,13.5,0,21.2,6.17,27,12.71,27H407.29C413.83,27,420,20.08,420,13.5,420,6,414.31,0,407.29,0Z"
    />
  </svg>
`
);

BULK_TEMPLATE_MAP.set(
  '4',
  `
  <svg id="bulk-4" viewBox="0 0 265 116" xmlns="http://www.w3.org/2000/svg">
    <path
      class="bulk-base"
      fill="$baseColor"
      d="M0,4.5V106.38A9.61,9.61,0,0,0,9.61,116H255.39a9.61,9.61,0,0,0,9.61-9.62V4.5Z"
    />
    <path
      class="bulk-cut" fill="$cutColor"
      d="M260.65,0H4.35A4.52,4.52,0,0,0,0,4.5,4.43,4.43,0,0,0,4.35,9h256.3A4.43,4.43,0,0,0,265,4.5,4.69,4.69,0,0,0,260.65,0Z"
    />
  </svg>
`
);

BULK_TEMPLATE_MAP.set(
  '5',
  `
  <svg id="bulk-5" viewBox="0 0 424 210" xmlns="http://www.w3.org/2000/svg">
    <path
      class="bulk-base"
      fill="$baseColor"
      d="M0,86V194.86A15.11,15.11,0,0,0,15.07,210H408.93A15.11,15.11,0,0,0,424,194.86V86Z"
    />
    <path
      class="bulk-cut" fill="$cutColor"
      d="M407.22,0H16.78A16.8,16.8,0,0,0,0,16.82V86a17.06,17.06,0,0,0,16.78,17.12H407.22A17.06,17.06,0,0,0,424,86V16.82A16.8,16.8,0,0,0,407.22,0Z"
    />
  </svg>
`
);

BULK_TEMPLATE_MAP.set(
  '6',
  `
  <svg id="bulk-6" viewBox="0 0 424 255" xmlns="http://www.w3.org/2000/svg">
    <path
      class="bulk-base"
      fill="$baseColor"
      d="M0,131V239.85A15.11,15.11,0,0,0,15.07,255H408.93A15.11,15.11,0,0,0,424,239.85V131Z"
    />
    <path
      class="bulk-cut" fill="$cutColor"
      d="M407.22,0H16.78A16.8,16.8,0,0,0,0,16.82V131c0,9.29,7.51,17.28,16.78,17.28H407.22c9.27,0,16.78-8,16.78-17.28V16.82A16.8,16.8,0,0,0,407.22,0Z"
    />
  </svg>
`
);

BULK_TEMPLATE_MAP.set(
  '7',
  `
  <svg id="bulk-7" viewBox="0 0 280 254" xmlns="http://www.w3.org/2000/svg">
    <path
      class="bulk-base"
      fill="$baseColor"
      d="M0,131V239a15,15,0,0,0,15,15H265a15,15,0,0,0,15-15V131Z"
    />
    <path
      class="bulk-cut" fill="$cutColor"
      d="M263.26,0H16.74A16.76,16.76,0,0,0,0,16.79V131a16.94,16.94,0,0,0,16.74,17H263.26A16.94,16.94,0,0,0,280,131V16.79A16.76,16.76,0,0,0,263.26,0Z"
    />
  </svg>
`
);

BULK_TEMPLATE_MAP.set(
  '8',
  `
  <svg id="bulk-8" viewBox="0 0 424 290" xmlns="http://www.w3.org/2000/svg">
    <path
      class="bulk-base" 
      fill="$baseColor"
      d="M0,166V275a15,15,0,0,0,15.07,15H408.93A15,15,0,0,0,424,275V166Z"
    />
    <path
      class="bulk-cut" fill="$cutColor"
      d="M407.22,0H16.78A16.79,16.79,0,0,0,0,16.8V166a17,17,0,0,0,16.78,
      
      17H407.22A17,17,0,0,0,424,166V16.8A16.79,16.79,0,0,0,407.22,0Z"
    />
  </svg>
`
);

BULK_TEMPLATE_MAP.set(
  '9',
  `
  <svg id="bulk-9" viewBox="0 0 352 328" xmlns="http://www.w3.org/2000/svg">
    <path
      class="bulk-base"
      fill="$baseColor"
      d="M0,205V313a15,15,0,0,0,15,15H337a15,15,0,0,0,15-15V205Z"
    />
    <path
      class="bulk-cut" fill="$cutColor"
      d="M335.25,0H16.75A16.75,16.75,0,0,0,0,16.75V205a17,17,0,0,0,16.75,17H335.25A17,17,0,0,0,352,205V16.75A16.75,16.75,0,0,0,335.25,0Z"
    />
  </svg>
`
);

BULK_TEMPLATE_MAP.set(
  '10',
  `
  <svg id="bulk-10" viewBox="0 0 424 329" xmlns="http://www.w3.org/2000/svg">
    <path
      class="bulk-base"
      fill="$baseColor"
      d="M0,205V314a15,15,0,0,0,15.07,15H408.93A15,15,0,0,0,424,314V205Z"
    />
    <path
      class="bulk-cut" fill="$cutColor"
      d="M407.22,0H16.78A16.77,16.77,0,0,0,0,16.75V205a17,17,0,0,0,16.78,17H407.22A17,17,0,0,0,424,205V16.75A16.77,16.77,0,0,0,407.22,0Z"
    />
  </svg>
`
);

BULK_TEMPLATE_MAP.set(
  '11',
  `
  <svg id="bulk-11" viewBox="0 0 282 329" xmlns="http://www.w3.org/2000/svg">
    <path
      class="bulk-base"
      fill="$baseColor"
      d="M0,205V314a15,15,0,0,0,15.08,15H266.92A15,15,0,0,0,282,314V205Z"
    />
    <path
      class="bulk-cut" fill="$cutColor"
      d="M265.21,0H16.79A16.77,16.77,0,0,0,0,16.75V205a17,17,0,0,0,16.79,17H265.21A17,17,0,0,0,282,205V16.75A16.77,16.77,0,0,0,265.21,0Z"
    />
  </svg>
`
);

BULK_TEMPLATE_MAP.set(
  '12',
  `
  <svg id="bulk-12" viewBox="0 0 424 371" xmlns="http://www.w3.org/2000/svg">
    <path
      class="bulk-base"
      fill="$baseColor"
      d="M0,247V356a15,15,0,0,0,15.07,15H408.93A15,15,0,0,0,424,356V247Z"
    />
    <path
      class="bulk-cut" fill="$cutColor"
      d="M407.22,0H16.78A16.78,16.78,0,0,0,0,16.77V247a17,17,0,0,0,16.78,17H407.22A17,17,0,0,0,424,247V16.77A16.78,16.78,0,0,0,407.22,0Z"
    />
  </svg>
`
);

BULK_TEMPLATE_MAP.set(
  '13',
  `
  <svg id="bulk-13" viewBox="0 0 352 371" xmlns="http://www.w3.org/2000/svg">
    <path
      class="bulk-base"
      fill="$baseColor"
      d="M0,247V356a15,15,0,0,0,15,15H337a15,15,0,0,0,15-15V247Z"
    />
    <path
      class="bulk-cut" fill="$cutColor"
      d="M335.25,0H16.75A16.73,16.73,0,0,0,0,16.72V247a17,17,0,0,0,16.75,17H335.25A17,17,0,0,0,352,247V16.72A16.73,16.73,0,0,0,335.25,0Z"
    />
  </svg>
`
);

BULK_TEMPLATE_MAP.set(
  '14',
  `
  <svg id="bulk-14" viewBox="0 0 424 450" xmlns="http://www.w3.org/2000/svg">
    <path
      class="bulk-base"
      fill="$baseColor"
      d="M0,328V435a15,15,0,0,0,15.07,15H408.93A15,15,0,0,0,424,435V328Z"
    />
    <path
      class="bulk-cut" fill="$cutColor"
      d="M407.22,0H16.78A16.79,16.79,0,0,0,0,16.8V328a17,17,0,0,0,16.78,17H407.22A17,17,0,0,0,424,328V16.8A16.79,16.79,0,0,0,407.22,0Z"
    />
  </svg>
`
);

BULK_TEMPLATE_MAP.set(
  '15',
  `
  <svg id="bulk-15" viewBox="0 0 424 527" xmlns="http://www.w3.org/2000/svg">
    <path
      class="bulk-base"
      fill="$baseColor"
      d="M0,403V512a15,15,0,0,0,15.07,15H408.93A15,15,0,0,0,424,512V403Z"
    />
    <path
      class="bulk-cut" fill="$cutColor"
      d="M407.22,0H16.78A16.77,16.77,0,0,0,0,16.76V403a17,17,0,0,0,16.78,17H407.22A17,17,0,0,0,424,403V16.76A16.77,16.77,0,0,0,407.22,0Z"
    />
  </svg>
`
);

BULK_TEMPLATE_MAP.set(
  '16',
  `
  <svg id="bulk-16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 313 106">
    <path
      class="bulk-base"
      fill="$baseColor"
      d="M10.6,66.1C6,79.1,2.4,92.4,0,106h306.5c5,0,6.5-3.6,6.5-6.1V5C103.8,22.3,39.2-2.7,10.6,66.1z"
    />
    <path
      class="bulk-cut" fill="$cutColor"
      d="M307.7,0L70.6,13.5c-45.5,3.5-60,52.6-60,52.6c22.5-33.3,36.2-41.4,60.6-42.7L308.3,9.9c2.6,0,4.7-2.1,4.7-4.7
    c0-0.1,0-0.2,0-0.2C313.1,2.6,310.2-0.1,307.7,0z"
    />
  </svg>
`
);

BULK_TEMPLATE_MAP.set(
  '17',
  `
  <svg
    version="1.1"
    id="bulk-17"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    viewBox="0 0 313 91"
    style="enable-background:new 0 0 313 91;"
    xml:space="preserve"
  >
    <path
      class="bulk-base"
      fill="$baseColor"
      d="M10.6,44.8C4.6,57,0,69.9,0,91h307c3.3,0,6-2.7,6-6V4C33.7-1,37.9-4.8,10.6,44.8z"
    />
    <path
      class="bulk-cut" fill="$cutColor"
      d="M308.5,0H58.4C28.6,0,13.5,39.4,11.1,43.9c0,0,20.4-34.9,46.3-34.9h251.1c2.5,0,4.5-2.5,4.5-4.9S311,0,308.5,0z"
    />
  </svg>
`
);

BULK_TEMPLATE_MAP.set(
  '18',
  `
  <svg
    version="1.1"
    id="bulk-18"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    viewBox="0 0 289 126"
    style="enable-background:new 0 0 289 126;"
    xml:space="preserve"
  >
    <path
      class="bulk-base"
      fill="$baseColor"
      d="M0,126h276c7.3,0,13-4,13-9.6V12C31.7,18.9,10.4,28.2,0,126z"
    />
    <path
      class="bulk-cut" fill="$cutColor"
      d="M277.2,0C45.5,19.8,8.2-4.5,0,126C9.7,23.2,127.6,42.7,275.1,26c10.2-0.9,13.9-7.6,13.9-14
    C289,5.3,284.2,0,277.2,0z"
    />
  </svg>
`
);

BULK_TEMPLATE_MAP.set(
  '19',
  `
  <svg
    id="bulk-19"
    version="1.1"
    viewBox="0 0 268 172"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      class="bulk-cut" fill="$cutColor"
      d="M21,23.6C13.9,33.5,4.6,60.1,0,96.1c0,0,242.7,71.6,252.7,74.9c10,3.3,15.3-2,15.3-8.6V54
    C268,54,54.7,5.7,45.7,6C35.1,6.3,25.7,17.8,21,23.6z"
    />
    <path
      class="bulk-base"
      fill="$baseColor"
      d="M258.1,45.3c-7.3-2-139-33.6-184.7-44.3C60.5-1.8,38.6-0.1,21,23.6c2-2.5,10.4-11.6,21.1-9
    c12.3,3,190.6,49.1,190.6,49.1C240,66,259.1,71,265.4,61c1.8-2.8,2.5-5.1,2.6-7C268.1,49.1,263.4,46.7,258.1,45.3z"
    />
  </svg>
`
);

BULK_TEMPLATE_MAP.set(
  '20',
  `
  <svg
    id="bulk-20"
    version="1.1"
    viewBox="0 0 286 197"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      class="bulk-base" 
      fill="$baseColor"
      d="M8,88L0,197h270c8.5,0,16-5.5,16-14V88H8z" />
    <path
      class="bulk-cut" fill="$cutColor"
      d="M285.5,13c-0.8-7.7-4.2-13-14.5-13C258.7,0,115.7,11.8,90,14C19,20.1,0,69.8,0,111v86
    c6.2-42.3,25.1-76.5,82-81.8c33.7-3.5,184-14.2,184-14.2c11.2,0,20-4.5,20-15C286,56.2,285.9,20.4,285.5,13z"
    />
  </svg>
`
);

BULK_TEMPLATE_MAP.set(
  '21',
  `
  <svg
    id="bulk-21"
    version="1.1"
    viewBox="0 0 287 235"
    xmlns="http://www.w3.org/2000/svg"
    icon-transform="scale(0.66) rotate(-4.5) translate(170 38)"
  >
    <path
      class="bulk-base"
      fill="$baseColor"
      fill-opacity="1"
      stroke-width="3"
      d="M0,235h271c10,0,16-5.7,16-14V113H0V235z"
    />
    <path
      class="bulk-cut" fill="$cutColor"
      fill-opacity="1"
      stroke-width="1"
      d="M270,0C260.4,0,95.2,11.3,62,17S0,49,0,104v131c0,0,9.9-74.3,66-79s199-15,199-15c10.3,0,22-3.7,22-16V20
      C287,6.2,278.3,0,270,0z"
    />
  </svg>
`
);

BULK_TEMPLATE_MAP.set(
  '22',
  `
  <svg
    id="bulk-22"
    version="1.1"
    viewBox="0 0 287 322"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path class="bulk-base" 
      d="M0,145v177h271c10,0,16-5.7,16-14V145H0z" 
      fill="$baseColor"/>
    <path
      class="bulk-cut" fill="$cutColor"
      d="M270,0C260.4,0,95.2,10.3,62,16S0,47,0,102v215c0,0,9.9-74.3,66-79s199-15,199-15c10.3,0,22-3.7,22-16V19
    C287,6.9,278.8,0,270,0z"
    />
  </svg>
`
);

BULK_TEMPLATE_MAP.set(
  '23',
  `
  <svg
    version="1.1"
    id="bulk-23"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    viewBox="0 0 287 357"
    style="enable-background:new 0 0 287 357;"
    xml:space="preserve"
  >
    <path 
      class="bulk-base" 
      d="M0,200l0.1,157H271c10,0,16-5.7,16-14V200H0z" 
      fill="$baseColor"/>
    <path
      class="bulk-cut" fill="$cutColor"
      d="M270,0C260.4,0,94.6,7.6,62,16C17.4,27.5,0,47.1,0,118v239c0,0,9.9-74.3,66-79s199-15,199-15
    c10.3,0,22-3.7,22-16V19C287,7.6,279.6,0,270,0z"
    />
    <rect
      x="36"
      y="48"
      transform="matrix(0.9989 -4.616482e-02 4.616482e-02 0.9989 -6.312 7.1897)"
      class="st1"
      width="233"
      height="184.5"
      fill-opacity="0"
    />
  </svg>
`
);

BULK_TEMPLATE_MAP.set(
  '24',
  `
  <svg
    id="bulk-24"
    version="1.1"
    viewBox="0 0 287 437"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path class="bulk-base" d="M0,300v137h271c10,0,16-5.7,16-14V300H0z" fill="$baseColor"/>
    <path
      class="bulk-cut" fill="$cutColor"
      d="M270,0C260.4,0,95.2,10.3,62,16S0,47,0,102v335c0,0,9.9-74.3,66-79s199-15,199-15c10.3,0,22-3.7,22-16V19
    C287,7.1,279.1,0,270,0z"
    />
  </svg>
`
);

BULK_TEMPLATE_MAP.set(
  '25',
  `
  <svg id="bulk-25" viewBox="0 0 286 512" xmlns="http://www.w3.org/2000/svg">
    <path class="bulk-base" d="M0,350V512H271c10,0,15-4.67,15-13V350Z" fill="$baseColor"/>
    <path
      class="bulk-cut" fill="$cutColor"
      d="M267,0C257.42,0,94.18,10.33,61,16S0,45,0,102V512s8.9-73.33,65-78,200-15,200-15c10.26,0,21-3.67,21-16V19C286,3.63,278.19,0,267,0Z"
    />
  </svg>
`
);

BULK_TEMPLATE_MAP.set(
  '26',
  `
  <svg id="bulk-26" viewBox="0 0 45 44" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(0.0,44.00) scale(0.1,-0.1)" >
      <path class="icon bulk" fill="$stickerColor" d="M181 414 c-25 -32 -26 -43 -5 -72 19 -27 64 -29 87 -4 24 26 21 68 -5 86 -32 23 -54 20 -77 -10z"/>
      <path class="icon bulk" fill="$stickerColor" d="M105 254 c-29 -35 -35 -48 -25 -57 9 -9 19 -3 46 28 l34 40 0 -37 0 -38 65 0 65 0 0 33 1 32 28 -32 c28 -34 51 -43 51 -20 0 7 -16 32 -36 55 l-36 42 -78 0 -78 0 -37 -46z"/>
      <path class="icon bulk" fill="$stickerColor" d="M125 130 c-18 -19 -25 -34 -21 -47 8 -26 74 -89 83 -79 6 6 2 21 -22 78 -5 12 1 21 21 31 l28 15 -31 15 c-29 16 -31 15 -58 -13z"/>
      <path class="icon bulk" fill="$stickerColor" d="M270 148 c-36 -13 -37 -18 -12 -37 23 -17 23 -18 6 -54 -27 -57 -6 -68 40 -20 41 44 45 71 14 100 -18 17 -28 19 -48 11z"/>
    </g>
  </svg>
  `
);

BULK_TEMPLATE_MAP.set(
  '27',
  `
  <svg id="bulk-27" viewBox="0 0 114 115" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_1014_1377)">
      <path class="icon bulk" fill="$stickerColor" d="M101.283 0.919922H12.7167C5.7 0.931322 0.0114 6.61992 0 13.6366V102.203C0.0114 109.22 5.7 114.909 12.7167 114.92H101.283C108.3 114.909 113.989 109.22 114 102.203V13.6366C113.989 6.61992 108.3 0.931322 101.283 0.919922ZM111.15 102.203C111.133 107.647 106.727 112.053 101.283 112.07H12.7167C7.2732 112.053 2.8671 107.647 2.85 102.203V13.6366C2.8671 8.19312 7.2732 3.78702 12.7167 3.76992H101.283C106.727 3.78702 111.133 8.19312 111.15 13.6366V102.203ZM70.9137 96.3037C63.6519 97.9738 48.1365 99.319 39.9798 95.4487C35.5053 93.3283 34.0347 88.8823 33.63 85.3027C33.2823 82.3615 31.4982 69.2059 33.003 56.8597C34.5135 44.485 41.7639 36.0889 41.7639 36.0889L42.6759 36.4537C43.0464 35.4391 43.4568 34.1566 43.662 32.9596C43.662 32.9596 42.1458 30.9532 40.413 28.2058C39.3072 26.4502 39.3072 22.882 40.641 20.716C42.978 16.9312 47.8116 15.6715 50.8725 17.2504C52.4628 18.0712 55.2729 19.1086 57.1083 24.6718C58.1172 27.727 58.6986 33.1762 57.0285 37.531C56.5098 38.8762 53.5971 38.1067 52.2405 37.0636C51.9327 37.0636 51.6762 37.0921 51.4881 37.1605C50.7186 37.4398 50.2626 38.557 50.0175 39.412L50.8896 39.7654L51.3285 42.6154C51.3285 42.6154 54.2469 48.0988 55.1532 54.5854C55.1988 54.9046 55.2444 55.2637 55.3014 55.6399C57.2736 58.0852 59.3313 59.8294 61.104 59.6698C63.5094 59.4532 70.4634 48.3097 70.4634 48.3097L70.9194 48.5947C71.0676 48.2185 71.3925 47.4889 71.9625 46.8277C72.7662 45.8929 75.3198 44.3026 75.9069 44.5534C76.494 44.8042 74.6301 46.537 74.6301 46.537C74.6301 46.537 76.6764 45.9613 77.1153 45.1291C77.5542 44.2969 77.4459 43.1455 77.9532 43.2538C78.4662 43.3621 78.4662 45.0835 78.2439 46.0468C78.0273 47.0044 77.5143 47.221 77.5143 47.221C77.5143 47.221 77.4402 47.6884 77.0754 48.1957C76.7106 48.703 74.4078 49.6606 73.9518 50.4757L74.6301 50.8975C74.6301 50.8975 68.8845 71.1268 59.1318 70.8019C58.539 70.7848 57.9405 70.6708 57.342 70.4941C57.6384 72.6544 58.5846 79.5571 58.6245 79.8706C58.6245 79.8706 83.1915 78.0922 84.7818 85.1374C84.7818 85.1488 84.7818 85.1545 84.7818 85.1659C86.4177 92.5303 78.1527 94.6165 70.9023 96.2866L70.9137 96.3037Z" />
    </g>
    <defs>
      <clipPath id="clip0_1014_1377">
        <rect width="114" height="114" transform="translate(0 0.919922)"/>
      </clipPath>
    </defs>
  </svg>
  `
);

BULK_TEMPLATE_MAP.set(
  '28',
  `
  <svg id="bulk-28" viewBox="0 0 114 115" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_1014_1379)">
      <path class="icon bulk" fill="$stickerColor" d="M101.283 0.0800781H12.7167C5.7 0.0914781 0.0114 5.78008 0 12.7968V101.363C0.0114 108.38 5.7 114.069 12.7167 114.08H101.283C108.3 114.069 113.989 108.38 114 101.363V12.7968C113.989 5.78008 108.3 0.0914781 101.283 0.0800781ZM111.15 101.363C111.133 106.807 106.727 111.213 101.283 111.23H12.7167C7.2732 111.213 2.8671 106.807 2.85 101.363V12.7968C2.8671 7.35328 7.2732 2.94718 12.7167 2.93008H101.283C106.727 2.94718 111.133 7.35328 111.15 12.7968V101.363ZM90.7782 29.2299L91.4508 26.8131L70.5717 21.1302L70.3836 21.0789L67.488 31.2306H35.4939L39.7803 84.5598C39.8145 87.1647 41.9577 89.2737 44.5911 89.2737H69.4602C72.0879 89.2737 74.2311 87.1704 74.271 84.5712L79.3041 31.2306H70.1214L72.1392 24.1569L90.7839 29.2356L90.7782 29.2299ZM38.4522 43.8789L37.6599 33.6702H66.7926L63.8856 43.8789H38.4579H38.4522ZM55.8828 57.6159L53.8593 63.3729L48.051 61.3665L50.0745 55.6095L55.8828 57.6159ZM50.8611 82.4337L44.6538 75.132L52.0182 68.976L58.2255 76.2777L50.8611 82.4337ZM67.146 73.7127L58.0488 70.572L61.2123 61.5546L70.3095 64.6953L67.146 73.7127ZM77.1381 33.6702L76.209 43.8789H66.5133L69.4203 33.6702H77.1381Z"/>
    </g>
    <defs>
      <clipPath id="clip0_1014_1379">
        <rect width="114" height="114" transform="translate(0 0.0800781)"/>
      </clipPath>
    </defs>
  </svg>
  `
);

export default BULK_TEMPLATE_MAP;
