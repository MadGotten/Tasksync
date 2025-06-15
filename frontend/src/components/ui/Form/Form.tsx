interface ChildrenNode {
  children?: React.ReactNode;
}

interface FieldProps extends ChildrenNode {
  label: string;
  stacked?: boolean;
  reversed?: boolean;
}

interface ActionsProps extends ChildrenNode {
  stacked?: boolean;
}

const Form = () => {
  return <div>Form</div>;
};

const Field = ({ children, label, stacked = true, reversed = false }: FieldProps) => {
  const className = stacked ? "form-group" : "form-group row";
  return (
    <div className={className}>
      {!reversed && <label htmlFor='form-name'>{label}</label>}
      {children}
      {reversed && <label htmlFor='form-name'>{label}</label>}
    </div>
  );
};

const Actions = ({ children, stacked = false }: ActionsProps) => {
  const className = stacked ? "form-actions column" : "form-actions";
  return <div className={className}>{children}</div>;
};

Form.Field = Field;
Form.Actions = Actions;

export default Form;
