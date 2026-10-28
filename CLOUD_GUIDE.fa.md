# راهنمای اصلی ادامهٔ Barça Radar در Claude، Codex و Cloud

آخرین جمع‌بندی: **۲۸ اکتبر ۲۰۲۶**. این فایل نقطهٔ شروع جلسهٔ بعدی است: مسیر تحقیق، انتخاب قالب، توسعه، آزمایش و تحویل را به شواهد موجود وصل می‌کند. وضعیت ماشینی و کارهای بعدی در [continuation-state.json](docs/video-production/continuation-state.json) قرار دارد. هیچ سند پژوهشی، به‌خودی‌خود اتصال MCP یا تأیید خروجی انتشار نیست.

## ۱. تصمیم‌های کاربر که باید حفظ شوند

- معیار اصلی **کیفیت بصری و تنوع محتوای واقعی** است؛ آسان‌تر یا سریع‌ترشدن تولید معیار دوم است.
- در تدوین قسمت موجود، **گفتار ویدیوی واقعی** مبناست. سناریوی تاریخی و PSG که قبلاً در گفتگو آمده‌اند نباید در اجرای دیگری قرار بگیرند.
- اجرای بررسی‌شدهٔ فعلی، شورت۱۷۵ثانیه‌ایِ تحلیل تاکتیکی ال‌کلاسیکو با مجری است؛ فایل بلند جداگانه خواهد رسید. فایل مربع720×720 به‌خاطر نسبت تصویر یا مدت، «بخشی از ویدیوی بلند» فرض نشود.
- ویدیوی تاریخی فارسیِ96.731ثانیه‌ای مرجع سبک است؛ فوتیج و موسیقی آن برای کپی در خروجی مجاز فرض نشده‌اند.
- تحقیق، تصمیم، کد و شواهد قابل بازبینی روی همین GitHub نگهداری شوند. آماده‌سازی و رندر GitHub با انتشار در شبکهٔ اجتماعی فرق دارد.
- سؤال بی‌پاسخ، تأیید نیست. نام‌های Bernardo، Diomande، Espart و Gordon در **۲۶ اکتبر توسط خود مجری تأیید شدند** و انتشار Public مجاز شد؛ review در manifest اکنون approved است و release gate پاس می‌شود.
- **یک شاخهٔ مرجع:** همهٔ عامل‌ها (Claude، GPT/Codex) از آخرین `main` شروع می‌کنند، روی شاخهٔ کوتاه کار و به `main` برمی‌گردانند. تصمیم‌های کاربر در همین فایل و continuation-state ثبت شوند تا دو خط موازی دوباره ساخته نشود.

## ۲. مخزن و مرجع کد

| مخزن | نقش |
|---|---|
| `ashkan244/barca-yt-render` | مرجع کد تولید، assets مجاز، ابزارها، workflowها، راهنما و شواهد تحویل |
| `ashkan244/barca-yt` | تحقیق و طرح‌های اولیه؛ شامل کد قدیمی که نباید روی مخزن تولید mirror شود |

از checkout موجود استفاده کن. ابتدا `git status` و دستورهای محلی را بخوان؛ تغییرات کاربر را حفظ کن. ابزار sync مخزن قدیمی اکنون انتقال **انتخابی و افزایشی** دارد، پیش‌فرض dry-run است و فایل موجود را بازنویسی نمی‌کند. تعارض با merge عمدی حل می‌شود. از نسخهٔ تاریخیِ دستور حذف/copy کل پوشه استفاده نشود.

## ۳. نقشهٔ مطالعه؛ لازم نیست همهٔ اسناد هر بار دوباره خوانده شوند

