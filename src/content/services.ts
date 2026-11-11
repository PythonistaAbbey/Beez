import type { ServiceContent, ServiceSlug } from "./en";
import type { Locale } from "@/lib/data/types";

type ServiceMap = Record<ServiceSlug, ServiceContent>;

const en: ServiceMap = {
  about: {
    eyebrow: "About Beez",
    title: "A Saudi cold-chain specialist since 2015",
    lead: "Beez Logistics describes itself as a Saudi company providing refrigerated shipping and storage solutions, and as one of the companies specialising in cold-chain shipping across the Kingdom.",
    stated: [
      { text: "Established in 2015 in the Kingdom of Saudi Arabia.", src: "about" },
      { text: "Focus on refrigerated shipping and storage for perishable and temperature-sensitive goods.", src: "home" },
      { text: "A network of distribution centres and warehouses across the Kingdom.", src: "why" },
      { text: "Headquartered on Abi Bakr Al Siddiq Branch Rd, Al Nafel District, Riyadh.", src: "contact" },
    ],
    pillars: [
      { title: "Trust first", body: "Beez says its success is built on the trust of its customers. The concept turns that trust into visible evidence: logs, timelines and proof of delivery.", icon: "ShieldCheck" },
      { title: "Built for Saudi conditions", body: "Beez notes that conditions in the Kingdom can be challenging for sensitive products. Temperature control is the core of the story.", icon: "Sun" },
      { title: "Technology owned in-house", body: "Beez states it develops its own systems. A customer layer can surface them without rebuilding them.", icon: "Cpu" },
    ],
    digital: { title: "How the concept presents Beez", items: [
      "A clear corporate story page with sourced facts only, no unverified numbers",
      "Leadership, certifications and milestones added only once Beez confirms them",
      "Consistent bilingual tone across every service page",
    ] },
  },
  logistics: {
    eyebrow: "Logistics & transportation",
    title: "Refrigerated transport across the Kingdom",
    lead: "Beez states it provides fast, refrigerated shipping across Saudi Arabia, last-mile delivery with a dedicated fleet, B2B supply, and dedicated vehicles with temperature monitoring throughout the trip.",
    stated: [
      { text: "Refrigerated shipping services all over Saudi Arabia.", src: "logistics" },
      { text: "Last-mile delivery using advanced technology and a dedicated fleet.", src: "logistics" },
      { text: "Cost-effective B2B supply-chain solutions.", src: "logistics" },
      { text: "Dedicated vehicles with temperature monitoring devices throughout the trip.", src: "logistics" },
      { text: "Strategically located distribution centres for fulfilment and inventory management.", src: "logistics" },
    ],
    pillars: [
      { title: "Line-haul between regions", body: "Temperature-controlled trips between major cities, visible on one map.", icon: "Truck" },
      { title: "Last mile", body: "Dedicated-fleet delivery to the final receiving point, with digital handover.", icon: "MapPin" },
      { title: "B2B replenishment", body: "Scheduled supply runs for retailers, pharmacies and distributors.", icon: "Boxes" },
      { title: "Dedicated vehicles", body: "Vehicles assigned to one client's loads, monitored for the whole journey.", icon: "Thermometer" },
    ],
    digital: { title: "Customer layer proposed", items: [
      "Route and ETA view that updates customers automatically when plans change",
      "One-click temperature log export for each trip",
      "Self-service delivery issue reporting tied to the shipment",
    ] },
  },
  "cold-chain": {
    eyebrow: "Cold-chain solutions",
    title: "Temperature integrity from dock to door",
    lead: "Beez's FAQ explains that advanced sensors monitor shipments and alert the driver if temperature leaves the allowed range, with typical ranges of 5 °C to 20 °C depending on product and client.",
    stated: [
      { text: "Sensors monitor shipments and alert the driver when temperature leaves its allowed range.", src: "home" },
      { text: "Typical range of 5 °C to 20 °C depending on product type and client requirements.", src: "home" },
      { text: "Temperature and humidity monitoring for medicine, food and cosmetics.", src: "logistics" },
      { text: "Refrigerated warehouses with temperature control maintained 24/7.", src: "warehousing" },
    ],
    pillars: [
      { title: "Continuous readings", body: "Temperature and humidity sampled along the route and in storage.", icon: "Activity" },
      { title: "Excursion alerts", body: "Out-of-band readings raise an alert in seconds, with a clear owner.", icon: "BellRing" },
      { title: "Audit-ready logs", body: "Every reading kept with the shipment for quality and compliance teams.", icon: "FileCheck" },
    ],
    digital: { title: "Customer layer proposed", items: [
      "Customer-side excursion alerts with configurable channels and quiet hours",
      "Graphs that show the allowed band, the excursion and how long it lasted",
      "Acknowledge, assign and escalate workflow, recorded for audit",
    ] },
  },
  medical: {
    eyebrow: "Medical logistics",
    title: "Care in every degree",
    lead: "Beez lists Medical among the industries it serves and states that its monitoring keeps sensitive products such as medicine safe in transport and storage. This page shows how a dedicated medical experience could look.",
    proposedPage: true,
    stated: [
      { text: "Medical and supplements listed among industries served.", src: "home" },
      { text: "Technology to monitor temperature and humidity for medicine.", src: "logistics" },
      { text: "Refrigerated storage for food and pharmaceuticals with 24/7 temperature control.", src: "warehousing" },
    ],
    pillars: [
      { title: "Priority lanes", body: "Critical medical lots flagged at booking and kept at the top of every list.", icon: "HeartPulse" },
      { title: "Backup stock visibility", body: "See where a second lot sits before it is needed.", icon: "Warehouse" },
      { title: "Escalation paths", body: "Named contacts and time-boxed steps for every critical exception.", icon: "Siren" },
    ],
    digital: { title: "Customer layer proposed", items: [
      "Medical priority queue in the control tower",
      "Days-of-cover and lot-expiry view for critical SKUs",
      "Escalation ladder with acknowledgement timestamps",
      "Note: no regulatory licences are claimed here. Any GDP or SFDA statements must come from Beez directly.",
    ] },
  },
  warehousing: {
    eyebrow: "Warehousing",
    title: "Refrigerated storage, assembly and packing",
    lead: "Beez states that its refrigerated warehouses are equipped with monitoring systems and precise 24/7 temperature control, with integrated storage, assembly and packaging services.",
    stated: [
      { text: "Refrigerated warehouses equipped with the latest monitoring systems.", src: "warehousing" },
      { text: "Precise temperature control maintained 24/7.", src: "warehousing" },
      { text: "Integrated storage, assembly and packaging services.", src: "warehousing" },
      { text: "Continuous updates to customers on the status of shipments.", src: "warehousing" },
    ],
    pillars: [
      { title: "Zoned storage", body: "Separate temperature zones for different product families.", icon: "Snowflake" },
      { title: "Value-added services", body: "Assembly, kitting and protective packaging before dispatch.", icon: "Package" },
      { title: "Dedicated onward fleet", body: "Storage connected directly to delivery.", icon: "Truck" },
    ],
    digital: { title: "Customer layer proposed", items: [
      "Live inventory by warehouse and temperature zone",
      "Days of cover, reserved stock and lot expiry at a glance",
      "Low-stock alerts that point to backup inventory",
    ] },
  },
  "fourth-party-logistics": {
    eyebrow: "Fourth-party logistics",
    title: "One accountable partner for the whole chain",
    lead: "Beez describes 3PL and 4PL services that cover transportation, warehousing, cross-docking, inventory, packaging, route planning, IT integration, and compliance and safety.",
    stated: [
      { text: "Transportation with efficient strategies and optimised routes.", src: "fourPl" },
      { text: "Warehousing, cross-docking and inventory optimisation.", src: "fourPl" },
      { text: "Customised secure and compliant packaging.", src: "fourPl" },
      { text: "Integration with client systems for real-time tracking and data synchronisation.", src: "fourPl" },
      { text: "Adherence to industry regulations and safety standards.", src: "fourPl" },
    ],
    pillars: [
      { title: "Orchestration", body: "Multiple carriers, warehouses and suppliers managed as one network.", icon: "Network" },
      { title: "Data-driven routing", body: "Routes optimised for cost, time and temperature risk.", icon: "Route" },
      { title: "Supplier coordination", body: "Inbound notices, slot booking and on-time performance in one place.", icon: "Handshake" },
    ],
    digital: { title: "Customer layer proposed", items: [
      "Supplier coordination board with inbound slot requests",
      "Network-wide analytics for on-time and temperature compliance",
      "Business continuity scenarios across the whole network",
    ] },
  },
  ecommerce: {
    eyebrow: "E-commerce fulfilment",
    title: "Chilled fulfilment for online stores",
    lead: "Beez lists E-commerce among its industries, offers a Beez app on the Salla platform, and states it achieved an integration with Amazon. This page brings that into a clear fulfilment offer.",
    proposedPage: true,
    stated: [
      { text: "E-commerce listed among industries served.", src: "home" },
      { text: "Beez app on Salla: connect a store and set shipping rates by city and region.", src: "salla" },
      { text: "Beez states it was the first company in the Middle East to integrate seamlessly with Amazon (company claim).", src: "it" },
      { text: "Express Dashboard System to create, monitor and modify orders in real time.", src: "it" },
    ],
    pillars: [
      { title: "Store connections", body: "Orders flow from the store platform straight into fulfilment.", icon: "ShoppingCart" },
      { title: "Chilled last mile", body: "Temperature-sensitive orders delivered to the shopper's door.", icon: "MapPin" },
      { title: "Shopper notifications", body: "Branded updates the merchant controls.", icon: "MessageSquare" },
    ],
    digital: { title: "Customer layer proposed", items: [
      "Merchant view of orders, stock and delivery status together",
      "Notification preferences per event and channel",
      "Delivery issue reporting that links to the order",
    ] },
  },
  technology: {
    eyebrow: "Technology solutions",
    title: "In-house systems, one customer window",
    lead: "Beez states it owns and develops its in-house systems, has integrated AI into most of them, and is ISO certified in Information Technology. This concept proposes a unified customer window in front of those systems.",
    stated: [
      { text: "In-house systems: Beez WMS, Ordering Management System, Fleet Management System with GPS, Driver App, Express Dashboard, Performance MS.", src: "it" },
      { text: "AI integrated into most systems (company statement).", src: "it" },
      { text: "ISO certified in Information Technology (company statement; certificate not reviewed).", src: "it" },
      { text: "Mobile app published on the App Store.", src: "appStore" },
      { text: "AI customer-service assistant developed in-house, called Beez GPT.", src: "service" },
    ],
    pillars: [
      { title: "Complement, don't replace", body: "The control tower reads from existing systems through secure APIs.", icon: "Layers" },
      { title: "API-first design", body: "Every screen in the concept is backed by a documented mock API.", icon: "Plug" },
      { title: "Privacy by design", body: "Least-privilege roles, data minimisation and Saudi data-residency ready.", icon: "Lock" },
    ],
    digital: { title: "Integration concept", items: [
      "WMS → inventory and zone temperatures",
      "OMS → orders, references and service levels",
      "FMS and driver app → positions, ETAs and proof of delivery",
      "Sensors → temperature and humidity readings and alerts",
    ] },
  },
  corporate: {
    eyebrow: "Corporate services",
    title: "Logistics programmes for enterprise teams",
    lead: "For organisations that need more than single shipments: dedicated vehicles, managed warehousing, 4PL orchestration and a single interface for operations, quality and finance teams.",
    stated: [
      { text: "Service lines: Logistics, Warehousing, Fourth Party Logistics, Advance IT Solution, Customer Service.", src: "home" },
      { text: "Dedicated vehicles with temperature monitoring.", src: "logistics" },
      { text: "3PL and 4PL services tailored to each client's business.", src: "fourPl" },
    ],
    pillars: [
      { title: "One account, many sites", body: "Every warehouse, lane and supplier under one corporate login.", icon: "Building2" },
      { title: "Role-based access", body: "Operations, quality and finance each see what they need.", icon: "Users" },
      { title: "Service reviews", body: "Analytics ready for quarterly business reviews.", icon: "BarChart3" },
    ],
    digital: { title: "Customer layer proposed", items: [
      "Corporate quotation wizard",
      "Customer account dashboard with tickets and quotes",
      "Service comparison for procurement teams",
    ] },
  },
};

