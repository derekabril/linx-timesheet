import * as React from "react";
import { Spinner, SpinnerSize } from "@fluentui/react/lib/Spinner";
import { Stack } from "@fluentui/react/lib/Stack";

interface ILoadingSpinnerProps {
  label?: string;
  size?: SpinnerSize;
}

export const LoadingSpinner: React.FC<ILoadingSpinnerProps> = ({
  label = "Loading...",
  size = SpinnerSize.large,
}) => {
  return (
    <Stack
      horizontalAlign="center"
      verticalAlign="center"
      styles={{ root: { minHeight: 200, padding: 20 } }}
    >
      <Spinner size={size} label={label} />
    </Stack>
  );
};
