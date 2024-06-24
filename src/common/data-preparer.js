import { JetsDataHelper } from './data-helper';
import {
  CLASS_CODE_MAP,
  LOCALES_MAP,
  ENTITY_SCHEME_MAP,
  ENTITY_STATUS_MAP,
  ENTITY_TYPE_MAP,
  DEFAULT_DECK_TITLE_HEIGHT,
  DEFAULT_INDEX_ROW_HEIGHT,
  SEAT_SIZE_BY_TYPE,
} from './constants';
import { Utils } from './utils';

const DEFAULT_INDEX_ROW_SEAT_TOP_OFFSET = 50;
const DEFAULT_INDEX_ROW_SEAT_HEIGHT = 50;

const SEAT_FEATURES_ICONS = {
  '+': '<svg width="20" height="20" viewBox="-1 -1 22 22" xmlns="http://www.w3.org/2000/svg"><path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM7.29 14.29L3.7 10.7C3.31 10.31 3.31 9.68 3.7 9.29C4.09 8.9 4.72 8.9 5.11 9.29L8 12.17L14.88 5.29C15.27 4.9 15.9 4.9 16.29 5.29C16.68 5.68 16.68 6.31 16.29 6.7L8.7 14.29C8.32 14.68 7.68 14.68 7.29 14.29Z" fill="#11d900"></path></svg>',
  '-': '<svg width="20" height="20" viewBox="-1 -1 22 22" xmlns="http://www.w3.org/2000/svg"><path d="M11.89 6.7L10 8.59L8.11 6.7C7.72 6.31 7.09 6.31 6.7 6.7C6.31 7.09 6.31 7.72 6.7 8.11L8.59 10L6.7 11.89C6.31 12.28 6.31 12.91 6.7 13.3C7.09 13.69 7.72 13.69 8.11 13.3L10 11.41L11.89 13.3C12.28 13.69 12.91 13.69 13.3 13.3C13.69 12.91 13.69 12.28 13.3 11.89L11.41 10L13.3 8.11C13.69 7.72 13.69 7.09 13.3 6.7C12.91 6.32 12.27 6.32 11.89 6.7ZM10 0C4.47 0 0 4.47 0 10C0 15.53 4.47 20 10 20C15.53 20 20 15.53 20 10C20 4.47 15.53 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18Z" fill="red"></path></svg>',
  wifi: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15.23 11"><title>wifi</title><path d="M6.62,9.91A1.08,1.08,0,1,0,7.7,8.82,1.08,1.08,0,0,0,6.62,9.91M7.7,7.64A2.24,2.24,0,0,1,9.84,9.26L11,8a3.76,3.76,0,0,0-6.65.09L5.54,9.32A2.25,2.25,0,0,1,7.7,7.64m0-3.06a5.25,5.25,0,0,1,4.37,2.35l1.08-1.15a6.75,6.75,0,0,0-11,.14L3.25,7A5.26,5.26,0,0,1,7.69,4.58m0-3a8.19,8.19,0,0,1,6.45,3.15l1.08-1.14A9.73,9.73,0,0,0,0,3.78L1.11,4.89A8.22,8.22,0,0,1,7.7,1.56" fill="#4f6f8f"/></svg>',
  wifi_enabled:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15.23 11"><title>wifi</title><path d="M6.62,9.91A1.08,1.08,0,1,0,7.7,8.82,1.08,1.08,0,0,0,6.62,9.91M7.7,7.64A2.24,2.24,0,0,1,9.84,9.26L11,8a3.76,3.76,0,0,0-6.65.09L5.54,9.32A2.25,2.25,0,0,1,7.7,7.64m0-3.06a5.25,5.25,0,0,1,4.37,2.35l1.08-1.15a6.75,6.75,0,0,0-11,.14L3.25,7A5.26,5.26,0,0,1,7.69,4.58m0-3a8.19,8.19,0,0,1,6.45,3.15l1.08-1.14A9.73,9.73,0,0,0,0,3.78L1.11,4.89A8.22,8.22,0,0,1,7.7,1.56" fill="#4f6f8f"/></svg>',
  wifiEnabled:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15.23 11"><title>wifi</title><path d="M6.62,9.91A1.08,1.08,0,1,0,7.7,8.82,1.08,1.08,0,0,0,6.62,9.91M7.7,7.64A2.24,2.24,0,0,1,9.84,9.26L11,8a3.76,3.76,0,0,0-6.65.09L5.54,9.32A2.25,2.25,0,0,1,7.7,7.64m0-3.06a5.25,5.25,0,0,1,4.37,2.35l1.08-1.15a6.75,6.75,0,0,0-11,.14L3.25,7A5.26,5.26,0,0,1,7.69,4.58m0-3a8.19,8.19,0,0,1,6.45,3.15l1.08-1.14A9.73,9.73,0,0,0,0,3.78L1.11,4.89A8.22,8.22,0,0,1,7.7,1.56" fill="#4f6f8f"/></svg>',
  power:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 21"><path d="M20.07,10.16a1.34,1.34,0,0,1-1.34,1.34H3.5a1.34,1.34,0,1,1,0-2.68h2V1.12a1.12,1.12,0,1,1,2.24,0v7.7h6.73V1.12a1.12,1.12,0,1,1,2.24,0v7.7h2A1.34,1.34,0,0,1,20.07,10.16ZM3.54,12.63V18.8A2.25,2.25,0,0,0,5.4,21H16.84a2.24,2.24,0,0,0,1.85-2.2V12.62Z"  fill="#4f6f8f"></path></svg>',
  audioVideo:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 21"><path d="M6.51,8.59h3.57L8.44,11.13H4.88ZM18.45,2.31,17.43,0,15,1.08l2.53,1.65Zm-3.16,1.4L12.77,2.07,9.51,3.52,12,5.17Zm-4.42,7.41h3.57l1.64-2.53H12.51Zm-1.05-5L7.29,4.51,4,6,6.56,7.6ZM18.5,8.59l-1.64,2.53h2.67V8.59Zm-16,11.24A1.16,1.16,0,0,0,3.63,21H18.37a1.16,1.16,0,0,0,1.16-1.16V13.2H2.47Zm.17-13V11.2L4.51,8.41Z" fill="#4f6f8f"></path></svg>',
  dot: '<svg width="20" height="20" viewBox="-1 -1 22 22" xmlns="http://www.w3.org/2000/svg"><path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0Z" fill="#4f6f8f"></path></svg>',
};

