import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Device } from "../types/device";
import { Object } from "../types/object";
import { Storage } from "../types/storage";
import { handleDeleteObject, handleGetObjectList } from "../api/backend";

interface PathStackItem {
    key: number;
    name: string;
}

type ObjectExplorerContextType = {
    activeDevice: Device | null;
    activeStorage: Storage | null;
    pathStack: PathStackItem[];
    loading: boolean;
    objects: Object[];
    focusedObject: Object | null;
    focusObject: (object: Object | null) => void;
    openPath: (pathStackItem: PathStackItem) => void;
    openStorage: (device: Device, storage: Storage) => void;
    loadObjects: (parentId: number) => Promise<void>;
    deleteObject: (objectID: number) => void;
};

const ObjectExplorerContext = createContext<ObjectExplorerContextType | null>(null);

export function ObjectExplorerProvider({ children }: { children: React.ReactNode }) {
    const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
    const [selectedStorage, setSelectedStorage] = useState<Storage | null>(null);
    const [objects, setObjects] = useState<Object[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [focusedObject, setFocusedObject] = useState<Object | null>(null);
    const [pathStack, setPathStack] = useState<PathStackItem[]>([]);

    const loadObjects = async (parentId: number) => {
        if (loading) {
            throw new Error("There is running process");
        }

        if (!selectedDevice || !selectedStorage) {
            throw new Error("Selected device or storage is not set");
        }

        try {
            setLoading(true);
            const objects = await handleGetObjectList(
                selectedDevice.serial_number,
                selectedStorage.id,
                parentId
            );
            setObjects(objects);
        } catch (e) {
            console.error("Error loading objects:", e);
        } finally {
            setLoading(false);
        }
    };

    const deleteObject = async (objectId: number) => {
        if (loading) {
            throw new Error("There is running process");
        }

        if (!selectedDevice || !selectedStorage) {
            throw new Error("Selected device or storage is not set");
        }

        try {
            await handleDeleteObject(selectedDevice.serial_number, objectId);
            loadObjects(pathStack[pathStack.length - 1].key);
        } catch (e) {
            console.error("Error deleting object:", e);
        } finally {
            setLoading(false);
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
                loading,
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
                deleteObject,
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
