"""Presenter matte with Robust Video Matting (MobileNetV3, ONNX, CPU).

Usage: python tools/host/matte.py <in.mp4> <out.webm> [start_s] [dur_s]
Writes a VP9 WebM with alpha (yuva420p): the presenter cut out, background transparent.
Model: https://github.com/PeterL1n/RobustVideoMatting (GPL-3.0 code; weights from the v1.0.0 release).
"""
import os, subprocess, sys, urllib.request
import numpy as np
import onnxruntime as ort

src, out = sys.argv[1], sys.argv[2]
ss = sys.argv[3] if len(sys.argv) > 3 else None
dur = sys.argv[4] if len(sys.argv) > 4 else None
model = os.path.join(os.path.dirname(__file__), 'rvm_mobilenetv3_fp32.onnx')
if not os.path.exists(model):
    urllib.request.urlretrieve('https://github.com/PeterL1n/RobustVideoMatting/releases/download/v1.0.0/rvm_mobilenetv3_fp32.onnx', model)

probe = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', src], capture_output=True, text=True).stdout.strip().split(',')
W, H = int(probe[0]), int(probe[1])
cut = (['-ss', ss] if ss else []) + (['-t', dur] if dur else [])
dec = subprocess.Popen(['ffmpeg', '-v', 'error', *cut, '-i', src, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', f'{W}x{H}', '-r', '30', '-i', '-',
                        '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p', '-b:v', '0', '-crf', '30', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '4', out], stdin=subprocess.PIPE)

so = ort.SessionOptions(); so.intra_op_num_threads = os.cpu_count() or 4
sess = ort.InferenceSession(model, so, providers=['CPUExecutionProvider'])
rec = [np.zeros([1, 1, 1, 1], dtype=np.float32)] * 4
ratio = np.array([0.4], dtype=np.float32)
n = 0
while True:
    buf = dec.stdout.read(W * H * 3)
    if len(buf) < W * H * 3:
        break
    rgb = np.frombuffer(buf, np.uint8).reshape(H, W, 3)
    x = (rgb.astype(np.float32) / 255.0).transpose(2, 0, 1)[None]
    fgr, pha, *rec = sess.run(None, {'src': x, 'r1i': rec[0], 'r2i': rec[1], 'r3i': rec[2], 'r4i': rec[3], 'downsample_ratio': ratio})
    a = np.clip(pha[0, 0], 0, 1)
    a = np.where(a < 0.04, 0, a)  # clean speckles in the background
    rgba = np.dstack([rgb, (a * 255).astype(np.uint8)])
    enc.stdin.write(rgba.tobytes())
    n += 1
    if n % 300 == 0:
        print(f'{n} frames', flush=True)
enc.stdin.close(); enc.wait(); dec.wait()
print(f'matte: {n} frames -> {out}')
