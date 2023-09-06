import { SELF_SENTRY_DSN } from '@/constants';
import { CrashReportTriggerTypeEnum, IExtendedMessageSender, IMessage, MessageTypeEnum } from '@/types';
import { isEmpty, monitorChromeLocalStorage } from '@/utils';
import * as Sentry from "@sentry/browser";

Sentry.init({
  dsn: SELF_SENTRY_DSN,
  tracesSampleRate: 1.0,
});

monitorChromeLocalStorage();

/**
 * @description: 崩溃上报
 * @param {CrashReportTriggerTypeEnum} type 上报类型
 * @param {number} tabId 标签页id
 * @return {*}
 */
const reportCrash = async (tabId: number, type: CrashReportTriggerTypeEnum) => {
  const targetTab = await chrome.storage.local.get(String(tabId));

  if (isEmpty(targetTab)) {
    return null;
  }

  const {
    url = '',
    payload: {
      ideVersion = '',
      jflowVersion = ''
    } = {}
  } = targetTab[tabId] || {} as IExtendedMessageSender;

  Sentry.captureMessage(`IDE Crash: ${url} ${Date.now()}`, (scope) => {
    scope.setLevel('error');
    scope.setTag('data.type', 'IDE Crash');
    scope.setTag('trigger.type', type);
    scope.setTag('ide.version', ideVersion);
    scope.setTag('jflow.version', jflowVersion);
    // 使用 fingerprint 控制分组逻辑
    scope.setFingerprint(['{{ default }}', url]);
    return scope;
  });

  // 异常上报后清除
  chrome.storage.local.remove(String(tabId));
};


/**
 * @description: 上报插件安装数据 
 * Chrome插件的卸载事件不会直接触发在插件内部的任何代码，因此，与其他浏览器事件不同，监听卸载事件并直接报告给Sentry会比较复杂。
 * chrome.runtime.setUninstallURL('https://yourserver.com/uninstall'); 可以在卸载页面上报 不过暂时没数据 可临时通过Extension Version 来大概看一下分布
 * @return {*}
 */
const reportInstallation = () => {
  const manifest = chrome.runtime.getManifest();
  const extensionVersion = manifest.version;

  Sentry.captureMessage('Extension Installed', (scope) => {
    scope.setLevel('info');
    scope.setTag('data.type', 'Extension Installed');
    scope.setTag('extension.version', extensionVersion); // 设置版本作为tag
    // 或者使用 extra 来存储版本信息
    // scope.setExtra('extension.version', extensionVersion);
    return scope;
  });
}


// 监听 content.js 发来的事件
chrome.runtime.onMessage.addListener((message: IMessage, sender) => {
  const { type, payload } = message;
  const { tab: { id: tabId = 0 } = {} } = sender || {};


  if (!tabId) {
    return;
  }

  const value = Object.assign(sender, { payload });
  console.log('🚀 LCAP Background.js: chrome.runtime.onMessage.addListener', message, value);

  switch (type) {
    case MessageTypeEnum.ADD:
      chrome.storage.local.set({ [`${tabId}`]: value });
      break;
    case MessageTypeEnum.UPDATE:
      chrome.storage.local.set({ [`${tabId}`]: value });
      break;
    case MessageTypeEnum.REMOVE:
      chrome.storage.local.remove(String(tabId));
      break;
    default:
      break;
  }

});


// 监听标签页关闭事件
chrome.tabs.onRemoved.addListener(async (tabId: number) => reportCrash(tabId, CrashReportTriggerTypeEnum.CLOSE_TAB ));

// 标签刷新
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (changeInfo.status === 'loading') {
    console.log('Tab with ID ' + tabId + ' is reloading');
    reportCrash(tabId, CrashReportTriggerTypeEnum.RELOAD_TAB);
  }
});

// 当插件安装或更新时触发
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    reportInstallation();
  }
});

// 监听插件与 panel 的连接
chrome.runtime.onConnect.addListener((port) => {
  console.assert(port.name === "panel");
  port.onMessage.addListener((msg: IMessage) => {
    // 将消息转发给内容脚本
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id as number, msg);
    });
  });
});