const ar: ServiceMap = {
  about: {
    eyebrow: "عن بيز",
    title: "متخصص سعودي في سلسلة التبريد منذ ٢٠١٥",
    lead: "تصف بيز اللوجستية نفسها بأنها شركة سعودية تقدم حلول الشحن والتخزين المبرد، ومن الشركات المتخصصة في شحن سلسلة التبريد في أنحاء المملكة.",
    stated: [
      { text: "تأسست عام ٢٠١٥ في المملكة العربية السعودية.", src: "about" },
      { text: "تركيز على الشحن والتخزين المبرد للبضائع سريعة التلف والحساسة للحرارة.", src: "home" },
      { text: "شبكة من مراكز التوزيع والمستودعات في أنحاء المملكة.", src: "why" },
      { text: "المقر في طريق أبي بكر الصديق الفرعي، حي النفل، الرياض.", src: "contact" },
    ],
    pillars: [
      { title: "الثقة أولًا", body: "تذكر بيز أن نجاحها مبني على ثقة عملائها. يحوّل المفهوم هذه الثقة إلى أدلة مرئية: سجلات ومراحل وإثبات تسليم.", icon: "ShieldCheck" },
      { title: "مصمم لظروف المملكة", body: "تشير بيز إلى أن الظروف في المملكة قد تكون صعبة على المنتجات الحساسة، لذا فضبط الحرارة جوهر القصة.", icon: "Sun" },
      { title: "تقنية مطورة داخليًا", body: "تذكر بيز أنها تطور أنظمتها بنفسها. يمكن لطبقة العميل إظهارها دون إعادة بنائها.", icon: "Cpu" },
    ],
    digital: { title: "كيف يقدّم المفهوم بيز", items: [
      "صفحة واضحة لقصة الشركة تتضمن حقائق موثقة المصدر فقط دون أرقام غير مؤكدة",
      "إضافة القيادات والشهادات والمحطات بعد تأكيدها من بيز فقط",
      "نبرة ثنائية اللغة متسقة في كل صفحات الخدمات",
    ] },
  },
  logistics: {
    eyebrow: "الخدمات اللوجستية والنقل",
    title: "نقل مبرد في أنحاء المملكة",
    lead: "تذكر بيز أنها تقدم شحنًا مبردًا سريعًا في أنحاء المملكة، وتوصيل الميل الأخير بأسطول مخصص، وإمدادًا بين الشركات، ومركبات مخصصة مزودة بأجهزة مراقبة الحرارة طوال الرحلة.",
    stated: [
      { text: "خدمات شحن مبرد في جميع أنحاء المملكة.", src: "logistics" },
      { text: "توصيل الميل الأخير بتقنيات متقدمة وأسطول مخصص.", src: "logistics" },
      { text: "حلول إمداد بين الشركات بتكلفة مناسبة.", src: "logistics" },
      { text: "مركبات مخصصة بأجهزة مراقبة الحرارة طوال الرحلة.", src: "logistics" },
      { text: "مراكز توزيع في مواقع استراتيجية لتنفيذ الطلبات وإدارة المخزون.", src: "logistics" },
    ],
    pillars: [
      { title: "النقل بين المناطق", body: "رحلات مضبوطة الحرارة بين المدن الكبرى، ظاهرة على خريطة واحدة.", icon: "Truck" },
      { title: "الميل الأخير", body: "توصيل بأسطول مخصص إلى نقطة الاستلام النهائية مع تسليم رقمي.", icon: "MapPin" },
      { title: "إمداد الشركات", body: "رحلات توريد مجدولة لمتاجر التجزئة والصيدليات والموزعين.", icon: "Boxes" },
      { title: "مركبات مخصصة", body: "مركبات مخصصة لحمولات عميل واحد، مراقبة طوال الرحلة.", icon: "Thermometer" },
    ],
    digital: { title: "طبقة العميل المقترحة", items: [
      "عرض للمسار ووقت الوصول يُحدّث العملاء تلقائيًا عند تغير الخطة",
      "تصدير سجل الحرارة لكل رحلة بنقرة واحدة",
      "إبلاغ ذاتي عن مشكلات التوصيل مرتبط بالشحنة",
    ] },
  },
  "cold-chain": {
    eyebrow: "حلول سلسلة التبريد",
    title: "سلامة الحرارة من الرصيف إلى الباب",
    lead: "توضح الأسئلة الشائعة لدى بيز أن مستشعرات متقدمة تراقب الشحنات وتنبه السائق إذا خرجت الحرارة عن النطاق المسموح، بنطاقات معتادة من ٥ إلى ٢٠ درجة مئوية بحسب المنتج والعميل.",
    stated: [
      { text: "مستشعرات تراقب الشحنات وتنبه السائق عند خروج الحرارة عن النطاق.", src: "home" },
      { text: "نطاق معتاد من ٥ إلى ٢٠ درجة مئوية بحسب نوع المنتج ومتطلبات العميل.", src: "home" },
      { text: "مراقبة الحرارة والرطوبة للأدوية والأغذية ومستحضرات التجميل.", src: "logistics" },
      { text: "مستودعات مبردة بضبط حرارة على مدار الساعة.", src: "warehousing" },
    ],
    pillars: [
      { title: "قراءات مستمرة", body: "قياس الحرارة والرطوبة على طول المسار وفي التخزين.", icon: "Activity" },
      { title: "تنبيهات التجاوز", body: "القراءات خارج النطاق تطلق تنبيهًا خلال ثوانٍ مع مسؤول واضح.", icon: "BellRing" },
      { title: "سجلات جاهزة للتدقيق", body: "كل قراءة محفوظة مع الشحنة لفرق الجودة والامتثال.", icon: "FileCheck" },
    ],
    digital: { title: "طبقة العميل المقترحة", items: [
      "تنبيهات تجاوز للعميل بقنوات وساعات هدوء قابلة للضبط",
      "رسوم تُظهر النطاق المسموح والتجاوز ومدته",
      "سير عمل للإقرار والإسناد والتصعيد، مسجّل للتدقيق",
    ] },
  },
  medical: {
    eyebrow: "اللوجستيات الطبية",
    title: "عناية في كل درجة",
    lead: "تذكر بيز القطاع الطبي ضمن القطاعات التي تخدمها، وتذكر أن المراقبة تحافظ على المنتجات الحساسة كالأدوية في النقل والتخزين. توضح هذه الصفحة كيف يمكن أن تبدو تجربة طبية مخصصة.",
    proposedPage: true,
    stated: [
      { text: "القطاع الطبي والمكملات ضمن القطاعات المخدومة.", src: "home" },
      { text: "تقنية لمراقبة الحرارة والرطوبة للأدوية.", src: "logistics" },
      { text: "تخزين مبرد للأغذية والأدوية بضبط حرارة على مدار الساعة.", src: "warehousing" },
    ],
    pillars: [
      { title: "مسارات الأولوية", body: "تمييز الدفعات الطبية الحرجة عند الحجز وإبقاؤها أعلى كل قائمة.", icon: "HeartPulse" },
      { title: "رؤية المخزون الاحتياطي", body: "اعرف مكان الدفعة البديلة قبل الحاجة إليها.", icon: "Warehouse" },
      { title: "مسارات التصعيد", body: "جهات اتصال محددة وخطوات بزمن محدد لكل استثناء حرج.", icon: "Siren" },
    ],
    digital: { title: "طبقة العميل المقترحة", items: [
      "قائمة أولويات طبية في برج التحكم",
      "عرض أيام التغطية وانتهاء صلاحية الدفعات للأصناف الحرجة",
      "سلّم تصعيد مع أوقات الإقرار",
      "ملاحظة: لا تُدّعى هنا أي تراخيص تنظيمية. أي بيانات عن GDP أو هيئة الغذاء والدواء يجب أن تأتي من بيز مباشرة.",
    ] },
  },
  warehousing: {
    eyebrow: "التخزين",
    title: "تخزين مبرد وتجميع وتغليف",
    lead: "تذكر بيز أن مستودعاتها المبردة مجهزة بأنظمة مراقبة وضبط دقيق للحرارة على مدار الساعة، مع خدمات متكاملة للتخزين والتجميع والتغليف.",
    stated: [
      { text: "مستودعات مبردة مجهزة بأحدث أنظمة المراقبة.", src: "warehousing" },
      { text: "ضبط دقيق للحرارة على مدار الساعة.", src: "warehousing" },
      { text: "خدمات متكاملة للتخزين والتجميع والتغليف.", src: "warehousing" },
      { text: "تحديثات مستمرة للعملاء عن حالة الشحنات.", src: "warehousing" },
    ],
    pillars: [
      { title: "تخزين بمناطق", body: "مناطق حرارة منفصلة لعائلات المنتجات المختلفة.", icon: "Snowflake" },
      { title: "خدمات القيمة المضافة", body: "التجميع والتجهيز والتغليف الواقي قبل الشحن.", icon: "Package" },
      { title: "أسطول مخصص للتوصيل", body: "التخزين متصل مباشرة بالتوصيل.", icon: "Truck" },
    ],
    digital: { title: "طبقة العميل المقترحة", items: [
      "مخزون مباشر حسب المستودع ومنطقة الحرارة",
      "أيام التغطية والمخزون المحجوز وانتهاء الصلاحية في لمحة",
      "تنبيهات انخفاض المخزون تشير إلى المخزون الاحتياطي",
    ] },
  },
  "fourth-party-logistics": {
    eyebrow: "لوجستيات الطرف الرابع",
    title: "شريك واحد مسؤول عن السلسلة كاملة",
    lead: "تصف بيز خدمات الطرف الثالث والرابع التي تشمل النقل والتخزين والتحويل المباشر والمخزون والتغليف وتخطيط المسارات والتكامل التقني والامتثال والسلامة.",
    stated: [
      { text: "نقل باستراتيجيات فعالة ومسارات محسّنة.", src: "fourPl" },
      { text: "التخزين والتحويل المباشر وتحسين المخزون.", src: "fourPl" },
      { text: "تغليف آمن ومتوافق مخصص.", src: "fourPl" },
      { text: "تكامل مع أنظمة العميل للتتبع اللحظي ومزامنة البيانات.", src: "fourPl" },
      { text: "الالتزام بأنظمة القطاع ومعايير السلامة.", src: "fourPl" },
    ],
    pillars: [
      { title: "التنسيق الشامل", body: "إدارة الناقلين والمستودعات والموردين كشبكة واحدة.", icon: "Network" },
      { title: "مسارات قائمة على البيانات", body: "مسارات محسّنة للتكلفة والوقت ومخاطر الحرارة.", icon: "Route" },
      { title: "التنسيق مع الموردين", body: "إشعارات الوارد وحجز المواعيد والأداء الزمني في مكان واحد.", icon: "Handshake" },
    ],
    digital: { title: "طبقة العميل المقترحة", items: [
      "لوحة تنسيق الموردين مع طلبات مواعيد الوارد",
      "تحليلات على مستوى الشبكة للالتزام بالوقت والحرارة",
      "سيناريوهات استمرارية الأعمال عبر الشبكة كاملة",
    ] },
  },
  ecommerce: {
    eyebrow: "تنفيذ طلبات التجارة الإلكترونية",
    title: "تنفيذ مبرد للمتاجر الإلكترونية",
    lead: "تذكر بيز التجارة الإلكترونية ضمن قطاعاتها، وتوفر تطبيقًا على منصة سلة، وتذكر أنها حققت تكاملًا مع أمازون. تجمع هذه الصفحة ذلك في عرض تنفيذ واضح.",
    proposedPage: true,
    stated: [
      { text: "التجارة الإلكترونية ضمن القطاعات المخدومة.", src: "home" },
      { text: "تطبيق بيز على سلة: ربط المتجر وضبط أسعار الشحن حسب المدينة والمنطقة.", src: "salla" },
      { text: "تذكر بيز أنها أول شركة في الشرق الأوسط تحقق تكاملًا سلسًا مع أمازون (ادعاء الشركة).", src: "it" },
      { text: "نظام Express Dashboard لإنشاء الطلبات ومتابعتها وتعديلها لحظيًا.", src: "it" },
    ],
    pillars: [
      { title: "ربط المتاجر", body: "تتدفق الطلبات من منصة المتجر مباشرة إلى التنفيذ.", icon: "ShoppingCart" },
      { title: "ميل أخير مبرد", body: "توصيل الطلبات الحساسة للحرارة إلى باب المتسوق.", icon: "MapPin" },
      { title: "إشعارات المتسوقين", body: "تحديثات بهوية التاجر يتحكم بها بنفسه.", icon: "MessageSquare" },
    ],
    digital: { title: "طبقة العميل المقترحة", items: [
      "عرض للتاجر يجمع الطلبات والمخزون وحالة التوصيل",
      "تفضيلات الإشعارات لكل حدث وقناة",
      "إبلاغ عن مشكلات التوصيل مرتبط بالطلب",
    ] },
  },
  technology: {
    eyebrow: "الحلول التقنية",
    title: "أنظمة داخلية، ونافذة واحدة للعميل",
    lead: "تذكر بيز أنها تمتلك أنظمتها وتطورها داخليًا، وأدمجت الذكاء الاصطناعي في معظمها، وأنها حاصلة على شهادة ISO في تقنية المعلومات. يقترح هذا المفهوم نافذة عميل موحدة أمام تلك الأنظمة.",
    stated: [
      { text: "أنظمة داخلية: نظام إدارة المستودعات، نظام إدارة الطلبات، نظام إدارة الأسطول بتحديد المواقع، تطبيق السائق، Express Dashboard، ونظام الأداء.", src: "it" },
      { text: "دمج الذكاء الاصطناعي في معظم الأنظمة (بيان الشركة).", src: "it" },
      { text: "شهادة ISO في تقنية المعلومات (بيان الشركة؛ لم تُراجع الشهادة).", src: "it" },
      { text: "تطبيق جوال منشور على App Store.", src: "appStore" },
      { text: "مساعد ذكي لخدمة العملاء مطور داخليًا باسم Beez GPT.", src: "service" },
    ],
    pillars: [
      { title: "تكامل لا استبدال", body: "يقرأ برج التحكم من الأنظمة القائمة عبر واجهات برمجية آمنة.", icon: "Layers" },
      { title: "تصميم قائم على API", body: "كل شاشة في المفهوم مدعومة بواجهة برمجية تجريبية موثقة.", icon: "Plug" },
      { title: "الخصوصية بالتصميم", body: "أقل صلاحيات لازمة، وتقليل البيانات، وجاهزية لتوطين البيانات في المملكة.", icon: "Lock" },
    ],
    digital: { title: "مفهوم التكامل", items: [
      "نظام المستودعات ← المخزون وحرارة المناطق",
      "نظام الطلبات ← الطلبات والمراجع ومستويات الخدمة",
      "نظام الأسطول وتطبيق السائق ← المواقع وأوقات الوصول وإثبات التسليم",
      "المستشعرات ← قراءات الحرارة والرطوبة والتنبيهات",
    ] },
  },
  corporate: {
    eyebrow: "خدمات الشركات",
    title: "برامج لوجستية لفرق المؤسسات",
    lead: "للمؤسسات التي تحتاج أكثر من شحنات منفردة: مركبات مخصصة، وتخزين مُدار، وتنسيق عبر الطرف الرابع، وواجهة واحدة لفرق العمليات والجودة والمالية.",
    stated: [
      { text: "خطوط الخدمة: اللوجستيات، التخزين، الطرف الرابع، الحلول التقنية، خدمة العملاء.", src: "home" },
      { text: "مركبات مخصصة بمراقبة الحرارة.", src: "logistics" },
      { text: "خدمات الطرف الثالث والرابع مصممة لاحتياجات كل عميل.", src: "fourPl" },
    ],
    pillars: [
      { title: "حساب واحد لمواقع متعددة", body: "كل المستودعات والمسارات والموردين تحت دخول مؤسسي واحد.", icon: "Building2" },
      { title: "صلاحيات حسب الدور", body: "يرى كل من فرق العمليات والجودة والمالية ما يحتاجه.", icon: "Users" },
      { title: "مراجعات الخدمة", body: "تحليلات جاهزة لمراجعات الأعمال الفصلية.", icon: "BarChart3" },
    ],
    digital: { title: "طبقة العميل المقترحة", items: [
      "معالج طلب عروض الأسعار للشركات",
      "لوحة حساب العميل مع التذاكر والعروض",
      "مقارنة الخدمات لفرق المشتريات",
    ] },
  },
};

export const SERVICES: Record<Locale, ServiceMap> = { en, ar };
export const SERVICE_SLUGS = Object.keys(en) as ServiceSlug[];
