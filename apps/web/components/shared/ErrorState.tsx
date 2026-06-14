"use client";

export interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = "Something went wrong.", onRetry }: ErrorStateProps): JSX.Element {
  return (
    <div className="state state--error" role="alert">
      <span className="state__text">{message}</span>
      {onRetry ? (
        <button type="button" className="btn btn--ghost" onClick={onRetry}>
          Retry
        </button>
      ) : null}
    </div>
  );
}
