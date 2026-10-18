import { component$ } from "@builder.io/qwik";

interface LogoProps {
  size?: number;
  /** Kept for API compatibility; the mark no longer uses gradient ids */
  id?: string;
  class?: string;
}

/**
 * The Zero to Secure mark: a shield with a heartbeat line running through it.
 * The shield reads as security, the pulse as something you check on regularly
 * rather than set once and forget. One solid fill in the theme's accent colour.
 */
export default component$((props: LogoProps) => {
  const size = props.size || 34;

  return (
    <svg
      class={props.class}
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      role="img"
      aria-label="Zero to Secure"
    >
      <path
        d="M24 2.5 41.5 11v14.2c0 9.4-7 17.3-17.5 20.3C13.5 42.5 6.5 34.6 6.5 25.2V11L24 2.5Z"
        fill="hsl(var(--p))"
      />
      <path
        d="M12 25.5h6.2l3-6.6 4.4 12.4 3.1-8 2.2 4.2H36"
        stroke="hsl(var(--pc))"
        stroke-width="2.9"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
      />
    </svg>
  );
});
