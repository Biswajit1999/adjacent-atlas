export interface EmptyStateProps {
  title?: string;
  message?: string;
}

export function EmptyState({ title = "Nothing here", message }: EmptyStateProps): JSX.Element {
  return (
    <div className="state">
      <span className="state__text">
        <strong>{title}</strong>
        {message ? ` — ${message}` : ""}
      </span>
    </div>
  );
}
