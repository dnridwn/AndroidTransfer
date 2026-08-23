import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Device } from "../types/device";
import { handleGetDeviceList, handleGetStorageList } from "../api/backend";

type DeviceListContextType = {
    devices: Device[];
};

const DeviceListContext = createContext<DeviceListContextType | null>(null);

export function DeviceListProvider({ children }: { children: ReactNode }) {
    const [devices, setDevices] = useState<Device[]>([]);

    useEffect(() => {
        (async () => {
            try {
                const deviceList = await handleGetDeviceList();
                for (let device of deviceList) {
                    const storages = await handleGetStorageList(device.serial_number);
                    device.storages = storages;
                }
                setDevices(deviceList);
            } catch (error) {
                console.error("Error fetching device list:", error);
            }
        })();
        return () => {
            setDevices([]);
        };
    }, []);

    return (
        <DeviceListContext.Provider value={{ devices }}>
            {children}
        </DeviceListContext.Provider>
    );
}

export function useDeviceList() {
    const context = useContext(DeviceListContext);
    if (!context) {
        throw new Error("useDeviceList must be used within a DeviceListProvider");
    }
    return context;
}
