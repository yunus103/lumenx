# Modelling queue

Ordered: the next batch is the first unchecked rows. Format: `- [ ] key | Sanity slug | note`. Tick a row when the lamp is linked with a night image; write "spec done, not linked" if a run stopped half way. Built from Sanity on 2026-11-08 (products without `modelKey`); the type comes from the product description, so check the photos.

Light Design slugs can differ from the Sanity slug (`-1`, `-ekonomik`); the coordinator resolves them from `source.url`.

## Metal, hat lamps (the kit's home ground)
- [x] aldebaran | aldebaran-sarjli-masa-lambasi | dome hat, bullet-shaped body
- [x] aro | aro-sarjli-masa-lambasi | cylinder hat, bell-shaped body
- [x] casares | casares-sarjli-masa-lambasi | flat disc hat, disc base
- [x] esna | esna-sarjli-masa-lambasi | mushroom hat flowing into the body
- [x] evora | evora-sarjli-masa-lambasi | classic mushroom; its gold photo is warmer than the gold finish
- [x] ezop | ezop-sarjli-masa-lambasi | thin rod, small disc hat
- [x] geminga | geminga-sarjli-masa-lambasi | small cone hat, very thin stem
- [x] heli | heli-sarjli-masa-lambasi | small dome hat, tall thin stem
- [x] hint | hint-sarjli-masa-lambasi | flat hat, thick column body
- [x] karo | karo-sarjli-masa-lambasi | layered hat: flat disc on a cone
- [x] konra | konra-sarjli-masa-lambasi | mushroom hat, long cone body
- [x] melma | melma-sarjli-masa-lambasi | small cone hat, slender stem
- [ ] merle | merle-sarjli-masa-lambasi | flat hat, thin tall stem
- [ ] mira | mira-sarjli-masa-lambasi | dome hat, round base
- [ ] mirach | mirach-sarjli-masa-lambasi | small mushroom hat, thin stem
- [ ] mona | mona-sarjli-masa-lambasi | cylinder hat, truncated cone body
- [ ] mula | mula-sarjli-masa-lambasi | wide dome hat, short body
- [ ] neptun | neptun-sarjli-masa-lambasi | thin cone body, small pointed hat
- [ ] orben | orben-sarjli-masa-lambasi | mushroom hat merging into a cone
- [ ] oxford | oxford-sarjli-masa-lambasi | wide mushroom hat, sturdy body
- [ ] polaris | polaris-sarjli-masa-lambasi | dome hat, thin stem, round base
- [ ] rigel | rigel-sarjli-masa-lambasi | small dome hat; lists `gumus`, which has no 3D value yet (falls back by type)
- [ ] suma | suma-sarjli-masa-lambasi | mushroom into cone; datasheet is image-only
- [ ] toledo | toledo-sarjli-masa-lambasi | dome hat, cylinder body; lists `gri`
- [ ] torino | torino-sarjli-masa-lambasi | wide dome, thick cylinder body
- [ ] vela | vela-sarjli-masa-lambasi | flat dome hat, round base
- [ ] verona | verona-sarjli-masa-lambasi | dome hat, cylinder body
- [ ] zamora | zamora-sarjli-masa-lambasi | classic mushroom
- [ ] bene | bene-sarjli-masa-lambasi | two-tone: white dome on a metal cone. Kit gap (two-tone), shared with Mensa and Nade: add it in this batch
- [ ] nade | nade-sarjli-masa-lambasi | two-tone: light inner face of the dome
- [ ] azha | azha-sarjli-masa-lambasi | generic description, check the photos; no datasheet (404)
- [ ] bella | bella-sarjli-masa-lambasi | generic description, check the photos
- [ ] bilham | bilham-sarjli-masa-lambasi | generic description; Ekonomik datasheet 404
- [ ] carina | carina-sarjli-masa-lambasi | generic description, check the photos
- [ ] enif | enif-sarjli-masa-lambasi | generic description; no datasheet (404)
- [ ] furud | furud-sarjli-masa-lambasi | aluminium body
- [ ] kuma | kuma-sarjli-masa-lambasi | generic description, check the photos
- [ ] lofen | lofen-sarjli-masa-lambasi | generic description, check the photos
- [ ] minkar | minkar-sarjli-masa-lambasi | aluminium body; its "gold" photo shows another colour
- [ ] navi | navi-sarjli-masa-lambasi | generic description, check the photos
- [ ] nerio | nerio-sarjli-masa-lambasi | generic description, check the photos
- [ ] pico | pico-sarjli-masa-lambasi | compact; no datasheet (404)
- [ ] plastica | plastica-sarjli-masa-lambasi | economy plastic series: black, blue and other colours
- [ ] mozaik-sutun | mozaik-sutun-sarjli-masa-lambasi | column form; the slug says mosaic, check for glass
- [ ] arya | arya-sarjli-masa-lambasi | small swivelling spot head: not fully turned, needs a tilted part
- [ ] solio | solio-sarjli-masa-lambasi | cylinder hat cut at an angle: not turned, needs a kit part

