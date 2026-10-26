import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';
export const LOCAL_FONTS = {display: 'RadarAnton', body: 'RadarInter', marker: 'RadarMarker', sans: 'RadarMontserrat', serif: 'RadarPlayfair'};
// loadFont blocks rendering until local font loading succeeds; retain upstream licenses.
export const fontsReady = Promise.all([
loadFont({family: LOCAL_FONTS.display, url: staticFile('fonts/anton/Anton-Regular.ttf'), weight: '400'}),
loadFont({family: LOCAL_FONTS.body, url: staticFile('fonts/inter/Inter[opsz,wght].ttf'), weight: '100 900'}),
loadFont({family: LOCAL_FONTS.marker, url: staticFile('fonts/permanentmarker/PermanentMarker-Regular.ttf'), weight: '400'}),
loadFont({family: LOCAL_FONTS.sans, url: staticFile('fonts/montserrat/Montserrat[wght].ttf'), weight: '100 900'}),
loadFont({family: LOCAL_FONTS.serif, url: staticFile('fonts/playfairdisplay/PlayfairDisplay[wght].ttf'), weight: '400 900'})
]);
