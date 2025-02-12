import { useState } from "react";

export function MultiStepExample() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });
  const steps = [
    {
      title: "Step 1",
      description: "Enter your email",
      input: "email",
    },
    {
      title: "Step 2",
      description: "Enter your username",
      input: "username",
    },
    {
      title: "Step 3",
      description: "Enter your password",
      input: "password",
    },
  ];
  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep((prev) => prev + 1);
    }
  };
  const handleBack = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
    }
  };
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [steps[step].input]: e.target.value,
    }));
  };
  return (<div>
    <h1>{steps[step].title}</h1>
    <p>{steps[step].description}</p>
    <input type="text" value={formData[steps[step].input]} onChange={handleChange} />
    <button onClick={handleBack}>Back</button>
    <button onClick={handleNext}>Next</button>
  </div>);
}