package libmtp

import (
	"AndroidTransfer/internal/mtp"
	"cmp"
	"context"
	"slices"
	"strings"
	"sync"

	mtpdriver "github.com/hanwen/go-mtpfs/mtp"
)

type Device struct {
	h             *mtpdriver.Device
	mu            *sync.Mutex
	serialNumber  string
	name          string
	isOpen        bool
	isSessionOpen bool
}

func NewDevice(ctx context.Context, h *mtpdriver.Device, mu *sync.Mutex) (*Device, error) {
	d := &Device{
		h:             h,
		mu:            mu,
		isOpen:        false,
		isSessionOpen: false,
	}

	if err := d.Open(ctx); err != nil {
		return nil, err
	}

	var deviceInfo mtpdriver.DeviceInfo
	if err := h.GetDeviceInfo(&deviceInfo); err != nil {
		return nil, err
	}

	d.serialNumber = deviceInfo.SerialNumber
	d.name = deviceInfo.Model
	return d, nil
}

func (d *Device) SerialNumber() string {
	return d.serialNumber
}

func (d *Device) Name() string {
	return d.name
}

func (d *Device) IsOpen() bool {
	return d.isOpen
}

func (d *Device) IsSessionOpen() bool {
	return d.isSessionOpen
}

func (d *Device) Open(ctx context.Context) error {
	d.mu.Lock()
	defer d.mu.Unlock()

	if d.isOpen {
		return nil
	}

	if err := d.h.Open(); err != nil {
		return err
	}
	d.isOpen = true

	return nil
}

func (d *Device) Close(ctx context.Context) error {
	d.mu.Lock()
	defer d.mu.Unlock()

	if !d.isOpen {
		return nil
	}

	if err := d.h.Close(); err != nil {
		return err
	}
	d.isOpen = false

	return nil
}

func (d *Device) OpenSession(ctx context.Context) error {
	d.mu.Lock()
	defer d.mu.Unlock()

	if d.isSessionOpen {
		return nil
	}

	if err := d.h.OpenSession(); err != nil {
		return err
	}
	d.isSessionOpen = true

	return nil
}

func (d *Device) CloseSession(ctx context.Context) error {
	d.mu.Lock()
	defer d.mu.Unlock()

	if !d.isSessionOpen {
		return nil
	}

	if err := d.h.CloseSession(); err != nil {
		return nil
	}
	d.isSessionOpen = false

	return nil
}

func (d *Device) GetStorages(ctx context.Context) ([]mtp.MTPStorage, error) {
	_ = d.OpenSession(ctx)

	d.mu.Lock()
	defer d.mu.Unlock()

	var storageIds mtpdriver.Uint32Array
	if err := d.h.GetStorageIDs(&storageIds); err != nil {
		return nil, err
	}

	storages := make([]mtp.MTPStorage, len(storageIds.Values))
	for i, id := range storageIds.Values {
		storage, err := NewStorage(d.h, d.mu, d.serialNumber, id)
		if err != nil {
			return nil, err
		}

		storages[i] = storage
	}

	return storages, nil
}

func (d *Device) GetObjects(ctx context.Context, storageID, parentID uint32) ([]mtp.MTPObject, error) {
	_ = d.OpenSession(ctx)

	d.mu.Lock()
	defer d.mu.Unlock()

	if parentID == 0 {
		parentID = mtpdriver.GOH_ROOT_PARENT
	}

	var objectIds mtpdriver.Uint32Array
	if err := d.h.GetObjectHandles(storageID, mtpdriver.GOH_ALL_ASSOCS, parentID, &objectIds); err != nil {
		return nil, err
	}

	objects := make([]mtp.MTPObject, len(objectIds.Values))
	for i, objectID := range objectIds.Values {
		object, err := NewObject(d.h, d.mu, d.serialNumber, storageID, objectID)
		if err != nil {
			return nil, err
		}

		objects[i] = object
	}

	slices.SortFunc(objects, func(a, b mtp.MTPObject) int {
		return cmp.Compare(strings.ToLower(a.Name()), strings.ToLower(b.Name()))
	})

	return objects, nil
}

func (d *Device) DeleteObject(ctx context.Context, objectID uint32) error {
	_ = d.OpenSession(ctx)

	d.mu.Lock()
	defer d.mu.Unlock()

	return d.h.DeleteObject(objectID)
}

func (d *Device) RenameObject(ctx context.Context, objectID uint32, name string) error {
	_ = d.OpenSession(ctx)

	d.mu.Lock()
	defer d.mu.Unlock()

	return d.h.SetObjectPropValue(objectID, mtpdriver.OPC_ObjectFileName, &mtpdriver.StringValue{
		Value: name,
	})
}
