const fs = require('fs');
const path = require('path');

const arPath = path.resolve(__dirname, '../src/locales/ar.json');
const enPath = path.resolve(__dirname, '../src/locales/en.json');
const frPath = path.resolve(__dirname, '../src/locales/fr.json');

const ar = JSON.parse(fs.readFileSync(arPath, 'utf8'));
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const fr = JSON.parse(fs.readFileSync(frPath, 'utf8'));

// 1. Precise fixes for corrupted or mangled keys in ar.json
const cleanReplacements = {
  // Help Center
  help_center: "مركز المساعدة والدعم التوثيقي",
  help_center_intro: "إجابات شاملة على الأسئلة الشائعة حول بناء الأشجار العائلية، الاشتراكات، وإدارة الحساب.",
  help_still_need_help: "هل ما زلت بحاجة إلى مساعدة؟",
  help_contact_intro: "فريق الباحثين والخبراء في الأنساب التونسية مستعد لمساعدتك في استفساراتك التوثيقية والأرشيفية.",
  help_cat_getting_started: "البداية والانطلاق",
  help_cat_trees: "الأشجار العائلية و GEDCOM",
  help_cat_subscriptions: "الاشتراكات والفوترة",
  help_cat_privacy: "الخصوصية والأمان",
  help_q_create_account: "كيف أنشئ حساباً جديداً؟",
  help_a_create_account: "اضغط على زر التسجيل في شريط التنقل العلوي، وأدخل اسمك وبريدك الإلكتروني وكلمة المرور. ستحصل على فترة تجريبية مجانية لمدة 14 يوماً لاستكشاف المنصة دون الحاجة للدفع مسبقاً.",
  help_q_first_tree: "كيف أبني أول شجرة عائلة لي؟",
  help_a_first_tree: "من لوحة التحكم، اختر «شجرة جديدة»، ثم أضف نفسك كأول شخص، واستخدم «إضافة قريب» لإضافة الوالدين والأبناء والزوج/الزوجة خطوة بخطوة. يمكنك أيضاً استيراد ملف GEDCOM جاهز مباشرة.",
  help_q_language: "هل يمكنني استخدام الموقع بلغة أخرى؟",
  help_a_language: "نعم — استخدم محول اللغة في شريط التنقل العلوي للتبديل بين العربية والفرنسية والإنجليزية في أي وقت.",
  help_q_gedcom_import: "ما هي صيغ GEDCOM المدعومة للاستيراد؟",
  help_a_gedcom_import: "ندعم صيغ GEDCOM 5.5.1 و GEDCOM 7.0 و GEDCOM X (سواء بتنسيق XML أو JSON أو ملفات .gedx). استخدم زر استيراد GEDCOM داخل شريط أدوات محرر الأشجار.",
  help_q_view_vs_download: "لماذا يمكنني تصفح شجرة معينة بينما لا يمكنني تحميلها؟",
  help_a_view_vs_download: "عرض الشجرة التي لا تملكها يتيح تصفحها للقراءة فقط في المتصفح. تحميل ملف GEDCOM المصدري يتطلب إما ملكية الشجرة أو موافقة مسبقة على طلب التحميل لحماية أبحاث الباحثين من النسخ غير المصرح به.",
  help_q_request_download: "كيف أطلب تحميل شجرة عائلة تابعة لمستخدم آخر؟",
  help_a_request_download: "افتح الشجرة واضغط على «طلب التحميل». سيتم إخطار صاحب الشجرة للموافقة على الطلب أو رفضه، ويمكنك متابعة حالة الطلب من صفحة «طلباتي».",
  help_q_plans_differ: "ما الفرق بين الباقات والاشتراكات؟",
  help_a_plans_differ: "الباقة الأساسية مجانية ومخصصة للأشجار الصغيرة. باقات المحترف والباحث في أنساب العائلات تفتح إمكانية إنشاء أشجار غير محدودة، رفع الوثائق للأرشيف، استيراد وتصدير GEDCOM، والدعم المتميز.",
  help_q_how_to_pay: "كيف أدفع مقابل الاشتراك في باقة؟",
  help_a_how_to_pay: "اختر الباقة المناسبة، ثم قم بالتحويل البنكي باستخدام البيانات الموضحة في صفحة الدفع وارفع صورة إشعار التحويل كإثبات. يقوم فريقنا بمراجعة الإشعار وتفعيل الحساب خلال يوم عمل واحد.",
  help_q_payment_review_time: "كم يستغرق التحقق من عملية الدفع؟",
  help_a_payment_review_time: "تتم مراجعة التحويلات البنكية يدوياً خلال 24 ساعة في أيام العمل. ستتلقى إشعاراً عبر البريد الإلكتروني فور تفعيل اشتراكك.",
  help_q_forgot_password: "نسيت كلمة المرور — ماذا أفعل الآن؟",
  help_a_forgot_password: "اضغط على «نسيت كلمة المرور» في صفحة تسجيل الدخول، وأدخل بريدك الإلكتروني لتلقي رمز التحقق وإعادة تعيين كلمة المرور بكل أمان.",
  help_q_delete_account: "كيف يمكنني حذف حسابي نهائياً؟",
  help_a_delete_account: "توجه إلى ملفك الشخصي وقدم طلب حذف الحساب. يقوم المشرف العام بمراجعة الطلب يدوياً لضمان التعامل السليم مع أي أشجار عائلية مشتركة قبل إتمام الحذف النهائي.",

  // Corrupted strings from previous edits
  preserve_lineage_title: "احفظ نسب عائلتك وتاريخ أجدادك",
  preserve_lineage_desc: "تواصل مع جذورك التونسية، واستكشف سجلات الأنساب التاريخية، وابنِ إرثاً رقمياً مستداماً لأجيال المستقبل.",
  ancestral_stories: "قصص وتراجم الأجداد",
  archive_metadata: "البيانات الوصفية للأرشيف",
  archive_source_placeholder: "مثال: الأرشيف الوطني التونسي، السلسلة التاريخية",
  article_published: "تم نشر المقال بنجاح",
  articles_body_placeholder: "اكتب تفاصيل البحث أو الرواية الشفوية أو الوثيقة التراثية هنا بالتفصيل...",
  articles_loaded: "تم تحميل المقالات بنجاح",
  audio_empty: "لا توجد تسجيلات صوتية متاحة حالياً",
  audio_file_too_large: "حجم الملف الصوتي كبير جداً (الحد الأقصى 25 ميغابايت)",
  audio_intro: "تسجيلات الروايات الشفوية والأهازيج التراثية التونسية الموثقة مع شيوخ العائلات والجهات.",
  audio_library: "مكتبة التسجيلات الصوتية",
  audio_library_title: "التسجيلات الصوتية والتاريخ الشفوي التونسي",
  audio_tap_to_upload: "اضغط هنا لرفع ملف صوتي جديد (MP3, WAV, M4A)",
  auto_saving: "جاري الحفظ التلقائي...",
  back_to: "العودة إلى",
  url_placeholder: "https://example.com/document.pdf",
  person_link_url: "رابط المصدر أو الوثيقة",
  periods_range_colonial: "1881 – 1956 م (حقبة الحماية وبداية سجلات الحالة المدنية)",
  periods_range_early_islamic: "670 – 909 م (الفتح الإسلامي وتأسيس القيروان والدولة الأغلبية)",
  periods_range_fatimid_ayyubid: "909 – 1236 م (المهدية الفاطمية وصنهاجة وبنو هلال)",
  periods_range_Hafsid: "1236 – 1574 م (الدولة الحفصية، قضاء تونس والأحباس الكبرى)",
  periods_range_ottoman_new: "1574 – 1881 م (العهد العثماني والحسيني، سجلات الدفاتر الشرعية والمحاكم)",

  // Missing keys identified in public pages audit
  articles_seo_desc: "اقرأ وشارك نتائج الأبحاث في الأنساب التونسية: الحالة المدنية، السجلات العثمانية، أنساب القيروان، وتاريخ الولايات.",
  article_image: "صورة المقال التراثي",
  oral_histories_eyebrow: "الروايات والتاريخ الشفوي",
  voices_before_they_disappear: "أصوات الذاكرة قبل أن تندثر",
  voices_before_they_disappear_desc: "حوارات، أغاني تراثية، شهادات، وذاكرة اللهجات مسجلة في مختلف ربوع تونس وفي المهجر، مرتبطة بالأسر والأماكن التي توثقها.",
  access_audio_archives: "الوصول إلى أرشيف التسجيلات الصوتية",
  submit_a_recording: "تقديم تسجيل صوتي جديد",
  audio_memory_eyebrow: "الذاكرة الصوتية",
  recorded_testimony_title: "شهادات وروايات شفوية مسجلة من أرجاء تونس",
  recorded_testimony_intro: "كل تسجيل مفهرس ومدقق ومصنف حسب الولاية والحقبة التاريخية، ومربوط بفروع الشجرة العائلية التي يدعمها.",
  pause_audio: "إيقاف مؤقت",
  play_audio: "تشغيل التسجيل الصوتي",
  audio_playing: "قيد التشغيل الآن",
  error_home: "الصفحة الرئيسية",
  retry_connection: "إعادة محاولة الاتصال",
  error_back: "الرجوع للخلف",
  clear: "مسح التصفية",
  manage_upload_photos: "إدارة ورفع الصور والأرشيف",
  places_documents_portraits: "أماكن، وثائق، وبورتريهات عائلية",
  gallery_intro_stored: "الصور محفوظة مع التسميات التوضيحية والتواريخ والأماكن والأسرة أو الوثيقة التي تنتمي إليها.",
  view_high_res: "عرض بدقة عالية",
  archival_image: "صورة أرشيفية",
  location_label: "الموقع:",
  date_label: "التاريخ:",
  edit_in_admin: "تعديل في لوحة الإدارة",
  gallery_articles_seo_title: "مقالات وأبحاث المعرض التراثي — جذور تونس",
  gallery_articles_seo_desc: "شارك قصص العائلات التونسية، المكتشفات الأرشيفية، والصور النادرة مع مجتمع منصة جذور تونس.",
  search_audio_placeholder: "ابحث عن تسجيل صوتي، راوٍ، أو ولاية…",
  search_docs_placeholder: "ابحث في الوثائق، الصكوك، والمراسيم البايليّة…",
  governorate_label: "الولاية:",
  category_label: "التصنيف:",
  year_label: "السنة / الحقبة:",
  photographer_label: "المصدر / المصور:",
  search_images_placeholder: "ابحث عن صورة، معلم، أو ولاية…",
  search_trees_placeholder: "ابحث عن شجرة عائلة، لقب، أو باحث…",
  search_books_placeholder: "ابحث في المخطوطات والكتب وسجلات المحاكم الشرعية…",
  source_label: "المصدر الأرشيفي:",
  view_manuscript: "الاطلاع على السجل المرقمن",
  request_full_pdf: "طلب نسخة كاملة PDF",
  close: "إغلاق",
  download_profile_extract: "تحميل البطاقة / المستخرج",
  download_or_request_gedcom: "تحميل / طلب ملف GEDCOM",
  close_card: "إغلاق البطاقة",
  tree_graph_schema: "المخطط البياني التفاعلي للشجرة",
  file_and_gedcom: "البطاقة التوثيقية و GEDCOM",
  interactive_tree_schema_hint: "مخطط شجري تفاعلي (استخدم عجلة الفأرة للتكبير والتصغير، والسحب للتحريك)",
  loading_gedcom: "جاري تحميل بيانات GEDCOM...",
  linked_cards: "بطاقات نسب مرتبطة",
  request_archive_access: "طلب الوصول إلى الأرشيف",
  placeholder_archive_reason: "وضح سبب بحثك الجينالوجي والغرض منه...",
  submit_access_request: "إرسال طلب الوصول",
  no_trees_yet_title: "لا توجد أشجار عائلية منشورة حالياً",
  no_trees_yet_desc: "أنشئ واحفظ أشجارك العائلية في محرر الأشجار؛ وستظهر تلقائياً هنا مع بطاقات النسب التفاعلية.",
  open_tree_builder: "فتح محرر الأشجار (Tree Builder)",
  generations_label: "الأجيال:",
  individuals_label: "الأفراد:",
  by_author: "مقدمة من طرف",
  recently_updated: "تم التحديث مؤخراً",
  explore_family_card: "استكشاف بطاقة العائلة",
  gedcom_standard: "معيار GEDCOM 5.5.1 UTF-8",

  // Research page
  research_seo_title: "البحث الأرشيفي الشامل — جذور تونس",
  research_seo_desc: "ابحث في جميع المخطوطات التونسية المرقمنة، سجلات الحالة المدنية، وأشجار العائلات التوثيقية.",
  universal_research: "البحث الشامل",
  search_across_archives: "ابحث عبر خزائن الأرشيف التونسي",
  research_subtitle: "ابحث في أسماء العائلات، القبائل، مواطن الأجداد، الكتب المرقمنة، مستخرجات الحالة المدنية وفهارس التاريخ الشفوي.",
  research_input_placeholder: "ابحث عن اسم عائلة، قبيلة، أرشيف أو ولاية…",
  no_matching_trees: "لم يتم العثور على أشجار عائلية مطابقة لبحثك.",
  digitized_books_docs: "الكتب والوثائق المرقمنة",
  no_matching_books: "لم يتم العثور على وثائق مكتبية مطابقة لبحثك.",
  consult_document: "الاطلاع على الوثيقة",
  pedigree_load_failed: "تعذر تحميل بيانات شجرة النسب.",

  // Periods page
  periods_hero_title: "أي السجلات تنتمي إلى أي حقبة تاريخية؟",
  periods_hero_subtitle: "ثلاثة آلاف سنة من تاريخ تونس، نقرأها من خلال الوثائق التي أنتجها كل عصر — وما يمكن للباحث في الأنساب أن يجده واقعياً.",
  browse_sources: "تصفح المصادر والأرصدة",
  explore_family_trees: "استكشف أشجار العائلات",
  nine_periods_eyebrow: "تسع حقب تاريخية",
  nine_periods_title: "من قرطاج إلى تونس المعاصرة",
  nine_periods_intro: "استكشف كل حقبة تاريخية لفهم كيف شكّلت التحولات الإدارية والأنظمة القانونية بقاء السجلات التوثيقية للأنساب.",
  primary_records_docs: "السجلات والوثائق الأساسية",
  genealogical_value_survival: "القيمة التوثيقية ومدى حفظ السجلات",
  fonds_available_archives: "الأرصدة المتوفرة في الأرشيف الوطني والخزائن الجهوية",
  consult_sources_era: "الاطلاع على مصادر هذه الحقبة",

  // Sources and Archives page
  sources_and_archives_nav: "المصادر والأرشيفات",
  tunisian_sources_repositories: "المصادر والخزائن الأرشيفية التونسية",
  tunisian_sources_repositories_desc: "تسع عائلات من المصادر التوثيقية الحاملة للأنساب التونسية، مع ما تثبته كل عائلة ومقرات حفظها ودليل الأرشيفات الحافظة لها.",
  see_the_timeline: "عرض الخط الزمني للحقب",
  evidence_eyebrow: "الأدلة والتوثيق",
  know_what_document_proves: "اعرف ما يمكن للوثيقة إثباته قبل الاستشهاد بها",
  know_what_document_proves_intro: "تسجل منصة جذور تونس كل شجرة مع عائلة مصدرها، ومؤسسة حفظها، والرمز الأرشيفي للوثيقة، لتبقى شجرتك موثقة بدقة.",
  repository_label: "مقر الحفظ والأرشيف",
  genealogical_proof_label: "الإثبات الجينيالوجي",
  directory: "دليل الخزائن",
  ten_institutions_title: "عشر مؤسسات وطنية لبدء بحثك التوثيقي",
  ten_institutions_intro: "تسرد كل بطاقة المدينة والسلاسل الأرشيفية الأكثر فائدة للباحثين في الأنساب، من دفاتر البايات إلى سجلات المحاكم.",

  // Library page
  genealogy_library_title: "مكتبة الأنساب التونسية الرقمية",
  genealogy_library_subtitle: "كتب ومخطوطات ومستخرجات حالة مدنية وسجلات محاكم وصكوك وخرائط مرقمنة — مصنفة ليحمل كل ادعاء في شجرتك توثيقه الأرشيفي.",
  get_full_access: "الحصول على وصول كامل",
  browse_archive_sources: "تصفح مصادر الأرشيف",
  search_library_placeholder: "ابحث في المخطوطات والكتب وسجلات الحالة المدنية أو أسماء المؤلفين…",
  digitized_documents_archive: "الوثائق المرقمنة في الأرشيف",
  default_library_desc: "مجلد مرجعي تاريخي ووثيقة أرشيفية تونسية مرقمنة.",
  consult_volume: "تصفح المجلد",
  collections: "المجموعات التوثيقية",
  nine_core_collections: "تسع مجموعات أساسية للبحث في الأنساب التونسية",
  nine_core_collections_intro: "كل مجموعة مفهرسة ومصنفة حسب الولاية والحقبة ونوع الوثيقة، مع إرشادات حول ما تثبته الوثيقة بدقة.",
  view_guide: "عرض الدليل التوجيهي ←",

  // Subscriptions page
  subscriptions_hero_title: "اشتراكات تناسب كل باحث في الأنساب التونسية",
  subscriptions_hero_subtitle: "ابدأ مجاناً مع شجرة عائلتك، ثم افتح فهرس الأرشيف التونسي الكامل وأدوات التوثيق وتصدير GEDCOM كلما تعمق بحثك.",
  get_started_for_free: "ابدأ مجاناً الآن",
  pricing_eyebrow: "الباقات والأسعار",
  three_plans_title: "ثلاث باقات بأسعار شفافة بالدينار التونسي",
  three_plans_intro: "تشمل جميع الباقات استضافة آمنة للبيانات، حماية الخصوصية طبقاً للقوانين التونسية، والمساهمة في مجتمع الباحثين.",

  // Payment & Refund
  tnd_ttc: "د.ت (شامل الأداءات)",
  placeholder_bank_tx_id: "رقم الحوالة البنكية أو الرمز المرجعي للتحويل",
  placeholder_additional_notes: "أي تعليمات خاصة بالبحث أو الفاتورة…",
  refund_eyebrow: "سياسة الاسترداد",
  refund_title: "سياسة الاسترداد وضمان الخدمة العادلة",
  refund_subtitle: "نلتزم بالشفافية الكاملة وحماية حقوق المستهلك التونسي وفقاً للتشريعات القانونية المعمول بها.",
  refund_section_4_p1: "يمكنك طلب استرداد الرسوم المدفوعة خلال 14 يوماً من تاريخ الاشتراك إذا لم يتم تفعيل الميزات أو واجهت مشكلة تقنية مستمرة.",

  // Unsubscribe page
  unsubscribe_seo_title: "إلغاء الاشتراك في النشرة البريدية — جذور تونس",
  unsubscribe_seo_desc: "إدارة تفضيلات المراسلات وإلغاء الاشتراك في التحديثات الأرشيفية والتسويقية لمنصة جذور تونس.",
  email_preferences: "تفضيلات البريد الإلكتروني",
  unsubscribed_success_title: "تم إلغاء اشتراكك بنجاح",
  unsubscribed_success_message: "تم تحديث تفضيلاتك بنجاح ولن تتلقى رسائل النشرة البريدية بعد الآن.",
  unsubscribe_intro_message: "يؤسفنا مغادرتك. أدخل بريدك الإلكتروني أدناه لإلغاء الاشتراك في التحديثات الأرشيفية وإعلانات المجموعات الجديدة.",
  important_note: "ملاحظة هامة:",
  unsubscribe_legal_disclaimer: "إذا كان لديك حساب نشط في منصة جذور تونس، فقد تظل تتلقى رسائل المعاملات الأساسية (مثل إعادة تعيين كلمة المرور والإشعارات الأمنية) وفقاً للقانون.",
  return_to_home: "العودة إلى الصفحة الرئيسية",
  processing_unsubscription: "جاري إلغاء الاشتراك…",
  confirm_unsubscribe: "تأكيد إلغاء الاشتراك",
  back_to_roots_tunisia: "العودة إلى جذور تونس",
  provide_valid_email: "يرجى إدخال عنوان بريد إلكتروني صالح.",
  unsubscribe_process_failed: "فشل إرسال طلب إلغاء الاشتراك. يرجى المحاولة مرة أخرى.",
  unsubscribe_error_generic: "حدث خطأ غير متوقع. يرجى المحاولة لاحقاً أو الاتصال بالدعم الفني.",

  // Tree Card & Hero
  heritage_research: "أبحاث الأنساب والتراث",
  tree_default_summary: "شجرة عائلية موثقة ومؤرشفة رقمياً.",
  family_and_lineage: "العائلة والنسب",
  standard_gedcom: "معيار GEDCOM 5.5.1 UTF-8",
  show_3d_card_gedcom: "عرض البطاقة ثلاثية الأبعاد و GEDCOM",
  genealogical_trees_eyebrow: "الأشجار الجينيالوجية",
  featured_trees_title: "أشجار العائلات التونسية البارزة",
  featured_trees_intro: "استكشف أشجار الأنساب التونسية الموثقة بمراجع أرشيفية ووثائق تاريخية وتنسيق GEDCOM المعتمد.",
  no_published_trees: "لا توجد أشجار عائلية منشورة حالياً. أنشئ شجرتك الأولى في أداة بناء الأشجار!",
  browse_all_family_trees: "تصفح جميع الأشجار العائلية",
  personalities_lineages: "شخصيات ورجالات تونسية",
  individuals_and_registers: "الأفراد وسجلات الأنساب",
  individuals_registers_intro: "استكشف السجلات والوثائق الجينيالوجية للأجداد والعلماء والتجار والوجهاء في الأرشيف التونسي.",
  view_plans_tiers: "عرض الخطط والاشتراكات",
  official_archives_intro: "أهم المجموعات المؤسسية الحافظة للسجلات الجينيالوجية والإدارية للعائلات التونسية.",
  view_archive_guide: "عرض دليل الأرشيف التونسي",

  // Category & Filter keys for Gallery pages
  cat_all: "الكل",
  cat_chronicles: "سجلات تاريخية",
  cat_sijillat: "سجلات قانونية ومحاكم شرعية",
  cat_genealogy_habous: "أنساب وأحباس",
  cat_manuscripts: "مخطوطات نادرة",
  doc_beylical_decree: "مرسوم بايلي",
  doc_habous_property: "حبس وأملاك",
  doc_etat_civil: "حالة مدنية",
  doc_waqf_education: "وقف وتعليم",
  img_cat_landmarks: "معالم وعمارة",
  img_cat_historic: "معالم تاريخية",
  img_cat_portraits: "بورتريهات عائلية",
  img_cat_regional: "تراث جهوي",
  img_cat_ancient: "تراث قديم",
  gov_all: "الكل",
  gov_tunis: "تونس",
  gov_sfax: "صفاقس",
  gov_mahdia: "المهدية",
  gov_kairouan: "القيروان",
  gov_sousse: "سوسة",
  gov_djerba: "جربة",
  gov_bizerte: "بنزرت"
};

