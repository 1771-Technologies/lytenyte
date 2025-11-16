export function LineDivider({ withMarkers }: { withMarkers?: boolean }) {
  return (
    <div
      className="absolute left-0 h-px w-screen bg-gray-300/40 dark:bg-gray-200/50"
      role="presentation"
      aria-hidden
    >
      <div className="container mx-auto flex items-center justify-between">
        {withMarkers && (
          <>
            <div className="-translate-y-1/2">+</div>
            <div className="-translate-y-1/2">+</div>
          </>
        )}
      </div>
    </div>
  );
}
