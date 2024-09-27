/*
 * @Author: chenqiaomin
 * @Date: 2024-09-26 16:46:06
 * @LastEditors: chenqiaomin@bxqqedu.com chenqiaomin@bxqqedu.com
 * @LastEditTime: 2024-09-27 18:14:07
 * @FilePath: appstore\src\services\db.ts
 * @Description: indexedDB
 */

import { openDB } from 'idb';

const DB_NAME = 'appstore-pwa-db';
const APP_STORE_DATA = 'appstore-data';

// 新建数据库时，新增数据表
export async function getDatabase(APP_STORE_DATA: string) {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(APP_STORE_DATA)) {
                db.createObjectStore(APP_STORE_DATA, { keyPath: 'id', autoIncrement: true })
                   .createIndex("key", "key", { unique: true });
            }
        },
    });
}

/**
 * 添加数据
 * @param {key}  存储数据的键值
 * @param {data} 存储的数据
 */
export async function addData(key: string, data: any) {
    const db = await getDatabase(APP_STORE_DATA);
    const tx = db.transaction(APP_STORE_DATA, 'readwrite');
    const store = tx.objectStore(APP_STORE_DATA);
    store.add({ key, value: data });
    await tx.oncomplete;
}

/**
 * 获取数据
 * @param {key}  存储数据的键值
 */
export async function getAllData(key: string) {
    const db = await getDatabase(APP_STORE_DATA);
    const tx = db.transaction(APP_STORE_DATA, 'readonly');
    const store = tx.objectStore(APP_STORE_DATA);
    const keyIndex = store.index("key");
    const getkeyIndex = keyIndex.get(key);

    return getkeyIndex;
}

/**
 * 删除数据
 * @param {id}  存储数据的id编号
 */
export async function deleteData(id: string) {
    const db = await getDatabase(APP_STORE_DATA);
    const tx = db.transaction(APP_STORE_DATA, 'readwrite');
    const store = tx.objectStore(APP_STORE_DATA);
    store.delete(id);
    await tx.oncomplete;
}

/**
 * 删除所有数据
 */
export async function deleteAllData() {
    const db = await getDatabase(APP_STORE_DATA);
    const transaction = db.transaction([APP_STORE_DATA], 'readwrite');
    const store = transaction.objectStore(APP_STORE_DATA);

    store.getAllKeys().then(keys => {
        keys.forEach(key => {
            store.delete(key);
        });

        transaction.oncomplete = () => {
            db.close();
        };

        transaction.onerror = () => {
            db.close();
        };
    });
}