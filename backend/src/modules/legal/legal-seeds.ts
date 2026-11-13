import { LEGAL_LOCALES, LEGAL_SLUGS } from './dto/legal.dto';

export type LegalSectionSeed = { heading: string; body: string };
export type SeedLegalDocument = { title: string; intro: string; sections: LegalSectionSeed[] };
export type LegalLocale = (typeof LEGAL_LOCALES)[number];
export type LegalSlug = (typeof LEGAL_SLUGS)[number];

const EN_SEEDS: Record<LegalSlug, SeedLegalDocument> = {
  terms: {
    title: 'Terms of Service',
    intro:
      'These Terms of Service ("Terms") govern your access to and use of Roots Tunisia. By creating an account or using our services, you agree to these Terms.',
    sections: [
      {
        heading: '1. Acceptance of Terms',
        body: 'By accessing or using Roots Tunisia, you confirm that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree, please discontinue use of the service.',
      },
      {
        heading: '2. Eligibility & Accounts',
        body: 'You must be at least 16 years old to create an account. You are responsible for maintaining the confidentiality of your credentials and for all activity that occurs under your account. Notify us immediately of any unauthorized use.',
      },
      {
        heading: '3. User-Generated Content & Intellectual Property',
        body: 'You retain ownership of family trees, documents, photographs, and narratives you upload. By submitting content, you grant Roots Tunisia a limited, non-exclusive license to host, display, and process that content solely to provide the service to you and, where you choose to share it, to other users you designate.',
      },
      {
        heading: '4. Acceptable Use',
        body: 'You agree not to upload unlawful, infringing, or harmful content, misrepresent your identity, attempt to breach system security, or use the service to harass or defame others. We may suspend or terminate accounts that violate this policy.',
      },
      {
        heading: '5. Subscriptions & Payments',
        body: 'Certain features may require a paid subscription. Fees, billing cycles, and cancellation terms are disclosed at the point of purchase. Except where required by EU consumer-protection law (which grants a statutory withdrawal period for online purchases) or other applicable law, fees are non-refundable once a billing period has started.',
      },
      {
        heading: '6. Accuracy of Genealogical Information',
        body: 'Roots Tunisia provides research tools and archival access but cannot guarantee the completeness or accuracy of user-submitted data, third-party archives, or historical records. Genealogical conclusions are provided for informational purposes only.',
      },
      {
        heading: '7. Limitation of Liability',
        body: 'To the maximum extent permitted by law, Roots Tunisia and its affiliates are not liable for indirect, incidental, or consequential damages arising from your use of the service. Nothing in these Terms limits liability that cannot be excluded under applicable law, including certain consumer protections in the EU/EEA and US states.',
      },
      {
        heading: '8. Indemnification',
        body: 'You agree to indemnify and hold Roots Tunisia harmless from claims arising out of your breach of these Terms or misuse of the service, to the extent permitted by applicable law.',
      },
      {
        heading: '9. Governing Law & Dispute Resolution',
        body: 'These Terms are governed by the laws applicable in your place of residence for consumer-protection purposes; otherwise, by the governing law designated in your service agreement. EU/EEA and UK residents retain any mandatory rights under local consumer law, including access to local courts or applicable ODR platforms. US residents may be subject to additional state-specific consumer arbitration disclosures where applicable.',
      },
      {
        heading: '10. Changes to These Terms',
        body: 'We may update these Terms from time to time. Material changes will be communicated via the service or by email, and continued use after the effective date constitutes acceptance of the revised Terms.',
      },
      {
        heading: '11. Contact Us',
        body: 'Questions about these Terms can be directed to our support team through the Contact page.',
      },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    intro:
      'This Privacy Policy explains how Roots Tunisia collects, uses, shares, and protects your personal data, and describes your rights under applicable data protection laws, including Tunisian Law No. 2004-63 (INPDP), the EU General Data Protection Regulation (GDPR), and US state privacy laws such as the CCPA/CPRA.',
    sections: [
      {
        heading: '1. Scope',
        body: "This policy applies to personal data processed when you use Roots Tunisia's website, admin panel, and related services, regardless of where you access them from.",
      },
      {
        heading: '2. Data We Collect',
        body: 'We collect information you provide directly (name, email, phone number, family tree and genealogical data, uploaded documents/photos), information generated by your use of the service (activity logs, preferences), and limited technical data (IP address, device/browser information) needed to operate the service securely.',
      },
      {
        heading: '3. How We Use Your Data',
        body: 'We process your data to provide and improve the service, authenticate accounts, communicate with you, and comply with legal obligations. Under GDPR, our legal bases include performance of a contract, legitimate interests, consent (e.g. for optional communications), and legal compliance.',
      },
      {
        heading: '4. Sharing & Disclosure',
        body: 'We do not sell your personal data. We may share data with service providers who process it on our behalf (e.g. hosting, email delivery) under contractual confidentiality obligations, with other users you explicitly choose to share family tree content with, or where required by law.',
      },
      {
        heading: '5. International Data Transfers',
        body: 'Where data is transferred outside your jurisdiction (for example, to hosting infrastructure in another country), we rely on appropriate safeguards such as standard contractual clauses or equivalent mechanisms recognized under GDPR and comparable frameworks.',
      },
      {
        heading: '6. Data Retention',
        body: 'We retain personal data for as long as your account is active or as needed to provide the service, comply with legal obligations, resolve disputes, and enforce agreements. You may request deletion of your account and associated data at any time, subject to legal retention requirements.',
      },
      {
        heading: '7. Your Rights (EU/EEA/UK Residents)',
        body: 'If you are located in the EU/EEA or UK, you have the right to access, rectify, erase, or restrict processing of your personal data, the right to data portability, the right to object to processing based on legitimate interests, the right to withdraw consent at any time, and the right to lodge a complaint with your local data protection supervisory authority.',
      },
      {
        heading: '8. Your Rights (US State Residents)',
        body: 'If you are a resident of California or another US state with a comprehensive privacy law, you have the right to know what personal information we collect, request deletion or correction of your data, opt out of the sale or sharing of personal information (we do not sell personal data), limit the use of sensitive personal information, and not be discriminated against for exercising these rights. You may exercise these rights yourself or through an authorized agent.',
      },
      {
        heading: '9. Cookies & Tracking Technologies',
        body: 'We use cookies and similar technologies as described in our Cookie Policy, which forms part of this Privacy Policy.',
      },
      {
        heading: "10. Children's Privacy",
        body: 'Roots Tunisia is not directed at children under 16, and we do not knowingly collect personal data from children without appropriate parental consent where required by law.',
      },
      {
        heading: '11. Data Security',
        body: 'We implement technical and organizational measures designed to protect personal data against unauthorized access, alteration, disclosure, or destruction, appropriate to the sensitivity of the data involved.',
      },
      {
        heading: '12. Changes to This Policy',
        body: 'We may update this Privacy Policy periodically. Material changes will be communicated through the service or by email prior to taking effect.',
      },
      {
        heading: '13. Contact Us',
        body: 'For privacy-related questions or to exercise your rights, please contact us through the Contact page.',
      },
    ],
  },
  cookies: {
    title: 'Cookie Policy',
    intro:
      'This Cookie Policy explains how Roots Tunisia uses cookies and similar technologies, and the choices available to you under applicable EU ePrivacy/GDPR rules and US state privacy laws.',
    sections: [
      {
        heading: '1. What Are Cookies',
        body: 'Cookies are small text files stored on your device by your web browser. They help websites remember your preferences and understand how the site is used.',
      },
      {
        heading: '2. Types of Cookies We Use',
        body: 'Essential cookies are required for authentication and core site functionality and cannot be disabled. Preference cookies remember your language and theme settings. Analytics cookies help us understand usage patterns to improve the service. We do not use cookies for third-party advertising.',
      },
      {
        heading: '3. Consent (EU/EEA/UK Visitors)',
        body: 'Where required by the ePrivacy Directive and GDPR, non-essential cookies are only set after you provide consent through our cookie banner. You can withdraw consent at any time by adjusting your preferences or browser settings.',
      },
      {
        heading: '4. Opt-Out Signals (US Visitors)',
        body: 'We honor recognized opt-out preference signals, such as the Global Privacy Control, where legally required, as an exercise of your right to opt out of the sale or sharing of personal information under applicable US state laws.',
      },
      {
        heading: '5. Managing Cookies',
        body: 'Most browsers let you control or delete cookies through their settings. Disabling non-essential cookies will not affect core functionality, but disabling essential cookies may prevent sign-in and other features from working correctly.',
      },
      {
        heading: '6. Third-Party Cookies',
        body: 'Some features may rely on third-party service providers (e.g. infrastructure or analytics partners) that set their own cookies subject to their respective privacy policies.',
      },
      {
        heading: '7. Changes to This Policy',
        body: 'We may update this Cookie Policy from time to time to reflect changes in technology or applicable law. The "last updated" date on this page reflects the most recent revision.',
      },
    ],
  },
  refund: {
    title: 'Refund and Cancellation Policy',
    intro:
      'This Refund and Cancellation Policy outlines the terms and conditions for subscriptions, digital document accesses, and cancellations on Roots Tunisia in compliance with applicable consumer protection laws.',
    sections: [
      {
        heading: '1. Subscription Billing & Cancellation',
        body: 'Roots Tunisia subscriptions are billed on a recurring monthly or annual basis as selected upon checkout. You may cancel your subscription at any time through your User Settings or by contacting customer support at devteam@rootstunisia.com. Once cancelled, your paid subscription will remain active until the end of your current paid billing period, with no further charges.',
      },
      {
        heading: '2. Statutory Right of Withdrawal (14-Day Cooling-Off Period)',
        body: 'In accordance with consumer protection regulations, customers in the European Union, United Kingdom, and jurisdictions granting statutory withdrawal rights are entitled to a full refund within 14 days of their initial purchase, provided that full digital archival downloads have not commenced with prior express consent.',
      },
      {
        heading: '3. Digital Records and Document Downloads',
        body: 'Due to the immediate access nature of digitized historical archives, GEDCOM exports, and high-resolution document scans, one-time document processing fees or completed digital download deliveries are generally non-refundable once accessed, unless the file was corrupted, defective, or inaccessible due to verified server failure.',
      },
      {
        heading: '4. Refund Request Process & Processing Times',
        body: 'To request a refund, submit an email to devteam@rootstunisia.com with your account email address, date of transaction, and reason for the request. Eligible refunds are reviewed within 3 business days and processed back to the original method of payment (or Tunisian bank transfer where applicable) within 5 to 10 business days.',
      },
      {
        heading: '5. Technical or Service Failures',
        body: 'If you experience prolonged service unavailability or a technical error prevents you from utilizing your paid quota or accessing the platform, we will provide an appropriate billing credit or prorated refund upon verification by our technical team.',
      },
      {
        heading: '6. Consumer Rights & Legal Protections',
        body: 'Nothing in this policy limits or diminishes any non-waivable statutory rights you hold under applicable Tunisian consumer law or international consumer-protection legislation in your place of residence.',
      },
    ],
  },
};

const FR_SEEDS: Record<LegalSlug, SeedLegalDocument> = {
  terms: {
    title: "Conditions Générales d'Utilisation",
    intro:
      "Les présentes Conditions Générales d'Utilisation régissent votre accès et votre utilisation de Roots Tunisia. En créant un compte ou en utilisant nos services, vous acceptez ces conditions.",
    sections: [
      {
        heading: '1. Acceptation des conditions',
        body: "En accédant à Roots Tunisia ou en utilisant ses outils, vous confirmez avoir lu, compris et accepté les présentes conditions ainsi que notre Politique de Confidentialité. En cas de désaccord, veuillez cesser d'utiliser la plateforme.",
      },
      {
        heading: '2. Éligibilité et comptes utilisateurs',
        body: 'Vous devez être âgé d’au moins 16 ans pour créer un compte. Vous êtes responsable de la confidentialité de vos identifiants et de toute activité effectuée depuis votre compte. Signalez-nous immédiatement tout accès non autorisé.',
      },
      {
        heading: '3. Contenus utilisateurs et propriété intellectuelle',
        body: 'Vous conservez la pleine propriété des arbres généalogiques, documents, photographies et récits que vous importez. En les publiant, vous accordez à Roots Tunisia une licence limitée et non exclusive pour héberger, afficher et traiter ces contenus aux seules fins de fournir le service.',
      },
      {
        heading: '4. Utilisation acceptable',
        body: "Vous vous engagez à ne pas publier de contenu illicite, diffamatoire ou portant atteinte aux droits d'autrui, ni à tenter de compromettre la sécurité du système. Tout compte contrevenant à ces règles pourra être suspendu ou supprimé.",
      },
      {
        heading: '5. Abonnements et paiements',
        body: "Certaines fonctionnalités nécessitent un abonnement payant. Les tarifs, cycles de facturation et modalités d'annulation sont précisés avant la validation. Sauf disposition légale impérative (notamment le droit de rétractation légal de 14 jours dans l'UE), les périodes entamées ne sont pas remboursables.",
      },
      {
        heading: '6. Exactitude des sources généalogiques',
        body: "Roots Tunisia met à disposition des outils de recherche et des fonds d'archives numérisés mais ne garantit pas l'exhaustivité des données transmises par les utilisateurs ou des registres anciens. Les conclusions généalogiques sont fournies à titre documentaire.",
      },
      {
        heading: '7. Limitation de responsabilité',
        body: 'Dans les limites prévues par la loi applicable, Roots Tunisia ne saurait être tenue responsable des dommages indirects ou imprévisibles liés à l’utilisation du service, sans préjudice des garanties d’ordre public applicables aux consommateurs.',
      },
      {
        heading: '8. Indemnisation',
        body: "Vous acceptez de garantir Roots Tunisia contre toute réclamation résultant d'une violation manifeste des présentes conditions ou d'une utilisation abusive des services, dans les limites autorisées par la loi.",
      },
      {
        heading: '9. Droit applicable et juridiction compétente',
        body: 'Les présentes conditions sont régies par le droit de la République tunisienne, sans préjudice des dispositions impératives de protection des consommateurs applicables dans votre pays de résidence (notamment au sein de l’UE/EEE ou du Royaume-Uni).',
      },
      {
        heading: '10. Modifications des conditions',
        body: 'Nous pouvons mettre à jour ces conditions périodiquement. Toute modification substantielle sera notifiée sur la plateforme ou par e-mail avant son entrée en vigueur.',
      },
      {
        heading: '11. Nous contacter',
        body: 'Pour toute question relative à ces conditions, veuillez contacter notre équipe via la page Centre d’Aide & Contact.',
      },
    ],
  },
  privacy: {
    title: 'Politique de Confidentialité',
    intro:
      "Cette Politique de Confidentialité explique comment Roots Tunisia collecte, utilise, partage et protège vos données personnelles conformément à la loi tunisienne n° 2004-63 (INPDP) et au RGPD européen.",
    sections: [
      {
        heading: '1. Champ d’application',
        body: 'Cette politique couvre les traitements de données personnelles réalisés lorsque vous utilisez le site web, les outils généalogiques et les services associés de Roots Tunisia.',
      },
      {
        heading: '2. Données collectées',
        body: 'Nous collectons les informations saisies directement (nom, e-mail, téléphone, arbres généalogiques, documents et photographies importés), les données techniques strictement nécessaires (adresse IP, navigateur) et vos préférences d’utilisation.',
      },
      {
        heading: '3. Finalités et bases légales du traitement',
        body: "Vos données sont traitées pour fournir le service, authentifier votre compte, répondre à vos demandes d'archives et satisfaire aux obligations légales (exécution du contrat, consentement explicite et intérêts légitimes).",
      },
      {
        heading: '4. Partage et confidentialité des données',
        body: 'Nous ne vendons jamais vos données personnelles. Elles ne sont partagées qu’avec des prestataires techniques soumis à confidentialité (hébergement, messagerie), avec les membres que vous autorisez explicitement, ou sur réquisition légale.',
      },
      {
        heading: '5. Transferts internationaux de données',
        body: 'Tout transfert hors de votre juridiction s’appuie sur des garanties juridiques appropriées, incluant les clauses contractuelles types et les exigences de protection reconnues.',
      },
      {
        heading: '6. Conservation des données et protection des personnes vivantes',
        body: 'Les données liées aux personnes vivantes (nées depuis moins de 100 ans sans acte de décès) sont masquées par défaut. Vous pouvez demander la suppression de votre compte et de vos données personnelles à tout moment.',
      },
      {
        heading: '7. Vos droits (INPDP & UE / EEE / Royaume-Uni)',
        body: 'Vous disposez d’un droit d’accès, de rectification, d’effacement, de limitation, de portabilité et d’opposition au traitement de vos données, ainsi que du droit de saisir l’INPDP en Tunisie ou votre autorité européenne de contrôle.',
      },
      {
        heading: '8. Droits des résidents d’autres juridictions',
        body: 'Nous respectons également les droits d’accès, de suppression et d’opposition prévus par les législations internationales applicables (notamment aux États-Unis et au Canada), sans aucune vente ni cession commerciale.',
      },
      {
        heading: '9. Cookies et traceurs',
        body: 'Nous utilisons des témoins de connexion décrits en détail dans notre Politique des Cookies, partie intégrante de la présente politique.',
      },
      {
        heading: '10. Protection des mineurs',
        body: 'Roots Tunisia ne s’adresse pas aux enfants de moins de 16 ans sans autorisation parentale vérifiable.',
      },
      {
        heading: '11. Sécurité des données',
        body: 'Nous mettons en œuvre un chiffrement des échanges (HTTPS/TLS), un contrôle strict des accès et des sauvegardes sécurisées afin de protéger l’intégrité des archives familiales.',
      },
      {
        heading: '12. Mises à jour de cette politique',
        body: 'Cette politique peut évoluer pour refléter les mises à jour techniques ou réglementaires. Les changements majeurs vous sont communiqués avant prise d’effet.',
      },
      {
        heading: '13. Contact',
        body: 'Pour exercer vos droits ou poser une question sur vos données, contactez notre équipe via la page Centre d’Aide.',
      },
    ],
  },
  cookies: {
    title: 'Politique des Cookies',
    intro:
      'Cette Politique des Cookies précise comment Roots Tunisia utilise les témoins et le stockage local, et comment gérer vos préférences en toute transparence.',
    sections: [
      {
        heading: '1. Qu’est-ce qu’un cookie ?',
        body: 'Un cookie est un petit fichier texte enregistré par votre navigateur. Il permet de sécuriser votre session et de mémoriser vos choix d’affichage.',
      },
      {
        heading: '2. Types de cookies utilisés',
        body: 'Nous utilisons des cookies essentiels (authentification JWT, sécurité de session), des cookies de préférences (langue choisie et thème visuel) et des statistiques anonymisées d’audience. Aucun cookie publicitaire tiers n’est utilisé.',
      },
      {
        heading: '3. Recueil du consentement',
        body: 'Conformément aux exigences européennes et internationales, les traceurs non essentiels ne sont activés qu’après votre accord via la bannière « Préférences Cookies ».',
      },
      {
        heading: '4. Signaux de refus automatique',
        body: 'Nous respectons les signaux de confidentialité reconnus par les navigateurs (tels que Global Privacy Control) pour les visiteurs concernés.',
      },
      {
        heading: '5. Gestion de vos préférences',
        body: 'Vous pouvez modifier ou retirer votre consentement à tout moment en cliquant sur « Préférences Cookies » dans le pied de page ou dans les paramètres de votre navigateur.',
      },
      {
        heading: '6. Services tiers',
        body: 'Certaines fonctionnalités techniques peuvent s’appuyer sur des sous-traitants d’hébergement respectant des normes strictes de confidentialité.',
      },
      {
        heading: '7. Évolution de la politique',
        body: 'Nous mettons cette page à jour en cas d’évolution technique ou réglementaire. La date figurant en haut du document indique la version en vigueur.',
      },
    ],
  },
  refund: {
    title: 'Politique de Remboursement et d’Annulation',
    intro:
      'Cette politique détaille les règles transparentes applicables aux abonnements, à l’accès aux documents numérisés et aux demandes de remboursement sur Roots Tunisia.',
    sections: [
      {
        heading: '1. Facturation et résiliation d’abonnement',
        body: 'Les abonnements sont renouvelés mensuellement ou annuellement selon votre choix. Vous pouvez résilier à tout moment depuis vos Paramètres ou en écrivant à devteam@rootstunisia.com. Votre accès reste actif jusqu’à la fin de la période déjà réglée sans nouveau prélèvement.',
      },
      {
        heading: '2. Délai légal de rétractation (14 jours)',
        body: 'Conformément aux standards de protection des consommateurs (UE, Royaume-Uni et juridictions équivalentes), vous disposez de 14 jours calendaires après votre premier achat pour obtenir un remboursement intégral, sauf en cas de téléchargement numérique massif déjà entamé avec accord exprès.',
      },
      {
        heading: '3. Actes numérisés et prestations unitaires',
        body: 'En raison de leur mise à disposition immédiate, les téléchargements HD et exports GEDCOM ponctuels ne sont pas remboursables après livraison, sauf si le fichier est corrompu, illisible ou erroné suite à une anomalie de notre service.',
      },
      {
        heading: '4. Procédure et délais de remboursement',
        body: 'Pour demander un remboursement, écrivez à devteam@rootstunisia.com avec votre adresse e-mail de compte, la référence de transaction et le motif. Les demandes admissibles sont traitées sous 3 jours ouvrés et recréditées sous 5 à 10 jours ouvrés.',
      },
      {
        heading: '5. Incidents techniques prolongés',
        body: 'En cas d’indisponibilité technique prolongée affectant votre formule payante, un avoir ou un remboursement au prorata est accordé après vérification par notre équipe technique.',
      },
      {
        heading: '6. Garanties légales des consommateurs',
        body: 'Aucune clause de cette politique ne restreint vos droits légaux impératifs prévus par la loi tunisienne (Loi n° 98-40 relative à la protection du consommateur) ou par votre législation nationale.',
      },
    ],
  },
};

const AR_SEEDS: Record<LegalSlug, SeedLegalDocument> = {
  terms: {
    title: 'شروط الاستخدام',
    intro:
      'تنظم شروط الاستخدام هذه («الشروط») وصولك إلى منصة جذور تونس واستخدامك لأدواتها الأرشيفية والبحثية. بإنشائك حساباً أو تصفحك المنصة، فإنك توافق على الالتزام بهذه الشروط.',
    sections: [
      {
        heading: '1. قبول الشروط',
        body: 'يؤكد دخولك إلى منصة جذور تونس أو استخدامك لخدماتها أنك قرأت وفهمت ووافقت على هذه الشروط وعلى سياسة الخصوصية. وفي حال عدم الموافقة، يُرجى التوقف عن استخدام المنصة.',
      },
      {
        heading: '2. الأهلية والحسابات الشخصية',
        body: 'يجب ألا يقل عمرك عن 16 عاماً لإنشاء حساب. تتحمل مسؤولية الحفاظ على سرية بيانات الدخول وكل نشاط يتم عبر حسابك، وإخطارنا فوراً بأي استخدام غير مصرح به.',
      },
      {
        heading: '3. المحتوى المرفوع والملكية الفكرية',
        body: 'تحتفظ بكامل حقوق الملكية على أشجار العائلة والوثائق والصور والروايات التي ترفعها. وتمنح المنصة ترخيصاً محدوداً وغير حصري لاستضافتها ومعالجتها فقط لتقديم الخدمة لك أو لمن تختار مشاركتهم.',
      },
      {
        heading: '4. الاستخدام المقبول',
        body: 'تتعهد بعدم رفع أي محتوى غير قانوني أو مسيء أو منتهك لحقوق الغير، وعدم انتحال الهوية أو محاولة اختراق أنظمة المنصة، وتحتفظ الإدارة بحق تعليق الحسابات المخالفة.',
      },
      {
        heading: '5. الاشتراكات والمدفوعات',
        body: 'تتطلب بعض المزايا اشتراكاً مدفوعاً تُعرض رسومه ودورة فوترته قبل الدفع. وبإمكانك الإلغاء في أي وقت، وتبقى الاشتراكات غير قابلة للاسترداد بعد بدء دورة الفوترة باستثناء فترات العدول القانونية المنصوص عليها.',
      },
      {
        heading: '6. دقة المعلومات الأرشيفية والتاريخية',
        body: 'توفر جذور تونس أدوات بحث وفهارس لأرصدة الأرشيف، غير أن البيانات المدخلة من المستخدمين والوثائق التاريخية تخضع للتحقق الميداني وتُقدم النتائج لأغراض التوثيق والبحث.',
      },
      {
        heading: '7. تحديد المسؤولية',
        body: 'في الحدود التي يسمح بها القانون، لا تتحمل منصة جذور تونس أي مسؤولية عن الأضرار غير المباشرة أو العرضية الناتجة عن استخدام الخدمة، دون المساس بحقوق المستهلك الإلزامية.',
      },
      {
        heading: '8. التعويض والحماية القانونية',
        body: 'توافق على حماية منصة جذور تونس من أي مطالبات تنشأ مباشرة عن إخلالك بهذه الشروط أو إساءة استخدامك للمنصة ضمن الحدود القانونية.',
      },
      {
        heading: '9. القانون الواجب التطبيق والاختصاص القضائي',
        body: 'تخضع هذه الشروط لقوانين الجمهورية التونسية وتُعرض النزاعات أمام المحاكم المختصة بتونس العاصمة، مع مراعاة الحقوق الإلزامية لحماية المستهلك في بلد إقامتك.',
      },
      {
        heading: '10. تعديلات الشروط',
        body: 'قد نقوم بتحديث هذه الشروط من وقت لآخر، وسيتم إشعارك بالتعديلات الجوهرية عبر المنصة أو البريد الإلكتروني قبل دخولها حيّز التنفيذ.',
      },
      {
        heading: '11. التواصل معنا',
        body: 'لأي استفسار حول هذه الشروط، يُرجى مراسلة فريق الدعم عبر صفحة مركز المساعدة والتواصل.',
      },
    ],
  },
  privacy: {
    title: 'سياسة الخصوصية',
    intro:
      'تشرح سياسة الخصوصية هذه كيفية جمع بياناتك الشخصية واستخدامها وحمايتها في منصة جذور تونس وفقاً للقانون التونسي عدد 63 لسنة 2004 المتعلق بحماية المعطيات الشخصية (INPDP) واللائحة الأوروبية (GDPR).',
    sections: [
      {
        heading: '1. نطاق التطبيق',
        body: 'تنطبق هذه السياسة على جميع المعطيات الشخصية التي تتم معالجتها عند استخدامك لموقع جذور تونس وأدوات الأنساب والخدمات المرتبطة بها.',
      },
      {
        heading: '2. المعطيات التي نجمعها',
        body: 'نجمع البيانات التي تقدمها مباشرة (الاسم، البريد الإلكتروني، الهاتف، أشجار العائلات والوثائق والصور المرفوعة)، إضافة إلى تفضيلات اللغة والمظهر وبيانات الأمان التقنية.',
      },
      {
        heading: '3. كيفية استخدام المعطيات والأساس القانوني',
        body: 'تُعالج بياناتك لتشغيل المنصة، ومصادقة الحساب، والرد على طلبات البحث الأرشيفي، والامتثال للالتزامات القانونية استناداً إلى العقد أو الموافقة الصريحة.',
      },
      {
        heading: '4. مشاركة البيانات وعدم بيعها',
        body: 'نحن لا نبيع بياناتك الشخصية أبداً. ولا تتم مشاركتها إلا مع مزودي الاستضافة التقنية الملتزمين بالسرية، أو مع المستخدمين الذين تختار مشاركتهم شجرة عائلتك، أو بموجب القانون.',
      },
      {
        heading: '5. نقل البيانات عبر الحدود',
        body: 'عند نقل البيانات خارج بلدك لأغراض الاستضافة السحابية الآمنة، نعتمد ضمانات تعاقدية قياسية تكفل مستوى حماية مماثلاً للمعايير الأوروبية والتونسية.',
      },
      {
        heading: '6. مدة الاحتفاظ وحماية الأشخاص الأحياء',
        body: 'تُحجب بيانات الأشخاص الأحياء (المولودين منذ أقل من 100 عام دون وثيقة وفاة) تلقائياً في البحث العام، ويمكنك طلب حذف حسابك وبياناتك في أي وقت.',
      },
      {
        heading: '7. حقوقك في تونس والاتحاد الأوروبي والمملكة المتحدة',
        body: 'لك الحق في النفاذ إلى معطياتك وتصحيحها ومحوها والاعتراض على معالجتها أو طلب نقلها، كما يحق لك التقدم بشكوى لدى الهيئة الوطنية لحماية المعطيات الشخصية (INPDP) أو هيئة الرقابة المختصة.',
      },
      {
        heading: '8. حقوق المقيمين في ولايات ودول أخرى',
        body: 'نلتزم أيضاً باحترام حقوق الوصول والتصحيح والحذف ومنع البيع أو التتبع المكفولة بموجب قوانين الخصوصية الدولية دون أي استغلال تجاري للبيانات.',
      },
      {
        heading: '9. ملفات تعريف الارتباط وتقنيات التتبع',
        body: 'تخضع ملفات تعريف الارتباط لأحكام سياسة ملفات الارتباط التي تشكل جزءاً لا يتجزأ من سياسة الخصوصية هذه.',
      },
      {
        heading: '10. خصوصية القاصرين',
        body: 'المنصة غير موجهة لمن هم دون سن 16 عاماً، ولا نجمع بياناتهم الشخصية عن قصد دون موافقة الولي القانوني.',
      },
      {
        heading: '11. أمن المعلومات والتشفير',
        body: 'نطبق تشفيراً كاملاً للاتصالات (HTTPS/TLS) وتخزيناً آمناً لقواعد البيانات الأرشيفية وضوابط وصول دقيقة لحماية سجلات العائلات من أي اختراق.',
      },
      {
        heading: '12. التغييرات على هذه السياسة',
        body: 'قد نحدث سياسة الخصوصية دورياً لمواكبة التطورات التقنية أو التشريعية، مع إعلام المستخدمين بالتغييرات الجوهرية مسبقاً.',
      },
      {
        heading: '13. التواصل بشأن الخصوصية',
        body: 'لممارسة حقوقك أو لطرح أي سؤال متعلق بالخصوصية، يُرجى مراسلتنا عبر صفحة اتصل بنا أو مركز المساعدة.',
      },
    ],
  },
  cookies: {
    title: 'سياسة ملفات الارتباط',
    intro:
      'توضح هذه السياسة كيفية استخدام منصة جذور تونس لملفات تعريف الارتباط والتخزين المحلي، وكيفية التحكم في تفضيلاتك بوضوح وشفافية.',
    sections: [
      {
        heading: '1. ما هي ملفات تعريف الارتباط (Cookies)؟',
        body: 'هي ملفات نصية صغيرة يحفظها المتصفح على جهازك لتأمين جلسة الدخول وتذكر اختياراتك الأساسية مثل اللغة والمظهر.',
      },
      {
        heading: '2. أنواع ملفات الارتباط التي نستخدمها',
        body: 'نستخدم ملفات ضرورية للمصادقة والأمان، وملفات تفضيلات لحفظ لغتك المختارة (العربية، الفرنسية، الإنجليزية، الإسبانية، الإيطالية، المالطية) والمظهر، وإحصائيات استخدام مجهولة الهوية. لا نستخدم أي ملفات إعلانية تجارية.',
      },
      {
        heading: '3. الموافقة المسبقة للزوار',
        body: 'تبقى الملفات غير الضرورية معطلة افتراضياً حتى تمنح موافقتك عبر شريط «إعدادات ملفات الارتباط»، ويمكنك سحبها في أي لحظة.',
      },
      {
        heading: '4. إشارات رفض التتبع التلقائية',
        body: 'نحترم إشارات الخصوصية الصادرة عن المتصفحات مثل إشارة عدم التتبع العالمية (GPC) وفق التشريعات السارية.',
      },
      {
        heading: '5. إدارة التفضيلات وتعديلها',
        body: 'يمكنك مراجعة اختياراتك وتعديلها في أي وقت عبر زر «إعدادات ملفات الارتباط» في أسفل الصفحة أو من إعدادات متصفحك.',
      },
      {
        heading: '6. ملفات الأطراف التقنية الموثوقة',
        body: 'قد تعتمد بعض الوظائف التقنية على مزودي بنية تحتية موثوقين يلتزمون بسياسات صارمة لحماية الخصوصية.',
      },
      {
        heading: '7. تحديثات هذه السياسة',
        body: 'قد تُحدَّث هذه السياسة عند إضافة أدوات جديدة أو تعديل الأطر القانونية، ويُشار دائماً إلى تاريخ آخر تحديث في الصفحة.',
      },
    ],
  },
  refund: {
    title: 'سياسة الاسترجاع والإلغاء',
    intro:
      'تحدد هذه السياسة القواعد الواضحة والعادلة للاشتراكات والخدمات الوثائقية وإلغاء الاشتراك وطلبات استرجاع الرسوم على منصة جذور تونس.',
    sections: [
      {
        heading: '1. الفوترة الدورية وإلغاء الاشتراك',
        body: 'تُفوتر الاشتراكات شهرياً أو سنوياً وفق الباقة المختارة. يمكنك إلغاء التجديد التلقائي في أي وقت من إعدادات حسابك أو بمراسلة devteam@rootstunisia.com، وتستمر صلاحية حسابك حتى نهاية الفترة المدفوعة دون رسوم إضافية.',
      },
      {
        heading: '2. حق العدول القانوني خلال 14 يوماً',
        body: 'وفقاً لمعايير حماية المستهلك التونسية والأوروبية والدولية، يحق للمشتركين المؤهلين استرداد المبلغ كاملاً خلال 14 يوماً من الاشتراك الأول ما لم يتم البدء في التنزيل المكثف للأرشيف الرقمي بموافقة صريحة مسبقة.',
      },
      {
        heading: '3. الوثائق الرقمية والتنزيلات الفردية',
        body: 'نظراً لطبيعة الوصول الفوري إلى المسوحات الضوئية عالية الدقة وملفات GEDCOM، لا تُسترد رسوم الطلبات الفردية بعد تسليم الملف، إلا إذا كان الملف تالفاً أو غير مقروء أو مخالفاً للطلب بسبب خطأ من طرفنا.',
      },
      {
        heading: '4. خطوات طلب الاسترجاع ومهلة المعالجة',
        body: 'لطلب استرجاع الرسوم، أرسل بريداً إلكترونياً إلى devteam@rootstunisia.com متضمناً البريد المسجل وتاريخ العملية وسبب الطلب. تُراجع الطلبات خلال 3 أيام عمل ويُعاد المبلغ إلى وسيلة الدفع الأصلية خلال 5 إلى 10 أيام عمل.',
      },
      {
        heading: '5. الأعطال التقنية أو تعذر الخدمة',
        body: 'في حال حدوث عطل تقني مطوّل حال دون استفادتك من اشتراكك المدفوع، يمنحك فريقنا رصيداً تعويضياً أو استرجاعاً نسبياً بعد التحقق الفني.',
      },
      {
        heading: '6. الحقوق القانونية والضمانات المحفوظة',
        body: 'لا ينتقص أي بند من هذه السياسة من الحقوق القانونية غير القابلة للتنازل التي يكفلها القانون التونسي لحماية المستهلك (القانون عدد 40 لسنة 1998) أو قوانين بلد إقامتك.',
      },
    ],
  },
};

const ES_SEEDS: Record<LegalSlug, SeedLegalDocument> = {
  terms: {
    title: 'Términos de Servicio',
    intro:
      'Estos Términos de Servicio regulan el acceso y uso de la plataforma Roots Tunisia. Al crear una cuenta o utilizar nuestros servicios, usted acepta estos Términos.',
    sections: [
      {
        heading: '1. Aceptación de los términos',
        body: 'Al acceder o utilizar Roots Tunisia, confirma que ha leído, comprendido y aceptado estos Términos y nuestra Política de Privacidad. Si no está de acuerdo, deje de utilizar el servicio.',
      },
      {
        heading: '2. Elegibilidad y cuentas',
        body: 'Debe tener al menos 16 años para crear una cuenta. Usted es responsable de mantener la confidencialidad de sus credenciales y de toda actividad realizada desde su cuenta.',
      },
      {
        heading: '3. Contenido del usuario y propiedad intelectual',
        body: 'Usted conserva la plena propiedad de los árboles genealógicos, documentos, fotografías y relatos que suba. Concede a Roots Tunisia una licencia limitada para alojarlos y mostrarlos conforme a su configuración de privacidad.',
      },
      {
        heading: '4. Uso aceptable',
        body: 'Se compromete a no subir contenido ilícito, infractor o difamatorio, ni intentar vulnerar la seguridad de la plataforma. Podemos suspender cuentas que incumplan esta política.',
      },
      {
        heading: '5. Suscripciones y pagos',
        body: 'Algunas funciones requieren suscripción de pago. Los importes, ciclos y condiciones de cancelación se muestran antes de confirmar. Salvo el derecho legal de desistimiento aplicable (14 días en la UE), los periodos iniciados no son reembolsables.',
      },
      {
        heading: '6. Exactitud de las fuentes históricas',
        body: 'Roots Tunisia ofrece herramientas de investigación y acceso archivístico, pero no garantiza la exhaustividad de los datos aportados por usuarios o registros antiguos. Los resultados tienen valor informativo y documental.',
      },
      {
        heading: '7. Limitación de responsabilidad',
        body: 'En la máxima medida permitida por la ley, Roots Tunisia no será responsable de daños indirectos o consecuentes derivados del uso del servicio, sin afectar los derechos irrenunciables del consumidor.',
      },
      {
        heading: '8. Indemnización',
        body: 'Usted acepta mantener indemne a Roots Tunisia frente a reclamaciones derivadas del incumplimiento grave de estos Términos o uso indebido del servicio.',
      },
      {
        heading: '9. Ley aplicable y resolución de litigios',
        body: 'Estos Términos se rigen por las leyes de la República de Túnez, sin perjuicio de las normas imperativas de protección al consumidor aplicables en su lugar de residencia (UE/EEE o Reino Unido).',
      },
      {
        heading: '10. Cambios en estos términos',
        body: 'Podemos actualizar estos Términos periódicamente. Los cambios relevantes se comunicarán en el sitio o por correo electrónico antes de entrar en vigor.',
      },
      {
        heading: '11. Contacto',
        body: 'Si tiene preguntas sobre estos Términos, puede contactar con nuestro equipo a través de la página Centro de Ayuda.',
      },
    ],
  },
  privacy: {
    title: 'Política de Privacidad',
    intro:
      'Esta Política de Privacidad explica cómo Roots Tunisia recopila, utiliza, comparte y protege sus datos personales conforme a la ley tunecina n.º 2004-63 (INPDP) y al RGPD.',
    sections: [
      {
        heading: '1. Alcance',
        body: 'Esta política se aplica a todos los datos personales tratados cuando utiliza el sitio web y los servicios genealógicos de Roots Tunisia.',
      },
      {
        heading: '2. Datos que recopilamos',
        body: 'Recopilamos los datos que proporciona directamente (nombre, correo, teléfono, árboles genealógicos, documentos y fotos), preferencias de idioma y datos técnicos de seguridad (IP y navegador).',
      },
      {
        heading: '3. Finalidad y base jurídica',
        body: 'Tratamos sus datos para prestar el servicio, autenticar cuentas, responder consultas archivísticas y cumplir obligaciones legales bajo contrato, consentimiento e interés legítimo.',
      },
      {
        heading: '4. Compartición y confidencialidad',
        body: 'No vendemos sus datos personales. Solo los compartimos con proveedores técnicos esenciales bajo secreto contractual, con usuarios que usted autorice o por mandato legal.',
      },
      {
        heading: '5. Transferencias internacionales de datos',
        body: 'Cuando los datos se procesan fuera de su jurisdicción, aplicamos garantías adecuadas como cláusulas contractuales tipo reconocidas internacionalmente.',
      },
      {
        heading: '6. Conservación y protección de personas vivas',
        body: 'Los datos de personas vivas (nacidas hace menos de 100 años sin defunción registrada) permanecen ocultos por defecto. Puede solicitar la eliminación de su cuenta y datos en cualquier momento.',
      },
      {
        heading: '7. Sus derechos (INPDP y UE / EEE / Reino Unido)',
        body: 'Tiene derecho de acceso, rectificación, supresión, limitación, portabilidad y oposición al tratamiento, así como a reclamar ante la INPDP o la autoridad europea competente.',
      },
      {
        heading: '8. Derechos en otras jurisdicciones',
        body: 'Respetamos igualmente los derechos de información, corrección, supresión y no discriminación previstos en leyes estatales de privacidad aplicables.',
      },
      {
        heading: '9. Cookies y tecnologías de seguimiento',
        body: 'El uso de cookies se detalla en nuestra Política de Cookies, que forma parte integrante de esta Política de Privacidad.',
      },
      {
        heading: '10. Privacidad de menores',
        body: 'Roots Tunisia no está dirigido a menores de 16 años sin autorización parental verificable.',
      },
      {
        heading: '11. Seguridad de los datos',
        body: 'Aplicamos cifrado en tránsito y medidas técnicas y organizativas estrictas para proteger los archivos familiares frente a accesos no autorizados.',
      },
      {
        heading: '12. Cambios en esta política',
        body: 'Podemos actualizar esta Política periódicamente y le notificaremos los cambios sustanciales antes de su aplicación.',
      },
      {
        heading: '13. Contacto',
        body: 'Para consultas de privacidad o ejercer sus derechos, contáctenos a través del Centro de Ayuda.',
      },
    ],
  },
  cookies: {
    title: 'Política de Cookies',
    intro:
      'Esta Política de Cookies explica cómo Roots Tunisia utiliza cookies y almacenamiento local, y las opciones disponibles para gestionar su consentimiento.',
    sections: [
      {
        heading: '1. ¿Qué son las cookies?',
        body: 'Son pequeños archivos de texto almacenados en su dispositivo por el navegador para mantener su sesión segura y recordar sus preferencias.',
      },
      {
        heading: '2. Tipos de cookies que utilizamos',
        body: 'Usamos cookies esenciales (autenticación y seguridad), cookies de preferencias (idioma francés, inglés, árabe, español, italiano o maltés y tema visual) y analítica anónima. No usamos cookies publicitarias.',
      },
      {
        heading: '3. Consentimiento previo',
        body: 'Las cookies no esenciales solo se activan tras su consentimiento expreso mediante nuestro banner de Preferencias de Cookies.',
      },
      {
        heading: '4. Señales de exclusión automática',
        body: 'Respetamos las señales técnicas de privacidad reconocidas como Global Privacy Control cuando resulten exigibles.',
      },
      {
        heading: '5. Gestión de cookies',
        body: 'Puede modificar sus preferencias en cualquier momento desde el enlace «Preferencias de Cookies» en el pie de página o en su navegador.',
      },
      {
        heading: '6. Proveedores de infraestructura',
        body: 'Ciertas funciones técnicas dependen de proveedores sujetos a estrictos acuerdos de confidencialidad.',
      },
      {
        heading: '7. Cambios en esta política',
        body: 'Actualizamos esta política cuando cambian nuestras herramientas o las leyes aplicables.',
      },
    ],
  },
  refund: {
    title: 'Política de Reembolso y Cancelación',
    intro:
      'Esta Política describe los términos transparentes de suscripciones, descargas digitales y solicitudes de reembolso en Roots Tunisia conforme a las leyes de protección al consumidor.',
    sections: [
      {
        heading: '1. Facturación y cancelación de suscripciones',
        body: 'Las suscripciones se facturan de forma mensual o anual. Puede cancelar en cualquier momento desde Configuración o escribiendo a devteam@rootstunisia.com, conservando el acceso hasta el final del ciclo pagado.',
      },
      {
        heading: '2. Derecho legal de desistimiento (14 días)',
        body: 'De acuerdo con las normativas de la UE, Reino Unido y jurisdicciones equivalentes, dispone de 14 días naturales desde la compra inicial para solicitar el reembolso íntegro, salvo descarga masiva previa con consentimiento expreso.',
      },
      {
        heading: '3. Documentos digitales y descargas únicas',
        body: 'Por su acceso inmediato, los escaneos HD y exportaciones GEDCOM puntuales no son reembolsables tras la descarga, salvo archivos dañados, ilegibles o erróneos por fallo de nuestro servicio.',
      },
      {
        heading: '4. Procedimiento y plazos de reembolso',
        body: 'Para solicitar un reembolso, escriba a devteam@rootstunisia.com indicando el correo de su cuenta, fecha de transacción y motivo. Revisamos cada solicitud en 3 días hábiles y reembolsamos en 5 a 10 días hábiles.',
      },
      {
        heading: '5. Fallos técnicos prolongados',
        body: 'Si una incidencia técnica prolongada impide utilizar su plan de pago, otorgaremos un crédito o reembolso proporcional tras la verificación técnica.',
      },
      {
        heading: '6. Garantías legales del consumidor',
        body: 'Nada en esta política limita sus derechos irrenunciables bajo la legislación tunecina (Ley n.º 98-40) o la normativa de consumidores de su país.',
      },
    ],
  },
};

const IT_SEEDS: Record<LegalSlug, SeedLegalDocument> = {
  terms: {
    title: 'Termini di Servizio',
    intro:
      'I presenti Termini di Servizio disciplinano l’accesso e l’utilizzo della piattaforma Roots Tunisia. Creando un account o utilizzando i nostri servizi, accetti tali Termini.',
    sections: [
      {
        heading: '1. Accettazione dei termini',
        body: 'Accedendo a Roots Tunisia o utilizzando i suoi strumenti, confermi di aver letto, compreso e accettato i presenti Termini e l’Informativa sulla Privacy.',
      },
      {
        heading: '2. Requisiti e account utente',
        body: 'Devi avere almeno 16 anni per registrare un account. Sei responsabile della riservatezza delle credenziali e di tutte le attività svolte con il tuo profilo.',
      },
      {
        heading: '3. Contenuti dell’utente e proprietà intellettuale',
        body: 'Mantieni la piena proprietà di alberi genealogici, documenti, fotografie e memorie caricati. Concedi a Roots Tunisia una licenza limitata per ospitarli e renderli accessibili secondo le tue impostazioni.',
      },
      {
        heading: '4. Uso consentito',
        body: 'Ti impegni a non caricare contenuti illeciti, lesivi o diffamatori e a non compromettere la sicurezza del sistema. Possiamo sospendere gli account in caso di violazione.',
      },
      {
        heading: '5. Abbonamenti e pagamenti',
        body: 'Alcune funzionalità richiedono un abbonamento. Prezzi, cicli e regole di recesso sono mostrati prima del pagamento. Fatto salvo il diritto di recesso legale di 14 giorni nell’UE, i periodi già avviati non sono rimborsabili.',
      },
      {
        heading: '6. Accuratezza delle fonti storiche',
        body: 'Roots Tunisia offre strumenti di ricerca e accesso archivistico, senza poter garantire l’assenza di lacune nei registri storici o nei dati inseriti dagli utenti.',
      },
      {
        heading: '7. Limitazione di responsabilità',
        body: 'Nei limiti massimi consentiti dalla legge, Roots Tunisia non risponde di danni indiretti o consequenziali derivanti dall’uso della piattaforma, fatti salvi i diritti inderogabili dei consumatori.',
      },
      {
        heading: '8. Manleva',
        body: 'Accetti di tenere indenne Roots Tunisia da richieste derivanti dalla violazione dei presenti Termini o dall’uso improprio del servizio.',
      },
      {
        heading: '9. Legge applicabile e foro competente',
        body: 'I Termini sono regolati dalla legge della Repubblica di Tunisia, fermi restando i diritti inderogabili del consumatore vigenti nel Paese di residenza (inclusa l’UE/SEE e il Regno Unito).',
      },
      {
        heading: '10. Modifiche ai presenti Termini',
        body: 'Possiamo aggiornare periodicamente questi Termini. Le modifiche sostanziali saranno comunicate tramite il servizio o via e-mail prima dell’entrata in vigore.',
      },
      {
        heading: '11. Contattaci',
        body: 'Per domande sui Termini puoi contattare il supporto tramite la pagina Centro Assistenza.',
      },
    ],
  },
  privacy: {
    title: 'Informativa sulla Privacy',
    intro:
      'Questa Informativa spiega come Roots Tunisia raccoglie, utilizza, condivide e protegge i dati personali in conformità alla legge tunisina n. 2004-63 (INPDP) e al GDPR europeo.',
    sections: [
      {
        heading: '1. Ambito di applicazione',
        body: 'L’informativa si applica ai dati personali trattati durante l’utilizzo del sito web e dei servizi genealogici di Roots Tunisia.',
      },
      {
        heading: '2. Dati raccolti',
        body: 'Raccogliamo i dati forniti direttamente (nome, email, telefono, alberi genealogici, documenti e foto caricati), preferenze d’uso e dati tecnici essenziali (indirizzo IP, browser).',
      },
      {
        heading: '3. Finalità e basi giuridiche',
        body: 'Trattiamo i dati per erogare il servizio, autenticare gli account, rispondere alle richieste archivistiche e adempiere agli obblighi legali (contratto, consenso e legittimo interesse).',
      },
      {
        heading: '4. Condivisione e riservatezza',
        body: 'Non vendiamo mai i tuoi dati personali. Possono essere trattati solo da fornitori tecnici vincolati da riservatezza o condivisi con utenti da te autorizzati.',
      },
      {
        heading: '5. Trasferimenti internazionali',
        body: 'Eventuali trasferimenti di dati verso infrastrutture esterne avvengono con adeguate garanzie contrattuali conformi al GDPR.',
      },
      {
        heading: '6. Conservazione e tutela dei viventi',
        body: 'I dati delle persone viventi (nate da meno di 100 anni senza atto di morte) sono oscurati per impostazione predefinita. Puoi chiedere in qualsiasi momento la cancellazione del tuo account.',
      },
      {
        heading: '7. I tuoi diritti (INPDP e UE / SEE / UK)',
        body: 'Hai diritto di accesso, rettifica, cancellazione, limitazione, portabilità e opposizione, oltre al diritto di proporre reclamo all’INPDP o all’autorità garante competente.',
      },
      {
        heading: '8. Diritti in altre giurisdizioni',
        body: 'Rispettiamo anche i diritti di trasparenza, correzione e cancellazione riconosciuti dalle normative internazionali sulla privacy applicabili.',
      },
      {
        heading: '9. Cookie e tracciamento',
        body: 'L’uso dei cookie è descritto nella nostra Politica sui Cookie, parte integrante della presente Informativa.',
      },
      {
        heading: '10. Tutela dei minori',
        body: 'Il servizio non è destinato a minori di 16 anni senza consenso verificabile dei genitori o tutori.',
      },
      {
        heading: '11. Sicurezza dei dati',
        body: 'Adottiamo cifratura dei trasferimenti e misure tecniche e organizzative adeguate alla sensibilità degli archivi familiari.',
      },
      {
        heading: '12. Aggiornamenti',
        body: 'Possiamo aggiornare periodicamente questa Informativa comunicando le modifiche rilevanti prima della loro applicazione.',
      },
      {
        heading: '13. Contatti',
        body: 'Per esercitare i tuoi diritti sulla privacy contattaci tramite il Centro Assistenza.',
      },
    ],
  },
  cookies: {
    title: 'Politica sui Cookie',
    intro:
      'Questa Politica illustra come Roots Tunisia utilizza cookie e archiviazione locale e come gestire liberamente le tue preferenze.',
    sections: [
      {
        heading: '1. Cosa sono i cookie',
        body: 'I cookie sono piccoli file di testo salvati dal browser per mantenere sicura la sessione e ricordare le preferenze essenziali.',
      },
      {
        heading: '2. Tipi di cookie utilizzati',
        body: 'Utilizziamo cookie essenziali (autenticazione JWT), cookie di preferenza (lingua scelta tra francese, inglese, arabo, spagnolo, italiano o maltese e tema grafico) e statistiche anonime. Nessun cookie pubblicitario.',
      },
      {
        heading: '3. Consenso preventivo',
        body: 'I cookie non essenziali vengono attivati solo dopo il tuo consenso esplicito nel pannello «Preferenze Cookie».',
      },
      {
        heading: '4. Segnali di opt-out',
        body: 'Riconosciamo i segnali tecnici di esclusione come Global Privacy Control ove previsto dalla legge.',
      },
      {
        heading: '5. Gestione delle preferenze',
        body: 'Puoi modificare o revocare il consenso in qualsiasi momento dal collegamento «Preferenze Cookie» nel piè di pagina o dal browser.',
      },
      {
        heading: '6. Fornitori tecnici',
        body: 'Eventuali partner infrastrutturali operano sotto rigorosi accordi di riservatezza.',
      },
      {
        heading: '7. Aggiornamenti',
        body: 'Aggiorniamo questa pagina in caso di evoluzioni tecnologiche o normative.',
      },
    ],
  },
  refund: {
    title: 'Politica di Rimborso e Cancellazione',
    intro:
      'Questa Politica definisce termini trasparenti per abbonamenti, scaricamenti digitali e richieste di rimborso su Roots Tunisia in conformità alle leggi sui consumatori.',
    sections: [
      {
        heading: '1. Fatturazione e disdetta',
        body: 'Gli abbonamenti sono fatturati mensilmente o annualmente. Puoi annullare in ogni momento dalle Impostazioni o scrivendo a devteam@rootstunisia.com, mantenendo l’accesso fino al termine del ciclo pagato.',
      },
      {
        heading: '2. Diritto di recesso legale (14 giorni)',
        body: 'Ai sensi delle normative UE, britanniche e tunisine applicabili, i nuovi acquirenti hanno diritto al rimborso integrale entro 14 giorni, salvo scaricamento massivo digitale già avviato con consenso espresso.',
      },
      {
        heading: '3. Documenti digitali e download singoli',
        body: 'Data la fruizione immediata delle scansioni HD e degli export GEDCOM, gli acquisti singoli non sono rimborsabili dopo la consegna, salvo file corrotti, illeggibili o errati per nostro disguido.',
      },
      {
        heading: '4. Procedura e tempi di rimborso',
        body: 'Scrivi a devteam@rootstunisia.com indicando l’email dell’account, la data della transazione e il motivo. Esaminiamo le richieste entro 3 giorni lavorativi ed effettuiamo il rimborso entro 5-10 giorni lavorativi.',
      },
      {
        heading: '5. Malfunzionamenti tecnici prolungati',
        body: 'In caso di prolungata indisponibilità tecnica del servizio a pagamento, riconosciamo un credito o rimborso proporzionale previa verifica tecnica.',
      },
      {
        heading: '6. Tutele legali del consumatore',
        body: 'Nulla in questa politica limita i diritti inderogabili garantiti dalla legge tunisina (Legge n. 98-40) o dalle normative vigenti nel tuo Paese.',
      },
    ],
  },
};

const MT_SEEDS: Record<LegalSlug, SeedLegalDocument> = {
  terms: {
    title: 'Termini tas-Servizz',
    intro:
      'Dawn it-Termini tas-Servizz jirregolaw l-aċċess u l-użu tal-pjattaforma Roots Tunisia. Billi toħloq kont jew tuża s-servizzi tagħna, inti taqbel ma’ dawn it-Termini.',
    sections: [
      {
        heading: '1. Aċċettazzjoni tat-termini',
        body: 'Billi tidħol jew tuża Roots Tunisia, inti tikkonferma li qrajt, fhimt u taqbel ma’ dawn it-Termini u mal-Politika tal-Privatezza tagħna.',
      },
      {
        heading: '2. Eliġibbiltà u kontijiet',
        body: 'Irid ikollok mill-inqas 16-il sena biex toħloq kont. Inti responsabbli biex iżżomm il-kredenzjali tiegħek kunfidenzjali u għall-attività kollha taħt il-kont tiegħek.',
      },
      {
        heading: '3. Kontenut tal-utent u proprjetà intellettwali',
        body: 'Inti żżomm is-sjieda sħiħa tas-siġar tal-familja, dokumenti, ritratti u stejjer li ttella’. Tagħti lil Roots Tunisia liċenzja limitata biex tospitahom u turihom skont l-għażliet tal-privatezza tiegħek.',
      },
      {
        heading: '4. Użu aċċettabbli',
        body: 'Taqbel li ma ttellax kontenut illegali, qarrieqi jew offensiv u li ma tippruvax tikser is-sigurtà tas-sistema. Nistgħu nissospendu kontijiet li jiksru din il-politika.',
      },
      {
        heading: '5. Abbonamenti u ħlasijiet',
        body: 'Xi karatteristiċi jeħtieġu abbonament imħallas. It-tariffi u l-kundizzjonijiet ta’ kanċellazzjoni jintwerew qabel il-ħlas. Ħlief fejn mitlub mil-liġi tal-konsumatur (bħad-dritt ta’ rtirar ta’ 14-il jum fl-UE), perjodi mibdija ma jitħallsux lura.',
      },
      {
        heading: '6. Preċiżjoni tal-informazzjoni ġenealoġika',
        body: 'Roots Tunisia tipprovdi għodod ta’ riċerka u aċċess għall-arkivji, iżda ma tiggarantixxix il-kompletezza ta’ dejta sottomessa mill-utenti jew ta’ reġistri storiċi antiki.',
      },
      {
        heading: '7. Limitazzjoni tar-responsabbiltà',
        body: 'Sal-limitu massimu permess mil-liġi, Roots Tunisia mhijiex responsabbli għal danni indiretti jew konsegwenzjali, mingħajr ma jiġu ristretti d-drittijiet obbligatorji tal-konsumatur.',
      },
      {
        heading: '8. Indennizz',
        body: 'Taqbel li żżomm lil Roots Tunisia ħielsa minn talbiet li jirriżultaw mill-ksur serju ta’ dawn it-Termini jew mill-użu ħażin tas-servizz.',
      },
      {
        heading: '9. Liġi applikabbli u ġurisdizzjoni',
        body: 'Dawn it-Termini huma rregolati mil-liġijiet tar-Repubblika Tuneżina, bla ħsara għad-drittijiet obbligatorji tal-konsumatur fil-pajjiż tar-residenza tiegħek (inklużi l-UE/ŻEE u r-Renju Unit).',
      },
      {
        heading: '10. Bidliet f’dawn it-Termini',
        body: 'Nistgħu naġġornaw dawn it-Termini minn żmien għal żmien. Bidliet sostanzjali jiġu kkomunikati fuq is-sit jew bl-email qabel ma jidħlu fis-seħħ.',
      },
      {
        heading: '11. Ikkuntattjana',
        body: 'Mistoqsijiet dwar dawn it-Termini jistgħu jintbagħtu lit-tim tagħna permezz taċ-Ċentru ta’ Għajnuna.',
      },
    ],
  },
  privacy: {
    title: 'Politika tal-Privatezza',
    intro:
      'Din il-Politika tispjega kif Roots Tunisia tiġbor, tuża, taqsam u tipproteġi d-dejta personali tiegħek skont il-liġi Tuneżina Nru 2004-63 (INPDP) u l-GDPR Ewropew.',
    sections: [
      {
        heading: '1. Skop',
        body: 'Din il-politika tapplika għad-dejta personali kollha ipproċessata meta tuża s-sit u s-servizzi ġenealoġiċi ta’ Roots Tunisia.',
      },
      {
        heading: '2. Dejta li niġbru',
        body: 'Niġbru l-informazzjoni li tagħti direttament (isem, email, telefon, siġar tal-familja, dokumenti u ritratti), preferenzi tal-lingwa u dejta teknika meħtieġa għas-sigurtà.',
      },
      {
        heading: '3. Kif nużaw id-dejta tiegħek',
        body: 'Nipproċessaw id-dejta biex nipprovdu s-servizz, nawtentikaw il-kontijiet, inwieġbu għal talbiet arkivistiċi u nħarsu l-obbligi legali.',
      },
      {
        heading: '4. Qsim u kunfidenzjalità',
        body: 'Qatt ma nbigħu d-dejta personali tiegħek. Naqsmuha biss ma’ fornituri tekniċi marbuta bil-kunfidenzjalità jew ma’ utenti li inti tagħżel espliċitament.',
      },
      {
        heading: '5. Trasferimenti internazzjonali',
        body: 'Meta d-dejta tiġi pproċessata barra l-ġurisdizzjoni tiegħek, napplikaw salvagwardji xierqa bħall-klawsoli kuntrattwali standard rikonoxxuti.',
      },
      {
        heading: '6. Żamma tad-dejta u protezzjoni ta’ persuni ħajjin',
        body: 'Dettalji ta’ persuni ħajjin (imwielda inqas minn 100 sena ilu mingħajr reġistru tal-mewt) jinħbew awtomatikament. Tista’ titlob it-tħassir tal-kont tiegħek fi kwalunkwe ħin.',
      },
      {
        heading: '7. Id-drittijiet tiegħek (INPDP u UE / ŻEE / UK)',
        body: 'Għandek dritt ta’ aċċess, rettifika, tħassir, limitazzjoni, portabbiltà u oġġezzjoni, kif ukoll id-dritt li tressaq ilment lill-INPDP jew lill-awtorità kompetenti.',
      },
      {
        heading: '8. Drittijiet f’ġurisdizzjonijiet oħra',
        body: 'Nirrispettaw ukoll id-drittijiet ta’ trasparenza, korrezzjoni u tħassir rikonoxxuti minn liġijiet internazzjonali oħra tal-privatezza.',
      },
      {
        heading: '9. Cookies u traċċar',
        body: 'L-użu tal-cookies huwa deskritt fil-Politika tal-Cookies tagħna, li tagħmel parti minn din il-Politika.',
      },
      {
        heading: '10. Privatezza tat-tfal',
        body: 'Roots Tunisia mhuwiex maħsub għal tfal taħt is-16-il sena mingħajr kunsens verifikabbli tal-ġenituri.',
      },
      {
        heading: '11. Sigurtà tad-dejta',
        body: 'Napplikaw kriptaġġ waqt it-trażmissjoni u miżuri tekniċi u organizzattivi stretti biex nipproteġu l-arkivji tal-familja.',
      },
      {
        heading: '12. Aġġornamenti',
        body: 'Nistgħu naġġornaw din il-Politika perjodikament u ninnotifikaw bidliet materjali qabel ma jidħlu fis-seħħ.',
      },
      {
        heading: '13. Kuntatt',
        body: 'Għal mistoqsijiet dwar il-privatezza jew biex teżerċita d-drittijiet tiegħek, ikkuntattjana miċ-Ċentru ta’ Għajnuna.',
      },
    ],
  },
  cookies: {
    title: 'Politika tal-Cookies',
    intro:
      'Din il-Politika tispjega kif Roots Tunisia tuża l-cookies u l-ħażna lokali, u kif tista’ timmaniġġja l-preferenzi tiegħek.',
    sections: [
      {
        heading: '1. X’inhuma l-cookies?',
        body: 'Il-cookies huma fajls żgħar ta’ test maħżuna mill-brawżer tiegħek biex iżommu s-sessjoni sigura u jiftakru l-għażliet tiegħek.',
      },
      {
        heading: '2. Tipi ta’ cookies li nużaw',
        body: 'Nużaw cookies essenzjali (awtentikazzjoni JWT), cookies tal-preferenzi (lingwa magħżula fost Franċiż, Ingliż, Għarbi, Spanjol, Taljan jew Malti u tema viżiva) u analitika anonima. Qatt ma nużaw cookies għar-reklamar.',
      },
      {
        heading: '3. Kunsens minn qabel',
        body: 'Cookies mhux essenzjali jiġu attivati biss wara li tagħti l-kunsens tiegħek permezz tal-istrixxa «Preferenzi tal-Cookies».',
      },
      {
        heading: '4. Sinjali ta’ esklużjoni awtomatika',
        body: 'Nirrispettaw sinjali rikonoxxuti tal-privatezza bħal Global Privacy Control fejn mitlub mil-liġi.',
      },
      {
        heading: '5. Ġestjoni tal-preferenzi',
        body: 'Tista’ tibdel jew tirtira l-kunsens tiegħek fi kwalunkwe ħin mill-ħolqa «Preferenzi tal-Cookies» f’qiegħ il-paġna jew mill-issettjar tal-brawżer.',
      },
      {
        heading: '6. Fornituri tekniċi',
        body: 'Fornituri tal-infrastruttura joperaw taħt ftehimiet stretti ta’ kunfidenzjalità.',
      },
      {
        heading: '7. Bidliet f’din il-Politika',
        body: 'Naġġornaw din il-paġna meta jinbidlu t-teknoloġiji jew il-liġijiet applikabbli.',
      },
    ],
  },
  refund: {
    title: 'Politika ta’ Rifużjoni u Kanċellazzjoni',
    intro:
      'Din il-Politika tistabbilixxi t-termini ċari u ġusti għall-abbonamenti, aċċessi diġitali u talbiet ta’ rifużjoni fuq Roots Tunisia skont il-liġijiet tal-konsumatur.',
    sections: [
      {
        heading: '1. Fatturazzjoni u kanċellazzjoni tal-abbonament',
        body: 'L-abbonamenti jiġu fatturati kull xahar jew kull sena. Tista’ tikkanċella fi kwalunkwe ħin mis-Settings tiegħek jew billi tikteb lil devteam@rootstunisia.com, u l-aċċess jibqa’ attiv sal-aħħar tal-perjodu diġà mħallas.',
      },
      {
        heading: '2. Dritt legali ta’ rtirar (14-il jum)',
        body: 'Skont ir-regoli tal-protezzjoni tal-konsumatur fl-UE, ir-Renju Unit u t-Tuneżija, klijenti eliġibbli għandhom dritt għal rifużjoni sħiħa fi żmien 14-il jum mill-ewwel xiri, sakemm ma jkunux bdew tniżżil diġitali estensiv b’kunsens espress.',
      },
      {
        heading: '3. Dokumenti diġitali u tniżżil individwali',
        body: 'Minħabba l-aċċess immedjat għal skens HD u fajls GEDCOM, ħlasijiet uniċi ma jiġux rimborżati wara l-kunsinna, ħlief jekk il-fajl ikun korrott, ma jinqarax jew ikun ħażin minħabba żball tagħna.',
      },
      {
        heading: '4. Proċess u żmien tar-rifużjoni',
        body: 'Biex titlob rifużjoni, ibgħat email lil devteam@rootstunisia.com bl-email tal-kont, id-data tat-tranżazzjoni u r-raġuni. It-talbiet jiġu riveduti fi żmien 3 ijiem tax-xogħol u l-ħlas lura jsir fi żmien 5 sa 10 ijiem tax-xogħol.',
      },
      {
        heading: '5. Ħsarat tekniċi fit-tul',
        body: 'Jekk ħsara teknika fit-tul iżżommok milli tuża l-pjan imħallas tiegħek, nagħtuk kreditu jew rifużjoni proporzjonata wara verifika teknika.',
      },
      {
        heading: '6. Drittijiet statutorji tal-konsumatur',
        body: 'Xejn f’din il-politika ma jillimita d-drittijiet legali tiegħek skont il-liġi Tuneżina tal-konsumatur (Liġi Nru 98-40) jew il-liġijiet ta’ pajjiżek.',
      },
    ],
  },
};

export const SEED_DOCUMENTS_BY_LOCALE: Record<LegalLocale, Record<LegalSlug, SeedLegalDocument>> = {
  en: EN_SEEDS,
  fr: FR_SEEDS,
  ar: AR_SEEDS,
  es: ES_SEEDS,
  it: IT_SEEDS,
  mt: MT_SEEDS,
};

