// Component factory for testing
export function createComponentFactory<T>(defaultProps: Partial<T>) {
  return (props: Partial<T> = {}): T => {
    return { ...defaultProps, ...props } as T;
  };
}

// Button factory example
export const createButtonProps = createComponentFactory({
  variant: 'primary',
  size: 'md',
  disabled: false,
  children: 'Button',
});

// Input factory example
export const createInputProps = createComponentFactory({
  type: 'text',
  value: '',
  placeholder: 'Enter text...',
  disabled: false,
  required: false,
});
