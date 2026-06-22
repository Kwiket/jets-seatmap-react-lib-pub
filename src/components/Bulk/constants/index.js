import BULK_TEMPLATE_MAP from './bulk-template-map';
import STICKER_TEMPLATE_MAP from './sticker-template-map';

// Number of bulk icons this client can render; advertised to the API so newer bulk ids are recoded to a fallback.
export const SUPPORTED_BULKS_COUNT = BULK_TEMPLATE_MAP.size - 1; // Exclude `zero` - the fallback bulk template.

export { BULK_TEMPLATE_MAP, STICKER_TEMPLATE_MAP };
