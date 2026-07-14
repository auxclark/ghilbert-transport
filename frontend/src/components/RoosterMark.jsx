export default function RoosterMark({ size = 32, color = 'var(--color-comb)' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M20 46c-3 4-7 5-11 5 2-4 3-8 2-12"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M22 20c-2-5-1-9 2-12 1 3 3 5 6 6-1-4 0-7 3-9 1 4 4 6 8 6 5 0 9 4 9 9 0 3-1 5-3 7l2 4c1 2 0 4-2 5l-4 1 1 5c1 4-1 8-5 10l-9 3c-6 2-12 0-16-5l-3-4c-3-4-3-9 0-13l4-5c2-2 4-4 7-5z"
        stroke={color}
        strokeWidth="2.4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx="34" cy="23" r="1.6" fill={color} />
      <path d="M18 40c2 3 5 5 9 5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