const SEAT_MEASUREMENTS_ICONS = {
  recline:
    '<svg width="48" height="51" viewBox="0 0 48 51" xmlns="http://www.w3.org/2000/svg"><g transform="scale(-1, 1) translate(-48,0)"><path d="M19.3954 30.8342C19.7952 31.1919 20.4265 30.8973 20.4265 30.3502C20.4265 30.1818 20.3424 30.0345 20.2161 29.9082L20.1319 29.8241L19.2902 29.1507L19.2691 29.1296C18.8272 28.7298 18.1538 29.1086 18.259 29.6978C18.2801 29.8451 18.3432 29.9503 18.4484 30.0345L18.4695 30.0555L19.3112 30.7289L19.3954 30.8131V30.8342Z"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M14.5973 0.152473C13.2084 0.510215 12.051 1.49927 11.8616 3.2038V3.30902C11.4284 12.9854 11.4976 17.6783 12.4905 21.7889L11.967 21.091L11.946 21.0489C11.8197 20.8384 11.5672 20.7543 11.3357 20.7753C10.8938 20.8384 10.6833 21.3435 10.9148 21.7223L10.9359 21.7643L11.6303 22.6903L11.6724 22.7534L11.6934 22.7955C11.9769 23.1853 12.5288 23.0977 12.734 22.7212C12.8634 23.1823 13.0052 23.6402 13.1601 24.1013C13.1537 24.128 13.1488 24.1557 13.1454 24.1844C13.1244 24.3527 13.1875 24.5211 13.2927 24.6473L13.3138 24.6894L13.4099 24.8175C14.1463 26.8561 15.1378 29.0219 16.4364 31.8585L16.4492 31.8863C16.5014 32.0005 16.5542 32.1159 16.6075 32.2325C17.1074 33.3248 17.6558 34.5232 18.246 35.841C18.0278 35.9337 17.8592 36.149 17.8592 36.4318C17.8592 36.6001 17.9434 36.7474 18.0697 36.8737L18.8904 37.6944L18.9535 37.7365C19.0105 37.7891 19.073 37.828 19.1381 37.8543C19.2985 38.2206 19.4614 38.5951 19.6267 38.978C19.9424 39.7355 20.2581 40.2616 20.9735 40.6615C21.5838 40.9982 22.3624 41.1455 23.625 41.1665C24.8703 41.187 26.0681 41.2 27.2319 41.2077L29.5644 48.0056H22.8676C22.1942 48.0056 21.626 48.5527 21.626 49.2472C21.626 49.9206 22.1731 50.4888 22.8676 50.4888H31.1617C31.2508 50.4988 31.3418 50.499 31.433 50.4888H42.838C43.5114 50.4888 44.0795 49.9416 44.0795 49.2472C44.0795 48.5738 43.5324 48.0056 42.838 48.0056H32.1957L29.8663 41.2168C31.8256 41.2179 33.7121 41.2077 35.5976 41.1974C36.2285 41.194 36.8594 41.1906 37.4928 41.1876C38.3328 41.1876 39.1769 41.1835 40.1246 41.179C41.3371 41.1731 42.7192 41.1665 44.4793 41.1665C45.7419 41.1876 46.5836 40.3037 47.0045 39.1253C47.1518 38.7044 47.236 38.2415 47.257 37.7785C47.2781 37.3155 47.236 36.8315 47.1308 36.3896C46.8151 35.148 46.0155 34.1379 44.5845 34.0117C40.2916 33.6539 37.4297 33.4014 34.5888 33.1489C33.2553 33.0322 31.925 32.9122 30.6452 32.7968C28.6936 32.6208 26.859 32.4553 25.3085 32.3282C19.7951 20.3544 18.6166 17.5976 19.6057 3.43528C19.7109 1.96223 18.8481 0.910044 17.6486 0.383953C17.1857 0.173516 16.6806 0.0472546 16.1545 0.00516733C15.6285 -0.0158763 15.1024 0.026211 14.5973 0.152473ZM28.3161 38.6924C31.509 38.7099 34.4611 38.691 37.4717 38.6623C40.0812 38.6413 42.7116 38.6202 44.4582 38.6202H44.4793C44.4793 38.6202 44.5424 38.4729 44.6266 38.2625C44.6897 38.0731 44.7318 37.8416 44.7528 37.6101C44.7739 37.3787 44.7528 37.1472 44.6897 36.9367C44.6266 36.6632 44.5214 36.4738 44.353 36.4527C43.8105 36.4054 43.2248 36.3545 42.6047 36.3006C40.1945 36.0912 37.2654 35.8367 34.3362 35.5689L34.335 35.5688C31.4945 35.3163 28.6538 35.0638 24.3405 34.7061L23.625 34.643L23.3304 33.9906L23.2462 33.8223C23.1555 33.6256 23.0658 33.4313 22.9772 33.2392C22.7687 33.4555 22.4052 33.5083 22.1311 33.2752V33.2963L22.0469 33.2331L21.5419 32.8123L21.2052 32.4756C21.0789 32.3493 21.0158 32.223 20.9947 32.0547C20.9526 31.5075 21.605 31.1919 22.0048 31.5496L22.3415 31.8863L22.3617 31.9031C17.1874 20.6464 16.1038 17.4332 17.1015 3.24589C17.1226 2.97232 16.9121 2.76188 16.6175 2.63562C16.4281 2.55145 16.1966 2.48832 15.9441 2.46727C15.6916 2.44623 15.4391 2.46727 15.2076 2.5304L15.2286 2.55145C14.7867 2.67771 14.4079 2.97232 14.3448 3.45632C13.7423 17.155 14.1695 20.4518 16.9083 26.8319L17.5225 27.4461C17.7771 27.7007 17.767 28.0756 17.5559 28.3069C17.9026 29.0826 18.2795 29.9097 18.6886 30.8073L18.7008 30.8341C19.6057 32.7912 20.6579 35.0849 21.8995 37.9679C22.0047 38.2415 22.1099 38.4098 22.1941 38.4519C22.4045 38.5781 22.8254 38.6202 23.6461 38.6413C25.1362 38.6658 26.5566 38.6814 27.9307 38.6901C28.0607 38.6701 28.1906 38.6716 28.3161 38.6924Z"></path><path d="M0.140476 10.527L0.132009 10.5185L0.182563 10.6533L0.0983887 10.485V9.05399C0.140476 8.88564 0.245694 8.75938 0.371956 8.67521C0.834916 8.38059 1.42414 8.80147 1.29788 9.32756V10.1062L1.38205 10.3587C1.5504 10.7796 1.2137 11.2215 0.771785 11.2004C0.540305 11.1794 0.329869 11.0321 0.245694 10.8006L0.22465 10.7375L0.140476 10.527Z"></path><path d="M2.26588 12.6525C2.05545 12.1264 1.31892 12.1474 1.12953 12.6525C1.0664 12.7998 1.0664 12.9471 1.12953 13.0944L1.15057 13.1575L1.48727 13.9151L1.59249 14.2307C1.80292 14.7358 2.51841 14.7358 2.72884 14.2307C2.79197 14.0834 2.79197 13.9151 2.72884 13.7678L2.56049 13.2627L2.30797 12.6945L2.28693 12.6314L2.26588 12.6525Z"></path><path d="M3.63372 16.0405C3.42328 15.5354 2.7078 15.5354 2.49736 16.0405C2.43423 16.1878 2.43423 16.3561 2.49736 16.5034V16.5245L2.68676 17.0295L2.93928 17.6188V17.6398C3.17076 18.1659 3.90729 18.1238 4.07564 17.5977C4.11772 17.4504 4.11772 17.3031 4.05459 17.1558V17.1347L3.73894 16.3982L3.61268 16.0615V16.0405H3.63372Z"></path><path d="M5.08573 19.3864C4.83321 18.8393 4.05459 18.9445 3.92833 19.5337C3.90729 19.66 3.92833 19.7862 3.97042 19.9125V19.9336L4.51755 21.0278C4.62277 21.2383 4.85425 21.3856 5.08573 21.3856C5.52765 21.3645 5.80121 20.9016 5.61182 20.5017L5.06469 19.4075V19.3864H5.08573Z"></path><path d="M5.56973 22.7534C5.5066 22.9217 5.52765 23.0901 5.61182 23.2374L6.24313 24.2896L6.28522 24.3527C6.41148 24.5421 6.62192 24.6684 6.85339 24.6473C7.31636 24.6263 7.56888 24.1212 7.3374 23.7214L7.29531 23.6583L6.664 22.6061L6.68505 22.6482C6.43252 22.1852 5.73808 22.2273 5.56973 22.7534Z"></path><path d="M8.57897 25.6995C8.26332 25.2576 7.54784 25.4259 7.46366 25.9731C7.44262 26.1204 7.4847 26.2887 7.56888 26.415L8.32645 27.4251L8.34749 27.4461C8.68419 27.867 9.37863 27.6776 9.44176 27.1305C9.46281 26.9621 9.42072 26.8148 9.3155 26.6886L8.55793 25.6785L8.57897 25.6995Z"></path><path d="M10.8517 28.4773C10.7044 28.3089 10.4729 28.2458 10.2625 28.3089C9.7995 28.4141 9.63116 28.9823 9.96785 29.319L9.9889 29.3401L10.3677 29.8451L10.8306 30.3081C11.2094 30.6868 11.8828 30.4133 11.8828 29.8661C11.8828 29.6978 11.8197 29.5505 11.6934 29.4453L11.6513 29.4032L11.5251 29.2348L10.9359 28.6456L10.8517 28.4773Z"></path><path d="M13.4401 31.0235C13.0613 30.6658 12.451 30.9183 12.4089 31.4444C12.4089 31.6338 12.472 31.8022 12.5983 31.9284L13.4401 32.7702C13.8399 33.1279 14.4712 32.8333 14.4712 32.3072C14.4712 32.1389 14.387 31.9705 14.2608 31.8653L13.419 31.0235H13.4401Z"></path><path d="M16.1547 33.4857C15.7549 33.1279 15.1446 33.4225 15.1446 33.9486C15.1446 34.117 15.2288 34.2853 15.355 34.4116L16.2178 35.2744C16.3651 35.4217 16.5756 35.4638 16.786 35.4217C17.27 35.2954 17.4173 34.7062 17.0385 34.3695L16.1547 33.4857Z"></path><path d="M9.67324 19.6389C9.94681 20.1019 10.6202 20.0388 10.7886 19.5127C10.8306 19.3443 10.8306 19.176 10.7465 19.0287L10.3887 18.3132L10.3046 18.1028L10.2625 18.0186C10.031 17.5556 9.33654 17.5977 9.14715 18.0817C9.08402 18.2501 9.08402 18.4184 9.16819 18.5868L9.21028 18.6709L9.54698 19.5127L9.6522 19.7231L9.67324 19.6389Z"></path><path d="M8.0108 16.314C8.11601 16.5455 8.32645 16.6718 8.57897 16.6718C9.02089 16.6507 9.29446 16.2088 9.12611 15.809L8.78941 14.9673L8.74732 14.841L8.70523 14.7568C8.4948 14.2728 7.8214 14.2518 7.58992 14.7358C7.52679 14.9041 7.50575 15.0725 7.58992 15.2408L7.63201 15.325L7.80036 15.83L8.0108 16.3561V16.314Z"></path><path d="M6.57983 12.905C6.79026 13.4311 7.54784 13.41 7.73723 12.8839C7.77931 12.7366 7.77931 12.5893 7.73723 12.4631L7.71618 12.442L7.54784 11.937L7.4847 11.8107L7.29531 11.3688V11.3477C7.08488 10.8006 6.30626 10.8217 6.13791 11.3898C6.09582 11.5161 6.09582 11.6424 6.15896 11.7897V11.8107L6.47461 12.5472L6.664 12.926L6.68505 12.9471L6.57983 12.905Z"></path><path d="M5.27512 9.45382C5.48556 10.001 6.26417 9.97991 6.43252 9.43278C6.47461 9.30651 6.47461 9.18025 6.43252 9.05399L6.41148 8.99086L6.28522 8.69625L6.03269 8.02285L5.94852 7.8545L5.92748 7.83346C5.696 7.32841 4.95947 7.3705 4.79112 7.89659C4.74903 8.0439 4.74903 8.1912 4.81216 8.33851V8.44372L5.12782 9.28547L5.19095 9.43278L5.21199 9.49591L5.27512 9.45382Z"></path><path d="M3.44433 7.66511C3.97042 7.62302 4.2019 6.97067 3.82311 6.61293C3.69685 6.48667 3.5285 6.44458 3.36015 6.44458H2.28693L1.65562 6.76023H1.63457C1.40309 6.86545 1.27683 7.09693 1.27683 7.32841C1.29788 7.77033 1.73979 8.0439 2.13962 7.8545H3.00241L3.44433 7.66511Z"></path></g></svg>',
  width:
    '<svg width="35" height="50" viewBox="0 0 35 50" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M31.1151 33.3111C32.0089 33.4715 32.8177 33.9081 33.4335 34.5238C34.2198 35.31 34.7141 36.4106 34.7141 37.6011C34.7141 38.7916 34.2198 39.8922 33.4335 40.6784C32.6472 41.4645 31.5464 41.9587 30.3557 41.9587H23.2082L23.1928 47.4843H27.8396C28.5361 47.4843 29.0977 48.0458 29.0977 48.7421C29.0977 49.4385 28.5361 50 27.8396 50H7.86769C7.17126 50 6.60962 49.4385 6.60962 48.7421C6.60962 48.0458 7.17126 47.4843 7.86769 47.4843H12.4992L12.5146 41.9587H5.35149C4.16082 41.9587 3.06 41.4645 2.2737 40.6784C1.48741 39.8922 0.993164 38.7916 0.993164 37.6011C0.993164 36.4106 1.48741 35.31 2.2737 34.5238C2.88437 33.9133 3.68474 33.4788 4.56958 33.3152L4.82779 23.4241C4.72932 23.4271 4.63334 23.4314 4.51247 23.4369C4.3114 23.446 4.04146 23.4581 3.57663 23.4727C2.90266 23.4951 2.31855 22.956 2.29609 22.2597C2.27362 21.5859 2.8128 21.0019 3.50923 20.9794C3.98488 20.965 4.26402 20.9529 4.47273 20.9438C4.63574 20.9368 4.75578 20.9316 4.89293 20.9286L5.32902 4.22282C5.35149 3.05481 5.84573 1.9991 6.60956 1.2354C7.37339 0.471698 8.42928 0 9.59749 0H26.0873C27.2555 0 28.3114 0.471698 29.0752 1.2354C29.839 1.9991 30.3108 3.05481 30.3557 4.22282L30.7921 20.9384C30.8322 20.94 30.8743 20.9419 30.9198 20.9438C31.1286 20.9529 31.4077 20.965 31.8833 20.9794C32.5798 21.0019 33.1189 21.5859 33.0965 22.2597C33.074 22.956 32.4899 23.4951 31.8159 23.4727C31.3511 23.4581 31.0812 23.446 30.8801 23.4369C30.8724 23.4365 30.8648 23.4362 30.8573 23.4359L31.1151 33.3111ZM20.6991 47.4843L20.7145 41.9587H15.0083L14.9929 47.4843H20.6991ZM27.8171 4.26775L28.5809 33.221H7.05887L7.82271 4.26775C7.82271 3.77359 8.0249 3.32435 8.36188 2.98742C8.6764 2.67296 9.10325 2.4708 9.57502 2.4708H26.0648C26.5366 2.4708 26.9634 2.67296 27.2779 2.98742C27.5925 3.32435 27.7946 3.77359 27.8171 4.26775ZM30.3557 35.7368H5.35149C4.83479 35.7368 4.38547 35.9389 4.04849 36.2759C3.7115 36.6128 3.50931 37.0845 3.50931 37.5787C3.50931 38.0953 3.7115 38.5445 4.04849 38.8814C4.38547 39.2184 4.85725 39.4205 5.35149 39.4205H30.3557C30.8724 39.4205 31.3218 39.2184 31.6587 38.8814C31.9957 38.5445 32.1979 38.0728 32.1979 37.5787C32.1979 37.062 31.9957 36.6128 31.6587 36.2759C31.3218 35.9389 30.85 35.7368 30.3557 35.7368Z"></path></svg>',
  pitch:
    '<svg width="74" height="51" viewBox="0 0 74 51" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M2.98892 0.152473C1.60004 0.510215 0.442636 1.49927 0.253243 3.2038V3.30902C-0.503624 20.2124 0.272842 21.9085 4.82805 31.8585L4.84076 31.8863L4.99918 32.2325L4.99924 32.2327L4.99927 32.2327C5.87007 34.1358 6.88816 36.3607 8.01834 38.978C8.334 39.7355 8.64965 40.2616 9.36514 40.6615C9.9754 40.9982 10.754 41.1455 12.0166 41.1665C13.2619 41.187 14.4597 41.2 15.6234 41.2077L17.9559 48.0057H11.2591C10.5857 48.0057 10.0175 48.5528 10.0175 49.2473C10.0175 49.9207 10.5646 50.4888 11.2591 50.4888H19.5541C19.6426 50.4987 19.7329 50.499 19.8235 50.4888H31.2295C31.9029 50.4888 32.471 49.9417 32.471 49.2473C32.471 48.5739 31.9239 48.0057 31.2295 48.0057H20.5872L18.2578 41.2168C20.2165 41.2179 22.1025 41.2077 23.9874 41.1974H23.9883H23.9892L23.992 41.1974L23.9947 41.1974C24.6238 41.194 25.2528 41.1906 25.8844 41.1876C26.7241 41.1876 27.5679 41.1835 28.5151 41.179H28.5156H28.5162C29.7287 41.1731 31.1108 41.1665 32.8709 41.1665C34.1335 41.1876 34.9752 40.3037 35.3961 39.1253C35.5434 38.7044 35.6276 38.2415 35.6486 37.7785C35.6697 37.3155 35.6276 36.8315 35.5224 36.3896C35.2067 35.148 34.4071 34.1379 32.9761 34.0117C28.6832 33.6539 25.8213 33.4014 22.9804 33.1489C21.6481 33.0323 20.3191 32.9124 19.0403 32.7971L19.0374 32.7968L19.0368 32.7968L19.0366 32.7968C17.085 32.6207 15.2506 32.4553 13.7001 32.3282C8.18669 20.3544 7.00825 17.5976 7.9973 3.43528C8.10252 1.96223 7.23973 0.910044 6.04024 0.383953C5.57728 0.173516 5.07224 0.0472546 4.54614 0.00516733C4.02005 -0.0158763 3.49396 0.026211 2.98892 0.152473ZM16.7077 38.6924C19.9006 38.7099 22.8527 38.691 25.8633 38.6623C28.4728 38.6413 31.1032 38.6202 32.8498 38.6202H32.8709C32.8709 38.6202 32.934 38.4729 33.0182 38.2625C33.0813 38.0731 33.1234 37.8416 33.1444 37.6101C33.1655 37.3787 33.1444 37.1472 33.0813 36.9367C33.0182 36.6632 32.913 36.4738 32.7446 36.4527C32.2021 36.4054 31.6163 36.3545 30.9963 36.3006L30.9954 36.3005C28.5853 36.0911 25.6566 35.8367 22.7278 35.5689L22.7265 35.5688L22.7256 35.5687L22.7244 35.5686C19.8846 35.3162 17.0443 35.0637 12.7321 34.7061L12.0166 34.643L11.722 33.9906L11.6378 33.8223C5.70355 20.9646 4.44093 18.2079 5.49311 3.24589C5.51415 2.97232 5.30371 2.76188 5.0091 2.63562C4.81971 2.55145 4.58823 2.48832 4.33571 2.46727C4.08319 2.44623 3.83066 2.46727 3.59918 2.5304L3.62022 2.55145C3.17831 2.67771 2.79952 2.97232 2.73639 3.45632C2.02158 19.7078 2.75606 21.3194 7.08023 30.8073L7.09242 30.8341C7.9973 32.7911 9.04948 35.0849 10.2911 37.9679C10.3963 38.2415 10.5015 38.4098 10.5857 38.4519C10.7961 38.5781 11.217 38.6202 12.0377 38.6413C13.5277 38.6658 14.948 38.6814 16.322 38.6901C16.4521 38.67 16.5821 38.6715 16.7077 38.6924ZM40.9889 0.152473C39.6 0.510215 38.4426 1.49927 38.2532 3.2038V3.30902C37.4964 20.2124 38.2728 21.9085 42.828 31.8585L42.8408 31.8863L42.9991 32.2323C43.8699 34.1355 44.8881 36.3605 46.0183 38.978C46.334 39.7355 46.6497 40.2616 47.3651 40.6615C47.9754 40.9982 48.754 41.1455 50.0166 41.1665C51.2619 41.187 52.4597 41.2 53.6234 41.2077L55.9559 48.0057H49.2591C48.5857 48.0057 48.0175 48.5528 48.0175 49.2473C48.0175 49.9207 48.5646 50.4888 49.2591 50.4888H57.5541C57.6426 50.4987 57.7329 50.499 57.8235 50.4888H69.2295C69.9029 50.4888 70.471 49.9417 70.471 49.2473C70.471 48.5739 69.9239 48.0057 69.2295 48.0057H58.5872L56.2578 41.2168C58.2165 41.2179 60.1025 41.2077 61.9874 41.1974H61.9883H61.9892C62.6201 41.194 63.251 41.1906 63.8844 41.1876C64.7241 41.1876 65.5679 41.1835 66.5151 41.179H66.5156H66.5162C67.7288 41.1731 69.1108 41.1665 70.8709 41.1665C72.1335 41.1876 72.9752 40.3037 73.3961 39.1253C73.5434 38.7044 73.6276 38.2415 73.6486 37.7785C73.6697 37.3155 73.6276 36.8315 73.5224 36.3896C73.2067 35.148 72.4071 34.1379 70.9761 34.0117C66.6832 33.6539 63.8213 33.4014 60.9804 33.1489C59.6486 33.0324 58.3201 32.9125 57.0417 32.7972L57.0376 32.7969L57.0368 32.7968L57.0366 32.7968L57.0361 32.7967C55.0847 32.6207 53.2505 32.4553 51.7001 32.3282C46.1867 20.3544 45.0083 17.5976 45.9973 3.43528C46.1025 1.96223 45.2397 0.910044 44.0402 0.383953C43.5773 0.173516 43.0722 0.0472546 42.5461 0.00516733C42.0201 -0.0158763 41.494 0.026211 40.9889 0.152473ZM54.7077 38.6924C57.9006 38.7099 60.8527 38.691 63.8633 38.6623C66.4728 38.6413 69.1032 38.6202 70.8498 38.6202H70.8709C70.8709 38.6202 70.934 38.4729 71.0182 38.2625C71.0813 38.0731 71.1234 37.8416 71.1444 37.6101C71.1655 37.3787 71.1444 37.1472 71.0813 36.9367C71.0182 36.6632 70.913 36.4738 70.7446 36.4527C70.2021 36.4054 69.6163 36.3545 68.9963 36.3006L68.9954 36.3005C66.5853 36.0911 63.6566 35.8367 60.7278 35.5689L60.7265 35.5688C57.886 35.3163 55.0454 35.0638 50.7321 34.7061L50.0166 34.643L49.722 33.9906L49.6378 33.8223C43.7035 20.9646 42.4409 18.2079 43.4931 3.24589C43.5142 2.97232 43.3037 2.76188 43.0091 2.63562C42.8197 2.55145 42.5882 2.48832 42.3357 2.46727C42.0832 2.44623 41.8307 2.46727 41.5992 2.5304L41.6202 2.55145C41.1783 2.67771 40.7995 2.97232 40.7364 3.45632C40.0216 19.7078 40.7561 21.3194 45.0802 30.8073L45.0924 30.8341C45.9973 32.7911 47.0495 35.0849 48.2911 37.9679C48.3963 38.2415 48.5015 38.4098 48.5857 38.4519C48.7961 38.5781 49.217 38.6202 50.0377 38.6413C51.5277 38.6658 52.948 38.6814 54.322 38.6901C54.4521 38.67 54.5821 38.6715 54.7077 38.6924Z"></path></svg>',
};

