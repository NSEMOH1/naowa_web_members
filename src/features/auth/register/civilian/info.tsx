import React, { useState, useEffect } from "react";
import { FormControl, FormLabel, Grid, Input, Select } from "@chakra-ui/react";
import { states } from "../../../../api/data";

type FieldType = "text" | "select" | "number" | "date";

interface FormFieldConfig {
  name: keyof FormData;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: { value: string; label: string }[];
  colSpan?: number;
  required?: boolean;
}

interface FormData {
  title: string;
  first_name: string;
  other_name: string;
  last_name: string;
  gender: string;
  phone_number: string;
  email: string;
  address: string;
  state_of_origin: string;
  bank_name: string;
  account_number: string;
  account_name: string;
  lga: string;
  pin: string;
  monthlyDeduction: string;
  date_of_birth: string;
}

interface StateOption {
  value: string;
  label: string;
}

interface EnterInfoProps {
  onFormDataChange?: (formData: FormData) => void;
  onValidationChange?: (isValid: boolean) => void;
  initialData?: Partial<FormData>;
}

const personalInfoFields: FormFieldConfig[] = [
  {
    name: "title",
    label: "Title",
    type: "select",
    required: true,
    options: [
      { value: "MR", label: "Mr" },
      { value: "MRS", label: "Mrs" },
      { value: "MISS", label: "Miss" },
    ],
  },
  {
    name: "first_name",
    label: "First Name",
    type: "text",
    placeholder: "Adedeji",
    required: true,
  },
  {
    name: "other_name",
    label: "Other Name",
    type: "text",
    placeholder: "Pelumi",
    required: true,
  },
  {
    name: "last_name",
    label: "Surname",
    type: "text",
    placeholder: "Oluwatobi",
    required: true,
  },
  {
    name: "gender",
    label: "Gender",
    type: "select",
    required: true,
    options: [
      { value: "MALE", label: "Male" },
      { value: "FEMALE", label: "Female" },
    ],
  },
  {
    name: "date_of_birth",
    label: "Date of Birth",
    type: "date",
    placeholder: "YYYY-MM-DD",
    required: true,
  },
  {
    name: "phone_number",
    label: "Phone Number",
    type: "text",
    placeholder: "Phone Number",
    required: true,
  },
  {
    name: "email",
    label: "Email Address",
    type: "text",
    placeholder: "mail@mail.com",
    required: true,
  },
  {
    name: "address",
    label: "House Address",
    type: "text",
    placeholder: "House Address",
    required: true,
  },
  {
    name: "state_of_origin",
    label: "State of Origin",
    type: "select",
    required: true,
  },
  { name: "lga", label: "LGA", type: "select", required: true },
];

const financialInfoFields: FormFieldConfig[] = [
  {
    name: "bank_name",
    label: "Bank",
    type: "select",
    placeholder: "Select bank",
    required: true,
    options: [
      { value: "Access Bank", label: "Access Bank" },
      { value: "First Bank", label: "First Bank" },
      { value: "GTBank", label: "GTBank" },
      { value: "Zenith Bank", label: "Zenith Bank" },
      { value: "UBA", label: "UBA" },
      { value: "OTHER", label: "Other" },
    ],
  },
  {
    name: "account_number",
    label: "Salary Account Number",
    type: "text",
    placeholder: "Account Number",
    required: true,
  },
  {
    name: "pin",
    label: "Transaction Pin",
    type: "text",
    placeholder: "Enter 4 digits pin",
    required: true,
  },
  {
    name: "monthlyDeduction",
    label: "Monthly Deduction Amount",
    type: "number",
    placeholder: "Monthly Deduction Amount",
    required: true,
  },
];

interface FormFieldProps {
  field: FormFieldConfig;
  value: string;
  onChange: (name: keyof FormData, value: string) => void;
  stateOptions?: StateOption[];
  lgaOptions?: StateOption[];
}

