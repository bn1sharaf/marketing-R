# لوحة الأداء التسويقي — GitHub + Cloudflare

الصفحات: `/` (العرض والتحليل) و `/entry.html` (تعبئة البيانات). قاعدة البيانات: Cloudflare D1 عبر Worker.

## النشر
1. `npm i -g wrangler && wrangler login`
2. `wrangler d1 create marketing-dashboard` ثم ضع `database_id` في `wrangler.toml`
3. `wrangler d1 execute marketing-dashboard --remote --file=schema.sql`
4. `wrangler deploy` (تجربة أولى)
5. ارفع المجلد إلى GitHub، ثم في Cloudflare: Workers & Pages → Create → Import a repository (أمر النشر: `npx wrangler deploy`)
6. الدومين: Worker → Settings → Domains & Routes → Add Custom Domain (الدومين لازم يكون على Cloudflare)
7. **الحماية (ضروري):** Zero Trust → Access → Applications → Self-hosted، أضف الدومين (يشمل `/api/*`) بسياسة Allow لإيميلاتكم. بدونها أي شخص يعرف الرابط يقرأ ويعدّل البيانات.

## نقل البيانات القديمة
من اللوحة القديمة: الأرشيف ← تصدير JSON، ثم في الجديدة: الأرشيف ← استيراد JSON (لكل براند على حدة).

## ملاحظات
- التحديث بين المتصفحات كل ~8 ثوانٍ (استعلام دوري).
- Chart.js و Google Fonts تُحمَّل من CDN.
- سحب بيانات ميتا/جوجل/تيك توك تلقائياً غير مضمّن (يحتاج Cron Worker ومفاتيح API).
