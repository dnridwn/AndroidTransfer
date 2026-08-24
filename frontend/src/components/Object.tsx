import {
    File,
    FileImage,
    FileMusic,
    FilePlay,
    FileText,
    Folder,
    Info,
    SquarePen,
    Trash,
} from "lucide-react";
import { MouseEvent, ReactElement, useEffect, useRef, useState } from "react";
import { Object } from "../types/object";
import { formatByteHumanReadable } from "../utils/format";

const ICON_BY_FORMAT: Record<Object["format"], ReactElement> = {
    Folder: (
        <Folder
            size={64}
            fill="oklch(82.8% 0.189 84.429)"
            color="oklch(76.9% 0.188 70.08)"
            strokeWidth={1}
            className="mx-auto"
        />
    ),
    Image: (
        <FileImage
            size={64}
            fill="oklch(86.5% 0.127 207.078)"
            color="oklch(78.9% 0.154 211.53)"
            strokeWidth={1}
            className="mx-auto"
        />
    ),
    Audio: (
        <FileMusic
            size={64}
            fill="oklch(64.5% 0.246 16.439)"
            color="oklch(58.6% 0.253 17.585)"
            strokeWidth={1}
            className="mx-auto"
        />
    ),
    Video: (
        <FilePlay
            size={64}
            fill="oklch(62.7% 0.265 303.9)"
            color="oklch(55.8% 0.288 302.321)"
            strokeWidth={1}
            className="mx-auto"
        />
    ),
    Text: (
        <FileText
            size={64}
            fill="oklch(77.7% 0.152 181.912)"
            color="oklch(70.4% 0.14 182.503)"
            strokeWidth={1}
            className="mx-auto"
        />
    ),
    Unknown: (
        <File
            size={64}
            fill="oklch(70.7% 0.022 261.325)"
            color="oklch(55.1% 0.027 264.364)"
            strokeWidth={1}
            className="mx-auto"
        />
    ),
};

interface ObjectComponentProps {
    object: Object;
    onDoubleClick: (object: Object) => void;
    onActionClick: (action: "INFO" | "RENAME" | "DELETE", object: Object) => void;
}

export const ObjectComponent = ({
    object,
    onDoubleClick,
    onActionClick,
}: ObjectComponentProps) => {
    const [contextMenu, setContextMenu] = useState<{
        visible: boolean;
        x: number;
        y: number;
    }>({
        visible: false,
        x: 0,
        y: 0,
    });
    const containerRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleOnDoubleClick = () => {
        onDoubleClick(object);
    };

    const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();

        const containerRect = containerRef.current!.getBoundingClientRect();
        const menuRect = menuRef.current!.getBoundingClientRect();

        let { clientX: x, clientY: y } = e;
        x = x - containerRect.x + 10;
        y = y - containerRect.y + 10;

        if (containerRect.x + x + menuRef.current!.offsetWidth > window.innerWidth) {
            x = containerRect.width - menuRect.width;
        }
        if (containerRect.y + y + menuRef.current!.offsetHeight > window.innerHeight) {
            y = containerRect.height - menuRect.height;
        }

        setContextMenu({
            visible: true,
            x,
            y,
        });
    };

    useEffect(() => {
        const handleCloseContextMenu = (e: any) => {
            if (
                contextMenu.visible &&
                menuRef.current &&
                !menuRef.current.contains(e.target)
            ) {
                setContextMenu((prev) => ({ ...prev, visible: false }));
            }
        };
        document.addEventListener("mousedown", handleCloseContextMenu);
        return () => {
            document.removeEventListener("mousedown", handleCloseContextMenu);
        };
    }, [contextMenu.visible]);

    return (
        <div className="relative" onContextMenu={handleContextMenu} ref={containerRef}>
            <div
                className={`absolute min-w-[160px] rounded-md shadow-lg bg-white overflow-hidden transition-opacity duration-200 z-9999 ${
                    contextMenu.visible
                        ? "visible opacity-100"
                        : "invisible opacity-0 pointer-events-none"
                }`}
                style={{
                    top: `${contextMenu.y}px`,
                    left: `${contextMenu.x}px`,
                }}
                ref={menuRef}
            >
                <div className="text-center px-3 py-2 bg-gray-200">
                    <h6 className="text-sm p-0 m-0">Action</h6>
                </div>
                <button
                    className="flex items-center gap-1 py-2 px-3 cursor-pointer text-sm text-left text-gray-600 w-full hover:bg-gray-100 hover:text-gray-900"
                    onClick={() => onActionClick("INFO", object)}
                >
                    <Info size={14} /> Info
                </button>
                <button
                    className="flex items-center gap-1 py-2 px-3 cursor-pointer text-sm text-left text-gray-600 w-full hover:bg-gray-100 hover:text-gray-900"
                    onClick={() => onActionClick("RENAME", object)}
                >
                    <SquarePen size={14} /> Rename
                </button>
                <button
                    className="flex items-center gap-1 py-2 px-3 cursor-pointer text-sm text-left text-gray-600 w-full hover:bg-gray-100 hover:text-gray-900"
                    onClick={() => onActionClick("DELETE", object)}
                >
                    <Trash size={14} /> Delete
                </button>
            </div>
            <button
                className="p-4 rounded-xl cursor-pointer overflow-hidden w-full h-full text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                onDoubleClick={handleOnDoubleClick}
            >
                {ICON_BY_FORMAT[object.format]}
                <p className="truncate text-sm">{object.name}</p>
                {object.format !== "Folder" && (
                    <p className="text-xs text-gray-400">
                        {formatByteHumanReadable(object.size)}
                    </p>
                )}
            </button>
        </div>
    );
};
