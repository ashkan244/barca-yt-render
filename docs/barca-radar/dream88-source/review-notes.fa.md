# یادداشت بازبینی — DREAM88-SOURCE (۱۹۸۸، سالی که دریم‌تیم ساخته شد)

تاریخ: ۱ نوامبر ۲۰۲۶. وضعیت: **review candidate** (preview). انتشار release پس از تأیید گوش مجری.

## ورودی‌ها و نقش‌ها

- `Clip 4.mp4`: اجرای مجری (مرتی)، 720×720 HEVC، 155.92 ثانیه. گفتار تقریباً کلمه‌به‌کلمه همان `Scenario 4.docx` است.
- `Clip for 2_06_.mp4`: فوتیج آرشیوی ۳.۱۶ ثانیه‌ای از والی ون‌باستن در فینال یورو ۸۸؛ اصلاحیه/درج تصویری در 2:06، **نه** برداشت دوبارهٔ مجری.
- فایل رندر: `DREAM88-source.mp4` = ویدیو و صدای مجری با stream copy (MD5 رمزگشایی‌شدهٔ صدا و تصویر با فایل اصلی یکسان) + درج به‌عنوان track دوم. SHA-256 در spec و manifest.
- ظرف MKV رد شد: edit list صدای AAC را حذف می‌کرد (MD5 صدا فرق داشت → خطر ~۲۳ms جابه‌جایی لب). MP4 همان شروع صفر و تعداد فریم صدا را نگه داشت.

## آنچه واقعاً بررسی شد

- ASR: faster-whisper 1.2.1، small.en، word timestamps، VAD. ۱۱ اصلاح فقط جایی که کلمهٔ شنیده‌شده هم‌آوای کلمهٔ سناریو است (`caption-corrections.json`). «Marco van» از روی شروع انرژی صوت (112.00s) زمان‌بندی شد چون ASR طول صفر داده بود.
- `episode.py --mode preview --check-media --source` روی فایل واقعی پاس شد: hash، مدت presenter/voice/score، ۱۰۰ صفحهٔ کپشن مشترک با SRT.
- `prepare_source.py` تغییریافته روی منبع اجرا شد: presenter.mp4 (155.9s، 720²، 30fps)، insert-1.mp4 (3.2s، 1920×1080، 30fps)، voice.wav دو مرحله‌ای، cover از track مجری.
- آرشیو: ۲۰ عکس Commons، همه با تاریخ ۱۹۸۸ در metadata/توضیح Nationaal Archief؛ ۱۹ CC0 و یک CC BY-SA 3.0 (نیمه‌نهایی PSV در برنابئو → CREDITS.md). دانلود محلی با `commons.py fetch --strict` موفق.
- `tsc --noEmit` و اعتبارسنج‌های spec/archive پاس. Still محلی از LONG (۱۶ فریم)، ARCHIVE (۱۷ فریم)، THUMB و COVER دیده شد.
- اشکال‌هایی که در stillها پیدا و رفع شدند: «1,992» در کارت شمارنده (سال نباید count باشد)، کارت typewriter کوچک برای موبایل، بریده‌شدن عنوان thumbnail (اصلاح موتور: fitText برای خطوط کاور/تامبنیل).

## موارد باز

1. **گوش مجری** برای ۱۱ اصلاح (Benfica، Feyenoord، Rinus Michels، «has no team»، «In defence»، «desperate»، «would score» …). تا آن زمان `review.transcript = pending` و رندر preview است.
2. فوتیج والی: حق پخش تلویزیونی؛ بی‌صدا و کوتاه استفاده شده ولی Content ID ممکن است claim کند (راه جایگزین در posting-long).
3. رندر GitHub و QC فایل خروجی هنوز انجام نشده؛ این یادداشت پس از run به‌روز می‌شود.
4. خروجی‌های SHORT و CLIP برای این قسمت درخواست نشده‌اند؛ spec بدون clips است.
