import { DataFrame, Series, streamCsvTransformer } from "../../dist/danfojs-node/src";
import stream from "stream"
import path from "path"
import { describe, it } from "mocha";

describe("pipeCsvTransform", function () {
    it("streamCsvTransformer works for local files", async function () {
        const inputFilePath = path.join(process.cwd(), "test", "samples", "titanic.csv");
        const outputFilePath = path.join(process.cwd(), "test", "samples", "titanicOutLocal.csv");

        const transformer = (df: DataFrame) => {
            const titles = df["Name"].map((name: string) => name.split(".")[0]);
            const names = df["Name"].map((name: string) => name.split(".")[1]);
            df["Name"] = names
            df.addColumn("titles", titles, { inplace: true })
            return df
        }
        streamCsvTransformer(inputFilePath, transformer, { outputFilePath, inputStreamOptions: { header: false } })
    });

    // it("streamCsvTransformer works for remote files", async function () {
    //     const inputFilePath = "https://raw.githubusercontent.com/opensource9ja/danfojs/dev/danfojs-node/tests/samples/titanic.csv"
    //     const outputFilePath = path.join(process.cwd(), "test", "samples", "titanicOutRemote.csv");
    //     const transformer = (df: DataFrame) => {
    //         const titles = df["Name"].map((name: string) => name.split(".")[0]);
    //         const names = df["Name"].map((name: string) => name.split(".")[1]);
    //         df["Name"] = names
    //         df.addColumn("titles", titles, { inplace: true })
    //         return df
    //     }
    //     streamCsvTransformer(inputFilePath, transformer, { outputFilePath, inputStreamOptions: { header: true } })
    // });

    it("streamCsvTransformer works for custom writers", async function () {
        const inputFilePath = "https://raw.githubusercontent.com/opensource9ja/danfojs/dev/danfojs-node/tests/samples/titanic.csv"
        const transformer = (df: DataFrame) => {
            const titles = df["Name"].map((name: string) => name.split(".")[0]);
            const names = df["Name"].map((name: string) => name.split(".")[1]);
            df["Name"] = names
            df.addColumn("titles", titles, { inplace: true })
            return df
        }
        let count = 0

        const customWriter = function () {
            const csvOutputStream = new stream.Writable({ objectMode: true })
            csvOutputStream._write = (chunk: DataFrame | Series, encoding, callback) => {
                count += 1
                callback()

            }
            return csvOutputStream
        }

        streamCsvTransformer(
            inputFilePath,
            transformer,
            {
                customCSVStreamWriter: customWriter,
                inputStreamOptions: { header: true }
            })
    });
})