export class JetsContentPreparer {
  _dataHelper = null;
  _deckTitleHeight = 0;

  constructor() {
    this._dataHelper = new JetsDataHelper();
  }

  prepareData = (apiData, config) => {
    if (!apiData) return [];

    const { seatDetails } = apiData;

    const decks = seatDetails?.decks;

    const isDeckExist = decks && decks.length;
    this._deckTitleHeight = decks && decks.length > 1 ? DEFAULT_DECK_TITLE_HEIGHT : 0;

    const preparedBulks = isDeckExist ? this._prepareBulks(decks) : [];
    const preparedExits = isDeckExist ? this._prepareExits(decks) : [];

    const preparedDecks = isDeckExist
      ? decks.map((deck, index) => {
          const bulks = preparedBulks[index];
          const exits = preparedExits[index];

          return { ...this._prepareDeck(deck, bulks, exits, apiData, config), number: index + 1 };
        })
      : [];

    const isWingsExist = Math.max(...preparedDecks.map(deck => deck.wingsInfo.length)) > 0;

    const finalDecks = preparedDecks.map(deck => this._updateDeckWithWings(deck, isWingsExist, config));

    const params = this._dataHelper.getSeatMapParams(finalDecks, config);

    return {
      content: finalDecks,
      params,
      exits: preparedExits,
      bulks: preparedBulks,
    };
  };