const FormField: React.FC<FormFieldProps> = ({
  field,
  value,
  onChange,
  stateOptions,
  lgaOptions,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    onChange(field.name, e.target.value);
  };

  const getFieldOptions = () => {
    if (field.name === "state_of_origin") {
      return stateOptions || [];
    }
    if (field.name === "lga") {
      return lgaOptions || [];
    }
    return field.options || [];
  };

  return (
    <FormControl fontWeight="light" gridColumn={`span ${field.colSpan || 1}`}>
      <FormLabel fontSize={13}>
        {field.label}
        {field.required && <span style={{ color: "red" }}>*</span>}
      </FormLabel>
      {field.type === "select" ? (
        <Select
          isRequired={field.required}
          bg="white"
          placeholder={`Select ${field.label.toLowerCase()}`}
          fontSize={13}
          value={value}
          onChange={handleChange}
          isDisabled={field.name === "lga" && !lgaOptions?.length}
        >
          {getFieldOptions().map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      ) : (
        <Input
          isRequired={field.required}
          type={field.type}
          placeholder={field.placeholder}
          fontSize={13}
          bg="white"
          value={value}
          onChange={handleChange}
        />
      )}
    </FormControl>
  );
};

export const EnterInfo: React.FC<EnterInfoProps> = ({
  onFormDataChange,
  onValidationChange,
  initialData = {},
}) => {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    first_name: "",
    other_name: "",
    last_name: "",
    gender: "",
    phone_number: "",
    email: "",
    address: "",
    state_of_origin: "",
    bank_name: "",
    account_number: "",
    account_name: "",
    lga: "",
    monthlyDeduction: "",
    pin: "",
    date_of_birth: "",
    ...initialData,
  });
  const [lgaOptions, setLgaOptions] = useState<StateOption[]>([]);
  const [customBankInput, setCustomBankInput] = useState("");

  const validateForm = (): boolean => {
    const allFields = [...personalInfoFields, ...financialInfoFields];
    const requiredFields = allFields.filter(
      (field) => field.required !== false
    );

    return requiredFields.every((field) => {
      const value = formData[field.name];
      return value && value.trim() !== "";
    });
  };

  useEffect(() => {
    if (onFormDataChange) {
      onFormDataChange(formData);
    }

    if (onValidationChange) {
      const isValid = validateForm();
      onValidationChange(isValid);
    }
  }, [formData, onFormDataChange, onValidationChange]);

  useEffect(() => {
    if (
      formData.state_of_origin &&
      Object.prototype.hasOwnProperty.call(states, formData.state_of_origin)
    ) {
      const lgAs = (states as Record<string, string[]>)[
        formData.state_of_origin
      ].map((lga) => ({
        value: lga,
        label: lga,
      }));
      setLgaOptions(lgAs);

      setFormData((prev) => ({
        ...prev,
        lga: "",
      }));
    } else {
      setLgaOptions([]);
    }
  }, [formData.state_of_origin]);

  const handleFieldChange = (name: keyof FormData, value: string) => {
    if (name === "bank_name") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        account_name: "", // Clear account name when bank changes
      }));
      if (value !== "OTHER") {
        setCustomBankInput("");
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCustomBankChange = (value: string) => {
    setCustomBankInput(value);
    setFormData((prev) => ({
      ...prev,
      bank_name: value.trim() ? `${value} (custom)` : "OTHER",
    }));
  };

  const stateOptions = Object.keys(states).map((state) => ({
    value: state,
    label: state,
  }));

  return (
    <div>
      <div className="flex flex-col justify-center items-center mb-6">
        <p className="font-bold text-3xl text-[#109CF1]">Create Profile</p>
        <p>Enter Your current informations</p>
      </div>

      <Grid
        templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
        gap={4}
        mt={4}
      >
        {personalInfoFields.map((field) => (
          <FormField
            key={field.name}
            field={field}
            value={formData[field.name]}
            onChange={handleFieldChange}
            stateOptions={
              field.name === "state_of_origin" ? stateOptions : undefined
            }
            lgaOptions={field.name === "lga" ? lgaOptions : undefined}
          />
        ))}
      </Grid>

      <Grid
        templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
        gap={4}
        mt={4}
      >
        {formData.bank_name && formData.bank_name !== "" && (
          <FormControl fontWeight="light" gridColumn="span 1">
            <FormLabel fontSize={13}>
              Bank Account Name
              <span style={{ color: "red" }}>*</span>
            </FormLabel>
            <Input
              isRequired
              type="text"
              placeholder="Account Name"
              fontSize={13}
              bg="white"
              value={formData.account_name}
              onChange={(e) =>
                handleFieldChange("account_name", e.target.value)
              }
            />
          </FormControl>
        )}
        {financialInfoFields.map((field) => (
          <FormField
            key={field.name}
            field={field}
            value={formData[field.name]}
            onChange={handleFieldChange}
          />
        ))}
        {formData.bank_name === "OTHER" && (
          <FormControl fontWeight="light" gridColumn="span 1">
            <FormLabel fontSize={13}>
              Custom Bank
              <span style={{ color: "red" }}>*</span>
            </FormLabel>
            <Input
              isRequired
              type="text"
              placeholder="Enter custom bank"
              fontSize={13}
              bg="white"
              value={customBankInput}
              onChange={(e) => handleCustomBankChange(e.target.value)}
            />
          </FormControl>
        )}
      </Grid>
    </div>
  );
};
