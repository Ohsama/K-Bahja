type Translations = {
  [key: string]: {
    ar: string;
    fr: string;
  };
};

export const dict: Translations = {
  // Auth Screen
  appName: {
    ar: 'بهجة',
    fr: 'Bahja'
  },
  appSlogan: {
    ar: 'لتنظيم مناسباتك بكل سهولة',
    fr: 'Organisez vos événements en toute simplicité'
  },
  loginTab: {
    ar: 'تسجيل الدخول',
    fr: 'Connexion'
  },
  registerTab: {
    ar: 'حساب جديد',
    fr: "S'inscrire"
  },
  fullNamePlaceholder: {
    ar: 'الاسم الكامل',
    fr: 'Nom complet'
  },
  emailPlaceholder: {
    ar: 'البريد الإلكتروني',
    fr: 'Adresse e-mail'
  },
  passwordPlaceholder: {
    ar: 'كلمة المرور',
    fr: 'Mot de passe'
  },
  submitLogin: {
    ar: 'تأكيد الدخول',
    fr: 'Se connecter'
  },
  submitRegister: {
    ar: 'تأكيد التسجيل',
    fr: "S'inscrire"
  },
  providerQueryTitle: {
    ar: 'مقدم خدمات متخصص؟',
    fr: 'Fournisseur de services?'
  },
  providerQuerySubtitle: {
    ar: 'سجل أعمالك مباشرة من هنا',
    fr: 'Inscrivez votre entreprise ici'
  },
  loginError: {
    ar: 'الرجاء إدخال البريد الإلكتروني وكلمة المرور',
    fr: 'Veuillez entrer votre email et mot de passe'
  },
  registerError: {
    ar: 'الرجاء ملء جميع الحقول',
    fr: 'Veuillez remplir tous les champs'
  },
  
  // Profile Screen
  profileSettingsLabel: {
    ar: 'الحساب والإعدادات',
    fr: 'Compte et Paramètres'
  },
  personalInfoTitle: {
    ar: 'المعلومات الشخصية',
    fr: 'Informations personnelles'
  },
  personalInfoSubtitle: {
    ar: 'تعديل التفضيلات واسم العرض',
    fr: 'Modifier les préférences et le nom'
  },
  accountSettingsTitle: {
    ar: 'إعدادات الحساب',
    fr: 'Paramètres du compte'
  },
  accountSettingsSubtitle: {
    ar: 'تغيير كلمة المرور وتفضيلات الإشعارات',
    fr: 'Changer le mot de passe et les alertes'
  },
  paymentMethodsTitle: {
    ar: 'طرق الدفع',
    fr: 'Méthodes de paiement'
  },
  paymentMethodsSubtitle: {
    ar: 'إدارة البطاقات المرتبطة',
    fr: 'Gérer les cartes liées'
  },
  languageToggleTitle: {
    ar: 'لغة التطبيق / Langue',
    fr: 'Langue / لغة التطبيق'
  },
  languageToggleSubtitle: {
    ar: 'تغيير لغة الواجهة إلى الفرنسية',
    fr: "Changer la langue vers l'Arabe"
  },
  logoutBtn: {
    ar: 'تسجيل الخروج',
    fr: 'Se déconnecter'
  },
  logoutConfirmTitle: {
    ar: 'تسجيل الخروج',
    fr: 'Déconnexion'
  },
  logoutConfirmBody: {
    ar: 'هل أنت متأكد أنك تريد تسجيل الخروج من حسابك؟',
    fr: 'Êtes-vous sûr de vouloir vous déconnecter?'
  },
  cancel: {
    ar: 'إلغاء',
    fr: 'Annuler'
  },
  confirm: {
    ar: 'تأكيد',
    fr: 'Confirmer'
  },
  adminRole: {
    ar: 'مدير النظام',
    fr: 'Administrateur'
  },
  customerRole: {
    ar: 'زبون مميز',
    fr: 'Client VIP'
  },

  // Navigation Tabs
  tabHome: {
    ar: 'الرئيسية',
    fr: 'Accueil'
  },
  tabAppointments: {
    ar: 'حجوزاتي',
    fr: 'Réservations'
  },
  tabProfile: {
    ar: 'حسابي',
    fr: 'Mon Profil'
  },

  // Home Screen
  searchHint: {
    ar: 'ما الخدمة التي تبحث عنها؟',
    fr: 'Quel service recherchez-vous?'
  },
  servicesSection: {
    ar: 'الخدمات',
    fr: 'Services'
  },
  noServicesText: {
    ar: 'لا توجد خدمات متاحة حالياً.',
    fr: 'Aucun service disponible actuellement.'
  },
  viewMore: {
    ar: 'عرض المزيد',
    fr: 'Voir plus'
  },
  matchingProviders: {
    ar: 'مزودي الخدمات المتطابقين',
    fr: 'Prestataires correspondants'
  },
  serviceLabel: {
    ar: 'خدمة',
    fr: 'Service'
  },
  onDemand: {
    ar: 'حسب الطلب',
    fr: 'Sur demande'
  },
  profileLabel: {
    ar: 'الملف',
    fr: 'Profil'
  },

  // Home Screen - Payment & Booking Flow
  securePaymentTitle: {
    ar: 'دفع آمن عبر بريدي موب',
    fr: 'Paiement sécurisé via BaridiMob'
  },
  securePaymentDesc: {
    ar: 'احجز خدماتك بسهولة وادفع بأمان عبر تطبيق Baridimob',
    fr: 'Réservez facilement et payez en toute sécurité via Baridimob'
  },
  howToBookTitle: {
    ar: 'كيف تحجز؟',
    fr: 'Comment réserver?'
  },
  step1Title: {
    ar: 'اختر خدمة',
    fr: 'Choisissez un service'
  },
  step1Desc: {
    ar: 'تصفح الخدمات المتاحة وحدد المناسبة',
    fr: 'Parcourez les services disponibles'
  },
  step2Title: {
    ar: 'تواصل / احجز',
    fr: 'Contactez'
  },
  step2Desc: {
    ar: 'تواصل مع صاحب الخدمة وحدد التفاصيل',
    fr: 'Contactez le prestataire et fixez les détails'
  },
  step3Title: {
    ar: 'ادفع بأمان',
    fr: 'Payez'
  },
  step3Desc: {
    ar: 'ادفع عبر Baridimob وتأكد من الحجز',
    fr: 'Payez en toute sécurité via Baridimob'
  },
  bookNowBtn: {
    ar: 'احجز خدمتك الان',
    fr: 'Réserver maintenant'
  },
  bookFirstAlert: {
    ar: 'الرجاء اختيار خدمة من قائمة الخدمات أعلاه أولاً.',
    fr: "Veuillez d'abord choisir un service dans la liste."
  },

  // Appointments Screen
  orderIdPrefix: {
    ar: 'طلب رقم: ',
    fr: 'Commande Numéro: '
  },
  payNowToAuth: {
    ar: 'ادفع الآن لتأكيد الحجز',
    fr: 'Payez maintenant pour confirmer'
  },
  payCashToProvider: {
    ar: 'يرجى تسديد المبلغ نقداً لصاحب الخدمة',
    fr: 'Veuillez payer en espèces au prestataire'
  },
  myAppointmentsTitle: {
    ar: 'حجوزاتي',
    fr: 'Mes Réservations'
  },
  noAppointments: {
    ar: 'ليس لديك أي مواعيد قادمة.',
    fr: "Vous n'avez pas de rendez-vous à venir."
  },

  // Payment Modal
  paymentMethodModal: {
    ar: 'طريقة الدفع',
    fr: 'Méthode de paiement'
  },
  paymentGatewaySubtitle: {
    ar: 'بوابة دفع آمنة - اختر طريقتك المفضلة',
    fr: 'Passerelle sécurisée - Choisissez votre méthode'
  },
  successOp: {
    ar: 'نجاح العملية',
    fr: 'Opération réussie'
  },
  successPaidCib: {
    ar: 'تم الدفع بنجاح عبر البطاقة الذهبية!',
    fr: 'Paiement effectué avec succès via Edahabia!'
  },
  processingCIB: {
    ar: 'جاري معالجة بطاقة الذهبية/CIB...',
    fr: 'Traitement de la carte Edahabia/CIB...'
  },
  dontCloseWindow: {
    ar: 'يرجى عدم إغلاق النافذة',
    fr: 'Veuillez ne pas fermer cette fenêtre'
  },
  edahabiaCib: {
    ar: 'البطاقة الذهبية / CIB',
    fr: 'Carte Edahabia / CIB'
  },
  payCashOnArrival: {
    ar: 'الدفع نقداً عند الوصول',
    fr: "Paiement en espèces à l'arrivée"
  },
  cashAlertTitle: {
    ar: 'من فضلك احتفظ بالمبلغ',
    fr: 'Veuillez conserver le montant'
  },
  cashAlertDesc: {
    ar: 'الرجاء دفع المبلغ كاملاً نقداً عند وصولك لمكان الخدمة.',
    fr: "Veuillez payer la totalité en espèces à votre arrivée."
  },

  // Account Settings Screen residual
  newPasswordLabel: {
    ar: 'كلمة المرور الجديدة',
    fr: 'Nouveau mot de passe'
  },
  confirmPasswordLabel: {
    ar: 'تأكيد كلمة المرور',
    fr: 'Confirmer le mot de passe'
  },
  updatePasswordBtn: {
    ar: 'تحديث كلمة المرور',
    fr: 'Mettre à jour'
  },

  // Personal Info Screen residual
  changeAvatarLabel: {
    ar: 'تغيير الصورة الشخصية',
    fr: "Changer la photo de profil"
  },
  fullNameLabel: {
    ar: 'الاسم الكامل',
    fr: 'Nom Complet'
  },
  phoneLabel: {
    ar: 'رقم الهاتف',
    fr: 'Numéro de téléphone'
  },
  phonePlaceholder: {
    ar: 'مثال: 0550000000',
    fr: 'Exemple: 0550000000'
  },
  saveChangesBtn: {
    ar: 'حفظ التغييرات',
    fr: 'Enregistrer'
  },

  // Payment Methods Screens residual
  deleteBtn: {
    ar: 'حذف',
    fr: 'Supprimer'
  },
  addNewCardLabel: {
    ar: 'إضافة بطاقة جديدة',
    fr: 'Ajouter une carte'
  },
  edahabiaCardName: {
    ar: 'الذهبية',
    fr: 'Edahabia'
  },
  emptyCardsText: {
    ar: 'لا توجد بطاقات محفوظة حالياً.',
    fr: 'Aucune carte enregistrée.'
  },
  cardNumberLabel: {
    ar: 'رقم البطاقة (الذهبية/CIB)',
    fr: 'Numéro de carte (Edahabia/CIB)'
  },
  addSaveBtn: {
    ar: 'إضافة وحفظ',
    fr: 'Ajouter et Enregistrer'
  },
  
  // Location Picker Elements
  allCities: {
    ar: 'كل المدن',
    fr: 'Toutes les villes'
  },
  chooseCityTitle: {
    ar: 'اختر المدينة',
    fr: 'Choisir la ville'
  },
  wilayaLabel: {
    ar: 'الولاية',
    fr: 'Wilaya'
  },
  chooseWilayaHint: {
    ar: 'اختر الولاية...',
    fr: 'Choisissez la wilaya...'
  },
  dairaLabel: {
    ar: 'الدائرة',
    fr: 'Daïra'
  },
  chooseDairaHint: {
    ar: 'اختر الدائرة...',
    fr: 'Choisissez la daïra...'
  },
  applyFilterBtn: {
    ar: 'تطبيق الفلتر',
    fr: 'Appliquer le filtre'
  },
  clearFilterBtn: {
    ar: 'مسح الاختيار',
    fr: 'Effacer'
  },

  // Home Screen Instructions
  bookFirstAlertContent: {
    ar: 'يمكنك تحديد الولاية والدائرة من الزر بالأعلى لرؤية مزودي الخدمات في منطقتك فقط، أو تصفح الجميع في كافة أنحاء الجزائر.\n\nبعدها اختر الخدمة المناسبة، تصفح ملفات وأعمال المزودين واحجز مع تعبئة التفاصيل الضرورية.\n\nسيتم الاتصال بك لتأكيد الموعد وستتمكن من متابعة حالة الحجز في نافذة طلباتي حتى النهاية!',
    fr: "Vous pouvez filtrer par Wilaya et Daïra via le bouton en haut pour voir uniquement les prestataires locaux.\n\nChoisissez ensuite un service, consultez les portfolios, et réservez en fournissant les détails.\n\nVous recevrez un appel de confirmation et pourrez suivre vos réservations dans 'Mes Commandes' jusqu'à leur finalisation !"
  },
  instructionsTitle: {
    ar: 'كيفية الحجز',
    fr: 'Comment Réserver'
  },
  okGotItBtn: {
    ar: 'حسناً، فهمت',
    fr: "D'accord, compris"
  },

  // Service Fallbacks (DB)
  'قاعات الأفراح': {
    ar: 'قاعات الأفراح',
    fr: 'Salles des fêtes'
  },
  'قاعات الافراح': {
    ar: 'قاعات الأفراح',
    fr: 'Salles des fêtes'
  },
  'صالونات الحلاقة و التجميل': {
    ar: 'صالونات الحلاقة و التجميل',
    fr: 'Salons de coiffure et beauté'
  },
  'حلاقة و تجميل': {
    ar: 'حلاقة و تجميل',
    fr: 'Coiffure et Beauté'
  },
  'ديجي': {
    ar: 'ديجي',
    fr: 'DJ'
  },
  'التصوير والفيديو': {
    ar: 'التصوير والفيديو',
    fr: 'Photographie et Vidéo'
  },
  'فوتوغراف': {
    ar: 'فوتوغراف',
    fr: 'Photographie'
  },
  'محل كراء الفساتين': {
    ar: 'محل كراء الفساتين',
    fr: 'Location de robes'
  },
  'محل الحلويات': {
    ar: 'محل الحلويات',
    fr: 'Pâtisserie'
  },
  'محل كراء الديكور': {
    ar: 'محل كراء الديكور',
    fr: 'Location de décoration'
  },
  'محل الورود': {
    ar: 'محل الورود',
    fr: 'Fleuriste'
  },
  'كراء السيارات': {
    ar: 'كراء السيارات',
    fr: 'Location de voitures'
  },
  'خيالة وبارود': {
    ar: 'خيالة وبارود',
    fr: 'Cavalerie et Baroud'
  },
  'حجز صالات وقاعات الحفلات (Salles de Fêtes)': {
    ar: 'حجز صالات وقاعات الحفلات (Salles de Fêtes)',
    fr: 'Réservation de salles des fêtes'
  },
  'تجميل عرائس، حلاقة رجال': {
    ar: 'تجميل عرائس، حلاقة رجال',
    fr: 'Coiffure hommes et femmes'
  },
  'مصورين محترفين لجلسات التصوير والفيديو': {
    ar: 'مصورين محترفين لجلسات التصوير والفيديو',
    fr: 'Photographes professionnels pour séances'
  },

  // Provider Navigation
  tabProviderOrders: {
    ar: 'طلباتي',
    fr: 'Mes Commandes'
  },
  tabProviderPortfolio: {
    ar: 'أعمالي',
    fr: 'Mon Portfolio'
  },

  // Provider Portfolio Screen
  providerPortfolioTitle: {
    ar: 'معرض أعمالي',
    fr: 'Mon Portfolio'
  },
  providerPortfolioSubtitle: {
    ar: 'شارك أعمالك ليراها الزبائن',
    fr: 'Partagez votre travail avec les clients'
  },
  providerNoPosts: {
    ar: 'لا يوجد لديك أي منشورات بعد. ابدأ بمشاركة أعمالك!',
    fr: "Vous n'avez pas encore de publications. Partagez votre travail!"
  },
  newPostModalTitle: {
    ar: 'منشور جديد',
    fr: 'Nouvelle Publication'
  },
  attachImageHint: {
    ar: 'انقر لإرفاق صورة العمل (اختياري)',
    fr: 'Cliquez pour joindre une photo (Optionnel)'
  },
  captionLabel: {
    ar: 'النص (اختياري)',
    fr: 'Texte (Optionnel)'
  },
  captionPlaceholder: {
    ar: 'اكتب وصفاً أو تفاصيل العمل الترويجي...',
    fr: 'Écrivez une description ou les détails...'
  },
  publishNowBtn: {
    ar: 'نشر الآن',
    fr: 'Publier maintenant'
  },
  postValidation: {
    ar: 'يرجى إرفاق صورة أو كتابة نص للمنشور.',
    fr: 'Veuillez joindre une image ou écrire un texte.'
  },
  postFailMsg: {
    ar: 'فشل إضافة المنشور.',
    fr: "Échec de l'ajout de la publication."
  },
  confirmDeletePostMsg: {
    ar: 'هل أنت متأكد من حذف هذا المنشور؟',
    fr: 'Êtes-vous sûr de vouloir supprimer cette publication?'
  },

  // Provider Orders Screen
  providerOrdersTitle: {
    ar: 'طلباتي المعلقة',
    fr: 'Commandes en attente'
  },
  providerOrdersSubtitle: {
    ar: 'الطلبات المعتمدة من الإدارة بانتظار التنفيذ',
    fr: "Commandes approuvées en attente d'exécution"
  },
  emptyOrdersText: {
    ar: 'لا توجد طلبات معتمدة بانتظار التنفيذ.',
    fr: "Aucune commande en attente d'exécution."
  },
  orderCustomerLabel: {
    ar: 'الزبون: ',
    fr: 'Client: '
  },
  orderPhoneLabel: {
    ar: 'الهاتف: ',
    fr: 'Téléphone: '
  },
  phoneUnavailable: {
    ar: 'غير متوفر',
    fr: 'Indisponible'
  },
  orderStatusConfirmed: {
    ar: 'معتمد وجاري',
    fr: 'Approuvé et en cours'
  },
  cancelOrderBtn: {
    ar: 'إلغاء الطلب',
    fr: 'Annuler la commande'
  },
  finishOrderBtn: {
    ar: 'إنهاء العملية',
    fr: 'Terminer'
  },
  orderCompletedWaitCommission: {
    ar: 'تم الإنهاء.. بانتظار استلام الإدارة للعمولة',
    fr: 'Terminé.. en attente de la commission par l\'Admin'
  },
  cancelConfirmDesc: {
    ar: 'هل أنت متأكد من إلغاء هذا الطلب؟',
    fr: 'Êtes-vous sûr de vouloir annuler cette commande?'
  },
  goBack: {
    ar: 'تراجع',
    fr: 'Retour'
  },
  confirmCancel: {
    ar: 'تأكيد الإلغاء',
    fr: "Confirmer l'annulation"
  },
  payCompleteTitle: {
    ar: 'إتمام الحجز واستلام النقود',
    fr: 'Finaliser et encaisser'
  },
  payCompleteDesc: {
    ar: 'أدخل إجمالي المبلغ النهائي الذي استلمته من الزبون. سيتم احتساب عمولة المنصة بشكل تلقائي.',
    fr: 'Entrez le montant total reçu du client. La commission de la plateforme sera calculée.'
  },
  amountReceivedLabel: {
    ar: 'المبلغ المستلم (بـ الدينار الجزائري):',
    fr: 'Montant reçu (en DZD):'
  },
  amountPlaceholder: {
    ar: 'مثال: 15000',
    fr: 'Exemple: 15000'
  },
  confirmSendBtn: {
    ar: 'تأكيد وإرسال',
    fr: 'Confirmer et envoyer'
  },

  // Update Manager (OTA)
  appUpdateTitle: {
    ar: 'تحديثات التطبيق',
    fr: "Mises à jour de l'application"
  },
  appUpdateDesc: {
    ar: 'تحقق من وجود أي تحديثات جديدة لتحسين تجربة استخدامك للتطبيق مباشرة بدون انتظار جوجل بلاي.',
    fr: "Vérifiez s'il y a de nouvelles mises à jour pour améliorer votre expérience sans attendre le Google Play Store."
  },
  appUpdateSuccess: {
    ar: 'تم تحميل التحديث بنجاح! يرجى إعادة التشغيل لتطبيقه.',
    fr: "Mise à jour téléchargée avec succès ! Veuillez redémarrer pour l'appliquer."
  },
  appUpdateApplyBtn: {
    ar: 'إعادة التشغيل وتطبيق التحديث',
    fr: "Redémarrer et appliquer la mise à jour"
  },
  appUpdateSearching: {
    ar: 'جاري البحث...',
    fr: 'Recherche en cours...'
  },
  appUpdateDownloading: {
    ar: 'جاري التحميل...',
    fr: 'Téléchargement en cours...'
  },
  appUpdateCheckBtn: {
    ar: 'البحث عن تحديثات الآن',
    fr: 'Rechercher des mises à jour'
  },
  appUpdateUpToDate: {
    ar: 'تطبيقك محدث لآخر إصدار!',
    fr: 'Votre application est à jour !'
  },
  
  // Auto Update Popup
  updateAvailableTitle: {
    ar: 'تحديث جديد متوفر!',
    fr: 'Nouvelle mise à jour !'
  },
  updateAvailableDesc: {
    ar: 'قمنا بإضافة ميزات وتحسينات جديدة على التطبيق. هل ترغب بالتحديث الآن للحصول على أفضل تجربة؟',
    fr: 'Nous avons apporté des améliorations et de nouvelles fonctionnalités. Voulez-vous mettre à jour maintenant ?'
  },
  updateNowBtn: {
    ar: 'تحديث الآن',
    fr: 'Mettre à jour'
  },
  updateLaterBtn: {
    ar: 'لاحقاً',
    fr: 'Plus tard'
  },
  
  // Admin Service Icons & Navs
  chooseServiceIcon: {
    ar: 'اختر أيقونة الصنف',
    fr: "Sélectionnez l'icône du service"
  },
  moreIcons: {
    ar: 'المزيد',
    fr: 'Plus'
  },
  iconLibrary: {
    ar: 'مكتبة الأيقونات',
    fr: 'Bibliothèque des icônes'
  },
  
  // Admin Screens Central
  adminDashboardWelcome: {
    ar: 'مرحباً بعودتك',
    fr: 'Bienvenue'
  },
  adminDashboardSubtitle: {
    ar: 'مدير النظام',
    fr: 'Administrateur'
  },
  adminDashboardStatsOverview: {
    ar: 'نظرة عامة على الإحصائيات',
    fr: 'Aperçu des statistiques'
  },
  adminDashboardActiveProviders: {
    ar: 'المزودين النشطين',
    fr: 'Prestataires actifs'
  },
  adminDashboardPendingActions: {
    ar: 'إجراءات معلقة',
    fr: 'Actions en attente'
  },
  adminDashboardTotalRevenue: {
    ar: 'إجمالي الأرباح',
    fr: 'Revenus totaux'
  },
  adminManageServicesTitle: {
    ar: 'إدارة الأصناف',
    fr: 'Gestion des services'
  },
  adminManageServicesDesc: {
    ar: 'التحكم في تصنيفات الخدمات (Services)',
    fr: 'Contrôler les catégories de services'
  },
  adminAddNewBtn: {
    ar: 'إضافة',
    fr: 'Ajouter'
  },
  adminContentModTitle: {
    ar: 'مراقبة المحتوى',
    fr: 'Modération'
  },
  adminContentModDesc: {
    ar: 'إدارة منشورات ومعارض المزودين',
    fr: 'Gérer les publications des prestataires'
  },

  // Dashboard Supplemental
  adminProfitAnalytics: {
    ar: 'تحليل أرباح المنصة',
    fr: 'Analyse des profits'
  },
  adminProfitByService: {
    ar: 'توزيع الأرباح حسب الخدمة',
    fr: 'Partage des bénéfices par service'
  },
  adminTopProviders: {
    ar: 'تصنيف المزودين الأكثر ربحية',
    fr: 'Classement des prestataires les plus rentables'
  },
  noProfitsYet: {
    ar: 'لا يوجد أرباح مسجلة بعد.',
    fr: 'Aucun profit enregistré pour le moment.'
  },

  // Admin Orders Supplemental
  adminOrdersTitle: {
    ar: 'المراقبة المركزية',
    fr: 'Surveillance Centrale'
  },
  adminOrdersSubtitle: {
    ar: 'لوحة تسيير طلبات المنصة',
    fr: 'Tableau de bord de gestion des commandes'
  },
  tabNewOrders: {
    ar: 'طلبات جديدة',
    fr: 'Nouvelles'
  },
  tabConfirmed: {
    ar: 'معتمدة للمزود',
    fr: 'Confirmées'
  },
  tabWaiting: {
    ar: 'تحصيل العمولة',
    fr: 'Commission'
  },
  tabDone: {
    ar: 'مكتملة',
    fr: 'Terminées'
  },
  tabCancelled: {
    ar: 'ملغاة',
    fr: 'Annulées'
  },
  noOrdersInList: {
    ar: 'لا توجد طلبات في هذه القائمة.',
    fr: 'Aucune commande dans cette liste.'
  },
  orderDetailsTitle: {
    ar: 'لوحة التحكم بالطلب',
    fr: 'Panneau de contrôle de commande'
  },
  orderNumber: {
    ar: 'رقم الطلب: ',
    fr: 'Commande n°: '
  },
  customerPhone: {
    ar: 'هاتف الزبون: ',
    fr: 'Tél. Client: '
  },
  noCustomerPhone: {
    ar: 'بدون هاتف!',
    fr: 'Pas de téléphone!'
  },
  customerNote: {
    ar: 'رسالة الزبون:',
    fr: 'Message du client:'
  },
  noCustomerNote: {
    ar: 'لم يترك الزبون أي تفاصيل نصية إضافية.',
    fr: 'Le client n\'a pas laissé de détails supplémentaires.'
  },
  attachmentsTitle: {
    ar: 'مرفقات الطلب (صور):',
    fr: 'Pièces jointes (Photos):'
  },
  noAttachments: {
    ar: 'لا توجد صور مرفقة.',
    fr: 'Aucune photo jointe.'
  },
  adminForceOverrideStatus: {
    ar: 'تغيير حالة الطلب إجبارياً كمسؤول:',
    fr: 'Forcer le changement de statut (Admin):'
  },
  statusNewSubmitted: {
    ar: 'جديد (Submitted)',
    fr: 'Nouveau (Submitted)'
  },
  statusConfirmedProvider: {
    ar: 'للمزود (Confirmed)',
    fr: 'Prestataire (Confirmed)'
  },
  statusWaitingPay: {
    ar: 'دفع (Waiting)',
    fr: 'Paiement (Waiting)'
  },
  statusPaidDone: {
    ar: 'مسدد (Paid/Done)',
    fr: 'Payé (Paid/Done)'
  },
  statusCancelFinal: {
    ar: 'إلغاء نهائي (Cancel)',
    fr: 'Annulation finale (Cancel)'
  },
  confirmToProvider: {
    ar: 'تأكيد التحويل للمزود',
    fr: 'Confirmer le transfert au prestataire'
  },
  confirmToProviderMsg: {
    ar: 'هل اتصلت بالطرفين وتأكدت من الموعد؟ سيتم إرسال الطلب الآن للمزود.',
    fr: 'Avez-vous contacté les deux parties ? La demande sera envoyée au prestataire.'
  },
  confirmPaymentRecv: {
    ar: 'تأكيد استلام العمولة',
    fr: 'Confirmer la réception de la commission'
  },
  confirmPaymentMsg: {
    ar: 'هل استلمت مبلغ العمولة من المزود نقداً؟',
    fr: 'Avez-vous reçu la commission du prestataire en espèces?'
  },
  detailsAndAttachments: {
    ar: 'التفاصيل والملحقات',
    fr: 'Détails et Pièces jointes'
  },
  approveForProviderBtn: {
    ar: 'اعتماد للمزود',
    fr: 'Approuver'
  },
  adminCommissionDue: {
    ar: 'بذمة المزود (عمولة): ',
    fr: 'Commission due: '
  },
  adminTreatedBy: {
    ar: 'يعالج بواسطة: ',
    fr: 'Traité par: '
  },
  cashReceiptBtn: {
    ar: 'استلام النقود',
    fr: 'Encaissement'
  },
  closeBtn: {
    ar: 'إغلاق',
    fr: 'Fermer'
  }
};
