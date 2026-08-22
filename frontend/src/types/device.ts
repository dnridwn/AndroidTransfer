import { Storage } from "./storage";

export interface Device {
    serial_number: string;
    name: string;
    storages: Storage[];
}
