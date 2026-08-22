package mtp

import "context"

type MTP interface {
	GetDevices(ctx context.Context) ([]MTPDevice, error)
}
