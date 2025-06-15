export const Input = ({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) => {
  return <input id='form-name' className='input' type='text' {...props}></input>;
};