| نیاز جلسه | سند شروع |
|---|---|
| تولید و کنترل کیفیت عمومی | [راهنمای تولید](docs/video-production/README.fa.md) و [Skill تولید](.agents/skills/video-production/SKILL.md) |
| فهم وضعیت واقعی اجرای مجری | [بستهٔ قسمت CLASICO](docs/barca-radar/clasico-source/README.md)، manifest و review-notes همان پوشه |
| انتخاب مدل محتوایی و نقد قالب‌ها | [بازبینی مدل‌ها](docs/video-production/review-2026-10-28.fa.md) و [format playbook](docs/video-production/format-playbook.fa.md) |
| تغییرات واقعاً پیاده‌شده | [implementation](docs/video-production/implementation-2026-10-28.fa.md) |
| کارگردانی بصری و ابزار مناسب | [Skill طراحی بصری](.agents/skills/barca-visual-direction/SKILL.md) و [بررسی Skill/MCP](docs/video-production/creative-integrations-2026-10-28.fa.md) |
| عکس تازه/چهره/آرشیو | [راهنمای عکس](docs/video-production/photographic-production.fa.md)، catalog و credits |
| Canva و Higgsfield | [ارزیابی اختصاصی](docs/video-production/canva-higgsfield-evaluation.fa.md) |
| ادیتورهای متن‌باز شبیه Adobe | [تحقیق OpenReel/Motionity/WeftCut/Natron/Friction و بقیه](docs/video-production/open-source-editors-2026-10-28.fa.md) |
| پروندهٔ آماری/بازیکن | [Skill روایت داده](.agents/skills/football-data-story/SKILL.md) و بخش دادهٔ تحقیق ابزارها |
| اجرای ابزارهای intake/captions/photos/QC | [tools/video](tools/video/README.md) |
| سابقهٔ شواهد و منابع اولیه | [تحقیق پایه](docs/video-production/research.fa.md)، فایل‌های `*-sources.json` و گزارش‌های تحویل |

[بستهٔ PSG](docs/barca-radar/psg-4-2/README.md) یک بستهٔ برنامه‌ریزی جداست؛ وجود آن نشانهٔ موضوع اجرای فعلی نیست. گزارش‌های قدیمی را به‌عنوان snapshot زمان خودشان بخوان و وضعیت جاری را از implementation/state و شواهد جدید بگیر.

## ۴. چه چیزی واقعاً داریم؟

| قابلیت | وضعیت ثبت‌شده | نتیجه‌ای که نباید از آن گرفت |
|---|---|---|
| intake، checksum، contact sheet، ASR اختیاری، آماده‌سازی صدا/ویدیو و QC | ابزار و آزمون موجود | ASR یا ffprobe صحت همهٔ کلمات/محتوا را تأیید نمی‌کند |
| شورت اصلیِ مجری | مستر۱۷۵ثانیه‌ای نسخهٔ قبلی روی GitHub رندر و دانلود/QC شده؛ review candidate | تأیید نام مبهم یا رندر قالب تطبیقی جدید نیست |
| manifest و کپشن مشترک | ۱۰۸ صفحهٔ کپشن برای burned-in و SRT؛ preflight preview/release | متنِ pending خودکار approved نمی‌شود |
| قالب تطبیقی مجری/برد/عکس | کد، فریم‌های منتخب و کلیپ گذار۶ثانیه‌ای بررسی شده | مستر کامل۱۷۵ثانیه‌ای همین قالب هنوز ثبت نشده |
| عکس | پنج دارایی بررسی‌شده با منبع/مجوز/hash؛ دو عکس۲۰۲۵ پدری/یامال و سه آرشیوی | عکس بازیکن از بازی دیگر شاهد ال‌کلاسیکو نیست؛ feed لحظه‌ای متصل نشده |
| دموهای عکس | دو نمونهٔ۲۷ثانیه‌ای افقی/عمودی با رندر GitHub و QC فایل دانلودشده | قسمت محتوایی آمادهٔ انتشار یا آزمون retention نیست |
| سه‌بعدی | یک قاب ثابتِ اصلی و شماتیک با Blender4.3.2،1280×720 رندر و بررسی شده | خط تولید انیمیشن سه‌بعدی یا Blender MCP فعال نیست |
| ادیتور متن‌باز | سورس/راهنمای چند پروژه بررسی؛ OpenReel تا ساخت پروژه و import در media pool؛ Motionity تا تولید PNG با اشکال کراپِ fixture؛ MLT تا کلیپ decodeشده آزموده شده‌اند | همهٔ برنامه‌ها، MCPها، import/export پروژه و رندرهای بلند تأیید نشده‌اند |
| Canva/Higgsfield/Figma/Runway/Exa/Tavily/ElevenLabs | مسیرهای رسمی/مستندات بررسی شده‌اند | در جلسهٔ بعد یا فعلی لزوماً tool فعال و account متصل ندارند |
| API دادهٔ فوتبال | گزینه‌ها و محدودیت‌های پوشش/مجوز بررسی شده‌اند | دادهٔ زندهٔ مورد نیاز قسمت یا مجوز تجاری آماده نیست |

