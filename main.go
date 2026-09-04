package main

import (
	"AndroidTransfer/internal/mtp/libmtp"
	"embed"
	"sync"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Create an mtp driver instance
	usbCommMutex := sync.Mutex{}
	mtpdriver := libmtp.NewLibMTP(&usbCommMutex)

	// Create an instance of the app structure
	app := NewApp(mtpdriver)

	// Create application with options
	err := wails.Run(&options.App{
		Title:         "AndroidTransfer",
		Width:         1024,
		Height:        768,
		DisableResize: true,
		DragAndDrop: &options.DragAndDrop{
			EnableFileDrop:     true,
			DisableWebViewDrop: false,
		},
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
