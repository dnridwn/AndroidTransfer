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
	export class ObjectOutput {
	    id: number;
	    device_serial_number: string;
	    storage_id: number;
	    name: string;
	    format: string;
	    size: number;
	    // Go type: time
	    modification_date: any;
	
	    static createFrom(source: any = {}) {
	        return new ObjectOutput(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.device_serial_number = source["device_serial_number"];
	        this.storage_id = source["storage_id"];
	        this.name = source["name"];
	        this.format = source["format"];
	        this.size = source["size"];
	        this.modification_date = this.convertValues(source["modification_date"], null);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
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

