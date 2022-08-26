//通用且与项目无关的方法
import fs from "fs";
import path from "path";

export function fsExists(path) {
    try {
        fs.accessSync(path);
        return true;
    } catch {
        return false;
    }
}

export function fsMove(sourcePath, targetPath) {
    return fs.renameSync(sourcePath, targetPath);
}

export function fsDelete(path) {
    return fs.rmSync(path);
}

export function getFilNameWithoutExt(filename) {
    return path.parse(filename)?.name;
}

/**
 * 获取指定目录下的所有文件名
 * @param dirPath {string}
 * @param search {string}
 * @returns {string[]}
 */
export function getFilesByDir(dirPath, search = '') {
    let files = fs.readdirSync(dirPath, {withFileTypes: true});
    return files.filter((item) => {
        if (item.name.charAt(0) === '.' || !item.isFile()) {
            return false;
        }
        if (search) {
            return item.name.includes(search);
        }
        return true;
    }).map(item => item.name);
}

/**
 * 获取指定目录下的所有目录名
 * @param dirPath {string}
 * @param search {string}
 * @returns {string[]}
 */
export function getDirsByDir(dirPath, search = '') {
    let files = fs.readdirSync(dirPath, {withFileTypes: true});
    return files.filter((item) => {
        if (item.name.charAt(0) === '.' || !item.isDirectory()) {
            return false;
        }
        if (search) {
            return item.name.includes(search);
        }
        return true;
    }).map(item => item.name);
}

export function enumGetName(enumObj, val) {
    let names = Object.keys(enumObj);
    for (const name of names) {
        if (enumObj[name] === val) {
            return name;
        }
    }
}

export function parseTemplateStrings(str, argObj) {
    return str.replace(/\${(.+?)}/g, (match, p1) => argObj[p1]);
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}
