package mtp

import "context"

type MTPDevice interface {
	SerialNumber() string
	Name() string
	IsOpen() bool
	IsSessionOpen() bool
	GetStorages(ctx context.Context) ([]MTPStorage, error)
}
