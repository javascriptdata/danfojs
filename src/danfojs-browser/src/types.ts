/**
*  @license
* Copyright 2021, JsData. All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.

* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* ==========================================================================
*/

/**
 * This file contains all type definitions unique to danfojs-browser version.
*/

import { ParseConfig } from 'papaparse';
import { Config, Layout } from "plotly.js-dist-min"

interface CustomConfig extends Config {
    x: string
    y: string,
    values: string,
    labels: string,
    rowPositions: number[],
    columnPositions: number[],
    grid: { rows: number, columns: number },
    tableHeaderStyle: any,
    tableCellStyle: any,
    columns: string[];
}

export type PlotConfigObject = {
    config: Partial<CustomConfig>
    layout: Partial<Layout>
}

export interface CsvInputOptions extends ParseConfig { }
export type ExcelInputOptions = { sheet?: number, method?: string, headers?: HeadersInit }
export type JsonInputOptions = { method?: string, headers?: HeadersInit }

export type CsvOutputOptionsBrowser = { fileName?: string, sep?: string, header?: boolean, download?: boolean };
export type ExcelOutputOptionsBrowser = { fileName?: string, sheetName?: string };
export type JsonOutputOptionsBrowser = { fileName?: string, format?: "row" | "column", download?: boolean };
