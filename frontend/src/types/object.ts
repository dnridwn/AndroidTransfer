export interface Object {
    id: number;
    device_serial_number: string;
    storage_id: number;
    name: string;
    format: "Folder" | "Image" | "Audio" | "Video" | "Text" | "Unknown";
    size: number;
    modification_date: string;
}
