import { CircleQuestionMark, HardDrive, Info, Laptop } from "lucide-react";
import { DeviceListProvider, useDeviceList } from "./hooks/useDeviceList";
import { ObjectExplorerProvider, useObjectExplorer } from "./hooks/useObjectExplorer";
import { useState } from "react";
import { BreadCrumbComponent } from "./components/Breadcrumb";
import { LoadingComponent } from "./components/Loading";
import { ObjectComponent } from "./components/Object";
import { ModalComponent } from "./components/Modal";
import { formatByteHumanReadable } from "./utils/format";
import { Object } from "./types/object";

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
        deleteObject,
    } = useObjectExplorer();
    const [focusObject, setFocusObject] = useState<Object | null>(null);
    const [modalObjectInfoVisible, setModalObjectInfoVisible] = useState(false);
    const [modalDeleteObjectVisible, setModalDeleteObjectVisible] = useState(false);

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
                                            setFocusObject(object);
                                            setModalObjectInfoVisible(true);
                                        }

                                        if (action === "DELETE") {
                                            setFocusObject(object);
                                            setModalDeleteObjectVisible(true);
                                        }
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    <ModalComponent
                        visible={modalObjectInfoVisible}
                        title={
                            <div className="flex justify-center items-center gap-2 text-sm">
                                <Info size={18} /> Info
                            </div>
                        }
                        onClose={() => {
                            setFocusObject(null);
                            setModalObjectInfoVisible(false);
                        }}
                    >
                        <table className="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <tr>
                                    <td className="p-1">Name</td>
                                    <td className="p-1">:</td>
                                    <td className="p-1">{focusObject?.name}</td>
                                </tr>
                                <tr>
                                    <td className="p-1">Type</td>
                                    <td className="p-1">:</td>
                                    <td className="p-1">{focusObject?.format}</td>
                                </tr>
                                <tr>
                                    <td className="p-1">Size</td>
                                    <td className="p-1">:</td>
                                    <td className="p-1">
                                        {formatByteHumanReadable(focusObject?.size || 0)}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-1">Modification Date</td>
                                    <td className="p-1">:</td>
                                    <td className="p-1">
                                        {new Date(
                                            focusObject?.modification_date || ""
                                        ).toLocaleString()}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </ModalComponent>

                    <ModalComponent
                        visible={modalDeleteObjectVisible}
                        title={
                            <div className="flex justify-center items-center gap-2 text-sm">
                                <CircleQuestionMark size={18} /> Delete Confirmation
                            </div>
                        }
                        onClose={() => {
                            setFocusObject(null);
                            setModalDeleteObjectVisible(false);
                        }}
                    >
                        <div className="mb-5">
                            <p className="text-sm">
                                Are you sure want to delete{" "}
                                <span className="font-bold">{focusObject?.name}</span>?
                            </p>
                        </div>
                        <div className="flex justify-end items-center gap-2">
                            <button
                                className="text-sm py-1 px-2 rounded-md cursor-pointer bg-gray-200 hover:bg-gray-300"
                                onClick={() => {
                                    setFocusObject(null);
                                    setModalDeleteObjectVisible(false);
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="text-sm py-1 px-2 rounded-md cursor-pointer bg-red-600 text-white hover:bg-red-700"
                                onClick={() => {
                                    focusObject && deleteObject(focusObject.id);
                                    setModalDeleteObjectVisible(false);
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </ModalComponent>
                </>
            )}
        </div>
    );
};

export default App;
