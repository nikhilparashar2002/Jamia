import { FolderIcon } from "@heroicons/react/24/outline";

interface NoDataProps {
  message?: string;
}

export default function NoData({ message = "No data available" }: NoDataProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <FolderIcon className="w-12 h-12 text-default-300 mb-4" />
      <p className="text-default-500">{message}</p>
    </div>
  );
}
