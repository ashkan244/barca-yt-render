import {Config} from '@remotion/cli/config';

// Locally (Windows, slow connection) reuse the installed Chrome instead of downloading
// Chrome Headless Shell. In the cloud (GitHub Actions / Colab, Linux) Remotion downloads its own.
if (process.platform === 'win32') {
  Config.setBrowserExecutable('C:/Program Files/Google/Chrome/Application/chrome.exe');
  Config.setChromeMode('chrome-for-testing');
  Config.setConcurrency(2);
}
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
