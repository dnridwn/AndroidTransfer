export namespace main {
	
	export class DeviceOutput {
	    serial_number: string;
	    name: string;
	
	    static createFrom(source: any = {}) {
	        return new DeviceOutput(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.serial_number = source["serial_number"];
	        this.name = source["name"];
	    }
	}
	export class StorageOutput {
	    id: number;
	    device_serial_number: string;
	    name: string;
	    max_capacity: number;
	    free_space: number;
	
	    static createFrom(source: any = {}) {
	        return new StorageOutput(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.device_serial_number = source["device_serial_number"];
	        this.name = source["name"];
	        this.max_capacity = source["max_capacity"];
	        this.free_space = source["free_space"];
	    }
	}

}