## Waiter-call lamps (need `topButton` on hat lamps: add it with the first one)
- [ ] sirius-garson | sirius-garson-cagirma-masa-lambasi | not the Sirius shape: call-button cap, deeper dome, convex collar, 240 mm
- [ ] capella-garson | capella-garson-cagirma-masa-lambasi | Capella with a call button; compare with `capella.ts`
- [ ] alpheca | alpheca-garson-cagirma-masa-lambasi | cylinder hat, short sturdy body
- [ ] caph | caph-garson-cagirma-masa-lambasi | mushroom hat, thin body
- [ ] menkent | menkent-garson-cagirma-masa-lambasi | cylinder hat with a visible bulb inside, dome base
- [ ] pollux | pollux-garson-cagirma-masa-lambasi | bell form, dome hat
- [ ] wolf | wolf-garson-cagirma-masa-lambasi | compact mushroom
- [ ] garson-cagri-butonu | garson-cagri-butonu | a table call button, not a lamp: a small turned cylinder

## Wood (like Defne)
- [ ] amore | amore-sarjli-masa-lambasi | marble, metal or wood variants
- [ ] kamelya | kamelya-sarjli-masa-lambasi | wooden body
- [ ] lila | lila-sarjli-masa-lambasi | wooden body
- [ ] lotus | lotus-sarjli-masa-lambasi | wooden body

## Fabric and pleated shades
- [ ] avior | avior-sarjli-masa-lambasi | rebuild from zero (now the old `lamp` family); shades krem, kirmizi
- [ ] alderamin | alderamin-sarjli-masa-lambasi | rebuild from zero; krem/kirmizi are its shades. After both: delete the `lamp` family
- [ ] alpha | alpha-sarjli-masa-lambasi | cone fabric shade, thin body
- [ ] denep | denep-sarjli-masa-lambasi | pleated white shade, cylinder body
- [ ] siena | siena-sarjli-masa-lambasi | cream fabric shade, round base
- [ ] ulger | ulger-sarjli-masa-lambasi | ribbed white cylinder shade on a metal base
- [ ] dulcet | dulcet-sarjli-masa-lambasi | ribbed transparent cylinder shade
- [ ] mariner | mariner-sarjli-masa-lambasi | ribbed transparent shade, ship-lantern look
- [ ] vega | vega-sarjli-masa-lambasi | transparent cone shade

## Glass and mosaic
- [ ] regulus-cam | regulus-cam-sarjli-masa-lambasi | ribbed glass cylinder body, metal hat and base; eskitme photo
- [ ] newyork-cam | newyork-cam-sarjli-masa-lambasi | decorative glass
- [ ] sargas-mozaik | sargas-mozaik-sarjli-masa-lambasi | mosaic glass head, metal body; three sizes
- [ ] segen-mozaik | segen-mozaik-sarjli-masa-lambasi | mushroom-shaped mosaic glass head
- [ ] dubhe | dubhe-sarjli-masa-lambasi | coloured mosaic glass globe; datasheet image-only

## Wall and floor (not table lamps: decide the scene first)
- [ ] alpha-aplik | alpha-aplik-kablosuz-modullu | wall light, cone fabric shade, metal arm
- [ ] cam-aplik | cam-aplik-kablosuz-modullu | wall light with glass
- [ ] metal-aplik | metal-aplik-kablosuz-modullu | plain metal wall light
- [ ] kose-lambader | kose-lambader-kablosuz-modullu | corner floor lamp, pleated shade
