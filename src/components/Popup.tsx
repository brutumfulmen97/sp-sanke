export default function Popup({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="fixed z-30 left-1/2 top-1/2 -translate-x-[50%] -translate-y-[50%] w-[90vw] min-h-[70vh] md:min-h-[50vh] bg-[#06283ed9]   rounded-lg p-12 text-white">
      <h1 className="text-3xl text-center mb-4">{title}</h1>
      <p>{body}</p>
    </div>
  );
}
