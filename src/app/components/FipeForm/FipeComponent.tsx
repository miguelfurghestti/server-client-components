interface FipeComponentProps {
  brand: string;
}

export function FipeComponent({ brand }: FipeComponentProps) {
  return (
    <div>
      <span>{brand}</span>
    </div>
  );
}