## ۴-ب. موتور یکپارچهٔ قسمت‌های مجری‌محور (ادغام ۲۸ اکتبر)

دو خط کار (Claude روی شاخه و GPT روی main) در ۲۸ اکتبر ادغام شدند. ساختار فعلی:

| بخش | فایل | توضیح |
|---|---|---|
| تعریف قسمت (طراحی) | `studio/src/episodes-source/<id>.spec.json` | صحنه‌ها، بردها، فصل‌ها، کلیپ‌ها، قالب آرشیوی (`archive.shots/cues`)، photo beats، عکس کارت‌ها |
| تعریف قسمت (منبع و بازبینی) | `<id>.manifest.json` + `tools/video/episode.py` | hash/مدت/رسانه، review gate، صفحه‌های کپشن مشترک با SRT |
| موتور | `studio/src/production/source/` | `SourceEpisode` (SHORT، LONG، CLIP، COVER، THUMB)، `ArchiveShort` (ARCHIVE)، `Shot` (عکس/ویدیو/برد) |
| قالب تطبیقی GPT | `production/AdaptiveSource.tsx` | خروجی اضافه `adaptive` در workflow |
| کپشن | `production/Captions.tsx` | یک کامپوننت: صفحه‌های مشترک SRT + برجسته‌سازی نام‌ها |
| برد تاکتیکی | `production/TacticalPlate.tsx` | حالت readable، دوربین/zoom، حرکت مرحله‌ای (مهره/فلش/ناحیه) |
| آرشیو | `tools/archive/commons.py`، `archive-research.yml` | جست‌وجو و دریافت Commons با مجوز؛ `draft_cues.py` پیش‌نویس خودکار کات‌ها |
| رندر | `render-source-short.yml` | `outputs=short,long,clips,archive,adaptive`، `mode=preview|release`، رندر موازی، delivery.json برای هر خروجی |

ارتقاهای بعدی ترتیب‌دار در [visual-roadmap](docs/video-production/visual-roadmap.fa.md).

## ۵. تحویل‌های قابل پیگیری؛ commit و artifact را مخلوط نکن

