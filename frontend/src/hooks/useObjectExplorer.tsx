import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Device } from "../types/device";
import { Object } from "../types/object";
import { Storage } from "../types/storage";
import { getObjectList } from "../api/backend";

interface PathStackItem {
    key: number;
    name: string;
}

type ObjectExplorerContextType = {
    activeDevice: Device | null;
    activeStorage: Storage | null;
    pathStack: PathStackItem[];
    loadingObjects: boolean;
    objects: Object[];
    focusedObject: Object | null;
    focusObject: (object: Object | null) => void;
    openPath: (pathStackItem: PathStackItem) => void;
    openStorage: (device: Device, storage: Storage) => void;
    loadObjects: (parentId: number) => Promise<void>;
};

const ObjectExplorerContext = createContext<ObjectExplorerContextType | null>(null);

export function ObjectExplorerProvider({ children }: { children: React.ReactNode }) {
    const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
    const [selectedStorage, setSelectedStorage] = useState<Storage | null>(null);
    const [objects, setObjects] = useState<Object[]>([]);
    const [loadingObjects, setLoadingObjects] = useState<boolean>(false);
    const [focusedObject, setFocusedObject] = useState<Object | null>(null);
    const [pathStack, setPathStack] = useState<PathStackItem[]>([]);

    const loadObjects = async (parentId: number) => {
        if (loadingObjects) {
            throw new Error("Already loading objects");
        }

        if (!selectedDevice || !selectedStorage) {
            throw new Error("Selected device or storage is not set");
        }

        try {
            setLoadingObjects(true);
            const objects = await getObjectList(
                selectedDevice.serial_number,
                selectedStorage.id,
                parentId
            );
            setObjects(objects);
        } catch (e) {
            console.error("Error loading objects:", e);
        } finally {
            setLoadingObjects(false);
        }
    };

    const openPath = (pathStackItem: PathStackItem) => {
        const existingIndex = pathStack.findIndex(
            (item) => item.key === pathStackItem.key
        );
        if (existingIndex < 0) {
            setPathStack((prev) => [...prev, pathStackItem]);
        } else {
            setPathStack((prev) => prev.slice(0, existingIndex + 1));
        }
    };

    useEffect(() => {
        if (selectedDevice && selectedStorage) {
            setPathStack([
                {
                    key: -1,
                    name: selectedDevice.name,
                },
                {
                    key: 0,
                    name: selectedStorage.name,
                },
            ]);
        }
    }, [selectedDevice, selectedStorage]);

    useEffect(() => {
        if (pathStack.length <= 0) {
            setObjects([]);
            return;
        }
        const lastStack = pathStack[pathStack.length - 1];
        loadObjects(lastStack.key);
    }, [pathStack]);

    return (
        <ObjectExplorerContext.Provider
            value={{
                activeDevice: selectedDevice,
                activeStorage: selectedStorage,
                pathStack,
                loadingObjects,
                objects,
                openPath,
                focusedObject,
                openStorage: (device: Device, storage: Storage) => {
                    setSelectedDevice(device);
                    setSelectedStorage(storage);
                },
                focusObject: (object: Object | null) => {
                    setFocusedObject(object);
                },
                loadObjects,
            }}
        >
            {children}
        </ObjectExplorerContext.Provider>
    );
}

export function useObjectExplorer() {
    const context = useContext(ObjectExplorerContext);
    if (!context) {
        throw new Error(
            "useObjectExplorer must be used within an ObjectExplorerProvider"
        );
    }
    return context;
}
