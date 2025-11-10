import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { Calendar } from "lucide-react";
import DatePicker from "react-datepicker";

function DatePickerInput({ selectedDate, onChange, placeholder }: any) {
    return (
        <InputGroup>
            <InputLeftElement pointerEvents="none">
                <Calendar color="gray.300" />
            </InputLeftElement>
            <Input
                as={DatePicker}
                selected={selectedDate}
                onChange={onChange}
                dateFormat="dd MMM yyyy"
                placeholderText={placeholder}
                showPopperArrow={true}
            />
        </InputGroup>
    );
}

export default DatePickerInput;