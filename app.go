package main

import (
	"AndroidTransfer/internal/mtp"
	"context"
	"errors"
)

// App struct
type App struct {
	ctx        context.Context
	mtpdriver  mtp.MTP
	devicePool map[string]mtp.MTPDevice
}

// NewApp creates a new App application struct
func NewApp(mtpdriver mtp.MTP) *App {
	return &App{
		mtpdriver:  mtpdriver,
		devicePool: make(map[string]mtp.MTPDevice, 0),
	}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) GetDevices() ([]DeviceOutput, error) {
	devices, err := a.mtpdriver.GetDevices(a.ctx)
	if err != nil {
		return nil, err
	}

	devicesOutput := make([]DeviceOutput, len(devices))
	for i, device := range devices {
		a.devicePool[device.SerialNumber()] = device
		devicesOutput[i] = DeviceOutput{
			Name:         device.Name(),
			SerialNumber: device.SerialNumber(),
		}
	}

	return devicesOutput, nil
}

func (a *App) GetStorages(deviceSerialNumber string) ([]StorageOutput, error) {
	device, ok := a.devicePool[deviceSerialNumber]
	if !ok {
		return nil, errors.New("no device found")
	}

	storages, err := device.GetStorages(a.ctx)
	if err != nil {
		return nil, err
	}

	storagesOutput := make([]StorageOutput, len(storages))
	for i, storage := range storages {
		storagesOutput[i] = StorageOutput{
			ID:                 storage.ID(),
			DeviceSerialNumber: storage.DeviceSerialNumber(),
			Name:               storage.Name(),
			MaxCapacity:        storage.MaxCapacity(),
			FreeSpace:          storage.FreeSpace(),
		}
	}

	return storagesOutput, nil
}