  _mergeCabinFeatures(cabin, entertainment, power, wifi) {
    const merged = { ...cabin };

    if (entertainment?.exists && entertainment?.summary) {
      merged['audioVideo'] = entertainment.summary;
    }

    if (power?.exists && power?.summary) {
      merged['power'] = power.summary;
    }

    if (wifi?.exists && wifi?.summary) {
      merged['wifi'] = wifi.summary;
    }

    return merged;
  }

  _prepareExits(decks) {
    return this._updateAllDeckItemsTopOffset(decks, 'exits');
  }

  _prepareBulks(decks) {
    return this._updateAllDeckItemsTopOffset(decks, 'bulks');
  }

  _getFirstElementDeckOffset(deck) {
    const bulksMinOffset = deck.bulks.reduce((minimum, item) => {
      return item.topOffset < minimum ? item.topOffset : minimum;
    }, 0);
    const exitsMinOffset = deck.exits.reduce((minimum, item) => {
      return item.topOffset < minimum ? item.topOffset : minimum;
    }, 0);

    const firstRow = deck.rows
      .sort((a, b) => {
        a.topOffset - b.topOffset;
      })
      .at(0);

    const seatsMinOffset = firstRow.seats.reduce((minimum, item) => {
      return item.topOffset < minimum ? item.topOffset : minimum;
    }, 0);

    const firstElementOffset = Math.min(bulksMinOffset, exitsMinOffset, seatsMinOffset);
    const offset = firstElementOffset < 0 ? -firstElementOffset : firstElementOffset;
    return offset + this._deckTitleHeight + DEFAULT_INDEX_ROW_HEIGHT;
  }

