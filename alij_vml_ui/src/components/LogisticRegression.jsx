import { Input } from "@nextui-org/react";
import React from "react";

export default function LogisticRegression() {
  const dataform = () => {
    return (
      <form className="grid grid-cols-4 gap-4">
        <Input
          isRequired
          onValueChange={() => {}}
          size="md"
          type="file"
          label="Data"
        />
        <Input
          isRequired
          onValueChange={() => {}}
          size="md"
          type="text"
          label="ETA"
        />
        <Input
          isRequired
          onValueChange={() => {}}
          size="md"
          type="text"
          label="Iterations"
        />
        <Input
          isRequired
          onValueChange={() => {}}
          size="md"
          type="text"
          label="Features"
        />
        <Input
          isRequired
          onValueChange={() => {}}
          size="md"
          type="text"
          label="Output Column"
        />
        <Input
          isRequired
          onValueChange={() => {}}
          size="md"
          type="text"
          label="Class"
        />
        data
      </form>
    );
  };
  return <div className="grid grid-cols-4 gap-4">{dataform()}</div>;
}
