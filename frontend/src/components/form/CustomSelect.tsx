import Select from "react-select";
import { Controller, Control } from "react-hook-form";
import { Form } from "react-bootstrap";

interface Option {
    label: string;
    value: string;
}

interface CustomSelectProps {
    name: string;
    label: string;
    options: Option[];
    control: Control;
}

const CustomSelect = ({ name, label, options, control, ...props }: CustomSelectProps) => {

    return (
        <Form.Group className="mb-3" controlId={name + "-input"}>
            <Controller
                control={control}
                defaultValue={options.map(c => c.value)}
                name="options"
                render={({ field: { onChange, value, ref } }) => (
                    <Select
                        ref={ref}
                        value={options.filter(c => value.includes(c.value))}
                        onChange={val => onChange(val.map(c => c.value))}
                        options={options}
                        isMulti
                    />
                )}
            />
        </Form.Group>
    );
}

export default CustomSelect;