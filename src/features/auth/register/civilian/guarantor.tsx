import React, { useState, useEffect } from "react";
import { FormControl, FormLabel, Grid, Input, Select } from "@chakra-ui/react";
import { states } from "../../../../api/data";

type FieldType = "text" | "select" | "date";

interface GuarantorData {
  title: string;
  service_number: string;
  first_name: string;
  other_name: string;
  last_name: string;
  gender: string;
  date_of_birth: string;
  phone_number: string;
  email: string;
  address: string;
  rank: string;
  state_of_origin: string;
  lga: string;
  unit: string;
  nationality: string;
  relationship: string;
}

interface FormFieldConfig {
  name: keyof GuarantorData;
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
    name: "other_name",
    label: "Other Name",
    type: "text",
    placeholder: "Optional",
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
    placeholder: "",
    required: true,
  },
  {
    name: "email",
    label: "Email Address",
    type: "text",
    placeholder: "john@example.com",
    required: true,
  },
  {
    name: "address",
    label: "Address",
    type: "text",
    placeholder: "Full address",
    required: true,
  },
  {
    name: "service_number",
    label: "Service Number",
    type: "text",
    placeholder: "",
    required: true,
  },
  {
    name: "nationality",
    label: "Nationality",
    type: "text",
    placeholder: "",
  },
  {
    name: "rank",
    label: "Rank",
    type: "select",
    required: true,
    options: [
      { value: "AVM", label: "AVM" },
      { value: "AIR_CDRE", label: "AIR CDRE" },
      { value: "GP_CAPT", label: "GP CAPT" },
      { value: "WG_CDR", label: "WG CDR" },
      { value: "SQN_LDR", label: "SQN LDR" },
      { value: "FLT_LT", label: "FLT LT" },
      { value: "FG_OFFR", label: "FG OFFR" },
      { value: "PLT_OFFR", label: "PLT OFFR" },
      { value: "AWO", label: "AWO" },
      { value: "MWO", label: "MWO" },
      { value: "WO", label: "WO" },
      { value: "FS", label: "FS" },
      { value: "SGT", label: "SGT" },
      { value: "CPL", label: "CPL" },
      { value: "LCPL", label: "LCPL" },
      { value: "ACM", label: "ACM" },
    ],
  },
  {
    name: "state_of_origin",
    label: "State of Origin",
    type: "select",
    required: true,
  },
  {
    name: "lga",
    label: "LGA",
    type: "select",
    required: true,
  },
  {
    name: "unit",
    label: "Unit",
    type: "select",
    required: true,
  },
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
      { value: "PARTNER", label: "Partner" },
      { value: "OTHER", label: "Other" },
    ],
  },
];

interface FormFieldProps {
  field: FormFieldConfig;
  value: string;
  onChange: (name: keyof GuarantorData, value: string) => void;
  stateOptions?: { value: string; label: string }[];
  lgaOptions?: { value: string; label: string }[];
  unitOptions?: { value: string; label: string }[];
}

const FormField: React.FC<FormFieldProps> = ({
  field,
  value,
  onChange,
  stateOptions,
  lgaOptions,
  unitOptions,
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
    if (field.name === "unit") {
      return unitOptions || [];
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

interface GuarantorProps {
  onFormDataChange?: (formData: GuarantorData) => void;
  onValidationChange?: (isValid: boolean) => void;
  initialData?: Partial<GuarantorData>;
}

export const Guarantor: React.FC<GuarantorProps> = ({
  onFormDataChange,
  onValidationChange,
  initialData = {},
}) => {
  const [formData, setFormData] = useState<GuarantorData>({
    title: "",
    first_name: "",
    last_name: "",
    gender: "",
    state_of_origin: "",
    lga: "",
    relationship: "",
    service_number: "",
    other_name: "",
    date_of_birth: "",
    phone_number: "",
    email: "",
    address: "",
    rank: "",
    unit: "",
    nationality: "",
    ...initialData,
  });
  const [lgaOptions, setLgaOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [customUnitInput, setCustomUnitInput] = useState("");


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

  const handleFieldChange = (name: keyof GuarantorData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const stateOptions = Object.keys(states).map((state) => ({
    value: state,
    label: state,
  }));

  const handleCustomUnitChange = (value: string) => {
    setCustomUnitInput(value);
    setFormData((prev) => ({
      ...prev,
      unit: value.trim() ? `${value} (custom)` : "OTHER",
    }));
  };

  return (
    <div>
      <div className="flex flex-col justify-center items-center mb-6">
        <p className="font-bold text-3xl text-[#109CF1]">
          Guarantor's Information
        </p>
        <p>Enter guarantor's information</p>
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
        {formData.unit === "OTHER" && (
          <FormControl fontWeight="light" gridColumn="span 1">
            <FormLabel fontSize={13}>
              Custom Unit
              <span style={{ color: "red" }}>*</span>
            </FormLabel>
            <Input
              isRequired
              type="text"
              placeholder="Enter custom unit"
              fontSize={13}
              bg="white"
              value={customUnitInput}
              onChange={(e) => handleCustomUnitChange(e.target.value)}
            />
          </FormControl>
        )}
      </Grid>
    </div>
  );
};
