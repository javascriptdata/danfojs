import { Series } from "./core/series";
import { DataFrame } from "./core/frame";
import { to_datetime } from "./core/timeseries";
import { merge } from "./core/merge";
import { concat } from "./core/concat";
import { date_range } from "./core/date_range";
import { get_dummies } from "./core/get_dummies";
import { read_csv, read_json, read_excel, read } from "./io/reader";
import { LabelEncoder, OneHotEncoder } from "./preprocessing/encodings";
import { MinMaxScaler, StandardScaler } from "./preprocessing/scalers";

declare module 'danfojs' {
    export { Series, DataFrame, to_datetime, merge, concat, date_range, get_dummies, read_csv, read_json, read_excel, read, LabelEncoder, OneHotEncoder, MinMaxScaler, StandardScaler }
}