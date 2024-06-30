import { Form } from "react-bootstrap";
import { FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";

interface CheckboxProps {
    label: string,
    register: UseFormRegister<any>,
    registerOptions?: RegisterOptions,
    error?: FieldError,
    [x: string]: any,
}

const Checkbox = ({ name, label, register, registerOptions, error, ...props }: CheckboxProps) => {
    return (
        <Form.Group className="mb-3" controlId={name + "-input"}>
            <Form.Label>{label}</Form.Label>
            <Form.Check
                {...props}
                {...register(name, registerOptions)}
                isInvalid={!!error}
                
            />
            <Form.Control.Feedback type="invalid">
                {error?.message}
            </Form.Control.Feedback>
        </Form.Group>
    );
}

export default Checkbox;