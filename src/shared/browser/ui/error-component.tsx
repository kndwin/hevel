import { ErrorComponentProps } from "@tanstack/react-router";
export function ErrorComponent(props: {
  error: ErrorComponentProps;
  message?: string;
}) {
  return (
    <div>
      <h1>Error</h1>
      {props.message && <p>{props.message}</p>}
      <p>{JSON.stringify(props.error.error, null, 2)}</p>
    </div>
  );
}
