export const monitorChromeLocalStorage = () => {

  // 监听 Storage 变化
  chrome.storage.onChanged.addListener((changes) => {
    // changes 是一个包含变更的对象，其中键是发生变更的存储键，值是一个包含 oldValue 和 newValue 的对象
    // area 是一个字符串，表示存储区域（"sync"、"local" 或 "managed"）

    // 获取完整的存储数据
    chrome.storage.local.get(null, (result) => {
      console.table(result);
    });

    // 处理存储变更
    for (let key in changes) {
      let storageChange = changes[key];
      console.log(`存储键 ${key}  旧值 storageChange.oldValue = `,  storageChange.oldValue, 'storageChange.newValue 新值：', storageChange.newValue);
    }
  });
};

export const isEmpty = (obj: any) => {
  return Object.keys(obj).length === 0;
}
