export default function CombDivider({ color = 'var(--color-comb)', flip = false }) {
  return (
    <svg
      viewBox="0 0 240 14"
      preserveAspectRatio="none"
      width="100%"
      height="14"
      style={{ display: 'block', transform: flip ? 'scaleY(-1)' : 'none' }}
      aria-hidden="true"
    >
      <path
        d="M0 14 L10 2 L20 14 L30 2 L40 14 L50 2 L60 14 L70 2 L80 14 L90 2 L100 14 L110 2 L120 14 L130 2 L140 14 L150 2 L160 14 L170 2 L180 14 L190 2 L200 14 L210 2 L220 14 L230 2 L240 14"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.55"
      />
    </svg>
  );
}
