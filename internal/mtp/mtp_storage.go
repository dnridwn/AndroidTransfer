package mtp

type MTPStorage interface {
	ID() uint32
	DeviceSerialNumber() string
	Name() string
	MaxCapacity() uint64
	FreeSpace() uint64
}
