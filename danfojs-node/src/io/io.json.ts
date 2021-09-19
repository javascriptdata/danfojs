import fs from 'fs'
import fetch, { HeadersInit } from "node-fetch";
import { DataFrame } from '../index'


/**
 * Reads a JSON file from local or remote location into a DataFrame.
 * @param filePath URL or local file path to JSON file.
 * @param options Configuration object. Supported options:
 * - `method`: The HTTP method to use. Defaults to `'GET'`.
 * - `headers`: Additional headers to send with the request. Supports the `node-fetch` [HeadersInit]
 */
const $readJSON = async (filePath: string, options: { method?: string, headers?: HeadersInit } = {}) => {
    const { method, headers } = { method: "GET", headers: {}, ...options }

    if (filePath.startsWith("http") || filePath.startsWith("https")) {

        return new Promise(resolve => {
            fetch(filePath, { method, headers }).then(response => {
                if (response.status !== 200) {
                    throw new Error(`Failed to load ${filePath}`)
                }
                response.json().then(json => {
                    resolve(new DataFrame(json));
                });
            }).catch((err) => {
                throw new Error(err)
            })
        })

    } else {
        return new Promise(resolve => {
            const file = fs.readFileSync(filePath, "utf8")
            const df = new DataFrame(JSON.parse(file));
            resolve(df);
        });
    }
};

export {
    $readJSON
}