  _updateAllDeckItemsTopOffset(decks, itemsName) {
    return decks.map(deck => {
      const firstElementOffset = this._getFirstElementDeckOffset(deck);
      return this._updateDeckItemsTopOffset(deck, itemsName, firstElementOffset);
    });
  }

  _updateDeckItemsTopOffset(deck, itemsName, offset = 0) {
    return deck[itemsName].map(deckItem => {
      const updatedItem = { ...deckItem, uniqId: Utils.generateId() };
      const updatedTopOffset = updatedItem.topOffset + offset;

      updatedItem.topOffset = updatedTopOffset;

      return updatedItem;
    });
  }

  _prepareDeck(deck, preparedBulks, preparedExits, apiData, config) {
    const rowGroups = this._groupRowsByCabinClass(deck.rows);

    const cabinClassWidths = [];
    for (const rowGroup of rowGroups) {
      const biggestDeckRow = this._dataHelper.findBiggestDeckRow(rowGroup.rows);
      const preparedBiggestDeckRow = this._prepareRow(biggestDeckRow, {}, config.lang);
      cabinClassWidths.push(preparedBiggestDeckRow.width);
      // rowGroup.width = preparedBiggestDeckRow.width;
    }

    // console.log('cabinClassWidths', cabinClassWidths);
    const sum = cabinClassWidths.reduce((acc, d) => acc + d, 0);
    const targetDeckWidth = sum / cabinClassWidths.length; // Math.avg(...cabinClassWidths);
    const firstElementOffset = this._getFirstElementDeckOffset(deck);

    for (const rowGroup of rowGroups) {
      const { cabin, entertainment, power, wifi } = apiData[rowGroup.classCode] || {};
      const cabinFeatures = this._mergeCabinFeatures(cabin, entertainment, power, wifi);

      const rows = this._prepareRows(rowGroup.rows, cabinFeatures, config.lang, firstElementOffset, targetDeckWidth);

      const firstCabinRow = rows.at(0);
      const lastCabinRow = rows.at(-1);
      firstCabinRow['isFirstInCabin'] = true;
      firstCabinRow['cabinHeight'] =
        rows.length === 1
          ? firstCabinRow.height
          : lastCabinRow.topOffset - firstCabinRow.topOffset + lastCabinRow.height / 2;

      rowGroup.rows = rows;
    }

    const rows = rowGroups.flatMap(g => g.rows);

    const innerDeckWidth = this._dataHelper.getDeckInnerWidth(targetDeckWidth, config);
    const deckHeight = this._dataHelper.calculateDeckHeight(rows, preparedBulks, preparedExits);

    const preparedWingsInfo = this._prepareWingsForDeck(deck.wingsInfo, rows[0].topOffset, deckHeight);

    return {
      uniqId: Utils.generateId(),
      width: innerDeckWidth,
      height: deckHeight,
      level: deck.level,
      rows,
      wingsInfo: preparedWingsInfo,
    };
  }

