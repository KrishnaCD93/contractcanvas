import React, { useState } from "react";
import { Steps } from "antd";

const ProgressIndicator = ({ currentStep }: any) => {
  const [stepData, setStepData] = useState([
    { label: "Portfolio", summary: ""},
    { label: "Personal", summary: "" },
    { label: "Password", summary: ""},
    { label: "Confirm", summary: "" },
  ]);

  return (
    <Steps current={currentStep}>
      {stepData.map((step, index) => (
        <Steps.Step
          key={index}
          title={step.label}
          description={currentStep > index ? step.summary : ""}
        />
      ))}
    </Steps>
  );
};

export default ProgressIndicator;
