export function read_csv(source?: any, chunk?: any): Promise<any>;
export function read_json(source?: any): Promise<any>;
export function read_excel(kwargs?: any): Promise<any>;
export function read(path_or_descriptor?: any, configs?: object): DataFrame;
import { DataFrame } from "../core/frame";
