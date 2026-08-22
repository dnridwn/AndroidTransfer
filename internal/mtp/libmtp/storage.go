package libmtp

import (
	"sync"

	mtpdriver "github.com/hanwen/go-mtpfs/mtp"
)

type Storage struct {
	h                  *mtpdriver.Device
	mu                 *sync.Mutex
	id                 uint32
	deviceSerialNumber string
	name               string
	maxCapacity        uint64
	freeSpace          uint64
}

func NewStorage(h *mtpdriver.Device, mu *sync.Mutex, deviceSerialNumber string, id uint32) (*Storage, error) {
	var storageInfo mtpdriver.StorageInfo
	if err := h.GetStorageInfo(id, &storageInfo); err != nil {
		return nil, err
	}

	return &Storage{
		id:                 id,
		deviceSerialNumber: deviceSerialNumber,
		name:               storageInfo.StorageDescription,
		maxCapacity:        storageInfo.MaxCapability,
		freeSpace:          storageInfo.FreeSpaceInBytes,
	}, nil
}

func (s *Storage) ID() uint32 {
	return s.id
}

func (s *Storage) DeviceSerialNumber() string {
	return s.deviceSerialNumber
}

func (s *Storage) Name() string {
	return s.name
}

func (s *Storage) MaxCapacity() uint64 {
	return s.maxCapacity
}

func (s *Storage) FreeSpace() uint64 {
	return s.freeSpace
}
