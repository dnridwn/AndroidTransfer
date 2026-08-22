import { HardDrive, Laptop } from "lucide-react";
import { DeviceListProvider, useDeviceList } from "./hooks/useDeviceList";

function App() {
    return (
        <DeviceListProvider>
            <div className="flex h-screen">
                <Sidebar />
            </div>
        </DeviceListProvider>
    );
}

export const Sidebar = () => {
    const { devices } = useDeviceList();

    return (
        <div className="w-[300px] h-full bg-gray-100 p-3">
            <h6 className="text-md">Devices</h6>

            {devices.map((device) => (
                <div
                    key={device.serial_number}
                    className="rounded-xl p-2 overflow-hidden hover:bg-gray-200"
                >
                    <button className="p-1 text-sm text-left text-gray-600 flex items-center gap-2 cursor-pointer w-full hover:text-gray-900">
                        <Laptop />
                        <span>{device.name}</span>
                    </button>

                    {device.storages.map((storage) => (
                        <button
                            key={storage.id}
                            className="pl-5 pt-1 pb-1 pr-1 text-sm text-left text-gray-600 flex items-center gap-2 cursor-pointer w-full hover:text-gray-900"
                            onClick={() => {}}
                        >
                            <HardDrive />
                            <span>{storage.name}</span>
                        </button>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default App;
