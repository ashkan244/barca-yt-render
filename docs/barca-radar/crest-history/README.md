# CREST-HISTORY-LONG · بستهٔ تولید

نسخهٔ بلند انگلیسی دربارهٔ تاریخ نشان باشگاه، با تصویر مجری و گرافیک برداری اختصاصی. تایم‌لاین گفتار از ضبط واقعی استخراج شده؛ مدت منبع مشتق‌شده ۲۲۵ ثانیه است و پس از آن ۸ ثانیه پایان برند قرار می‌گیرد.

## فصل‌ها

- 00:00 — The story behind the crest
- 00:26 — The four bars and the Senyera
- 01:28 — Sant Jordi and the cross
- 02:11 — From city arms to the 1910 crest
- 03:09 — A symbol bigger than football

## بازسازی (۹ نوامبر ۲۰۲۶)

نسخهٔ اول (run 41903021109) بازبینی شد و این ایرادها داشت: شکل نشان درست نبود (سپر مستطیلی با سر صاف، نوار FCB کرم، ۱۱ نوار پایین به‌جای ۷، توپ سیاه‌وسفید مدرن، جای صلیب)، کارت‌های موتور زیر پنل دیده می‌شدند، Arial روی سرور نبود و متن‌ها سریف و ریز رندر شدند، تصویرها تا یک دقیقه ثابت می‌ماندند، پرچم انگلستان مربع بود، نشان شهر ۱۸۹۹ قابل‌تشخیص نبود و قاب مجری از 3:40 تا 3:45 سیاه می‌شد (پنج ثانیهٔ پایانی منبع فریم سیاه است).

- `CrestArt.tsx`: نشان باشگاه با اندازه‌گیری از نشان فعلی (شبکهٔ ۱۰۰۰ واحدی، متقارن) بازسازی شد: لبهٔ بالایی با دو «گوش»، گوشه‌های برآمده، بال‌ها هم‌تراز نوار حروف، نوک پایینی؛ صلیب در جای واقعی؛ Senyera با ۹ نوار برابر (۴ قرمز)؛ ۷ نوار آبی/اناری با نوار اناری در وسط؛ توپ چرمی طلایی با درزها؛ حروف F C B با شکل خود نشان. بخش‌ها جدا قابل کنترل‌اند (نمایش، کم‌رنگ‌کردن، درخشش، رسم خط دور) برای مونتاژ و تمرکز.
- `CrestHistoryLong.tsx`: کامپوزیشن اختصاصی به‌جای روکش روی SourceLong. ۳۰ بیت تصویری هم‌زمان با کلمه‌ها (هر ۳ تا ۸ ثانیه یک تغییر)، دو چیدمان (مجری کنار صحنه / صحنهٔ تمام‌قاب با مجری در گوشه)، مونتاژ نشان ۱۹۱۰ دقیقاً روی کلمه‌های 2:42 تا 2:51، فونت‌های محلی پروژه (Anton/Inter)، پرچم انگلستان ۳:۵، نشان شهر بارسلون (لوزی چهاربخشی با تاج، با برچسب ILLUSTRATION)، و پایان: از 3:39.85 گرافیک «MÉS QUE UN CLUB» جای فریم‌های سیاه منبع را می‌گیرد، سپس ۲۰ ثانیه end screen.
- تامبنیل اختصاصی (`CrestHistoryThumb`) با نشان واقعی، عنوان و تصویر مجری.
- زیرنویس: ۱۴ اصلاح از روی سناریو و اجرای دوم ASR (`caption-corrections.json`)، از جمله «on a white background»، «This is the cross»، «other Mediterranean lands»، «Sant Jordi»، «regional identity». مجری پاراگراف روز سنت جوردی (۲۳ آوریل) را اجرا نکرده، پس در تصویر هم نیامده.
- نام مجری روی صفحه: MORTI.

## وضعیت بازبینی

پیش‌نمایش (preview). پیش از انتشار: یک بار دیدن کامل با زیرنویس توسط مجری. ادعای «قدیمی‌ترین کاربرد شناخته‌شدهٔ چهار نوار: مهر رامون برنگر چهارم، ۱۱۵۰» از پژوهش نسخهٔ اول آمده و منابع رسمی کاتالان همین را می‌گویند.

## منابع اولیهٔ بررسی‌شده

- FC Barcelona, [The crest](https://www.fcbarcelona.com/en/club/identity/the-crest)
- FC Barcelona, [1899–1909: Foundation and survival](https://www.fcbarcelona.com/en/news/643865/1899-1909-foundation-and-survival/amp)
- Parlament de Catalunya, [Symbols of Catalonia](https://www.parlament.cat/wp/pcat/parlament/historia-del-parlament/simbols-catalunya/)
- Museu d'Història de Barcelona, [Barcelona, capital](https://www.barcelona.cat/museuhistoria/sites/default/files/llibret_bcn_capital_med_eng.pdf)
- The Royal Family, [The Union Jack](https://www.royal.uk/union-jack)

## فایل‌ها

- طرح کارگردانی: `visual-direction.fa.md`
- زیرنویس زمان‌بندی‌شده: `CREST-HISTORY-LONG.srt`
- تنظیمات تصویر/فصل: `studio/src/episodes-source/crest-history-long.spec.json`
- بازبینی و manifest: `studio/src/episodes-source/crest-history-long.manifest.json`
