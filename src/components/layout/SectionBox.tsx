export default function SectionBox({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="bg-white m-8 shadow p-4">{children}</div>;
}
