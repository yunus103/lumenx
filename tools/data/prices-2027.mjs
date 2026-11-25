// 2027 price list (USD), applied by tools/apply-prices.mjs to the Light Design products.
// Keys are Sanity slug prefixes: a product matches the longest key equal to its slug or followed by "-".
// T(eko, premium): tiered, null where the list shows "-". S(price): one price (stations, accessories).
// A range in the list ("Küçük 70–80$ …") or several bodies (Amore) use the lowest, as the site shows
// "Başlangıç fiyatı". Konra and Oxford's marble versions (95$) are the same products: the metal price is used.
// The lamps that exist only in the price list (Albostan, Palermo, Svela, Sera, Neva, Hazer, Orkide, Lilia, Verda, Lara, Sena,
// Balsam, Hebe, Alpina, Aplik Şarj Modülü) carry theirs in tools/data/ext/pricelist.json.
const T = (eko, premium) => ({ eko, premium });
const S = (price) => ({ single: price });

export const PRICES = {
  // Garson çağırma
  "alpheca": T(null, 105), "menkent": T(null, 105), "wolf": T(null, 105), "caph": T(null, 105),
  "capella-garson": T(null, 105), "pollux": T(null, 105), "sirius-garson": T(null, 105), "garson-cagri-butonu": S(85),
  // Metal
  "sirius": T(58, 75), "evora": T(135, 150), "casares": T(70, 150), "lofen": T(75, 90),
  "bella": T(80, 98), "nerio": T(130, 145), "geminga": T(67, 80), "kuma": T(85, 95), "navi": T(85, 95),
  "enif": T(null, 195), "pico": T(null, 205), "capella": T(58, 75), "zamora": T(58, 75), "toledo": T(60, 75),
  "mula": T(58, 70), "melma": T(58, 75), "heli": T(55, 70),
  "gemini": T(58, 75), "rigel": T(58, 75), "susen": T(67, 80), "vita": T(75, 85), "merle": T(78, 88),
  "nade": T(85, 95), "karo": T(88, 98), "mirach": T(58, 75), "solio": T(62, 79), "mona": T(58, 75),
  "esna": T(58, 75), "hint": T(58, 75), "verona": T(68, 85), "torino": T(58, 70), "sani": T(55, 70),
  "ezop": T(62, 85), "pandora": T(58, 75), "meissa": T(58, 75), "olena": T(60, 75), "nigora": T(60, 75),
  "neptun": T(60, 75), "mimosa": T(85, 95), "mila": T(58, 75), "konra": T(58, 75), "rena": T(69, 83),
  "oxford": T(58, 75), "orben": T(58, 75), "bene": T(75, 85), "baro": T(58, 75), "aro": T(62, 79),
  "agena": T(58, 75), "mensa": T(60, 75), "tole": T(60, 79), "fuga": T(58, 75), "diya": T(58, 75),
  "vela": T(95, 105),
  // "UMA" in the list is Aldebaran's photo (the name differs; client to confirm)
  "aldebaran": T(null, 105), "bahar": T(null, 110), "aster": T(null, 110), "astra": T(null, 110),
  // Mermer
  "minkar": T(95, 105), "alis": T(95, 105), "flora": T(95, 105), "lera": T(95, 105), "carina": T(95, 105),
  "amore": S(190),
  // Cam
  "regulus": T(75, 85), "newyork": T(125, 135), "mariner": T(75, 80), "furud": T(115, 125),
  // Mozaik
  "segen": T(85, 95), "sargas": T(70, 80), "iris": T(85, 95), "mozaik-sutun": T(95, 105),
  "lina": T(null, 180), "gaye": T(null, 145), 
  // Kumaş (Avena and Ülger have no price in the list)
  "alderamin": T(70, 90), "siena": T(70, 90), "alpha": T(60, 75), "avior": T(70, 90), "dulcet": T(78, 90),
  "levan": T(null, 105), "bagonvil": T(null, 135), "zelal": T(null, 145),
  // Ahşap
  "lila": T(null, 95), "defne": T(null, 95), "kamelya": T(null, 95), "alya": T(null, 95), "acelya": T(null, 95),
  "lotus": T(null, 95), "mina": T(null, 95), "ladin": T(null, 95), "viola": T(null, 110), "lupin": T(null, 120),
  "yosun": T(null, 95), "puren": T(null, 95), "alba": T(null, 140), "arven": T(null, 105), "aran": T(null, 95),
  "beliz": T(null, 110), "dora": T(null, 95), "poyraz": T(null, 95), "deren": T(null, 95), "maya": T(null, 95),
  "feza": T(null, 95), "pera": T(null, 95), "azha": T(null, 205), "akasya": T(null, 95), "sumbul": T(null, 95),
  
  // Porselen
  "manolya": T(null, 115), "zambak": T(null, 115), "dalia": T(null, 135),
  "nehir": T(null, 135),
  // Tuz
  "lalin": T(null, 95), "nergis": T(null, 95), "azalya": T(null, 115), "melia": T(null, 95),
  // Aplik
  "alpha-aplik": T(null, 105), "metal-aplik": T(null, 80),
  "anemon": T(null, 110), "idil": T(null, 115), "berfin": T(null, 120),
  // Lambader
  "kose-lambader": T(null, 145), "vanda": T(null, 75), "linden": T(null, 145), "evren": T(null, 170),
  // Şarj
  "tekli-sarj-kaseti": S(21),
  "9lu-sarj-istasyonu-premium": S(270), "18li-sarj-istasyonu-premium": S(540),
  "27li-sarj-istasyonu-premium": S(810), "36li-sarj-istasyonu-premium": S(1080),
  "9lu-sarj-istasyonu-ekonomik": S(160), "18li-sarj-istasyonu-ekonomik": S(320),
  "27li-sarj-istasyonu-ekonomik": S(480), "36li-sarj-istasyonu-ekonomik": S(640),
  "lambader-sarj-modulu": S(60), "10lu-type-c": S(90), "plastica": S(18),
};
