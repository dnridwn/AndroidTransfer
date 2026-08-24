import {
    GetDevices,
    GetStorages,
    GetObjects,
    DeleteObject,
    RenameObject,
} from "../../wailsjs/go/main/App";
import { Device } from "../types/device";
import { Storage } from "../types/storage";
import { Object } from "../types/object";

export const handleGetDeviceList = async (): Promise<Device[]> => {
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

export const handleGetStorageList = async (
    deviceSerialNumber: string
): Promise<Storage[]> => {
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

export const handleGetObjectList = async (
    deviceSerialNumber: string,
    storageId: number,
    parentId: number
): Promise<Object[]> => {
    try {
        const objects = await GetObjects(deviceSerialNumber, storageId, parentId);
        return (objects || []).map((object) => {
            return {
                id: object.id,
                device_serial_number: object.device_serial_number,
                storage_id: object.storage_id,
                name: object.name,
                format: object.format as any,
                size: object.size,
                modification_date: object.modification_date,
            };
        });
    } catch (e: unknown) {
        if (e instanceof Error) {
            throw new Error("Failed to get object list: " + e.message);
        } else {
            throw new Error("An unexpected error occured: ", {
                cause: e,
            });
        }
    }
};

export const handleRenameObject = async (
    deviceSerialNumber: string,
    objectID: number,
    name: string
) => {
    try {
        await RenameObject(deviceSerialNumber, objectID, name);
    } catch (e) {
        if (e instanceof Error) {
            throw new Error("Failed to rename object: " + e.message);
        } else {
            throw new Error("An unexpected error occured: ", {
                cause: e,
            });
        }
    }
};

export const handleDeleteObject = async (
    deviceSerialNumber: string,
    objectID: number
) => {
    try {
        await DeleteObject(deviceSerialNumber, objectID);
    } catch (e) {
        if (e instanceof Error) {
            throw new Error("Failed to delete object: " + e.message);
        } else {
            throw new Error("An unexpected error occured: ", {
                cause: e,
            });
        }
    }
};
