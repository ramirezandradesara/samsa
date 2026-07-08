type FormHeaderProps = {
  title: string;
  description: string;
};

function FormHeader({ title, description }: FormHeaderProps) {
  return (
    <header className="space-y-2">
      <h1 className="text-heading-sm font-semibold tracking-tight text-foreground md:text-heading">
        {title}
      </h1>
      <p className="max-w-md text-body leading-body text-muted-foreground">
        {description}
      </p>
    </header>
  );
}

export default FormHeader;
