import { ReactNode } from "react";

interface EmptyComponentProps {
    icon: ReactNode;
    title: string | ReactNode;
    subtitle?: string | ReactNode;
}

export const EmptyComponent = ({ icon, title, subtitle }: EmptyComponentProps) => {
    return (
        <div className="h-full flex flex-col justify-center items-center text-gray-400">
            <span className="mb-3">{icon}</span>
            <h6 className="mb-1">{title}</h6>
            {subtitle && <p className="text-sm">{subtitle}</p>}
        </div>
    );
};
