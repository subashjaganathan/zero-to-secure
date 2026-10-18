import { component$ } from "@builder.io/qwik";

interface LogoProps {
  size?: number;
  /** Unique suffix for the gradient ids, so multiple logos can share a page */
  id?: string;
  class?: string;
}

/**
 * The Zero to Secure mark: a hex shield with a heartbeat line running through
 * it: the shield reads as security, the pulse as something you check on
 * regularly rather than set once and forget.
 *
 * Drawn inline rather than loaded as an image so it inherits the page's
 * gradient palette and stays crisp at any size.
 */
export default component$((props: LogoProps) => {
  const size = props.size || 34;
  const uid = props.id || 'default';

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
      <defs>
        <linearGradient id={`logo-body-${uid}`} x1="6" y1="2" x2="42" y2="46" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="hsl(var(--p))" />
          <stop offset="55%" stop-color="hsl(var(--s))" />
          <stop offset="100%" stop-color="hsl(var(--a))" />
        </linearGradient>
        <linearGradient id={`logo-pulse-${uid}`} x1="10" y1="24" x2="38" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="hsl(var(--pc, 0 0% 100%))" stop-opacity="0.95" />
          <stop offset="100%" stop-color="hsl(var(--pc, 0 0% 100%))" stop-opacity="0.75" />
        </linearGradient>
      </defs>

      {/* Hex shield body */}
      <path
        d="M24 2.5 41.5 11v14.2c0 9.4-7 17.3-17.5 20.3C13.5 42.5 6.5 34.6 6.5 25.2V11L24 2.5Z"
        fill={`url(#logo-body-${uid})`}
      />

      {/* Inner bevel, gives the mark some depth */}
      <path
        d="M24 7 37 13.3v11.9c0 7.3-5.4 13.5-13 16-7.6-2.5-13-8.7-13-16V13.3L24 7Z"
        fill="hsl(var(--b1))"
        fill-opacity="0.16"
      />

      {/* Heartbeat / pulse line */}
      <path
        d="M12 25.5h6.2l3-6.6 4.4 12.4 3.1-8 2.2 4.2H36"
        stroke={`url(#logo-pulse-${uid})`}
        stroke-width="2.9"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
      />
    </svg>
  );
});