  _groupRowsByCabinClass(rows) {
    const groups = [];
    let currentClassCode = null;
    let currentGroup = null;

    for (const row of rows) {
      if (row.classCode !== currentClassCode) {
        currentClassCode = row.classCode;
        currentGroup = { rows: [], topOffset: row.topOffset, classCode: currentClassCode, width: 0 };
        groups.push(currentGroup);
      }
      currentGroup.rows.push(row);
    }

    return groups;
  }

  _updateDeckWithWings(deck, isWingsExist, config) {
    return {
      ...deck,
      width: this._dataHelper.getDeckInnerWidthWithWings(deck, isWingsExist, config),
    };
  }

  _prepareWingsForDeck(wingsInfo, offset, deckHeight) {
    let intersection = {
      start: 0,
      finish: 0,
      length: 0,
    };

    if (!wingsInfo) {
      return intersection;
    }

    const deckOffset = offset;

    const { topOffset, height } = wingsInfo;

    const wingA = deckOffset + topOffset;
    const wingB = wingA + height;

    const deckA = 0;
    const deckB = deckHeight;

    // const min1 = Math.min(wingA, wingB);
    // const max1 = Math.max(wingA, wingB);
    // const min2 = Math.min(deckA, deckB);
    // const max2 = Math.min(deckA, deckB);

    intersection.start = Math.max(deckA, wingA);
    intersection.finish = Math.min(deckB, wingB);
    intersection.length = Math.max(intersection.finish - intersection.start, 0);

    return intersection;
  }

