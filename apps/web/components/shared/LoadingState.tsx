export interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading…" }: LoadingStateProps): JSX.Element {
  return (
    <div className="state" role="status" aria-live="polite">
      <span className="state__spinner" aria-hidden="true" />
      <span className="state__text">{message}</span>
    </div>
  );
}
