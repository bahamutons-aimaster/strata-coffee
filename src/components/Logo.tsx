type LogoProps = {
  size?: number;
  color?: string;
  className?: string;
};

/**
 * Logo Strata Coffee — "S" yang terbentuk dari 3 garis lengkung
 * meniru uap kopi (sesuai brand mark di cup).
 */
export function Logo({ size = 40, color = 'currentColor', className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-label="Strata Coffee"
    >
      <path
        d="M14 18 C24 8, 44 8, 50 18 C44 22, 30 22, 24 26 C18 30, 18 36, 24 38"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 32 C32 24, 48 24, 52 32 C46 36, 32 36, 26 40 C20 44, 20 48, 26 50"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 46 C24 38, 40 40, 50 46"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
