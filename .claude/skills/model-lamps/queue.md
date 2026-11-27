# Modelling queue

Ordered: the next batch is the first unchecked rows. Format: `- [ ] key | Sanity slug | note`. Tick a row when the lamp is linked with a night image; write "spec done, not linked" if a run stopped half way. Rebuilt on 2026-11-25 from Sanity (table lamps without `modelKey`); the note comes from the product copy and the cover photo, so check the photos. The 83 finished lamps are in `docs/HANDOFF.md` "Modelled lamps".

Only table lamps are modelled (client, 2026-11-25). Light Design slugs can differ from the Sanity slug; the coordinator resolves them from `source.url`. Rows marked **price list** have no Light Design page: their only photo is the small one from the 2027 price list (`tools/data/ext-images/pricelist/<key>.png`, ~100–240 px wide) and there is no datasheet, so fit the proportions to that photo, take sizes from similar lamps, and say so in the HANDOFF notes (the client was asked for real photos). Newer lamps (and many price-list ones) have no datasheet: the 2027 catalogue (`arstar.com.tr/wp-content/uploads/2026/11/Lightdesign-sarjli-masa-lambasi-2027-katalog.pdf`) gives H, head Ø and base Ø, and many galleries have a labelled dimension photo. `extract.py` and `review.py` handle price-list products by slug.

## Metal (the kit's home ground)
- [x] bahar | bahar-sarjli-masa-lambasi | thin stem, wide flat disc hat, round base
- [x] aster | aster-sarjli-masa-lambasi | black cone hat on a thin stem, round base
- [x] astra | astra-sarjli-masa-lambasi | satin-nickel dome hat, thin stem, round base
- [x] susen | susen-sarjli-masa-lambasi | very slender copper-rose lamp, small pointed hat, flat round base
- [x] albostan | albostan-sarjli-masa-lambasi | **price list**; gold, small hat on a thin stem, bell base
- [x] palermo | palermo-sarjli-masa-lambasi | **price list**; copper-rose mushroom hat on a cone body

## Wood (like Defne)
- [x] akasya | akasya-ahsap-sarjli-masa-lambasi | turned wood body, metal stem and hat
- [x] sumbul | sumbul-ahsap-sarjli-masa-lambasi | wood body, metal stem and hat
- [x] maya | maya-ahsap-sarjli-masa-lambasi | pear-shaped wood body, black metal hat
- [x] mina | mina-ahsap-sarjli-masa-lambasi | wood body, black metal hat
- [x] orkide | orkide-ahsap-sarjli-masa-lambasi | **price list**; stacked wood body, copper hat
- [x] pera | pera-ahsap-sarjli-masa-lambasi | wood cylinder body, wood dome hat, metal stem
- [x] poyraz | poyraz-ahsap-sarjli-masa-lambasi | round wood body, wood disc hat, metal stem
- [x] puren | puren-ahsap-sarjli-masa-lambasi | egg-shaped wood body, wood disc hat, metal stem
- [x] yosun | yosun-ahsap-sarjli-masa-lambasi | wood cylinder body, wood disc hat, metal stem
- [x] alba | alba-ahsap-sarjli-masa-lambasi | wood cone body, wide wood mushroom hat
- [x] alya | alya-ahsap-sarjli-masa-lambasi | wood cone body, wood disc hat, brass detail
- [x] aran | aran-ahsap-sarjli-masa-lambasi | wood cone body and cone hat
- [ ] acelya | acelya-ahsap-sarjli-masa-lambasi | pear-shaped wood body, wood hat, brass stem
- [ ] deren | deren-ahsap-sarjli-masa-lambasi | wood cylinder, wood disc hat, brass stem
- [ ] dora | dora-ahsap-sarjli-masa-lambasi | stacked-bead wood body, wood hat, brass stem
- [ ] feza | feza-ahsap-sarjli-masa-lambasi | wood cylinder, small wood hat, brass stem
- [ ] lupin | lupin-ahsap-sarjli-masa-lambasi | wood cone body, wood mushroom hat
- [ ] beliz | beliz-ahsap-sarjli-masa-lambasi | wood body, brass stem, white bell shade (opal or porcelain, unconfirmed)
- [ ] kamelya | kamelya-sarjli-masa-lambasi | wooden body, linen shade
- [ ] lila | lila-sarjli-masa-lambasi | wooden body, linen shade
- [ ] lotus | lotus-sarjli-masa-lambasi | wooden body
- [ ] amore | amore-sarjli-masa-lambasi | marble, metal or wood variants (price per body)

## Stone and marble (opal or stone domes)
- [ ] alis | alis-mermer-sarjli-masa-lambasi | sandy stone base, opal dome
- [ ] flora | flora-mermer-ahsap-sarjli-masa-lambasi | wood base, marble body
- [ ] lera | lera-mermer-ahsap-sarjli-masa-lambasi | white marble dome on a wood base (`marble` kit part)
- [ ] sera | sera-sarjli-masa-lambasi | **price list**; veined translucent dome (alabaster?) on a stone base
- [ ] azalya | azalya-sarjli-tuz-lambasi | opal dome on a travertine-like base
- [ ] lalin | lalin-sarjli-tuz-lambasi | plain white cylinder ("tuz", looks like stone)
- [ ] nergis | nergis-sarjli-tuz-lambasi | white stone baluster form
- [ ] melia | melia-sarjli-tuz-lambasi | white stone cylinder with a hollow top

