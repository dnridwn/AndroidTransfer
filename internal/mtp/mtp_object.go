package mtp

import "time"

type MTPObject interface {
	ID() uint32
	DeviceSerialNumber() string
	StorageID() uint32
	Name() string
	Format() string
	Size() uint64
	ModificationDate() time.Time
}