- شورت قبلی: [run40317053776](https://github.com/ashkan244/barca-yt-render/actions/runs/40317053776)، render commit `d52a6d8af5319aed89aef03532f93020f7923e78`؛ [delivery.json](docs/barca-radar/clasico-source/delivery.json).1080×1920،30fps،175.019s؛ سطح اندازه‌گیری‌شده−16.02LUFS/−2.86dBTP. **انقضای ثبت‌شدهٔ artifact:۹نوامبر۲۰۲۶.**
- دموهای عکس: [run40611256947](https://github.com/ashkan244/barca-yt-render/actions/runs/40611256947)، render commit `e56b6a7fe1025a0a88ce1bede56ce5ab2db3cf3c`؛ [دانلودها و گزارش](docs/video-production/photo-demo-delivery.fa.md). دو نسبت Full HD،27.008s؛ موسیقی آرامِ بدون گفتار حدود−36.83LUFS. **انقضای ثبت‌شده:۲۷نوامبر۲۰۲۶.**
- قاب سه‌بعدی: [تصویر](docs/video-production/previews/tactical-lab-3d.png) و [proof](docs/video-production/tactical-lab-3d-proof.json). این تصویر مستقل از tracking مسابقه است.
- مطالعهٔ ادیتورها: [evidence](docs/video-production/open-editor-evidence.json) دامنهٔ واقعی هر آزمون و شکست‌های حل‌نشده را مشخص می‌کند.

Artifact آرشیو دائمی Git نیست. در جلسهٔ بعد وجود و تاریخ انقضا را بررسی کن؛ اگر از دسترس خارج شده، از کد/ورودی تأییدشده دوباره بساز. اندازه‌گیری نسخهٔ قدیمی را به کد، caption یا asset تازه نسبت نده. ثبت URL، dispatch یا PID به معنی پایان موفق رندر نیست.

## ۶. شروع فنی در محیط تازه

ابتدا مهارت/دستور محیط اجرا، `AGENTS.md` و فایل‌های مرتبط بالا را بخوان. در محیط مدیریت‌شده، policy شبکه و وضعیت credentialها را از ابزار همان محیط بررسی کن؛ مقدار secretها چاپ یا داخل Git ذخیره نشود. وجود فایل در `/workspace/.onboarding` یا process قبلی در یک جلسهٔ تازه تضمین نشده است.

نیاز پایه: Node سازگار با lockfile فعلی، Python3.11+، FFmpeg/ffprobe. GitHub قبلی Node22 داشت و محیط بررسی اخیر Node24؛ Remotion پروژه4.0.535 است. برای آزمایش یک ابزار، پکیج‌های Remotion را جداگانه و بدون بررسی ارتقا نده.

```sh
# در مسیر checkout تولید؛ در محیط دیگر مسیر را تطبیق بده
cd /workspace/barca-yt-render
git status --short
node --version
python3 --version
ffmpeg -version
cd studio
npm ci --no-audit --no-fund
npm run typecheck
npm run test:production
```

Blender، Kdenlive و melt در محیط بررسی اخیر حاضر بودند؛ در محیط بعدی حضورشان را با command/version بررسی کن. نصب برنامه با اجرای کامل و آماده‌بودن display، GPU، codec و renderer یکسان نیست. sudo در محیط اخیر موجود نبود و نصب apt سیستم به مجوز OS برخورد کرد؛ برای کار مستقلِ Remotion یا تحقیق لازم نیست به آن متوقف شوی. برای ابزار native، محیط مناسب یا dependencyهای همان مسیر را فراهم و نتیجه را ثبت کن.

ASR فقط در صورت نیاز در venv جدا نصب شود؛ دستور و requirements در tools/video است. مدل/venv/cache بیرون Git بمانند. منابع خام مجری و WAVهای تولیدشده عمداً ignored هستند؛ وجود source code به معنی حاضر بودن آن‌ها نیست.

## ۷. ادامهٔ قسمت فعلی بدون گم‌کردن منبع

مرجع اجرایی:

`studio/src/episodes-source/clasico-source.manifest.json`

شامل role، SHA-256، duration/fps، مسیر runtime media، word/page/SRT، صحنه و cue، عکس‌های مصرفی و وضعیت review است. source SHA ثبت‌شده:

`8b558736590ffa4297a2b2df4aa8d007042472738cb141085cb4b9eac03a29c1`

رسانهٔ اصلی را از ورودی مجاز runtime بازیابی و hash را بررسی کن؛ Drive ID/URL خصوصی در Git قرار نگیرد. برای فایل تازه، این hash را بی‌بررسی عوض نکن. اول نقش، مدت، گفتار، کیفیت و تفاوت فایل را ثبت کن و manifest/timing را متناسب به‌روزرسانی کن.

نمونهٔ دستورها، از ریشهٔ مخزن و با مقادیر واقعیِ runtime:

```sh
python tools/video/download_drive.py "$SOURCE_FILE_ID" /tmp/presenter-source.mov --sha256 "$EXPECTED_SOURCE_SHA256"
python tools/video/prepare_source.py /tmp/presenter-source.mov --output-dir studio/public/host/CLASICO
python tools/video/make_score.py studio/public/host/CLASICO/score.wav --duration 175
python tools/video/episode.py studio/src/episodes-source/clasico-source.manifest.json --mode preview --check-media --source /tmp/presenter-source.mov --build-captions
```

`SOURCE_FILE_ID` باید شناسهٔ فایل واقعیِ مجاز باشد، نه شناسهٔ پوشهٔ Drive. `EXPECTED_SOURCE_SHA256` از manifest بررسی‌شده تأمین شود؛ مقدار منبع فعلی در بالا آمده است. این راهنما credential یا شناسهٔ خصوصی را ذخیره یا تنظیم نمی‌کند. صدای آماده‌شده را چند بار normalize نکن. برای قسمت تازه مدت از فایل/manifest همان قسمت خوانده شود؛175 پیش‌فرض همهٔ ویدیوها نیست.

```sh
cd studio
npm run typecheck
npx remotion bundle src/index.ts --out-dir=build
npm run qc:frames -- CLASICO-SOURCE-ADAPTIVE 0,360,900,1600,2350,5249 /tmp/adaptive-frames
```

bundle از `studio/` ساخته شود تا public/fonts و دارایی‌های محلی درست وارد شوند. در محیط دارای Chromium، در صورت نیاز مسیر واقعی آن را با `BROWSER_EXECUTABLE` برای ابزار frame یا flag مربوطِ Remotion بده؛ راه‌حلِ خطای فونت خاموش‌کردن font/TLS check نیست.

پس از بازکردن فریم‌ها و یک کلیپ گذار، `npm run render:adaptive` خروجی محلی می‌سازد؛ بدون رسانهٔ runtime این دستور ورودی گمشده را ایجاد نمی‌کند. دستور `npm run episode:release` با نام unresolved فعلی باید خطا بدهد. تا رفع واقعی مسئله، برای بررسی از preview استفاده کن.

workflow `render-source-short.yml` ورودی runtime منبع و انتخاب `mode`/`composition` دارد؛ نام دقیق workflow و inputهای HEAD را پیش از dispatch بخوان. اعتبار عکس و delivery/QC از همان run باید کنار فایل باشد. برای بلند تازه اول intake/رونویسی/shot map مستقل ساخته شود؛ صرف جایگزینی MP4 در پوشهٔ CLASICO کافی نیست.

## ۸. انتخاب زبان تصویری بر اساس محتوای قسمت

| نیاز روایت | مسیر پیشنهادی | نمونهٔ قابل سنجش پیش از توسعهٔ کامل |
|---|---|---|
| توضیح علت شکست/پرس | مجری → برد غالب → مکث روی رابطه → نتیجه |۲۰تا۳۰ثانیه با cueهای هم‌راستای گفتار و نام‌های خوانا |
| عمق و زاویه مهم است | Blender/Three برای نماهای منتخب + نمای بالا | یک still و camera move کوتاه؛ زمان/هزینه و خوانایی واقعی |
| تاریخ/هویت باشگاه | عکس/سند + نقشه + timeline | سه style frame و یک فصل کوتاه با تاریخ و منبع |
| معرفی و مقایسهٔ بازیکن | پرتره + دادهٔ مجاز + نمودار هم‌مقیاس | یک سؤال و دو نمودار با تعریف، بازه، دقایق و منبع |
| خبر تازه | عکس همان رویداد + تاریخ/منبع + اثر خبر | یک گزارش کوتاه که عکس معرفی را از شاهد بازی جدا کند |
| جستار/تیزر تصویری | تصویرسازی و نماهای مکمل Higgsfield/Runway یا ابزار تصویر موجود | ورودی مرجع یکسان، حرکت/ثبات/هزینهٔ خروجی پذیرفته‌شده |
| بازبینی روی تایم‌لاین | OpenReel یا WeftCut؛ تدوین دستی در Kdenlive/Shotcut | پروژهٔ کوچک، undo/save/reopen/relink/export؛ سپس اتصال عامل |

اول brief و سه قاب نمایندهٔ شروع/هسته/پایان را طراحی کن. هر نما یک هدف و یک کانون توجه داشته باشد. خوانایی در موبایل، تناسب عکس با جمله و ترتیب علت/اثر پیش از تعداد افکت‌ها ارزیابی شوند. اثر بر retention/CTR بدون دادهٔ انتشار ادعا نشود.

## ۹. عکس، داده و تصویر مولد

### عکس

`studio/src/production/photo-catalog.json` مرجع فایل‌های بررسی‌شده است. `DateTimeOriginal` با تاریخ آپلود یا نام فایل فرق دارد. عکس تیم ملی پدری/یامال۲۰۲۵ در بانک فعلی برای هویت بازیکن است، نه تصویر همان ال‌کلاسیکو. گزینه‌های۲۰۲۶ در فهرست candidate نگه داشته شده‌اند و خودکار وارد رندر نشده‌اند.

```sh
python tools/video/photos.py search --query '"Lamine Yamal" "2026"' --limit 12 --output /tmp/photo-candidates.json
python tools/video/photos.py verify --release
python tools/video/photos.py credits --release --output /tmp/photo-credits.md
```

search، metadata نامزد می‌سازد؛ دانلود/تأیید خودکار نیست. تصویر را واقعاً باز کن، هویت/تاریخ/منشأ/حقوق را بررسی و فایل انتخابی را با hash و focus و usageNote ثبت کن. `photoAssets` قسمت دقیقاً با `photoId` صحنه‌ها برابر باشد. سیاست release فعلی محافظه‌کارانه است؛ CC BY-SA یا سایر مجوزها به بررسیِ شرایط کاربرد خودشان نیاز دارند. عکس روز از آژانس/باشگاه/عکاس به اجازهٔ همان کاربرد وابسته است.

### داده

از Skill `football-data-story` استفاده کن. Missing صفر نیست؛ xG، xGOT، event و tracking تعریف یکسان ندارند. پوشش APIِ نتیجه/ترکیب، مجوز عکس یا tracking کامل ایجاد نمی‌کند. StatsBomb Open Data در قرارداد بررسی‌شده محدودیت تجاریِ داده و تحلیل مشتق‌شده دارد؛ برای کانال درآمدزا به‌صورت خودکار cleared نیست. برای هر provider، پوشش همان بازی/فصل و شرایط استفاده بررسی و snapshot ثابت به renderer داده شود.

### تصویر مولد

برای تصویرسازی، فضا و نماهای مکمل از آن استفاده شود؛ خروجی مدل شاهد ثبت‌شدهٔ یک اتفاق واقعی نیست. چهره/لباس، دست/توپ، متن و تداوم نماها در خود فایل بررسی شوند. اجرای واقعی مجری، لب و کلمات با سناریوی دیگری بازتولید یا عوض نشوند. مدل/نسخه/ورودی/مدت/هزینه/نتیجهٔ پذیرفته‌شده ثبت شود.

## ۱۰. اتصال ابزارها؛ برای هر ابزار مسیر مناسب را انتخاب کن

- **Canva MCP مخصوص طرح‌ها** با **Canva Dev MCP مخصوص توسعهٔ اپ** تفاوت دارد. برای thumbnail، کارت و brand review اولی مناسب است. بعضی قابلیت‌های autofill وابسته به plan هستند.
- **Higgsfield MCP رسمی** و **Runway MCP رسمی** مسیرهای تصویر/ویدیو دارند؛ tool/model/credit و entitlement واقعی از اتصال همان حساب بررسی شوند. بعضی Skillهای Higgsfield برای Paper Collage/Shot Composer/Illustration Animation به **After Effects** وابسته‌اند؛ اتصال سرویس AE را روی Cloud لینوکس حاضر نمی‌کند.
- **Figma MCP** برای طراحی سیستم قاب و component است؛ timing ویدیو در موتور تولید طراحی می‌شود.
- **Exa یا Tavily** برای تحقیق و یافتن شاهد تازه‌اند؛ یکی را با نتایج موضوع واقعی بسنج. جست‌وجوی تصویر مجوز مصرف آن نیست.
- **Blender بومی** برای قاب ثابت آزمایش شده؛ MCP شخص ثالثِ آن addon و پل واقعی می‌خواهد. ابزار را از CLI موجود هم می‌توان اجرا کرد.
- **OpenReel/WeftCut** ابزارهای actor/timeline محلی دارند؛ endpointِ localhostِ کامپیوتر کاربر، localhostِ Cloud نیست. مسیر اتصال کلاینت و میزبان باید واقعاً آماده باشد. CLI تغییر JSON با encoder headless یکی نیست.
- **Natron/Friction** ابزار مستقل‌اند؛ وجود Python/CLI/expression به‌تنهایی MCP فعال نمی‌سازد. خروجی میانی و روش واردکردن آن به Remotion باید آزموده شود.
- **ElevenLabs** Skill/APIهای صوت دارد. مخزن MCP محلی قدیمی deprecated است؛ قابلیت hosted agent/TTS را با تمام endpointهای music/SFX/dubbing یکی فرض نکن.

فایل تنظیمات کلاینت یا نصب Skill، خودبه‌خود tool را در این گفتگو فعال نمی‌کند. در جلسهٔ تازه، ابزارهای واقعاً در دسترس و auth همان محیط را دوباره بررسی کن. بدون اتصال provider هم طراحی، دارایی محلی، مطالعه و prototype مستقل را ادامه بده. کلید/کوکی/توکن در Git یا log عمومی قرار نگیرد.

## ۱۱. چطور تحقیق را کامل و عملیاتی کنیم؟

برای هر آزمایش یک ثبت کوچک با این فیلدها بساز:

```text
Question: کدام مشکل تصویر/روایت را حل می‌کنیم؟
Baseline: کدام قاب/روش فعلی مبنای مقایسه است؟
Candidate: ابزار، نسخه/commit و میزبان اجرا
Inputs: نقش فایل، checksum، حقوق و محدودیت
Method: دستورهای واقعی و پیش‌نیازها
Evidence: قاب/کلیپ/پروژهٔ ذخیره‌شده و گزارش decode/صدا/رنگ
Result: proposed / source-reviewed / connected / prototype-tested / delivery-verified / blocked
Limits: چه چیزی هنوز آزموده یا تأیید نشده؟
Next: یک اقدام مشخص و معیار پذیرش آن
```

کد ابزار خارجی را اول در محیط پژوهشی جدا بخوان؛ dependencies تولیدی را برای هر نامزد تغییر نده. هر وقت sample مشخص بهتر بود، یک adapter محدود بساز و مرز داده/asset/renderer را نگه دار. برای استفاده از برنامهٔ GPL و برای کپی‌کردن کد GPL به محصول، تصمیم مجوز یکسان نیست. `.aep`/`.prproj` یا scene React انتقال کامل و تضمین‌شده به همهٔ ادیتورها ندارند؛ فرمت میانی، SRT، timebase و relink را عملاً امتحان کن.

اسناد قدیمی را با نتیجهٔ جدید بی‌ردپا بازنویسی نکن؛ گزارش تازه و state را به‌روزرسانی و نسخهٔ واقعاً رندرشده را مشخص کن. خروجی MP4 بزرگ، source خام، مدل ASR و cache وارد Git نشوند؛ کد و recipe و thumbnail بررسی و گزارش کوچک کافی‌اند. بررسی GitHub/دانلود artifact با auth همان کاربر انجام شود؛ خطای دسترسی دقیق گزارش شود و موفقیت ادعا نشود.

## ۱۲. کارهای بعدی به ترتیب پیشنهادی

1. **قسمت فعلی:** سه قاب طراحی‌شدهٔ مستقل و یک برش تطبیقی با تصویر مجاز را از نظر روایت/خوانایی بررسی؛ در صورت مناسب‌بودن مستر preview تازه بساز. unresolvedِ نام را حفظ کن تا واقعاً رفع شود.
2. **مدل مستند نقشه‌ای:** از آرشیو مجاز و Skillهای مرتبط Remotion یک نمونهٔ کوتاه با نقشه/زمان بساز؛ به نصب همهٔ سرویس‌ها وابسته نیست.
3. **آزمایش ادیتور:** OpenReel یا WeftCut، یکی در هر آزمایش، با fixture بی‌نیاز از حساب پولی. مرحلهٔ import در media poolِ OpenReel بررسی شده؛ ویرایش timeline، save/reopen/relink و export باید جدا تکمیل شوند؛ سپس MCP. در Motionity قرارداد مختصات/ذخیرهٔ state قبل از تأیید خروجی بررسی شود. یافته‌ها به گزارش ادیتورها افزوده شوند.
4. **نمای تخصصی:** برای یک نیاز واقعی از Natron/Friction یا انیمیشن Blender استفاده کن؛ alpha، رنگ، فریم و زمان رندر را بسنج و فقط دارایی منتخب را وارد تایم‌لاین کن.
5. **اتصال خلاقه:** اگر قالب منتخب نیاز داشت، Canva برای طراحی و Higgsfield/Runway برای نمونهٔ مولدِ محدود؛ با brief و تصویر مرجع مشترک کیفیت را مقایسه کن.
6. **پروندهٔ داده:** اول منبع/مجوز/تعریف متریک، بعد نمودار. انتشار تجاری بر اساس snapshot پژوهشیِ محدود انجام نشود.
7. **بلند تازه:** وقتی فایل واقعی رسید، intake و رونویسی مستقل و برنامهٔ تصویریِ مطابق همان اجرا ساخته شود.

این ترتیب، برنامهٔ پیشنهادی است؛ دستور تازهٔ کاربر اولویت را تغییر می‌دهد. کاربر را برای تصمیم‌های روتین یا کارهای مستقلِ از قبل مجاز، دوباره متوقف نکن.

## متن آماده برای شروع جلسهٔ بعد

> از `CLOUD_GUIDE.fa.md`، `AGENTS.md` و `docs/video-production/continuation-state.json` شروع کن. آخرین دستور من و وضعیت واقعی فایل‌ها و ابزارهای فعال را بررسی کن. برای قسمت مجری، گفتار ویدیوی واقعی و manifest مبناست؛ سناریوهای قبلی را وارد آن نکن. تفاوت پیشنهاد، کد موجود، اتصال واقعی، prototype و تحویل تأییدشده را حفظ کن. یک اقدام بعدی مشخص برای بهبود کیفیت بصری/تنوع محتوا انتخاب و در محدودهٔ مجاز اجرا کن، نمونهٔ واقعی را بررسی کن و تحقیق/نتیجه را روی GitHub ثبت کن. اگر provider یا media حاضر نیست، کارهای مستقل را ادامه بده و دقیقاً بگو کدام عملیات به آن وابسته است. موفقیت رندر یا آماده‌بودن انتشار را فقط با شواهد همان خروجی گزارش کن.