## Fabric and pleated shades (a pleated-shade kit part unlocks most of these)
- [ ] avior | avior-sarjli-masa-lambasi | rebuild from zero (now the old `lamp` family); shades krem, kirmizi
- [ ] alderamin | alderamin-sarjli-masa-lambasi | rebuild from zero, pleated red shade; after both: delete the `lamp` family
- [ ] siena | siena-sarjli-masa-lambasi | pleated cream shade, round base
- [ ] avena | avena-kumas-sarjli-masa-lambasi | pleated cream shade, tall metal stem
- [ ] ulger | ulger-sarjli-masa-lambasi | pleated white cylinder shade with gold rim, metal base
- [ ] levan | levan-kumas-sarjli-masa-lambasi | pleated shade with a scalloped hem, gold base
- [ ] arven | arven-ahsap-sarjli-masa-lambasi | pleated shade on a short wood body
- [ ] ladin | ladin-ahsap-kumas-sarjli-masa-lambasi | pleated shade, wood stem, black base
- [ ] alpha | alpha-sarjli-masa-lambasi | cone fabric shade (red, black trim), gold base
- [ ] dalia | dalia-porselen-sarjli-masa-lambasi | scalloped fabric shade on a striped ceramic body
- [ ] lilia | lilia-kumas-porselen-sarjli-masa-lambasi | **price list**; pleated shade with navy trim, diamond-pattern porcelain body
- [ ] bagonvil | bagonvil-kumas-sarjli-masa-lambasi | tall ribbed beige fabric lantern shade
- [ ] zelal | zelal-kumas-sarjli-masa-lambasi | tall ribbed red fabric lantern shade

## Porcelain (painted pattern: needs a print texture)
- [ ] zambak | zambak-porselen-sarjli-masa-lambasi | hexagonal porcelain shade with a blue pattern, brass stem
- [ ] manolya | manolya-porselen-sarjli-masa-lambasi | porcelain dome with a bird pattern, brass stem
- [ ] nehir | nehir-ahsap-porselen-sarjli-masa-lambasi | ribbed white porcelain dome, wood body
- [ ] hazer | hazer-ahsap-porselen-sarjli-masa-lambasi | **price list**; textured white porcelain cone, wood body

## Glass and mosaic
- [ ] regulus-cam | regulus-cam-sarjli-masa-lambasi | ribbed glass cylinder body, metal hat and base; eskitme photo
- [ ] newyork-cam | newyork-cam-sarjli-masa-lambasi | ribbed glass, chrome top and base
- [ ] mariner | mariner-sarjli-masa-lambasi | short ribbed glass shade, brass top and base
- [ ] dulcet | dulcet-sarjli-masa-lambasi | pleated translucent cylinder shade, copper base
- [ ] sargas-mozaik | sargas-mozaik-sarjli-masa-lambasi | mosaic glass head, metal body; three sizes
- [ ] segen-mozaik | segen-mozaik-sarjli-masa-lambasi | mushroom-shaped mosaic glass head
- [ ] iris | iris-mozaik-sarjli-masa-lambasi | mosaic glass dome, brass body
- [ ] viola | viola-ahsap-mozaik-sarjli-masa-lambasi | mosaic glass dome on a wood cone body
- [ ] mozaik-sutun | mozaik-sutun-sarjli-masa-lambasi | turned copper column around a green mosaic glass cylinder, finial on top; LD slug `sutun-sarjli-masa-lambasi`, 330 mm; needs the mosaic glass kit part

## Special shapes
- [ ] solio | solio-sarjli-masa-lambasi | cylinder hat cut at an angle: not turned, needs a kit part
- [ ] garson-cagri-butonu | garson-cagri-butonu | a table call button, not a lamp: a small turned cylinder

## Lanterns (not turned: a frame, glass and a candle; need their own parts)
- [ ] azha | azha-sarjli-masa-lambasi | wooden frame lantern with a handle, opal candle inside
- [ ] enif | enif-sarjli-masa-lambasi | square frame with a wire handle, candle
- [ ] pico | pico-sarjli-masa-lambasi | white square frame lantern with a leather strap handle; datasheet 300×150 mm
- [ ] svela | svela-sarjli-masa-lambasi | **price list**; ribbed opal cylinder on a satin-nickel base, leather strap
- [ ] verda | verda-sarjli-masa-lambasi | **price list**; tapered wooden salt lantern, leather strap
- [ ] lara | lara-sarjli-masa-lambasi | **price list**; square wooden salt lantern, leather strap
- [ ] sena | sena-sarjli-masa-lambasi | **price list**; cylindrical wooden salt lantern, leather strap

## Waiting on the client (not in the 2027 price list; maybe discontinued)
- [ ] arya | arya-sarjli-masa-lambasi | small swivelling spot head: needs a tilted part
- [ ] bilham | bilham-sarjli-masa-lambasi | two uprights and a handle bar, glass cylinder, candle
- [ ] denep | denep-sarjli-masa-lambasi | pleated white shade, cylinder body
- [ ] vega | vega-sarjli-masa-lambasi | transparent cone shade
- [ ] dubhe | dubhe-sarjli-masa-lambasi | coloured mosaic glass globe; datasheet image-only

## Not modelled
- Mosaic cubes Lina, Gaye, Neva (client: not worth it).
- Wall and floor lamps (Alpha, Cam, Metal aplik, Balsam, Hebe, Anemon, İdil, Berfin; Köşe, Alpina, Vanda, Linden, Evren lambader) until the client asks: table lamps come first.
- Charging stations, accessories, armatures and outdoor fittings: photo only.
