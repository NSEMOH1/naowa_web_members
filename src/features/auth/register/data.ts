import type { FormFieldConfig } from "../../../lib/types";

export const personalInfoFields: FormFieldConfig[] = [
    {
        name: 'title', label: 'Title', type: 'select', options: [
            { value: 'Mr', label: 'Mr' },
            { value: 'Mrs', label: 'Mrs' },
            { value: 'Miss', label: 'Miss' }
        ]
    },
    { name: 'firstName', label: 'First Name', type: 'text', placeholder: 'Adedeji' },
    { name: 'surname', label: 'Surname', type: 'text', placeholder: 'Oluwatobi' },
    { name: 'nationality', label: 'Nationality', type: 'text', placeholder: '' },
    {
        name: 'gender', label: 'Gender', type: 'select', options: [
            { value: 'Male', label: 'Male' },
            { value: 'Female', label: 'Female' }
        ]
    },
    { name: 'stateOfOrigin', label: 'State of Origin/Local Government Area', type: 'text', colSpan: 2 },
    {
        name: 'relationship', label: 'Relationship', type: 'select', options: [
            { value: 'Brother', label: 'Brother' },
            { value: 'Sister', label: 'Sister' },
            { value: 'Spouse', label: 'Spouse' },
            { value: 'Parent', label: 'Parent' }
        ]
    },
    { name: 'email', label: 'Email Address', type: 'text' },
    { name: 'phone', label: 'Phone', type: 'text' },
];
