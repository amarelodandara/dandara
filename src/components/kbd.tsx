export function Kbd({ children }: { children: string }) {
  return (
    <kbd
      aria-hidden="true"
      className="ml-2 inline-flex min-w-[1.1em] items-center justify-center rounded-[0.25rem] border border-black/15 px-1 py-0.5 font-mono text-[0.65rem] leading-none font-normal text-black/35"
    >
      {children}
    </kbd>
  );
}
