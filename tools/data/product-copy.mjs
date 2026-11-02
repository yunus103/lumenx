// LUMENX product copy: rewritten descriptions, product-specific spec rows and option fixes, keyed by the
// Light Design slug in lightdesign.json. Applied by tools/apply-copy.mjs. Shapes are taken from the studio
// photos; facts (materials, sizes, options) only from Light Design's data. Product rows are merged over the
// category table by label (src/lib/catalog.ts mergeSpecs), so only what differs is listed here.

const SAC = ["Malzeme", "Alüminyum ve sac, boya veya kaplama"];
const WOOD = (shade) => ["Malzeme", `Ahşap gövde, ${shade}`];
const MOSAIC = ["Malzeme", "Metal gövde, el yapımı mozaik cam"];
const GLASS = ["Malzeme", "Metal gövde, cam abajur"];
const STATION = [["Uyumluluk", "Şarjlı masa lambası ve garson çağırma serisi"], ["Kullanım", "İç mekân"], ["Menşei", "Türkiye"]];

export const CATEGORY_SPECS = {
  "sarjli-masa-lambasi": [
    ["Işık kaynağı", "Samsung 2835 SMD LED"],
    ["Işık ayarı", "Dokunmatik, 3 kademe dimmer"],
    ["Güç", "3 W (Ekonomik) / 5 W (Premium)"],
    ["Batarya", "Li-ion 1×18650 1500 mAh / 2×18650 1500–2200 mAh"],
    ["Kullanım süresi", "Premium'da tam şarjla 30 saate kadar, ışık seviyesine bağlı"],
    ["Şarj süresi", "Ortalama 8 saat"],
    ["Güç girişi", "5 V / 2 A"],
    ["Malzeme", "Alüminyum ve DKP sac, boya veya kaplama"],
    ["Ağırlık", "Yaklaşık 1 kg"],
    ["Koruma sınıfı", "IP20, iç mekân"],
    ["Sertifikalar", "CE, ISO, RoHS, MSDS"],
    ["Şarj seçenekleri", "Tekli kaset veya 9 / 18 / 27 / 36'lı istasyon"],
    ["Garanti", "Elektronik aksamda 2 yıl"],
    ["Menşei", "Türkiye"],
  ],
  "garson-cagirma": [
    ["Çağrı", "Masadaki çağrı butonu"],
    ["Işık kaynağı", "Samsung 2835 SMD LED"],
    ["Işık ayarı", "Dokunmatik, 3 kademe dimmer"],
    ["Güç", "3 W (Ekonomik) / 5 W (Premium)"],
    ["Batarya", "Li-ion 1×18650 1500 mAh / 2×18650 1500–2200 mAh"],
    ["Güç girişi", "5 V / 2 A"],
    ["Malzeme", "Alüminyum ve DKP sac, boya veya kaplama"],
    ["Ağırlık", "Yaklaşık 1 kg"],
    ["Koruma sınıfı", "IP20, iç mekân"],
    ["Sertifikalar", "CE, ISO, RoHS, MSDS"],
    ["Şarj seçenekleri", "Tekli kaset veya 9 / 18 / 27 / 36'lı istasyon"],
    ["Garanti", "Elektronik aksamda 2 yıl"],
    ["Menşei", "Türkiye"],
  ],
  "aplik-ve-lambader": [
    ["Işık kaynağı", "Samsung 2835 SMD LED"],
    ["Işık ayarı", "Dokunmatik, 3 kademe dimmer"],
    ["Bağlantı", "Kablosuz, şarjlı LED modül"],
    ["Malzeme", "Alüminyum ve DKP sac, boya veya kaplama"],
    ["Ağırlık", "Yaklaşık 1 kg"],
    ["Koruma sınıfı", "IP20, iç mekân"],
    ["Sertifikalar", "CE, ISO, RoHS, MSDS"],
    ["Menşei", "Türkiye"],
  ],
  // stations list their own rows (capacity first), see STATION below
  "sarj-istasyonlari": [],
};

