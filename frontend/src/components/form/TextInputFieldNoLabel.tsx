import { Form } from "react-bootstrap";
import { FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";

interface TextInputFieldProps {
    name: string,
    register: UseFormRegister<any>,
    registerOptions?: RegisterOptions,
    error?: FieldError,
    [x: string]: any,
}

const TextInputFieldNoLabel = ({ name, register, registerOptions, error, ...props }: TextInputFieldProps) => {

    return (
        <Form.Group className="mb-3" controlId={name + "-input"}>
            <Form.Control
                as="textarea"
                rows={1}
                {...props}
                {...register(name, registerOptions)}
                isInvalid={!!error}
            />
            {/* <textarea
                {...props}
                {...register(name, registerOptions)}
                className={`${styles.formControl} form-control ${error ? 'is-invalid' : ''}`}
                rows={textareaRows}
                onChange={handleTextareaChange}
            /> */}
            <Form.Control.Feedback type="invalid">
                {error?.message}
            </Form.Control.Feedback>
        </Form.Group>
    );
}

export default TextInputFieldNoLabel;