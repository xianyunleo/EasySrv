import fs from "fs";


export default class File {

    /**
     * 创建文件符号链接
     * @param path {string}
     * @param pathToTarget {string}
     * @returns {undefined}
     */
    static CreateSymbolicLink(path, pathToTarget) {
        return fs.symlinkSync(pathToTarget, path);
    }

    /**
     * 删除文件
     * @param path {string}
     * @returns {undefined}
     */
    static Delete(path) {
        return fs.rm(path);
    }

    /**
     * 判断文件是否存在
     * @param path {string}
     * @returns {boolean}
     */
    static Exists(path) {
        return fs.existsSync(path) && fs.lstatSync(path).isFile();
    }

    /**
     * 读取文件的全部内容
     * @param path {string}
     * @param encoding {string|null}
     * @returns {string|Buffer}
     */
    static ReadAllText(path, encoding = 'utf8') {
        return fs.readFileSync(path, {encoding: encoding});
    }

    /**
     * 创建一个新文件，将字符串写入该文件，如果文件已经存在，则会覆盖该文件。
     * @param path {string}
     * @param contents {string}
     * @param encoding {string|null}
     * @returns {undefined}
     */
    static WriteAllText(path, contents, encoding = 'utf8') {
        return fs.writeFileSync(path, contents, {encoding: encoding});
    }

    /**
     * 将字符串追加到文件，如果文件不存在，则会创建该文件。
     * @param path {string}
     * @param contents {string}
     * @param encoding {string|null}
     * @returns {undefined}
     */
    static AppendAllText(path, contents, encoding = 'utf8') {
        return fs.appendFileSync(path, contents, {encoding: encoding});
    }
}