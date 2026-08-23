import { X } from "lucide-react";
import { ReactNode } from "react";

interface ModalComponentProps {
    visible: boolean;
    title: string | ReactNode;
    children?: ReactNode;
    onClose: () => void;
}

export const ModalComponent = ({
    visible,
    onClose,
    title,
    children,
}: ModalComponentProps) => {
    return (
        <div
            className={`fixed inset-0 z-9999 flex items-center justify-center ${
                visible ? "visible" : "invisible pointer-events-none"
            }`}
        >
            <div
                className={`fixed inset-0 backdrop-blur-xs bg-black/20 z-9999 transition-opacity duration-200 ${
                    visible ? "opacity-100" : "opacity-0"
                }  `}
            ></div>
            <div className="relative min-w-[400px] bg-white rounded-lg shadow overflow-hidden z-9999">
                <div className="flex justify-between items-center py-2 px-4 bg-gray-100">
                    <h6>{title}</h6>
                    <div>
                        <button
                            className="cursor-pointer rounded-sm text-gray-600 hover:bg-gray-300 p-1"
                            onClick={onClose}
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>
                <div className="p-4">{children}</div>
            </div>
        </div>
    );
};
