import React, { useState, useEffect } from "react";
import { FormControl, FormLabel, Grid, Input, Select } from "@chakra-ui/react";
import { states } from "../../../../api/data";

type FieldType = "text" | "select";

interface NextOfKinFormData {
  title: string;
  first_name: string;
  last_name: string;
  nationality: string;
  gender: string;
  relationship: string;
  email: string;
  phone: string;
  address: string;
  state_of_origin: string;
  lga: string;
}

interface FormFieldConfig {
  name: keyof NextOfKinFormData;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: { value: string; label: string }[];
  colSpan?: number;
  required?: boolean;
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
    name: "last_name",
    label: "Surname",
    type: "text",
    placeholder: "Oluwatobi",
    required: true,
  },
  {
    name: "nationality",
    label: "Nationality",
    type: "text",
    placeholder: "Nigerian",
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
    name: "state_of_origin",
    label: "State of Origin",
    type: "select",
    required: true,
  },
  { name: "lga", label: "LGA", type: "select", required: true },
  {
    name: "relationship",
    label: "Relationship",
    type: "select",
    required: true,
    options: [
      { value: "SPOUSE", label: "Spouse" },
      { value: "FATHER", label: "Father" },
      { value: "MOTHER", label: "Mother" },
      { value: "SON", label: "Son" },
      { value: "DAUGHTER", label: "Daughter" },
      { value: "SIBLING", label: "Brother/Sister" },
      { value: "GUARDIAN", label: "Guardian" },
      { value: "OTHER", label: "Other" },
    ],
  },
  {
    name: "email",
    label: "Email Address",
    type: "text",
    placeholder: "john@example.com",
    required: true,
  },
  {
    name: "phone",
    label: "Phone",
    type: "text",
    placeholder: "",
    required: true,
  },
  {
    name: "address",
    label: "Address",
    type: "text",
    placeholder: "",
    required: true,
  },
];

interface FormFieldProps {
  field: FormFieldConfig;
  value: string;
  onChange: (name: keyof NextOfKinFormData, value: string) => void;
  stateOptions?: { value: string; label: string }[];
  lgaOptions?: { value: string; label: string }[];
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

interface CreateProfileProps {
  onFormDataChange?: (formData: NextOfKinFormData) => void;
  onValidationChange?: (isValid: boolean) => void;
  initialData?: Partial<NextOfKinFormData>;
}

export const CreateProfile: React.FC<CreateProfileProps> = ({
  onFormDataChange,
  onValidationChange,
  initialData = {},
}) => {
  const [formData, setFormData] = useState<NextOfKinFormData>({
    title: "",
    first_name: "",
    last_name: "",
    nationality: "",
    gender: "",
    relationship: "",
    email: "",
    phone: "",
    address: "",
    state_of_origin: "",
    lga: "",
    ...initialData,
  });
  const [lgaOptions, setLgaOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const validateForm = (): boolean => {
    return personalInfoFields.every((field) => {
      if (field.required) {
        const value = formData[field.name];
        return value && value.trim() !== "";
      }
      return true;
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
      setFormData((prev) => ({ ...prev, lga: "" }));
    } else {
      setLgaOptions([]);
    }
  }, [formData.state_of_origin]);

  const handleFieldChange = (name: keyof NextOfKinFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const stateOptions = Object.keys(states).map((state) => ({
    value: state,
    label: state,
  }));

  return (
    <div>
      <div className="flex flex-col justify-center items-center mb-6">
        <p className="font-bold text-3xl text-[#109CF1]">Enter Next of Kin</p>
        <p>Enter next of kin details</p>
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
    </div>
  );
};
