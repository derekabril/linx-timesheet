import * as React from "react";
import { Persona, PersonaSize } from "@fluentui/react/lib/Persona";

interface IPersonaDisplayProps {
  name: string;
  email?: string;
  size?: PersonaSize;
}

export const PersonaDisplay: React.FC<IPersonaDisplayProps> = ({
  name,
  email,
  size = PersonaSize.size24,
}) => {
  return (
    <Persona
      text={name}
      secondaryText={email}
      size={size}
      hidePersonaDetails={size === PersonaSize.size24}
    />
  );
};
