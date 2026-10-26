// Source-led Barça Radar episodes. Add a new recording by adding <id>.spec.json + <id>.words.json here.
import {validateArchive} from '../production/source/ArchiveShort';
import {validateSourceEpisode, type SourceEpisodeProps, type SourceSpec} from '../production/source/SourceEpisode';
import clasicoSpec from './clasico-source.spec.json';
import clasicoWords from './clasico-source.words.json';

export const SOURCE_EPISODES: SourceEpisodeProps[] = [
  {spec: clasicoSpec as unknown as SourceSpec, words: clasicoWords.words},
].map(validateSourceEpisode).map((d) => { validateArchive(d.spec); return d; });
