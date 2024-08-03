import bash from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import markdown from 'highlight.js/lib/languages/markdown';
import plaintext from 'highlight.js/lib/languages/plaintext';
import shell from 'highlight.js/lib/languages/shell';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import { createLowlight } from 'lowlight';

const lowlight = createLowlight();
lowlight.register({ plaintext });
lowlight.register({ bash });
lowlight.register({ shell });
lowlight.register({ xml });
lowlight.register({ css });
lowlight.register({ javascript });
lowlight.register({ typescript });
lowlight.register({ json });
lowlight.register({ markdown });

export default lowlight;