  _prepareRows = (rows, cabinFeatures, lang, offset, maxRowWidth = 0) => {
    if (!rows?.length) return [];
    const prepared = rows.map(row => this._prepareRow(row, cabinFeatures, lang, offset, maxRowWidth));

    return prepared;
  };

  _prepareRow = (row, cabinFeatures, lang, offset, maxRowWidth = 0) => {
    const { number, topOffset, seatScheme, classCode, seatType } = row;
    const _topOffset = topOffset + offset;
    const preparedSeats = this._prepareSeats(row, cabinFeatures, lang, maxRowWidth);
    const rowWidth = preparedSeats.map(seat => seat.size.width).reduce((a, b) => a + b, 0);

    return {
      seats: preparedSeats,
      uniqId: Utils.generateId(),
      number,
      topOffset: _topOffset,
      width: rowWidth,
      height: preparedSeats.at(0).size.height, // TODO: improve this
      seatScheme,
      classCode,
      seatType,
    };
  };

  _prepareSeats = (row, cabinFeatures, lang, maxRowWidth = 0) => {
    const { seatScheme, seats, seatType } = row;

    if (!seats?.length) return [];

    let seatsCounter = 0;
    const rowElements = seatScheme.split('');

    let aisleWidth = 0;

    // resize aisles if maxRowWidth is set
    if (maxRowWidth) {
      const [width] = SEAT_SIZE_BY_TYPE[seatType];
      const seatsCount = seatScheme.match(/S|E/g).length;
      const aislesCount = seatScheme.match(/-/g).length;
      const seatsWidth = seatsCount * width;
      const widthDiff = maxRowWidth - seatsWidth;
      const targetAisleWidth = widthDiff / aislesCount;

      aisleWidth = targetAisleWidth > 0 ? Math.min(targetAisleWidth, width) : 1;
    }

    const result = rowElements.reduce((acc, item) => {
      let element = {};

      if (item === ENTITY_SCHEME_MAP.aisle) {
        element = this._prepareAisle(row, aisleWidth);
      } else if (item === ENTITY_SCHEME_MAP.empty) {
        element = this._prepareEmpty(row);
      } else if (item === ENTITY_SCHEME_MAP.seat) {
        element = this._prepareSeat(seats[seatsCounter], row, cabinFeatures, lang);
        seatsCounter++;
      }

      acc.push(element);

      return acc;
    }, []);

    return result;
  };

