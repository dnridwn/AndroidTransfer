package main

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
