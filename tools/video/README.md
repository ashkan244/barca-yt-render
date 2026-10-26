# Video production tools

Python 3.11+, `ffmpeg` and `ffprobe` are required. No secret, raw footage or model belongs in Git. These tools never publish to YouTube. Paths below are examples; substitute an actual file, and use a directory outside tracked source for reports.

```sh
python tools/video/media.py inspect /path/input.mp4 --role short --output /tmp/intake.json
python tools/video/media.py contact-sheet /path/input.mp4 --output /tmp/contact.jpg
python tools/video/media.py cuts /path/input.mp4 --output /tmp/cuts.json
python tools/video/media.py qc /path/final.mp4 --profile vertical --decode --loudness --output /tmp/qc.json
```

`inspect` records a SHA-256 and an explicit role, not a guessed topic. A 175s recording is not automatically an incomplete long-form video. Inspect the actual speech. Contact sheets sample the full duration (up to 64 cells); they do not replace transition or audio review. Scene detection can mistake flashes for cuts. QC returns nonzero for structural/decode failures; `input_*` loudness fields measure the file, not a hypothetical normalized result. It does not certify subjective quality or detect every lip-sync/caption issue.

## Optional local transcription

Install in an isolated environment; do not replace the system Python:

```sh
python -m venv /workspace/.venvs/video-asr
/workspace/.venvs/video-asr/bin/pip install -r tools/video/requirements.txt
/workspace/.venvs/video-asr/bin/python tools/video/media.py transcribe /path/input.mp4 --language en --model small.en --output /tmp/transcript.json
python tools/video/media.py check-script /path/spoken-script.txt /tmp/transcript.json --output /tmp/alignment.json
```

Whisper downloads model files on first use. Specify language and keep model caches outside Git. Base-model Persian transcription performed poorly on the supplied reference; it is not a reviewed transcript. English base/small/medium also disagreed on names. Use source words, compare models only as aids, and document uncertainty. Never replace a spoken player with a currently plausible squad member based on outside assumptions. `check-script` is a token-order screening tool with both script and heard coverage; it is not semantic/factual certification. Exit 2 means the threshold was not met, not that the ASR must be correct. Feed spoken text without headings or stage directions.

## Reproducible media preparation

`prepare_source.py` preserves the source timeline, converts video to compatible H.264 and runs two-pass voice normalization. It writes new files, never edits the input. The chosen target is a production default, not a YouTube requirement. Do not normalize already processed audio repeatedly.

`make_score.py` produces an original tonal underscore without external samples. It is intentionally quiet and optional. Do not describe it as a licensed commercial track. Generated WAVs belong in ignored runtime paths. The episode composition mixes it below the voice; final output must be measured again.

`download_drive.py` follows the shared-file download form and requires an expected SHA-256. It uses ordinary verified HTTPS, does not extract authentication, and does not bypass private-file access. A changed source requires reviewed new metadata, timing and checksum, not blindly updating the hash.

## Validation

```sh
python -m unittest discover -s tools/video/tests -v
```

Actual-source integration checks are recorded per episode. Unit checks do not establish that a full render happened.
