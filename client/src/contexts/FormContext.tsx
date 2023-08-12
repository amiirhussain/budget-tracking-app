import React, { createContext, useContext, useState } from 'react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  budget: number | undefined;
  password: string;
  confirmPassword: string;
}

interface FormContextType {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const useFormContext = (): FormContextType => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};

interface FormProviderProps {
  children: React.ReactNode;
}

export const FormProvider: React.FC<FormProviderProps> = ({ children }) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    budget: undefined,
    password: '',
    confirmPassword: '',
  });

  return (
    <FormContext.Provider value={{ formData, setFormData }}>
      {children}
    </FormContext.Provider>
  );
};
