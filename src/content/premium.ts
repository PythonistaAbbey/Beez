import type { Locale } from "@/lib/data/types";

/**
 * Copy for the premium template sections. Everything here describes the
 * proposed concept experience, not Beez's actual operations or statistics.
 */
export const PREMIUM = {
  en: {
    journey: {
      eyebrow: "How the concept works",
      title: "One calm journey, from booking to proof of delivery",
      lead: "The proposed customer layer follows each temperature-sensitive shipment through four moments that matter.",
      steps: [
        { icon: "FileCheck", title: "Book", body: "Request a quote or a pickup with the temperature profile, priority and delivery window set up front." },
        { icon: "Snowflake", title: "Collect and condition", body: "The load is checked against its band before departure, so the record starts clean." },
        { icon: "Activity", title: "Monitor in transit", body: "Live position and readings in one view, with excursion alerts routed to a named owner." },
        { icon: "ShieldCheck", title: "Deliver and prove", body: "Signature, photo and the full temperature log attached to the shipment for audit." },
      ],
    },
    visual: { demo: "Synthetic demo data", cover: "Days of stock cover", inBand: "Readings in band", open: "Open alerts", onTime: "On-time (simulated)", week: "Deliveries per day (simulated)" },
    related: "Explore more solutions",
    cta: {
      title: "See it working on a live demo shipment",
      lead: "Open the control tower, follow a refrigerated delivery across the Kingdom and run a hypothetical disruption. Everything shown is synthetic.",
      primary: "Open the Control Tower",
      secondary: "Request a quote",
    },
    trackingHints: [
      { icon: "MapPin", title: "Where it is", body: "Route progress and the last checkpoint." },
      { icon: "Thermometer", title: "How it is", body: "Readings against the allowed band, with any excursion marked." },
      { icon: "FileCheck", title: "Proof", body: "Delivery confirmation and the complete temperature log." },
    ],
  },
  ar: {
    journey: {
      eyebrow: "كيف يعمل المفهوم",
      title: "رحلة واحدة هادئة، من الحجز حتى إثبات التسليم",
      lead: "تتابع طبقة العملاء المقترحة كل شحنة حساسة للحرارة عبر أربع لحظات مهمة.",
      steps: [
        { icon: "FileCheck", title: "الحجز", body: "اطلب عرض سعر أو استلامًا مع تحديد نطاق الحرارة والأولوية ونافذة التسليم مسبقًا." },
        { icon: "Snowflake", title: "الاستلام والتهيئة", body: "يُفحص الحمل مقابل نطاقه قبل الانطلاق، ليبدأ السجل نظيفًا." },
        { icon: "Activity", title: "المراقبة أثناء النقل", body: "الموقع والقراءات الحية في عرض واحد، مع توجيه تنبيهات التجاوز إلى مسؤول محدد." },
        { icon: "ShieldCheck", title: "التسليم والإثبات", body: "توقيع وصورة وسجل الحرارة الكامل مرفقة بالشحنة لأغراض التدقيق." },
      ],
    },
    visual: { demo: "بيانات تجريبية مصطنعة", cover: "أيام تغطية المخزون", inBand: "قراءات ضمن النطاق", open: "تنبيهات مفتوحة", onTime: "في الموعد (محاكاة)", week: "التسليمات اليومية (محاكاة)" },
    related: "استكشف حلولًا أخرى",
    cta: {
      title: "شاهده يعمل على شحنة تجريبية حية",
      lead: "افتح برج التحكم، وتابع توصيلة مبردة عبر المملكة، وشغّل اضطرابًا افتراضيًا. كل ما يظهر بيانات مصطنعة.",
      primary: "افتح برج التحكم",
      secondary: "اطلب عرض سعر",
    },
    trackingHints: [
      { icon: "MapPin", title: "أين هي", body: "تقدم المسار وآخر نقطة تفتيش." },
      { icon: "Thermometer", title: "كيف حالها", body: "القراءات مقابل النطاق المسموح، مع تمييز أي تجاوز." },
      { icon: "FileCheck", title: "الإثبات", body: "تأكيد التسليم وسجل الحرارة الكامل." },
    ],
  },
} satisfies Record<Locale, unknown>;