  _prepareIndexRow = row => {
    const seats = row.seats.map(element => {
      element.letter = element.type === ENTITY_TYPE_MAP.aisle ? '' : element.letter;
      element.type = element.type === ENTITY_TYPE_MAP.aisle ? ENTITY_TYPE_MAP.empty : ENTITY_TYPE_MAP.index;
      element.status = ENTITY_STATUS_MAP.disabled;
      element.topOffset = element.topOffset - element.size.height / 2;
      element.number = '';
      element.size = {
        width: element.size.width,
        height: DEFAULT_INDEX_ROW_SEAT_HEIGHT,
      };
      element.seatScheme = row.seatScheme;

      element.rotation = ''; // resetting rotation for the case when biggest row has rotated seats

      return element;
    });

    return { ...row, number: '', seats, topOffset: row.topOffset };
  };

  _prepareSeat = (seat, row, cabinFeatures, lang) => {
    const { number, classCode, name: rowName, seatType: _rowSeatType } = row;
    const prepared = this._prepareSeatFeatures(seat, cabinFeatures, lang);
    const features = prepared.features;
    const measurements = prepared.measurements;
    const classType = CLASS_CODE_MAP[classCode.toLowerCase()] || '';
    const seatNumber = number + seat?.letter || '';
    const type = ENTITY_TYPE_MAP.seat;
    const status = ENTITY_STATUS_MAP.available;
    const seatType = seat.seatType || _rowSeatType;
    const seatClassAndType = `${classCode}-${seatType}`;

    const [seatWidthByRow, seatHeightByRow] = SEAT_SIZE_BY_TYPE[_rowSeatType];
    const [seatWidth, seatHeight] = SEAT_SIZE_BY_TYPE[seatType];

    return {
      uniqId: Utils.generateId(),
      ...seat,
      features,
      measurements,
      status,
      type,
      number: seatNumber,
      classType,
      classCode,
      rowName,
      seatType: seatClassAndType,
      seatIconType: seatType,
      size: { width: Math.max(seatWidthByRow, seatWidth), height: seatHeight },
    };
  };

  _prepareAisle = (row, maxWidth = 0) => {
    const { number: rowNumber, seatType } = row;
    const [width, height] = SEAT_SIZE_BY_TYPE[seatType];
    const size = { width: maxWidth || width, height };
    const type = ENTITY_TYPE_MAP.aisle;
    const status = ENTITY_STATUS_MAP.disabled;

    return { uniqId: Utils.generateId(), letter: rowNumber, type, status, size };
  };

  _prepareEmpty = row => {
    const [width, height] = SEAT_SIZE_BY_TYPE[row.seatType];
    const size = { width, height };
    const type = ENTITY_TYPE_MAP.empty;
    const status = ENTITY_STATUS_MAP.disabled;

    return { uniqId: Utils.generateId(), letter: '', status, type, size };
  };

  _prepareSeatFeatures = (seat, cabin, lang) => {
    const { pitch: cabinSeatPitch, width: cabinSeatWidth, recline: cabinSeatRecline, audioVideo, power, wifi } = cabin;
    const { pitch: seatPitch, width: seatWidth, recline: seatRecline } = seat || {};
    const features = { audioVideo, power, wifi, ...seat.features };
    const measurements = {
      pitch: seatPitch || cabinSeatPitch,
      width: seatWidth || cabinSeatWidth,
      recline: seatRecline || cabinSeatRecline,
    };

    const prosOrCons = ['+', '-'];

    const preparedFeatures = Object.entries(features)
      .filter(([key, value]) => !!value && !measurements[key])
      .map(([key, value]) => {
        const uniqId = Utils.generateId();
        const localized = LOCALES_MAP[lang][key] || key;
        if (prosOrCons.includes(value)) {
          // swap key-value for pros-cons features
          const icon = SEAT_FEATURES_ICONS[value] || '';

          return { uniqId, title: null, icon, value: localized, key };
        } else {
          const icon = SEAT_FEATURES_ICONS[key] || '';

          return { uniqId, title: localized, icon, value, key };
        }
      });

    const preparedMeasurements = Object.entries(measurements).map(([key, value]) => {
      const localized = LOCALES_MAP[lang][key] || key;
      const icon = SEAT_MEASUREMENTS_ICONS[key] || '';

      return { uniqId: Utils.generateId(), title: localized, icon, value, key };
    });

    return { features: preparedFeatures, measurements: preparedMeasurements };
  };

  _prepareSeatAdditionalProps = seat => {
    const { additionalProps } = seat || {};

    const preparedAdditionalProps = additionalProps?.map(item => {
      return {
        icon: SEAT_FEATURES_ICONS[item?.icon || 'dot'] || '',
        title: null,
        uniqId: Utils.generateId(),
        value: item?.label,
        cssClass: item?.cssClass,
      };
    });

    return preparedAdditionalProps;
  };
}
