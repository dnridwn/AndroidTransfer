import { GetDevices, GetStorages } from "../../wailsjs/go/main/App";
import { Device } from "../types/device";
import { Storage } from "../types/storage";

export const getDeviceList = async (): Promise<Device[]> => {
    try {
        const devices = await GetDevices();
        return (devices || []).map((device) => {
            return {
                serial_number: device.serial_number,
                name: device.name,
                storages: [],
            };
        });
    } catch (e: unknown) {
        if (e instanceof Error) {
            throw new Error("Failed to get device list: " + e.message);
        } else {
            throw new Error("An unexpected error occured: ", {
                cause: e,
            });
        }
    }
};

export const getStorageList = async (deviceSerialNumber: string): Promise<Storage[]> => {
    try {
        const storages = await GetStorages(deviceSerialNumber);
        return (storages || []).map((storage) => {
            return {
                id: storage.id,
                device_serial_number: storage.device_serial_number,
                name: storage.name,
                max_capacity: storage.max_capacity,
                free_space: storage.free_space,
            };
        });
    } catch (e: unknown) {
        if (e instanceof Error) {
            throw new Error("Failed to get storage list: " + e.message);
        } else {
            throw new Error("An unexpected error occured: ", {
                cause: e,
            });
        }
    }
};
