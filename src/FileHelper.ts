import {FixedError} from "./util";

type ReadResultMap = {
    readAsArrayBuffer: ArrayBuffer,
    readAsBinaryString: string,
    readAsDataURL: string,
    readAsText: string
};

class DomExcError extends FixedError {
    constructor(readonly exception: DOMException, message?: string) {
        super(message);
    }
}


export class FileHelper {

    public static toArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
        return FileHelper.read(blob, 'readAsArrayBuffer');
    }

    public static toChunks(blob: Blob, chunkSizeBytes: number): Blob[] {
        const chunks: Blob[] = [];

        for (let start = 0; start < blob.size; start += chunkSizeBytes) {
            chunks.push(blob.slice(start, start + chunkSizeBytes));
        }

        return chunks;
    };

    public static totalSize(blobs: Array<(Blob | ArrayBuffer)>): number {
        return blobs.reduce((acc, blob) => acc + FileHelper.size(blob), 0);
    }

    public static size(blob: Blob | ArrayBuffer): number {
        return blob instanceof Blob ? blob.size : blob.byteLength;
    }

    /**
     * Promisified version of FileReader.
     */
    private static read<M extends keyof ReadResultMap>(blob: Blob, method: M): Promise<ReadResultMap[M]> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result! as ReadResultMap[M]);
            reader.onerror = () => reject(new DomExcError(reader.error!));
            reader[method](blob);
        });
    }

}
