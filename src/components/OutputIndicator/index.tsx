type OutputIndicatorProps = {
  title: string;
  enabled: boolean;
};

const OutputIndicator = ({ title, enabled }: OutputIndicatorProps) => {
  return (
    <div className="flex items-center gap-2">
      <div className={`p-2 rounded-full border-2 border-gray-200 transition-colors ${enabled ? "bg-green-500" : "bg-red-500"}`} />
      <div className="text-sm font-medium uppercase">{title}</div>
    </div>
  );
};

export { OutputIndicator };
