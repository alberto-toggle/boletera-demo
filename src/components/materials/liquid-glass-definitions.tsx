/** Background-only lens adapted from UI Layouts Liquid Glass (MIT). */
export function LiquidGlassDefinitions({
  id = "liquid-material-refraction",
  strength = 90,
}: {
  id?: string;
  strength?: number;
}) {
  return (
    <svg
      width="0"
      height="0"
      aria-hidden="true"
      focusable="false"
      style={{ position: "absolute", pointerEvents: "none" }}
    >
      <defs>
        <filter
          id={id}
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.003 0.007"
            numOctaves="1"
            seed="8"
            result="refraction"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="refraction"
            scale={strength}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
