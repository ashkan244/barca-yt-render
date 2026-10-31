// Source-led Barça Radar episodes. Add a new recording by adding <id>.spec.json + <id>.words.json here.
import {validateArchive} from '../production/source/ArchiveShort';
import {validateSourceEpisode, type SourceEpisodeProps, type SourceSpec} from '../production/source/SourceEpisode';
import clasicoSpec from './clasico-source.spec.json';
import clasicoWords from './clasico-source.words.json';
import clasicoPages from './clasico-source.pages.json';
import dream88Spec from './dream88-source.spec.json';
import dream88Words from './dream88-source.words.json';
import dream88Pages from './dream88-source.pages.json';

export const SOURCE_EPISODES: SourceEpisodeProps[] = [
  {spec: clasicoSpec as unknown as SourceSpec, words: clasicoWords.words, pages: clasicoPages.pages},
  {spec: dream88Spec as unknown as SourceSpec, words: dream88Words.words, pages: dream88Pages.pages},
].map(validateSourceEpisode).map((d) => { validateArchive(d.spec); return d; });
