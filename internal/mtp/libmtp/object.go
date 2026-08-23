package libmtp

import (
	"math"
	"sync"
	"time"

	mtpdriver "github.com/hanwen/go-mtpfs/mtp"
)

type Object struct {
	h                  *mtpdriver.Device
	mu                 *sync.Mutex
	id                 uint32
	deviceSerialNumber string
	storageID          uint32
	name               string
	format             string
	size               uint64
	modificationDate   time.Time
}

func NewObject(h *mtpdriver.Device, mu *sync.Mutex, deviceSerialNumber string, storageID, id uint32) (*Object, error) {
	object := &Object{
		h:                  h,
		mu:                 mu,
		id:                 id,
		deviceSerialNumber: deviceSerialNumber,
		storageID:          storageID,
	}
	var objectInfo mtpdriver.ObjectInfo
	if err := h.GetObjectInfo(id, &objectInfo); err != nil {
		return nil, err
	}

	size := uint64(objectInfo.CompressedSize)
	if size == math.MaxUint32 {
		var realSize mtpdriver.Uint64Value
		if err := h.GetObjectPropValue(id, mtpdriver.OPC_ObjectSize, &realSize); err != nil {
			return nil, err
		}
		size = realSize.Value
	}

	object.name = objectInfo.Filename
	object.format = object.getFormat(objectInfo.ObjectFormat)
	object.size = size
	object.modificationDate = objectInfo.ModificationDate

	return object, nil
}

func (o *Object) ID() uint32 {
	return o.id
}

func (o *Object) DeviceSerialNumber() string {
	return o.deviceSerialNumber
}

func (o *Object) StorageID() uint32 {
	return o.storageID
}

func (o *Object) Name() string {
	return o.name
}

func (o *Object) Format() string {
	return o.format
}

func (o *Object) Size() uint64 {
	return o.size
}

func (o *Object) ModificationDate() time.Time {
	return o.modificationDate
}

func (o *Object) getFormat(objFormat uint16) string {
	switch objFormat {
	case mtpdriver.OFC_Association:
		return "Folder"
	case mtpdriver.OFC_EXIF_JPEG,
		mtpdriver.OFC_TIFF_EP,
		mtpdriver.OFC_FlashPix,
		mtpdriver.OFC_BMP,
		mtpdriver.OFC_CIFF,
		mtpdriver.OFC_GIF,
		mtpdriver.OFC_JFIF,
		mtpdriver.OFC_PCD,
		mtpdriver.OFC_PICT,
		mtpdriver.OFC_PNG,
		mtpdriver.OFC_TIFF,
		mtpdriver.OFC_TIFF_IT,
		mtpdriver.OFC_JP2,
		mtpdriver.OFC_JPX,
		mtpdriver.OFC_DNG,
		mtpdriver.OFC_CANON_CRW,
		mtpdriver.OFC_CANON_CRW3,
		mtpdriver.OFC_CANON_CHDK_CRW,
		mtpdriver.OFC_MTP_WindowsImageFormat:
		return "Image"
	case mtpdriver.OFC_AIFF,
		mtpdriver.OFC_WAV,
		mtpdriver.OFC_MP3,
		mtpdriver.OFC_MTP_M4A,
		mtpdriver.OFC_MTP_UndefinedAudio,
		mtpdriver.OFC_MTP_WMA,
		mtpdriver.OFC_MTP_OGG,
		mtpdriver.OFC_MTP_AAC,
		mtpdriver.OFC_MTP_AudibleCodec,
		mtpdriver.OFC_MTP_FLAC:
		return "Audio"
	case mtpdriver.OFC_AVI,
		mtpdriver.OFC_MPEG,
		mtpdriver.OFC_ASF,
		mtpdriver.OFC_CANON_MOV,
		mtpdriver.OFC_MTP_UndefinedVideo,
		mtpdriver.OFC_MTP_WMV,
		mtpdriver.OFC_MTP_MP4,
		mtpdriver.OFC_MTP_MP2,
		mtpdriver.OFC_MTP_3GP:
		return "Video"
	case mtpdriver.OFC_Script,
		mtpdriver.OFC_Text,
		mtpdriver.OFC_HTML,
		mtpdriver.OFC_DPOF,
		mtpdriver.OFC_MTP_UndefinedDocument,
		mtpdriver.OFC_MTP_AbstractDocument,
		mtpdriver.OFC_MTP_XMLDocument,
		mtpdriver.OFC_MTP_MSWordDocument,
		mtpdriver.OFC_MTP_MHTCompiledHTMLDocument,
		mtpdriver.OFC_MTP_MSExcelSpreadsheetXLS,
		mtpdriver.OFC_MTP_MSPowerpointPresentationPPT,
		mtpdriver.OFC_MTP_vCard2,
		mtpdriver.OFC_MTP_vCard3,
		mtpdriver.OFC_MTP_vCalendar1,
		mtpdriver.OFC_MTP_vCalendar2:
		return "Text"
	default:
		return "Unknown"
	}
}
