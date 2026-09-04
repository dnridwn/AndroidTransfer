package mtp

import "context"

type MTPDevice interface {
	SerialNumber() string
	Name() string
	IsOpen() bool
	IsSessionOpen() bool
	GetStorages(ctx context.Context) ([]MTPStorage, error)
	GetObjects(ctx context.Context, storageID, parentID uint32) ([]MTPObject, error)
	DeleteObject(ctx context.Context, objectID uint32) error
	RenameObject(ctx context.Context, objectID uint32, name string) error
	PutObjects(ctx context.Context, storageID, parentID uint32, paths []string) error
}
