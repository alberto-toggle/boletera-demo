# Liquid Glass lens

Background refraction adapted from UI Layouts Liquid Glass (MIT license included).
Mount `LiquidGlassDefinitions` once, outside hidden or filtered containers. Its ID
and strength are configurable; it has no theme, routing or storage dependencies.
Use the filter through `backdrop-filter`, so text and icons remain undistorted.

Public proposals opt in through `data-material="liquid"`. The demo appearance
adapter applies it only with Glass enabled, to the gallery navigation bar, its photo-opening button and photo category
labels and featured-event hero links, uniformly across all four proposals.
Liquid uses shared dark tint and light text tokens inspired by Gala. Other Glass surfaces remain unchanged.
The playground stays independent. Tokens and reduced-transparency fallback live
in `features/demo-appearance/appearance.css`. SVG backdrop support varies by browser;
without it the material retains clear transparency and rim highlights.
