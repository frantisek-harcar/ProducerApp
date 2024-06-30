import { Form } from "react-bootstrap";
import { FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";

interface ItemProps {
    id: string,
    name: string,
}

interface SelectProps {
    label: string,
    items: ItemProps[],
    register: UseFormRegister<any>,
    registerOptions?: RegisterOptions,
    error?: FieldError,
    [x: string]: any,
}

const Select = ({ name, items, label, register, registerOptions, error, ...props }: SelectProps) => {
    return (
        <Form.Group className="mb-3" controlId={name + "-input"}>
            <Form.Label>{label}</Form.Label>
            <Form.Select
                {...props}
                {...register(name, registerOptions)}
                isInvalid={!!error}
            >
                {
                    items.map((item, index) => (
                        <option key={index} value={item.id}>{item.name}</option>
                    ))
                }

            </Form.Select>
            <Form.Control.Feedback type="invalid">
                {error?.message}
            </Form.Control.Feedback>
        </Form.Group>
    );
}

export default Select;