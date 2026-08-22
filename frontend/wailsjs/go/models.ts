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

}

