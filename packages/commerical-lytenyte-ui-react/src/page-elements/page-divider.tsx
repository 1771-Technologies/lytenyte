export function PageDivider() {
  return (
    <div role="presentation" aria-hidden className="absolute top-0 z-[-1] h-full w-full">
      <div className="container mx-auto h-full px-1.5">
        <div className="h-full border-x border-gray-300/40 dark:border-gray-200/50"></div>
      </div>
    </div>
  );
}
