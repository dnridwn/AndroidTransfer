package main

import "time"

type DeviceOutput struct {
	SerialNumber string `json:"serial_number"`
	Name         string `json:"name"`
}

type StorageOutput struct {
	ID                 uint32 `json:"id"`
	DeviceSerialNumber string `json:"device_serial_number"`
	Name               string `json:"name"`
	MaxCapacity        uint64 `json:"max_capacity"`
	FreeSpace          uint64 `json:"free_space"`
}

type ObjectOutput struct {
	ID                 uint32    `json:"id"`
	DeviceSerialNumber string    `json:"device_serial_number"`
	StorageID          uint32    `json:"storage_id"`
	Name               string    `json:"name"`
	Format             string    `json:"format"`
	Size               uint64    `json:"size"`
	ModificationDate   time.Time `json:"modification_date"`
}
