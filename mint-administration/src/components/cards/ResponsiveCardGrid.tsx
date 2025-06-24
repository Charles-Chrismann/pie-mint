type ContainerProps = {
  children: React.ReactNode[]; // ou React.ReactElement[] si tu veux être plus strict
};

export default function ResponsiveCardGrid({ children }: ContainerProps) {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {children.map((child, index) => (
        <div key={index} className="child-wrapper">
          {child}
        </div>
      ))}
    </ul>
  )
}