import { HardDrive, Info, Laptop } from "lucide-react";
import { DeviceListProvider, useDeviceList } from "./hooks/useDeviceList";
import { ObjectExplorerProvider, useObjectExplorer } from "./hooks/useObjectExplorer";
import { useState } from "react";
import { BreadCrumbComponent } from "./components/Breadcrumb";
import { LoadingComponent } from "./components/Loading";
import { ObjectComponent } from "./components/Object";
import { ModalComponent } from "./components/Modal";
import { formatByteHumanReadable } from "./utils/format";

function App() {
    return (
        <DeviceListProvider>
            <ObjectExplorerProvider>
                <div className="flex h-screen">
                    <Sidebar />
                    <MainView />
                </div>
            </ObjectExplorerProvider>
        </DeviceListProvider>
    );
}

export const Sidebar = () => {
    const { devices } = useDeviceList();
    const { openStorage } = useObjectExplorer();

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
                            onClick={() => openStorage(device, storage)}
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

const MainView = () => {
    const {
        activeDevice,
        activeStorage,
        pathStack,
        openPath,
        objects,
        loading,
        focusedObject,
        focusObject,
        deleteObject,
    } = useObjectExplorer();

    const [modalObjectInfoVisible, setModalObjectInfoVisible] = useState(false);

    return (
        <div className="w-[calc(100%-300px)] h-full overflow-y-scroll bg-white">
            {activeDevice && activeStorage && (
                <>
                    <div className="w-full bg-white sticky top-0 z-10 p-3">
                        <BreadCrumbComponent
                            items={pathStack.map((item) => {
                                return {
                                    key: item.key,
                                    name: item.name,
                                    onClick: (key: number, name: string) => {
                                        if (key === -1) return;
                                        openPath({ key, name });
                                    },
                                };
                            })}
                        />
                    </div>

                    {loading && <LoadingComponent />}

                    {!loading && (
                        <div className="grid grid-cols-5 gap-2 p-3">
                            {objects.map((object) => (
                                <ObjectComponent
                                    key={object.id}
                                    object={object}
                                    onDoubleClick={(object) => {
                                        if (object.format !== "Folder") return;
                                        openPath({
                                            key: object.id,
                                            name: object.name,
                                        });
                                    }}
                                    onActionClick={(action, object) => {
                                        if (action === "INFO") {
                                            focusObject(object);
                                            setModalObjectInfoVisible(true);
                                        }

                                        if (action === "DELETE") {
                                            deleteObject(object.id);
                                        }
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    <ModalComponent
                        visible={modalObjectInfoVisible}
                        title={
                            <div className="flex justify-center items-center gap-2">
                                <Info size={18} /> Info
                            </div>
                        }
                        onClose={() => {
                            focusObject(null);
                            setModalObjectInfoVisible(false);
                        }}
                    >
                        <table className="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <tr>
                                    <td className="p-1">Name</td>
                                    <td className="p-1">:</td>
                                    <td className="p-1">{focusedObject?.name}</td>
                                </tr>
                                <tr>
                                    <td className="p-1">Type</td>
                                    <td className="p-1">:</td>
                                    <td className="p-1">{focusedObject?.format}</td>
                                </tr>
                                <tr>
                                    <td className="p-1">Size</td>
                                    <td className="p-1">:</td>
                                    <td className="p-1">
                                        {formatByteHumanReadable(
                                            focusedObject?.size || 0
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-1">Modification Date</td>
                                    <td className="p-1">:</td>
                                    <td className="p-1">
                                        {new Date(
                                            focusedObject?.modification_date || ""
                                        ).toLocaleString()}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </ModalComponent>
                </>
            )}
        </div>
    );
};

export default App;