// Apply cleanReplacements to ar.json
let updatedCount = 0;
for (const [k, v] of Object.entries(cleanReplacements)) {
  if (ar[k] !== v) {
    ar[k] = v;
    updatedCount++;
  }
}

// 2. Also ensure all newly added keys in home.tsx, periods.tsx, SourcesAndArchives.tsx, library.tsx, audio.tsx, subscriptions.tsx exist in ar.json
const pageKeysToAdd = {
  // home.tsx tool cards
  tool_explore_archives_title: "استكشف الأرشيف الوطني",
  tool_explore_archives_body: "ابحث في سجلات المحاكم الشرعية ودفاتر البايات ومستخرجات الحالة المدنية من 24 ولاية تونسية.",
  tool_build_family_tree_title: "ابنِ شجرة عائلتك",
  tool_build_family_tree_body: "أنشئ وصدّر واستورد أشجار نسبك بصيغة GEDCOM 5.5.1 القياسية مع حفظ دقيق لبيانات أجدادك.",
  tool_consult_sources_title: "راجع وثائق الأنساب",
  tool_consult_sources_body: "اطلع على حجج الأحباس، دفاتر المجبى، وعقود التركات الموثقة في خزائن الأرشيف التونسي.",
  tool_oral_memories_title: "استمع للذاكرة الشفوية",
  tool_oral_memories_body: "تسجيلات صوتية وشهادات لأهالي تونس توثق الروايات والأنساب واللهجات عبر الأجيال.",

  // home.tsx timeline
  timeline_punic_era: "العهد البونيقي القرطاجي",
  timeline_punic_desc: "النقائش النذرية الفينيقية وشواهد القبور وحفريات هضبة بيرصا بقرطاج.",
  timeline_punic_years: "814 – 146 ق.م",
  timeline_roman_era: "أفريقيا البروقنصلية الرومانية",
  timeline_roman_desc: "النقائش اللاتينية، فسيفساء الجم، ومسوح الأراضي الفلاحية الرومانية بإقليم أفريكا.",
  timeline_roman_years: "146 ق.م – 439 م",
  timeline_vandal_byzantine_era: "العهد الوندالي والبيزنطي",
  timeline_vandal_byzantine_desc: "النقائش المسيحية، التحصينات البيزنطية، وقوائم الأساقفة برقعة البلاد التونسية.",
  timeline_vandal_byzantine_years: "439 – 698 م",
  timeline_early_islamic_era: "الفتح الإسلامي والدولة الأغلبية",
  timeline_early_islamic_desc: "تأسيس القيروان، مساجد الزيتونة، وسجلات الأنساب العربية والبربرية الأولى.",
  timeline_early_islamic_years: "670 – 909 م",
  timeline_fatimid_zirid_era: "العهد الفاطمي والصنهاجي",
  timeline_fatimid_zirid_desc: "تأسيس المهدية، هجرة القبائل الهلالية، وتدوين الأنساب البدوية والحضرية بالبلاد.",
  timeline_fatimid_zirid_years: "909 – 1159 م",
  timeline_almohad_hafsid_era: "العهد الموحدي والدولة الحفصية",
  timeline_almohad_hafsid_desc: "قضاء تونس، تأسيس الأحباس العائلية الكبرى، وتوثيق الأسر الأندلسية المهاجرة.",
  timeline_almohad_hafsid_years: "1159 – 1574 م",
  timeline_ottoman_muradid_era: "العهد العثماني والمرادي",
  timeline_ottoman_muradid_desc: "سجلات الدفاتر الشرعية العثمانية، حامية الانكشارية، وصكوك الأوقاف المرقمنة.",
  timeline_ottoman_muradid_years: "1574 – 1705 م",
  timeline_husainid_era: "الدولة الحسينية وعهد الأمان",
  timeline_husainid_desc: "دفاتر البايات، سجلات المجبى الجبائية، وفرمانات قصر باردو المودعة بالأرشيف الوطني.",
  timeline_husainid_years: "1705 – 1881 م",
  timeline_modern_republican_era: "الحماية التونسية والجمهورية",
  timeline_modern_republican_desc: "دفاتر الحالة المدنية الحديثة (منذ 1886)، سجلات بطاقات التعريف، والأرشيف المعاصر.",
  timeline_modern_republican_years: "1881 م – الحاضر",

  // home.tsx library sources & archives
  lib_source_charaïque: "سجلات المحاكم الشرعية بتونس وصفاقس (1750 – 1881 م)",
  lib_source_habous: "دفاتر جمعية الأوقاف وحجج الأحباس العائلية (1874 – 1957 م)",
  lib_source_etat_civil: "دفاتر الحالة المدنية التونسية والبلديات (منذ 1886 م)",
  lib_source_beylical: "أوامر وفرمانات البايات بمراسيم وسجلات دار الباي",
  archive_national: "الأرشيف الوطني التونسي (نهج المنزه، تونس)",
  archive_bnt: "المكتبة الوطنية التونسية (مخطوطات الزيتونة والقيروان)",
  archive_habous: "إدارة الأرشيف والوثائق بوزارة الشؤون الدينية والعدل",
  archive_anom: "أرشيف ما وراء البحار وسجلات الحالة المدنية المشتركة",

  // periods.tsx keys
  period_punic_era: "العهد البونيقي الفينيقي",
  period_punic_years: "814 – 146 ق.م",
  period_punic_records: "نقائش نذرية فينيقية وبونية، شواهد توفات قرطاج وحضرموت وسيكا.",
  period_punic_note: "تاريخ عريق يوثق أقدم الطبقات الإسمية والجغرافية للبحر الأبيض المتوسط بتونس.",

  period_roman_era: "أفريقيا البروقنصلية الرومانية",
  period_roman_years: "146 ق.م – 439 م",
  period_roman_records: "شواهد القبور اللاتينية، إحصاءات الأراضي الفلاحية، نقائش مسرح الجم ودقة وسبيطلة.",
  period_roman_note: "أكثر من 30 ألف نقيشة لاتينية موثقة تبين أسماء العائلات والمواطنين الرومان والأفارقة.",

  period_vandal_era: "العهد الوندالي والبيزنطي",
  period_vandal_years: "439 – 698 م",
  period_vandal_records: "سجلات المجامع الكنسية، نقائش الحصون البيزنطية، وقوائم قادة الجند.",
  period_vandal_note: "توثق مرحلة انتقالية كبرى في التسميات والتحصينات العسكرية الإقليمية.",

  period_early_islamic: "الفتح الإسلامي والدولة الأغلبية",
  period_early_islamic_years: "670 – 909 م",
  period_early_islamic_records: "تراجم علماء القيروان، مساجد الزيتونة، وسجلات الأنساب القيروانية المبكرة.",
  period_early_islamic_note: "تأسيس أولى طبقات الأنساب العربية والأمازيغية الإسلامية المكتوبة بإفريقية.",

  period_fatimid_era: "العهد الفاطمي والصنهاجي",
  period_fatimid_years: "909 – 1159 م",
  period_fatimid_records: "وثائق المهدية وقصور صبرة المنصورية، وسجلات القبائل الهلالية والمغاربية.",
  period_fatimid_note: "حقبة مفصلية شهدت استقرار القبائل في السهول والسباسب والوسط التونسي.",

  period_hafsid_era: "الدولة الحفصية وقضاء تونس",
  period_hafsid_years: "1236 – 1574 م",
  period_hafsid_records: "دفاتر قضاء تونس، حجج أوقاف الزيتونة، وسجلات هجرة ونسب الأسر الأندلسية.",
  period_hafsid_note: "العمود الفقري للأنساب الحضرية والأندلسية الموثقة في تونس والمهدية وتستور ونابل.",

  period_ottoman_era: "العهد العثماني وبكوات المراديين",
  period_ottoman_years: "1574 – 1705 م",
  period_ottoman_records: "الدفاتر القضائية بالمحاكم الشرعية، قيود الصبايحية والإنكشارية، وأوقاف المدن.",
  period_ottoman_note: "سجلات مكتوبة بالعربية والعثمانية توثق النسيج الاجتماعي للمدن التونسية.",

  period_husainid_era: "الدولة الحسينية وعهد الأمان",
  period_husainid_years: "1705 – 1881 م",
  period_husainid_records: "دفاتر البايات، سجلات المجبى الجبائية، حجج الأحباس، وتركات أعيان الولايات.",
  period_husainid_note: "أغنى رصيد وثائقي للأنساب التونسية محفوظ بالأرشيف الوطني التونسي.",

  period_modern_era: "الحماية الفرنسية والجمهورية الحديثة",
  period_modern_years: "1881 م – الحاضر",
  period_modern_records: "سجلات الحالة المدنية (منذ 1886)، المسح العقاري، وسجلات الهوية الوطنية.",
  period_modern_note: "السلسلة الحديثة التي تربط الأسر الحالية بسلاسل أجدادها السابقة في 24 ولاية.",

  // SourcesAndArchives.tsx source keys
  src_national_archives_title: "الأرشيف الوطني التونسي",
  src_national_archives_period: "العهد العثماني، الحسيني، وسجلات الحماية (1705 – 1956 م)",
  src_national_archives_holds: "سلاسل دار الباي، دفاتر المجبى، أحكام المحاكم الشرعية، ومراسيم البايات.",
  src_national_archives_proves: "إثبات الأنساب المتسلسلة، الملكيات العائلية، وتاريخ التعيينات والوجهاء.",

  src_sijillat_title: "سجلات المحاكم الشرعية",
  src_sijillat_period: "1650 – 1957 م",
  src_sijillat_holds: "عقود الزواج، وثائق الطلاق، حصر التركات، وتصفية المواريث الشرعية.",
  src_sijillat_proves: "تحديد دقيق لأسماء الأزواج والآباء والأجداد وفروع العائلة وأملاكهم.",

  src_habous_title: "دفاتر حجج الأحباس والأوقاف",
  src_habous_period: "العهد الحفصي إلى 1957 م",
  src_habous_holds: "صكوك تحبيس الأراضي والعقارات والغابات والمنازل لفائدة الذرية والعلماء.",
  src_habous_proves: "شجرات نسب متسلسلة لأجيال متعددة مذكورة حرفياً في شروط الواقفين.",

  src_etat_civil_title: "دفاتر وسجلات الحالة المدنية",
  src_etat_civil_period: "منذ 1886 م إلى العهد الحاضر",
  src_etat_civil_holds: "مستخرجات الولادة، عقود الزواج المدني، وشهادات الوفاة بجميع بلديات تونس.",
  src_etat_civil_proves: "حلقة الوصل القانونية المباشرة بين الأفراد المعاصرين وآبائهم وأجدادهم.",

  src_kairouan_nasab_title: "مخطوطات وأنساب القيروان",
  src_kairouan_nasab_period: "القرن الثامن إلى التاسع عشر الميلادي",
  src_kairouan_nasab_holds: "تراجم الفقهاء، كتب الأنساب القيروانية، ووثائق جامع عقبة بن نافع.",
  src_kairouan_nasab_proves: "أصول وسلاسل نسب عائلات القيروان والساحل والوسط التونسي.",

  src_andalusian_deeds_title: "حجج وأنساب الأندلسيين بتونس",
  src_andalusian_deeds_period: "1609 – 1900 م",
  src_andalusian_deeds_holds: "وثائق استقرار العائلات الأندلسية في تستور وزغوان وسليمان ورأس الجبل.",
  src_andalusian_deeds_proves: "الألقاب الأندلسية، شجرات العائلات المهاجرة، وملكيات الأراضي السقوية.",

  src_tribal_majba_title: "دفاتر المجبى وسجلات القبائل",
  src_tribal_majba_period: "1860 – 1910 م",
  src_tribal_majba_holds: "قوائم دافعي الضرائب والقبائل والأعراش في الشمال الغربي والوسط والجنوب.",
  src_tribal_majba_proves: "ربط الألقاب والعائلات بفروع الأعراش وشيوخ القبائل والمناطق الجغرافية.",

  src_djerba_ibadi_title: "وثائق وأوقاف جربة التاريخية",
  src_djerba_ibadi_period: "القرن السادس عشر إلى العصر الحديث",
  src_djerba_ibadi_holds: "عقود الجوامع، دفاتر الأوقاف العائلية، وسجلات تجارة القوافل والبحر.",
  src_djerba_ibadi_proves: "أنساب العائلات الجربية، عمارة المنازل والمنازل الحصينة وفروع النسب.",

  src_oral_archives_title: "أرشيف التسجيلات والرواية الشفوية",
  src_oral_archives_period: "القرن العشرون – الحاضر",
  src_oral_archives_holds: "تسجيلات صوتية ومقابلات مع شيوخ العائلات حول الذاكرة والهجرة والمصاهرات.",
  src_oral_archives_proves: "توثيق التقاليد العائلية غير المكتوبة وتأكيد الروايات المتواترة.",

  // SourcesAndArchives.tsx institutions
  inst_archives_nationales_name: "الأرشيف الوطني التونسي",
  inst_archives_nationales_city: "تونس العاصمة",
  inst_archives_nationales_holdings: "سلاسل دار الباي، سجلات المحاكم الشرعية، دفاتر المجبى، ووثائق الحماية.",

  inst_bnt_name: "المكتبة الوطنية التونسية",
  inst_bnt_city: "تونس العاصمة",
  inst_bnt_holdings: "المخطوطات النادرة، كتب التراجم، الصحف التاريخية التونسية، وفهارس الأنساب.",

  inst_habous_archives_name: "أرشيف جمعية الأوقاف (وزارة العدل)",
  inst_habous_archives_city: "تونس العاصمة",
  inst_habous_archives_holdings: "حجج الأحباس العائلية والعمومية لجميع جهات البلاد التونسية.",

  inst_sfax_archives_name: "أرشيف بلدية صفاقس وسجلاتها الشرعية",
  inst_sfax_archives_city: "صفاقس",
  inst_sfax_archives_holdings: "سجلات قضاء صفاقس، عقود غابات الزيتون، ودفاتر الحالة المدنية الأولى.",

  inst_kairouan_center_name: "مركز المخطوطات والوثائق بالقيروان",
  inst_kairouan_center_city: "القيروان",
  inst_kairouan_center_holdings: "أرشيف رقوق جامع عقبة، سجلات أوقاف الزوايا والعلماء، وأنساب الساحل.",

  inst_sousse_archives_name: "خزانة وثائق ولاية سوسة والساحل",
  inst_sousse_archives_city: "سوسة",
  inst_sousse_archives_holdings: "سجلات أعيان الساحل، عقود الملكيات الفلاحية والبحرية، وحجج الأنساب.",

  inst_djerba_archives_name: "أرشيف التراث الثقافي بجربة",
  inst_djerba_archives_city: "حومة السوق، جربة",
  inst_djerba_archives_holdings: "سجلات المساجد، وثائق التجارة البحرية، ودفاتر أوقاف العائلات الجربية.",

  inst_testour_andalusian_name: "مركز الذاكرة والتراث الأندلسي بتستور",
  inst_testour_andalusian_city: "تستور، باجة",
  inst_testour_andalusian_holdings: "وثائق العائلات الأندلسية، صكوك المزارع والمياه، وسجلات الهجرة.",

  inst_bizerte_marine_name: "أرشيف بلدية بنزرت وسجلاتها البحرية",
  inst_bizerte_marine_city: "بنزرت",
  inst_bizerte_marine_holdings: "سجلات الملاحة البحرية، دفاتر الحالة المدنية المبكرة، وصكوك العقارات.",

  inst_anom_france_name: "أرشيف ما وراء البحار (ANOM)",
  inst_anom_france_city: "إيكس أون بروفانس / فرنسا",
  inst_anom_france_holdings: "سجلات الحالة المدنية المشتركة، دفاتر الموظفين، والخرائط الطبوغرافية لتونس.",

  // library.tsx collections
  lib_col_beylical_sijillat: "سجلات دفاتر البايات والمحاكم الشرعية",
  lib_col_beylical_sijillat_body: "أحكام القضاء الشرعي، عقود الزواج، وحصر التركات بمدينة تونس وصفاقس.",
  lib_col_beylical_sijillat_count: "3,400+ سجل مرقمن",

  lib_col_habous_deeds: "حجج الأحباس والأوقاف العائلية",
  lib_col_habous_deeds_body: "صكوك الوقف الذري والمشترك على العقارات وغابات الزيتون والدور بالمدن العتيقة.",
  lib_col_habous_deeds_count: "5,800+ صك ووثيقة",

  lib_col_civil_registers: "سجلات ومستخرجات الحالة المدنية",
  lib_col_civil_registers_body: "دفاتر المواليد والوفيات والزيجات المقيدة ببلديات تونس منذ 1886.",
  lib_col_civil_registers_count: "12,000+ مستخرج مفهرس",

  lib_col_kairouan_manuscripts: "مخطوطات وفهارس أنساب القيروان",
  lib_col_kairouan_manuscripts_body: "كتب الأنساب، تراجم الفقهاء والصلحاء، وأوقاف جامع عقبة بن نافع.",
  lib_col_kairouan_manuscripts_count: "850+ مخطوطة نادرة",

  lib_col_andalusian_heritage: "أرشيف الأسر والبلدات الأندلسية",
  lib_col_andalusian_heritage_body: "وثائق نسب وأملاك العائلات الأندلسية بتستور وزغوان وسليمان والمهدية.",
  lib_col_andalusian_heritage_count: "1,200+ وثيقة وصك",

  lib_col_majba_tax_rolls: "دفاتر المجبى وإحصاءات السكان والقبائل",
  lib_col_majba_tax_rolls_body: "سجلات المكلفين بالضريبة والقبائل والأعراش بمختلف جهات الإيالة التونسية.",
  lib_col_majba_tax_rolls_count: "2,100+ دفتر وإحصاء",

  lib_col_djerba_island_records: "سجلات وأوقاف جزيرة جربة",
  lib_col_djerba_island_records_body: "صكوك المساجد والمنازل والآبار وتجارة القوافل بالجنوب التونسي.",
  lib_col_djerba_island_records_count: "950+ وثيقة محفوظة",

  lib_col_historical_maps: "الخرائط والمسوح الطبوغرافية التاريخية",
  lib_col_historical_maps_body: "خرائط الأراضي الفلاحية والتقسيمات القبلية والمدن التونسية العتيقة.",
  lib_col_historical_maps_count: "450+ خريطة مرقمنة",

  lib_col_oral_transcripts: "نصوص وتفريغ التسجيلات الشفوية",
  lib_col_oral_transcripts_body: "تفريغ مدقق لحوارات كبار السن حول أنساب الأسر وألقابها في 24 ولاية.",
  lib_col_oral_transcripts_count: "600+ تسجيل ومقابلة",

  // audio.tsx recordings
  audio_rec_testour_title: "مالوف تستور وسلاسل الأنساب الأندلسية",
  audio_rec_testour_place: "تستور، باجة",
  audio_rec_testour_body: "شهادة شفوية مسجلة سنة 1968 توثق أصول العائلات الأندلسية وأهازيج المالوف المتوارثة.",

  audio_rec_sfax_title: "ذاكرة تجارة صفاقس ودفاتر المجبى (1881 م)",
  audio_rec_sfax_place: "صفاقس المدينة",
  audio_rec_sfax_body: "حوار مع شيوخ البحارة والتجار حول دفاتر الجباية البايليّة وطرق الملاحة الساحلية.",

  audio_rec_djerba_title: "لهجة جربة وأوقاف العائلات البحرية",
  audio_rec_djerba_place: "حومة السوق، جربة",
  audio_rec_djerba_body: "تسجيل صوتي يوثق مصطلحات الأحباس الجربية القديمة ومسارات قوافل الجنوب.",

  audio_rec_kairouan_title: "روايات حلقات جامع عقبة وزوايا القيروان",
  audio_rec_kairouan_place: "القيروان العتيقة",
  audio_rec_kairouan_body: "شهادات كبار السن حول سلاسل نسب المدرسين والطلبة ومجاوري الحرم القيرواني.",

  // subscriptions.tsx plans & features
  plan_basic_name: "الباقة الأساسية",
  plan_basic_price: "مجاناً",
  plan_basic_period: "مدى الحياة",
  plan_basic_tagline: "مثالية للمبتدئين في استكشاف شجرة عائلتهم وتوثيق الأجيال الأولى.",
  plan_basic_cta: "ابدأ مجاناً الآن",

  plan_pro_name: "باقة الباحث المعتمد",
  plan_pro_price: "29 د.ت",
  plan_pro_period: "شهرياً",
  plan_pro_tagline: "للراغبين في الوصول الكامل إلى فهارس الأرشيف والوثائق المرقمنة.",
  plan_pro_cta: "اشترك في باقة الباحث",

  plan_family_name: "باقة مؤرخ العائلة",
  plan_family_price: "199 د.ت",
  plan_family_period: "سنوياً",
  plan_family_tagline: "أفضل قيمة لحفظ الأنساب الممتدة ومشاركة الأبحاث والتحميل غير المحدود.",
  plan_family_cta: "اختر الباقة السنوية",

  feat_unlimited_trees: "أشجار عائلية غير محدودة وبطاقات نسب تفاعلية",
  feat_gedcom_export: "تصدير واستيراد ملفات GEDCOM 5.5.1 و 7.0 القياسية",
  feat_full_archive_access: "وصول كامل لفهارس الأرشيف الوطني ودفاتر المحاكم",
  feat_high_res_downloads: "تحميل صور الوثائق والمخطوطات بدقة فائقة HD",
  feat_citation_tools: "أدوات توثيق المصادر والرموز الأرشيفية المعتمدة",
  feat_priority_support: "دعم مخصص من باحثي منصة جذور تونس في قراءة المخطوطات",
  feat_collaborative_trees: "مشاركة الشجرة مع أفراد العائلة بصلاحيات متعددة",
  feat_dna_notes: "تسجيل الملاحظات الجينية وحفظ الوثائق الصوتية والشفوية",
  feat_commercial_license: "شهادة توثيق نسب رقمية معتمدة قابلة للطباعة",
  feat_basic_tree: "شجرة عائلة واحدة حتى 50 فرداً",
  feat_basic_search: "بحث أساسي في أسماء الولايات والألقاب التونسية",
  feat_read_only_archive: "تصفح مقتطفات الأرشيف العام للقراءة فقط"
};

for (const [k, v] of Object.entries(pageKeysToAdd)) {
  if (!ar[k] || ar[k].startsWith('عنصر') || /[a-zA-Z]{3,}/.test(ar[k])) {
    ar[k] = v;
    updatedCount++;
  }
}

// Write back to ar.json
fs.writeFileSync(arPath, JSON.stringify(ar, null, 2), 'utf8');
console.log(`Successfully updated and enriched ar.json with ${updatedCount} clean translations.`);

// Synchronize keys to en.json and fr.json if missing
let enAdded = 0;
for (const [k, v] of Object.entries(cleanReplacements)) {
  if (!en[k]) {
    en[k] = k.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    enAdded++;
  }
  if (!fr[k]) {
    fr[k] = en[k];
  }
}
fs.writeFileSync(enPath, JSON.stringify(en, null, 2), 'utf8');
fs.writeFileSync(frPath, JSON.stringify(fr, null, 2), 'utf8');
console.log(`Synced missing keys to en.json and fr.json.`);
