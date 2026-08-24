package libmtp

import (
	"AndroidTransfer/internal/mtp"
	"context"
	"sync"

	mtpdriver "github.com/hanwen/go-mtpfs/mtp"
	"github.com/hanwen/usb"
)

type libMTP struct {
	mu *sync.Mutex
}

func NewLibMTP(mu *sync.Mutex) *libMTP {
	return &libMTP{mu}
}

func (l *libMTP) GetDevices(ctx context.Context) ([]mtp.MTPDevice, error) {
	foundDevices, err := l.getDevices()
	if err != nil {
		return nil, err
	}

	if len(foundDevices) == 0 {
		return nil, mtp.ErrNoDeviceFound
	}

	devices := []mtp.MTPDevice{}
	for _, foundDevice := range foundDevices {
		device, err := NewDevice(ctx, foundDevice, l.mu)
		if err != nil {
			return nil, err
		}

		devices = append(devices, device)
	}

	return devices, nil
}

func (l *libMTP) getDevices() ([]*mtpdriver.Device, error) {
	l.mu.Lock()
	defer l.mu.Unlock()

	foundDevices, err := mtpdriver.FindDevices(usb.NewContext())
	return foundDevices, err
}
