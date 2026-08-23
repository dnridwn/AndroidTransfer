import { ChevronRight } from "lucide-react";

interface BreadCrumbItem {
    key: number;
    name: string;
    onClick: (key: number, name: string) => void;
}

interface BreadCrumbProps {
    items: BreadCrumbItem[];
}

export const BreadCrumbComponent = ({ items }: BreadCrumbProps) => {
    return (
        <div className="flex items-center gap-2 w-full min-w-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {items.map((item, index) => (
                <>
                    <button
                        className={`shrink-0 whitespace-nowrap text-sm cursor-pointer rounded-xl px-2 hover:text-gray-900 ${
                            index === items.length - 1
                                ? "bg-gray-200 text-gray-900"
                                : "text-gray-600"
                        }`}
                        onClick={() => item.onClick(item.key, item.name)}
                    >
                        {item.name}
                    </button>
                    {index < items.length - 1 && (
                        <span className="text-gray-600">
                            <ChevronRight size={12} />
                        </span>
                    )}
                </>
            ))}
        </div>
    );
};