export const COPY = {
  // ─── Charging stations ─────────────────────────────────────────────────────
  "9lu-sarj-istasyonu-ekonomik": {
    d: [
      "Dokuz lambayı aynı anda şarj eden, ayaklı yuvarlak bir istasyon. Lambalar üst tabladaki yuvalara oturur, kablo karmaşası olmaz.",
      "Az sayıda masası olan kafe ve restoranlar için bütçe dostu başlangıç seçeneği.",
    ],
    specs: [["Kapasite", "9 lamba"], ["Ölçüler", "Yükseklik 39 cm, çap 54 cm"], ["Seri", "Ekonomik"], ...STATION],
  },
  "9lu-sarj-istasyonu": {
    name: "9'lu Şarj İstasyonu - Premium",
    d: [
      "Dokuz yuvalı, alçak ve düz bir şarj tablası. Tezgâh altına ya da bir rafa sığacak kadar basık olduğu için servis alanında yer kaplamaz.",
      "Lambalar gün sonunda yuvalarına bırakılır, ertesi akşam tam şarjla masaya döner.",
    ],
    specs: [["Kapasite", "9 lamba"], ["Ölçüler", "45 × 54 cm, yükseklik 9 cm"], ["Seri", "Premium"], ...STATION],
  },
  "18li-sarj-istasyonu-ekonomik": {
    d: [
      "On sekiz lambayı tek noktada toplayan, dikey kurgulu ekonomik istasyon. Küçük bir taban alanında iki katlı şarj kapasitesi sunar.",
      "Orta ölçekli bir salonun tüm masa lambalarını tek gece şarjına hazırlamak için yeterlidir.",
    ],
    specs: [["Kapasite", "18 lamba"], ["Ölçüler", "Yükseklik 74 cm, çap 54 cm"], ["Seri", "Ekonomik"], ...STATION],
  },
  "18li-sarj-istasyonu": {
    name: "18'li Şarj İstasyonu - Premium",
    d: [
      "İki raflı, siyah metal gövdeli şarj ünitesi. Her rafta dokuz yuva bulunur, lambalar dik ve düzenli durur.",
      "Raflar arasındaki 40 cm'lik mesafe uzun gövdeli modellerin de rahatça sığmasını sağlar.",
    ],
    specs: [["Kapasite", "18 lamba"], ["Ölçüler", "45 × 54 cm, yükseklik 61 cm"], ["Raf arası", "40 cm"], ["Seri", "Premium"], ...STATION],
  },
  "27li-sarj-istasyonu-ekonomik": {
    d: [
      "Üç kat yuvarlak tablalı, kule tipi şarj istasyonu. Yirmi yedi lambayı yaklaşık bir metrelik bir alanda dik olarak toplar.",
      "Büyük salonlar ve çok katlı işletmeler için yerden tasarruf eden ekonomik çözüm.",
    ],
    specs: [["Kapasite", "27 lamba"], ["Ölçüler", "Yükseklik 110 cm, çap 54 cm"], ["Seri", "Ekonomik"], ...STATION],
  },
  "27li-sarj-istasyonu": {
    name: "27'li Şarj İstasyonu - Premium",
    d: [
      "Üç raflı premium şarj ünitesi. Dokuzarlı üç sıra yuva, yirmi yedi lambayı aynı anda şarj eder.",
      "Sağlam metal iskeleti sayesinde yoğun servis temposunda her gün kullanılmak üzere tasarlanmıştır.",
    ],
    specs: [["Kapasite", "27 lamba"], ["Ölçüler", "45 × 54 cm, yükseklik 106 cm"], ["Raf arası", "40 cm"], ["Seri", "Premium"], ...STATION],
  },
  "36li-sarj-istasyonu-ekonomik": {
    d: [
      "Dört katlı kule formunda, otuz altı lambalık ekonomik istasyon. Taban ölçüsü küçük modellerle aynı kalır, kapasite yukarı doğru artar.",
      "Otel restoranları ve etkinlik alanları gibi çok masalı mekânlar için uygundur.",
    ],
    specs: [["Kapasite", "36 lamba"], ["Ölçüler", "Yükseklik 147 cm, çap 54 cm"], ["Seri", "Ekonomik"], ...STATION],
  },
  "36li-sarj-istasyonu": {
    name: "36'lı Şarj İstasyonu - Premium",
    d: [
      "Serinin en büyük ünitesi: dört raf, otuz altı yuva. Tüm salonun lambaları tek bir dolap genişliğinde toplanır ve birlikte şarj olur.",
      "Raflar 40 cm aralıklı olduğundan lambalar başlıkları birbirine değmeden yerleşir.",
    ],
    specs: [["Kapasite", "36 lamba"], ["Ölçüler", "45 × 54 cm, yükseklik 151 cm"], ["Raf arası", "40 cm"], ["Seri", "Premium"], ...STATION],
  },
  "tekli-sarj-kaseti": {
    d: [
      "Tek bir lambayı şarj etmek için kompakt, yuvarlak bir kaset. Lamba üzerine oturtulur, başka bir bağlantı gerekmez.",
      "Az sayıda lamba kullanan mekânlar, ev kullanımı ya da istasyona ek yedek şarj noktası olarak idealdir.",
    ],
    specs: [["Kapasite", "1 lamba"], ["Seri", "Premium"], ...STATION],
  },

  // ─── Wall and floor lamps ──────────────────────────────────────────────────
  "alpha-aplik-kablosuz-modullu": {
    d: [
      "Konik kumaş abajurlu, metal kollu bir duvar apliği. Şarjlı modülü sayesinde duvara elektrik hattı çekmeden monte edilir.",
      "Kiralık mekânlarda, tadilat yapılamayan duvarlarda ya da sonradan aydınlatma eklenmesi gereken köşelerde pratik bir çözümdür.",
    ],
  },
  "alpha-aplik-kablosuz-modullu-1-1": {
    d: [
      "Cam detaylı, kablosuz duvar apliği. Şarjlı LED modülü ile çalışır, montaj için duvarda tesisat gerekmez.",
      "Koridor, lobi ve oda girişlerinde dekoratif ortam ışığı için tasarlanmıştır.",
    ],
  },
  "alpha-aplik-kablosuz-modullu-1": {
    d: [
      "Sade metal gövdeli, kablosuz duvar apliği. Şarjlı modülü sayesinde istenen noktaya kablo izi bırakmadan yerleştirilir.",
      "Otel odaları ve restoran duvarlarında yumuşak, dolaylı bir ortam ışığı sağlar.",
    ],
  },
  "kose-lambader-kablosuz-modullu": {
    d: [
      "Pliseli kumaş abajurlu, kablosuz bir köşe lambaderi. Şarjlı modülü sayesinde priz arama derdi olmadan salonun herhangi bir köşesine taşınabilir.",
      "Lobi, bekleme alanı ve oturma gruplarında sıcak bir ortam ışığı oluşturur.",
    ],
    specs: [["Ağırlık", "2–3 kg"]],
  },

  // ─── Waiter call ───────────────────────────────────────────────────────────
  "garson-cagri-butonu": {
    d: [
      "Masaya yerleştirilen, kompakt silindir gövdeli bir garson çağırma butonu. Misafir tek dokunuşla garsonu çağırır, el kaldırmaya ya da seslenmeye gerek kalmaz.",
      "Masa lambalarıyla aynı kaplama renklerinde üretildiği için masadaki diğer ürünlerle uyumlu durur.",
    ],
  },
  "alphecca-garson-cagirma": {
    d: [
      "Silindir başlıklı, kısa ve tok gövdeli bir garson çağırma lambası. Masayı aydınlatırken üzerindeki buton ile garsonu çağırma imkânı da verir.",
      "Tek üründe hem masa ışığı hem servis çağrısı isteyen restoran ve kafeler için tasarlanmıştır.",
    ],
  },
  "capella-garon-cagirma": {
    d: [
      "Capella'nın garson çağırma butonlu versiyonu: konik başlık, ince gövde. Masa lambası görünümünü korur, servis çağrısını da üstlenir.",
      "Aynı salonda Capella masa lambasıyla birlikte kullanıldığında masalar arasında görsel bütünlük sağlar.",
    ],
  },
  "caph-garson-cagirma": {
    d: [
      "Mantar başlıklı, ince gövdeli bir garson çağırma lambası. Misafir lambanın üzerindeki butona dokunarak garsonu çağırır.",
      "Sade formu, hem modern hem klasik dekorasyonlu restoranlara uyum sağlar.",
    ],
  },
  "menkent-garson-cagirma": {
    d: [
      "Silindir başlığın içinde görünen ampul detayıyla öne çıkan, kubbe tabanlı bir garson çağırma lambası.",
      "Retro bir dokunuş isteyen kafe ve bistrolarda, masa ışığı ile çağrı butonunu tek üründe birleştirir.",
    ],
  },
  "pollux-garson-cagirma": {
    d: [
      "Çan formunda, kubbe başlıklı bir garson çağırma lambası. Yuvarlak hatları masada yumuşak ve davetkâr bir görünüm verir.",
      "Masadaki buton ile misafir garsonu sessizce çağırır, servis akışı hızlanır.",
    ],
  },
  "sirius-garson-cagirma-masalambasi-1": {
    d: [
      "Sirius'un garson çağırma butonlu versiyonu: kubbe başlık, ince silindir gövde. Görünüşte bir masa lambası, işlevde aynı zamanda bir servis butonu.",
      "Sirius masa lambasıyla aynı salonda kullanılabilir, masalar arasında form birliği korunur.",
    ],
  },
  "wolf-garson-cagirma-masalambasi": {
    d: [
      "Kompakt, mantar başlıklı bir garson çağırma lambası. Küçük ölçüsü sayesinde iki kişilik masalarda bile yer kaplamaz.",
      "Üzerindeki buton ile misafir garsonu çağırır, ışık seviyesi dokunmatik olarak ayarlanır.",
    ],
  },

  // ─── Wood ──────────────────────────────────────────────────────────────────
  "defne-sarjli-masa-lambasi-3-3": {
    d: [
      "Damla formlu ahşap gövde ve keten abajurdan oluşan, sıcak ve doğal bir masa lambası. Ceviz ya da kayın ahşap seçeneğiyle üretilir.",
      "Ahşap ve kumaşın birlikte verdiği yumuşak ışık, akşam yemeği servislerinde masaya samimi bir atmosfer getirir.",
    ],
    specs: [WOOD("keten abajur")],
    options: [],
  },
  "kamelya-sarjli-masa-lambasi-3-2": {
    d: [
      "Silindir ahşap gövde üzerinde, düz kesimli kumaş abajur. Yalın çizgileriyle ahşabın dokusunu öne çıkaran bir masa lambası.",
      "Ceviz ve kayın seçenekleri, iskandinav ve doğal tonlu dekorasyonlarla kolayca uyum sağlar.",
    ],
    specs: [WOOD("kumaş abajur")],
    options: [],
  },
  "lila-sarjli-masa-lambasi-3-1-4": {
    d: [
      "Vazo formlu ahşap gövde ve konik kumaş abajur. Klasik abajurlu lamba siluetini kablosuz kullanımla buluşturur.",
      "Ceviz ya da kayın ahşap seçeneğiyle otel odası, lobi ve restoran masalarına ev sıcaklığı katar.",
    ],
    specs: [WOOD("kumaş abajur")],
    options: [],
  },
  "lotus-sarjli-masa-lambasi-2": {
    d: [
      "Başlığı ve gövdesi ahşaptan, konik çizgilere sahip bir masa lambası. Işık geniş ahşap şapkanın altından masaya yayılır.",
      "Tamamen ahşap görünümü sayesinde doğal malzemeli iç mekânlarda heykelsi bir obje gibi durur.",
    ],
    specs: [["Malzeme", "Ahşap gövde ve başlık"]],
    options: [],
  },

  // ─── Mosaic ────────────────────────────────────────────────────────────────
  "dubhe-sarjli-masa-lambasi": {
    name: "Dubhe Şarjlı Masa Lambası",
    slug: "dubhe-sarjli-masa-lambasi",
    d: [
      "Renkli mozaik cam küresiyle geleneksel Osmanlı lambalarını hatırlatan bir masa lambası. Işık, cam parçaların arasından masaya desenler halinde düşer.",
      "Kablosuz olduğu için bu klasik görünümü priz bağımlılığı olmadan teraslara, lobilere ve yemek masalarına taşır.",
    ],
    specs: [MOSAIC, ["Ölçüler", "Başlık Ø 175 mm, yükseklik 375 mm, taban 125 mm"]],
  },
  "sargas-sarjli-masa-lambasi": {
    d: [
      "El yapımı mozaik cam başlıklı, metal gövdeli bir masa lambası. Büyük, orta ve küçük olmak üzere üç boyda üretilir.",
      "Farklı boyları bir arada kullanarak masalarda ya da bar tezgâhında katmanlı bir mozaik ışık düzeni kurulabilir.",
    ],
    specs: [MOSAIC],
  },
  "segen-sarjli-masa-lambasi": {
    name: "Segen Mozaik Şarjlı Masa Lambası",
    d: [
      "Mantar formunda mozaik cam başlığa sahip bir masa lambası. Yandığında başlıktaki renkli cam parçalar bir vitray gibi parlar.",
      "Doğu esintili restoranlar, nargile salonları ve butik oteller için karakterli bir aydınlatma seçeneği.",
    ],
    specs: [MOSAIC],
  },
  "sutun-sarjli-masa-lambasi": {
    d: [
      "İnce, uzun bir sütun formunda mozaik cam masa lambası. Dikey silueti masada az yer kaplarken renkli ışığı yukarı doğru taşır.",
      "Klasik mozaik lambaların daha modern ve sade bir yorumu olarak hem geleneksel hem çağdaş mekânlara uyar.",
    ],
    specs: [MOSAIC],
  },

  // ─── Glass and clear shades ────────────────────────────────────────────────
  "newyork-cam-sarjli-masa-lambasi": {
    d: [
      "Metal başlık ve taban arasında şeffaf nervürlü cam silindirden oluşan, fener esintili bir masa lambası. Işık, camın dikey çizgileriyle kırılarak yayılır.",
      "Kokteyl barları, bistrolar ve otel lobileri için şık ve dikkat çekici bir seçenek.",
    ],
    specs: [GLASS],
  },
  "regulus-cam-sarjli-masa-lambasi-1": {
    d: [
      "Uzun, nervürlü cam silindir gövdeli bir masa lambası. Metal başlık ve taban, cam gövdeyi bir kandil gibi çerçeveler.",
      "Işığı yumuşak ve dağınık verdiği için uzun akşam yemeklerinde gözü yormayan bir ortam yaratır.",
    ],
    specs: [GLASS],
  },
  "mariner-sarjli-masa-lambasi-1": {
    d: [
      "Nervürlü şeffaf abajuru ile gemi fenerlerini andıran, kısa ve tok gövdeli bir masa lambası.",
      "Metal başlık ve tabanı farklı kaplama renklerinde seçilebilir. Sahil restoranları ve deniz temalı mekânlar için uygun bir karakter taşır.",
    ],
  },
  "dulcet-sarjli-masa-lambasi": {
    d: [
      "Metal bir taban üzerinde yükselen nervürlü, şeffaf silindir abajur. Işık, abajurun dikey çizgileri boyunca yumuşakça yayılır.",
      "Kompakt yüksekliği sayesinde karşılıklı oturan misafirlerin göz temasını kesmez.",
    ],
  },
  "ulger-sarjli-masa-lambasi": {
    d: [
      "Metal taban üzerinde nervürlü beyaz silindir abajur. Klasik bir mumluğu modern ve kablosuz bir forma taşıyan masa lambası.",
      "Sade görünümü sayesinde beyaz örtülü fine dining masalarından kafe tezgâhlarına kadar geniş bir kullanım alanına uyar.",
    ],
  },
  "minkar-sarjli-masa-lambasi": {
    d: [
      "Metal bir kaide üzerinde mat beyaz silindir abajur. Işığı doğrudan değil, abajurun yüzeyinden yumuşak bir parıltı olarak verir.",
      "Minimal formu modern otel odaları, lounge alanları ve bar tezgâhları için uygundur.",
    ],
  },
  "vega-sarjli-masa-lambasi": {
    d: [
      "İnce metal gövde üzerinde koni biçimli şeffaf abajur. Abajurun hafif renkli tonu, yandığında masaya sıcak bir parıltı yayar.",
      "Narin silueti, kalabalık masalarda bile hafif ve zarif bir görünüm sağlar.",
    ],
  },
  "carina-sarjli-masa-lambasi": {
    d: [
      "İnce metal gövde üzerinde beyaz opal kubbe. Kubbe ışığı her yöne eşit dağıttığı için masanın tamamını yumuşakça aydınlatır.",
      "Klasik bir siluete modern bir sadelik katar. Restoran, otel ve kafe masalarında kolayca uyum sağlar.",
    ],
  },

  // ─── Lantern forms ─────────────────────────────────────────────────────────
  "azha-sarjli-masa-lambasi": {
    d: [
      "Dikdörtgen metal çerçeve içinde mum formunda bir ışık gövdesi. Fener görünümünü kablosuz bir masa lambasına dönüştürür.",
      "Büyük ve küçük olmak üzere iki boyda üretilir. İki boy bir arada kullanıldığında masalarda katmanlı bir kompozisyon oluşur.",
    ],
  },
  "bilham-sarjli-masa-lambasi": {
    // Light Design's listing name has a typo ("Biham"); its URL and text say Bilham
    name: "Bilham Şarjlı Masa Lambası",
    slug: "bilham-sarjli-masa-lambasi",
    d: [
      "İnce metal çerçeveli, fener formlu bir masa lambası. Çerçevenin ortasındaki mum biçimli gövde, alevi andıran yumuşak bir ışık verir.",
      "Antrasit ve gri tonlarında, büyük ve küçük iki boyda üretilir. Teras ve kış bahçesi gibi kapalı açık alanlara yakışır.",
    ],
  },
  "enif-sarjli-masa-lambasi": {
    d: [
      "Metal kafesli fener formu ve içinde mum biçimli ışık gövdesi. Klasik fenerlerin çizgisini sade ve modern bir yoruma taşır.",
      "Antrasit ve gri renk, büyük ve küçük boy seçenekleriyle kullanılabilir.",
    ],
  },
  "pico-sarjli-masa-lambasi": {
    d: [
      "Kare metal çerçeveli ve deri saplı, taşınabilir bir fener lamba. Sapından tutulup masadan masaya kolayca taşınır.",
      "Küçük ölçüsüne rağmen sağlam gövdesi yoğun kullanıma uygundur. Teras, bahçe kapalı alanları ve butik oteller için pratik bir seçenek.",
    ],
  },

  // ─── Fabric and pleated shades ─────────────────────────────────────────────
  "alderamin-sarjli-masa-lambasi": {
    d: [
      "Pliseli kumaş abajur, ince metal gövde ve yuvarlak taban. Klasik abajurlu lambanın kablosuz ve daha zarif bir yorumu.",
      "Krem ve kırmızı abajur seçenekleri, gövdenin metal kaplama renkleriyle birleştirilerek mekâna göre kombin yapılabilir.",
    ],
  },
  "alpha-sarjli-masa-lambasi": {
    d: [
      "Konik kumaş abajurlu, ince gövdeli bir masa lambası. Abajur ışığı aşağı ve yana yayarak masada sıcak bir ışık havuzu oluşturur.",
      "Kırmızı, pembe, krem ve mor renkleriyle mekâna renk katmak isteyen restoran ve barlar için iddialı bir seçenek.",
    ],
  },
  "avior-sarjli-masa-lambasi": {
    d: [
      "Pliseli kumaş abajur ve koyu tonlu, kısa gövde. Bistro masalarının klasik lambasını kablosuz hale getirir.",
      "Abajurdan süzülen ışık, akşam saatlerinde masaya sıcak ve samimi bir renk verir.",
    ],
  },
  "denep-sarjli-masa-lambasi-3": {
    d: [
      "Pliseli beyaz abajur ve silindir gövdeden oluşan, klasik oranlara sahip bir masa lambası.",
      "Gövde rengi metal kaplama seçeneklerinden seçilebilir. Abajurun beyazı her renk seçeneğiyle dengeli durur.",
    ],
  },
  "siena-sarjli-masa-lambasi": {
    d: [
      "Krem kumaş abajur, ince metal gövde ve yuvarlak tabandan oluşan klasik bir masa lambası.",
      "Geleneksel çizgisi otel odaları, kütüphane köşeleri ve klasik dekorasyonlu restoranlar için idealdir.",
    ],
  },

  // ─── Marble and body options ───────────────────────────────────────────────
  "amore-sarjli-masa-lambasi-1": {
    d: [
      "Metal mantar şapka ve kalın silindir gövdeden oluşan bir masa lambası. Gövde mermer, metal ya da ahşap olarak üretilebilir.",
      "Mermer gövde seçeneği, lambayı masada dekoratif bir objeye dönüştürür ve özellikle fine dining mekânlarında öne çıkar.",
    ],
    options: [{ name: "Gövde", values: ["Mermer", "Metal", "Ahşap"] }],
  },
  "konra-sarjli-masa-lambasi": {
    d: [
      "Mantar başlık ve uzun konik gövdeden oluşan, heykelsi bir masa lambası. Gövde metal ya da mermer olarak seçilebilir.",
      "Konik gövde ışığı başlığın altında toplayarak masada odaklı ve sakin bir aydınlatma sağlar.",
    ],
    options: [{ name: "Gövde", values: ["Metal", "Mermer"] }],
  },
  "oxford-sarjli-masa-lambasi": {
    d: [
      "Geniş mantar başlık ve tok gövdesiyle güçlü bir siluete sahip masa lambası. Metal ya da mermer gövde seçeneğiyle üretilir.",
      "Mermer seçeneğinde damarlı yüzey her üründe farklı olur. Lobi ve resepsiyon masaları için gösterişli bir seçenek.",
    ],
    options: [{ name: "Gövde", values: ["Metal", "Mermer"] }],
  },

  // ─── Mushroom domes ────────────────────────────────────────────────────────
  "aldebaran-sarjli-masa-lambasi-22": {
    d: [
      "Kubbe şapka ve mermi formlu silindir gövde. Parlak kaplamalarda gövdenin yuvarlak hatları ışığı yansıtarak lambayı masada bir mücevher gibi gösterir.",
      "Kablosuz ve dimmerli yapısıyla akşam servisinde ışık seviyesi masaya göre ayarlanabilir.",
    ],
  },
  "diya-sarjli-masa-lambasi": {
    d: [
      "Yuvarlak kubbe başlık ve dolgun silindir gövdeli, kompakt bir masa lambası.",
      "Kısa boyu sayesinde masadaki sohbeti engellemez. Kafe ve brasserie masaları için pratik bir seçimdir.",
    ],
  },
  "esna-sarjli-masa-lambasi": {
    d: [
      "Geniş mantar başlığın gövdeye yumuşak bir geçişle bağlandığı, tek parça görünümlü bir masa lambası.",
      "Yekpare formu modern ve minimalist mekânlarda masaya heykelsi bir obje olarak yerleşir.",
    ],
  },
  "evora-sarjli-masa-lambasi": {
    d: [
      "Klasik mantar lamba: yarım küre başlık, ince gövde ve yuvarlak taban.",
      "Turuncu dahil geniş renk seçenekleriyle hem sade hem renkli konseptlere uyarlanabilir.",
    ],
  },
  "heli-sarjli-masa-lambasi": {
    d: [
      "Küçük kubbe başlık ve ince, uzun gövdeli zarif bir masa lambası. Narin oranları sayesinde masada hafif bir görünüm bırakır.",
      "Rose ve bronz gibi sıcak kaplama tonlarında özellikle öne çıkar.",
    ],
    specs: [SAC],
  },
  "mira-sarjli-masa-lambasi": {
    d: [
      "Kubbe başlık, ince gövde ve yuvarlak tabandan oluşan, dengeli oranlara sahip bir mantar lamba.",
      "Yalın formu sayesinde farklı kaplama renklerinde aynı salonda bir arada kullanılabilir.",
    ],
  },
  "mirach-sarjli-masa-lambasi": {
    d: [
      "Küçük mantar başlığı ve ince uzun gövdesiyle narin bir masa lambası.",
      "Dar masalarda ve bar tezgâhlarında az yer kaplarken ışığı doğrudan masaya indirir.",
    ],
  },
  "mula-sarjli-masa-lambasi": {
    d: [
      "Geniş kubbe başlık ve kısa gövdeli, kompakt bir mantar lamba.",
      "Başlığın geniş çapı ışığı aşağı doğru toplayarak masada belirgin bir ışık alanı oluşturur.",
    ],
  },
  "orben-sarjli-masa-lambasi": {
    d: [
      "Mantar başlığın konik gövdeyle birleştiği, tek parça görünümlü kompakt bir masa lambası.",
      "Mat yüzeyli renk seçenekleriyle modern kafe ve restoranlarda sade bir aksan oluşturur.",
    ],
  },
  "plastica-sarjli-masa-lambasi-ekonomik": {
    d: [
      "Kubbe başlıklı, sade gövdeli ekonomik seri masa lambası. Siyah, mavi ve pembe renkleriyle genç ve canlı konseptlere uyar.",
      "Ekonomik seri, çok sayıda masası olan işletmeler için bütçe dostu bir başlangıç sunar.",
    ],
    specs: [SAC],
  },
  "polaris-sarjli-masa-lambasi": {
    d: [
      "Kubbe başlık, ince gövde ve yuvarlak taban. Klasik mantar formunu sade bir çizgiyle yorumlayan masa lambası.",
      "Koyu kaplama renklerinde özellikle loş ve karakterli mekânlarda öne çıkar.",
    ],
  },
  "rigel-sarjli-masa-lambasi": {
    d: [
      "Küçük kubbe başlıklı, ince gövdeli bir masa lambası. Gümüş dahil geniş renk seçenekleriyle üretilir.",
      "Kompakt ölçüsü sayesinde iki kişilik masalarda ve bar tezgâhlarında rahatça kullanılır.",
    ],
  },
  "sani-sarjli-masa-lambasi": {
    d: [
      "Kubbe başlık ve ince gövdeli sade bir masa lambası.",
      "Yalın formu farklı dekorasyon tarzlarına kolayca uyum sağlar. Kafe ve restoran masalarında günlük kullanım için tasarlanmıştır.",
    ],
    specs: [SAC],
  },
  "sirius-sarjli-masa-lambasi": {
    d: [
      "Kubbe başlık ve silindir gövdeden oluşan, modern çizgili bir metal masa lambası.",
      "Aynı formun garson çağırma butonlu versiyonu da bulunduğundan, salonun bir bölümünde çağrı özellikli model aynı görünümle kullanılabilir.",
    ],
  },
  "suma-sarjli-masa-lambasi": {
    name: "Suma Şarjlı Masa Lambası",
    slug: "suma-sarjli-masa-lambasi",
    d: [
      "Mantar başlığın konik gövdeyle birleştiği, yumuşak hatlı bir masa lambası.",
      "Premium seride üretilir. Kompakt boyu restoran masaları ve otel odası komodinleri için uygundur.",
    ],
    specs: [["Ölçüler", "Başlık Ø 160 mm, yükseklik 250 mm, taban 100 mm"]],
  },
  "toledo-sarjli-masa-lambasi": {
    d: [
      "Kubbe başlık ve silindir gövdeli, modern bir mantar lamba.",
      "Gri dahil mat ve parlak kaplama seçenekleri, lambayı farklı konseptlere kolayca uyarlar.",
    ],
  },
  "torino-sarjli-masa-lambasi": {
    d: [
      "Geniş kubbe şapka ve kalın silindir gövdeli, tok bir mantar lamba.",
      "Parlak kaplamalarda gövde ve şapkanın yuvarlak hatları ortamdaki ışığı yansıtarak masaya zengin bir görünüm katar.",
    ],
  },
  "verona-sarjli-masa-lambasi": {
    d: [
      "Kubbe başlık ve silindir gövdeli, yumuşak hatlı bir masa lambası.",
      "Mat kaplama renklerinde sakin ve modern bir görünüm verir. Kafe ve brunch mekânları için uygundur.",
    ],
  },
  "zamora-sarjli-masa-lambasi-1": {
    d: [
      "Kubbe başlık, ince gövde ve yuvarlak tabanlı klasik bir mantar lamba.",
      "Serinin en geniş renk yelpazesine sahip modeli. Kırmızı, fıstık yeşili ve gökyüzü mavisi gibi canlı tonlarla mekânın renk paletine uyarlanabilir.",
    ],
  },

  // ─── Flat and cone hats ────────────────────────────────────────────────────
  "bella-sarjli-masa-lambasi": {
    d: [
      "Geniş ve basık konik şapka, ince gövde. Işığı aşağı yönlendirerek masada net bir aydınlatma alanı yaratır.",
      "Yalın silueti modern restoran ve otel masalarında dekorasyonun önüne geçmeden işlev görür.",
    ],
  },
  "fuga-sarjli-masa-lambasi": {
    d: [
      "Geniş disk şapka ve aşağıya doğru genişleyen konik gövde. Kum saatini andıran dinamik bir siluete sahip masa lambası.",
      "Koyu kaplamalarda masada güçlü, grafik bir obje gibi durur.",
    ],
  },
  "geminga-sarjli-masa-lambasi-1": {
    d: [
      "Küçük konik şapkalı, çok ince gövdeli zarif bir masa lambası.",
      "Kompakt boyu dar bistro masaları ve bar tezgâhları için idealdir.",
    ],
    options: [],
  },
  "karo-sarjli-masa-lambasi-1-1": {
    d: [
      "Konik şapkanın üzerinde düz bir disk bulunan, katmanlı başlık tasarımına sahip bir masa lambası.",
      "İki parçalı başlık ışığı hem aşağıya hem yana yumuşakça dağıtır.",
    ],
  },
  "lofen-sarjli-masa-lambasi": {
    d: [
      "Geniş ve basık kubbe şapka, ince gövde ve sade taban. Işığı masa yüzeyine geniş bir alan halinde yayar.",
      "Premium seride üretilir. Sade çizgisi otel restoranları ve mimari projeler için güvenli bir seçimdir.",
    ],
  },
  "melma-sarjli-masa-lambasi": {
    d: [
      "Küçük konik şapka ve narin uzun gövdeli bir masa lambası.",
      "Rose ve bronz gibi sıcak kaplamalarda ince gövde ışığı yansıtarak zarif bir parıltı verir.",
    ],
  },
  "nade-sarjli-masa-lambasi": {
    d: [
      "Kubbe şapkanın iç yüzeyi açık renkli olarak bırakılmış, ince gövdeli bir masa lambası. Bu sayede ışık şapkanın içinden yansıyarak masaya iner.",
      "Dış ve iç yüzey arasındaki kontrast, özellikle siyah kaplamada şık bir detay oluşturur.",
    ],
  },
  "navi-sarjli-masa-lambasi": {
    d: [
      "Düz ve küçük şapka, ince gövde ve sade taban. Modern çizgili, yalın bir metal masa lambası.",
      "Premium seride üretilir. Kompakt boyu yoğun oturma düzenli restoranlarda masaya rahatça sığar.",
    ],
  },
  "nigora-sarjli-masa-lambasi": {
    d: [
      "Geniş, basık şapka ve ince gövdeli bir masa lambası. Şapkanın çapı ışığı masaya geniş bir daire halinde indirir.",
      "Koyu ve sıcak kaplama tonları, akşam servislerinde loş ve rafine bir atmosfer yaratır.",
    ],
  },
  "olena-sarjli-masa-lambasi": {
    d: [
      "Geniş disk şapka ve aşağıya doğru genişleyen ince konik gövde. Zarif ve hafif bir siluete sahip masa lambası.",
      "Açık kaplama renklerinde masada neredeyse havada duruyormuş gibi bir görünüm verir.",
    ],
  },
  "vela-sarjli-masa-lambasi": {
    d: [
      "Basık kubbe şapka, ince gövde ve yuvarlak taban. Sade ve dengeli oranlara sahip bir masa lambası.",
      "Farklı kaplama renkleriyle aynı salonda bölge bölge kullanılabilir.",
    ],
  },
  "bene-sarjli-masa-lambasi": {
    d: [
      "Beyaz kubbe başlık ve metal konik gövdeden oluşan, iki renkli bir masa lambası.",
      "Başlığın beyazı ile gövdenin kaplama rengi arasındaki kontrast, lambayı masada belirgin bir aksan haline getirir.",
    ],
  },

  // ─── Cylinders, drums and discs ────────────────────────────────────────────
  "agena-sarjli-masa-lambasi": {
    d: [
      "Silindir başlık, aşağıya doğru incelen gövde ve yuvarlak taban. Sade ve dengeli oranlara sahip bir metal masa lambası.",
      "Geniş kaplama yelpazesiyle klasik restoranlardan modern otel konseptlerine kadar farklı mekânlara uyarlanır.",
    ],
  },
  "aro-sarjli-masa-lambasi": {
    d: [
      "Silindir başlık ve çan formunda genişleyen gövde. Gövdenin yumuşak eğrisi masada sağlam ve dengeli bir duruş sağlar.",
      "Parlak kaplamalarda çan gövde ortam ışığını yansıtarak masaya ek bir parıltı katar.",
    ],
  },
  "arya-sarjli-masa-lambasi": {
    d: [
      "İnce gövdenin ucunda yönlendirilebilir küçük bir spot başlık. Işığı istenen noktaya odaklayan, okuma lambası karakterli bir model.",
      "Menü okuma, bar tezgâhı ve resepsiyon masası gibi odaklı ışık gereken noktalar için uygundur.",
    ],
  },
  "baro-sarjli-masa-lambasi": {
    d: [
      "Düz disk başlık, ince gövde ve geniş taban. Yalın ve dengeli bir siluete sahip metal masa lambası.",
      "Geniş tabanı masada sağlam durmasını sağlar. Yoğun servis temposundaki işletmeler için pratik bir seçimdir.",
    ],
  },
  "capella-sarjli-masa-lambasi": {
    d: [
      "Konik başlık ve ince, uzun gövdeli bir masa lambası. Başlığın açılı formu ışığı masaya yumuşakça yayar.",
      "Aynı formun garson çağırma butonlu versiyonu da mevcuttur. İki model aynı salonda birlikte kullanılabilir.",
    ],
  },
  "casares-sarjli-masa-lambasi": {
    d: [
      "Düz disk başlık, ince gövde ve disk tabandan oluşan, kaide formunda zarif bir masa lambası.",
      "Rose ve gold gibi parlak kaplamalarda, ince gövdesi ve simetrik formuyla masada şık bir aksesuar gibi durur.",
    ],
  },
  "ezop-sarjli-masa-lambasi-ekonomik": {
    d: [
      "İnce çubuk gövde ve küçük disk başlıklı, minimal bir masa lambası. Ekonomik seride üretilir.",
      "Çok sayıda masası olan işletmelerde bütçe dostu bir çözüm sunar, görünümden ödün vermez.",
    ],
    specs: [SAC],
  },
  "furud-sarjli-masa-lambasi": {
    d: [
      "Çok ince, mum çubuğunu andıran gövdesiyle serinin en narin modellerinden biri.",
      "Premium seride üretilir. Masada neredeyse hiç yer kaplamadan ışık noktası oluşturur. Kalabalık ve dar masalar için idealdir.",
    ],
  },
  "gemini-sarjli-masa-lambasi": {
    d: [
      "Düz disk başlık, ince gövde ve yuvarlak tabanlı sade bir masa lambası.",
      "Eskitme ve bronz gibi sıcak kaplamalarda klasik, siyah ve beyazda modern bir görünüm verir.",
    ],
  },
  "hint-sarjli-masa-lambasi-1": {
    d: [
      "Düz başlık ve kalın silindir gövdeden oluşan, sütun formunda bir masa lambası. Uzun ve kısa olmak üzere iki boyda üretilir.",
      "İki boy bir arada kullanıldığında masalarda farklı yüksekliklerde bir ışık kompozisyonu kurulabilir.",
    ],
    options: [{ name: "Boy", values: ["Uzun", "Kısa"] }],
  },
  "kuma-sarjli-masa-lambasi": {
    d: [
      "Düz disk başlık, çok ince gövde ve küçük tabanlı minimal bir masa lambası.",
      "Premium seride üretilir. Krom ve parlak kaplamalarda modern ve rafine bir görünüm sunar.",
    ],
  },
  "meissa-sarjli-masa-lambasi-ekonomik": {
    d: [
      "Küçük disk başlık ve ince gövdeli sade bir masa lambası. Ekonomik seride üretilir.",
      "Bütçe dostu fiyatıyla çok masalı mekânların tamamını aynı modelle donatmak için uygundur.",
    ],
    specs: [SAC],
  },
  "mensa-sarjli-masa-lambasi-1": {
    d: [
      "Küçük disk başlık, ince gövde ve yuvarlak tabanlı zarif bir masa lambası.",
      "Geniş kaplama yelpazesi sayesinde mekânın metal detaylarıyla birebir uyumlu renk seçilebilir.",
    ],
  },
  "merle-sarjli-masa-lambasi": {
    d: [
      "Düz şapka ve ince uzun gövdeli, yalın bir masa lambası.",
      "Boyu sayesinde ışığı masanın üstüne yukarıdan indirir. Geniş masalar ve bar tezgâhları için uygundur.",
    ],
    specs: [["Ölçüler", "Başlık Ø 175 mm, yükseklik 350 mm, taban 100 mm"]],
  },
  "mila-sarjli-masa-lambasi": {
    d: [
      "Silindir bir kaide üzerinde yükselen ince çubuk gövde ve küçük disk başlık. Mumluk görünümünü modern bir dille yorumlar.",
      "Parlak kaplamalarda ince gövde ışığı yansıtarak masaya zarif bir dikey çizgi çizer.",
    ],
  },
  "mimosa-sarjli-masa-lambasi": {
    d: [
      "Silindir gövdenin üzerinde yatay bir çubuk başlık. T formuyla serinin en grafik modellerinden biri.",
      "Yatay başlık ışığı masaya geniş bir çizgi halinde indirir. Modern ve minimalist mekânlar için uygundur.",
    ],
  },
  "mona-sarjli-masa-lambasi": {
    d: [
      "Silindir başlık ve aşağıya doğru genişleyen kesik koni gövde. Sağlam ve tok bir siluete sahip masa lambası.",
      "Geniş tabanı sayesinde masada devrilmeye karşı dengeli durur. Yoğun servisli mekânlar için güvenli bir seçimdir.",
    ],
  },
  "neptun-sarjli-masa-lambasi": {
    d: [
      "Aşağıya doğru zarifçe genişleyen ince konik gövde ve sivri küçük başlık. Masada bir heykelcik gibi duran bir lamba.",
      "Parlak kaplamalarda gövdenin eğrisi ışığı yansıtarak dikkat çekici bir parıltı oluşturur.",
    ],
  },
  "nerio-sarjli-masa-lambasi": {
    d: [
      "Küçük disk başlık, ince gövde ve yuvarlak taban. Sade çizgileriyle premium serinin zarif modellerinden biri.",
      "Rose ve gold gibi sıcak kaplamalarda masaya rafine ve sıcak bir aksan katar.",
    ],
  },
  "pandora-sarjli-masa-lambasi-ekonomik": {
    d: [
      "Düz silindir başlık, ince gövde ve geniş tabanlı sade bir masa lambası. Ekonomik seride üretilir.",
      "Klasik oranları sayesinde farklı mekân tarzlarına uyar ve bütçe dostu bir çözüm sunar.",
    ],
    specs: [SAC],
  },
  "rena-sarjli-masa-lambasi": {
    d: [
      "Kalın silindir gövde ve hafif geniş başlıktan oluşan, kompakt sütun formunda bir masa lambası.",
      "28 cm'lik boyu sayesinde masada karşılıklı oturanların görüşünü kesmez.",
    ],
    specs: [["Ölçüler", "Başlık Ø 100 mm, yükseklik 280 mm, taban 80 mm"]],
  },
  "solio-sarjli-masa-lambasi": {
    d: [
      "Açılı kesilmiş silindir başlık ve konik gövde. Başlığın eğik kesimi ışığı tek yöne yönlendirerek lambaya dinamik bir görünüm verir.",
      "Gold, rose ve prinç eskitme gibi sıcak kaplamalarda özellikle şık durur.",
    ],
  },
  "tole-sarjli-masa-lambasi-1": {
    d: [
      "Silindir başlık, ince silindir gövde ve yuvarlak taban. Yalın, geometrik çizgilere sahip bir metal masa lambası.",
      "Sade formu farklı kaplama renkleriyle hem klasik hem modern mekânlara uyarlanabilir.",
    ],
  },
  "vita-sarjli-masa-lambasi": {
    d: [
      "Küçük silindir başlık ve çan formunda genişleyen gövde. Gövdenin geniş eğrisi masada sağlam ve zarif bir duruş sağlar.",
      "Parlak kaplamalarda gövde ortamdaki ışığı yansıtarak lambayı masada belirgin bir obje haline getirir.",
    ],
  },
};
