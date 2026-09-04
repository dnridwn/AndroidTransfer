import { ReactNode, useEffect, useRef, useState } from "react";
import { OnFileDrop, OnFileDropOff } from "../../wailsjs/runtime";
import { Download } from "lucide-react";

interface DropZoneComponentProps {
    children: ReactNode;
    className?: string;
    onDrop: (paths: string[]) => void;
}

export const DropZoneComponent = ({
    children,
    className,
    onDrop,
}: DropZoneComponentProps) => {
    const [isHovering, setIsHovering] = useState(false);
    const dragZoneRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleFileDrop = (x: number, y: number, paths: string[]) => {
            const rect = dragZoneRef.current?.getBoundingClientRect();
            if (
                rect &&
                x >= rect.left &&
                x <= rect.right &&
                y >= rect.top &&
                y <= rect.bottom
            ) {
                onDrop(paths);
            }
        };

        OnFileDrop(handleFileDrop, false);

        return () => {
            OnFileDropOff();
        };
    }, [dragZoneRef.current]);

    return (
        <div
            className={`
                relative
                ${className || ""}
            `}
            onDragOver={(e) => {
                e.preventDefault();
                setIsHovering(true);
            }}
            onDragLeave={(e) => {
                e.preventDefault();
                setIsHovering(false);
            }}
            onDrop={(e) => {
                e.preventDefault();
                setIsHovering(false);
            }}
            ref={dragZoneRef}
        >
            {isHovering && (
                <div className="absolute inset-0 bg-gray-300/50 z-9999 flex justify-center items-center">
                    <div className="flex flex-col justify-center items-center gap-2">
                        <Download className="text-gray-500" size={64} />
                        <p className="text-sm text-gray-500 font-bold">Drop files here</p>
                    </div>
                </div>
            )}
            {children}
        </div>
    );
};
