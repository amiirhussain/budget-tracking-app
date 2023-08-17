export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  budget: number | undefined;
  password: string;
  confirmPassword: string;
}

export interface FormContextType {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export interface CustomButtonProps {
  buttonText: string;
  onclick: () => void;
}

export interface EmailInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  rules: any[];
}

export interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  rules: any[];
}
