export function formatFileSize(size: number): string {
    let fileSizeText: string;
    let fileSize: number;
    if (size / 1000000000 > 0.999999) {
        fileSize = (size / 1000000000)
        fileSizeText = `GB`
    } else if (size / 1000000 > 0.999999) {
        fileSize = (size / 1000000)
        fileSizeText = `MB`
    } else if (size / 1000 > 0.999999) {
        fileSize = (size / 1000)
        fileSizeText = `kB`
    } else {
        fileSize = size
        fileSizeText = `B`
    }

    return `${fileSize.toLocaleString("cs-CZ")} ${fileSizeText}`
}