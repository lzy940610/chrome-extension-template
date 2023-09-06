import { PERFORMANCE_MODE_KEY, SENTRY_CONFIG_KEY } from "@/constants";
import { IMessage, IPayload, MessageTypeEnum } from "@/types";

// 记录页面加载的函数
function recordPage() {
  console.log('🚀 LCAP Content.js: recordPage');
  chrome.runtime.sendMessage({ type: MessageTypeEnum.ADD });
}

function updatePage(payload: IPayload) {
  console.log('🚀 LCAP Content.js: updatePage', payload);
  chrome.runtime.sendMessage({
    type: MessageTypeEnum.UPDATE,
    payload
  });
}

// 移除页面的函数
function removePage() {
  console.log('🚀 LCAP Content.js: removePage');
  chrome.runtime.sendMessage({ type: MessageTypeEnum.REMOVE });
}

// 注销消息监听器的函数
function unregisterMessageListeners() {
  chrome.runtime.onMessage.removeListener(recordPage);
  chrome.runtime.onMessage.removeListener(removePage);
}

window.addEventListener('load', () => {
  recordPage();
  injectScript('injectScript.bundle.js');
});

window.addEventListener('beforeunload', () => {
  removePage();
  unregisterMessageListeners();
});


function injectScript(file: string): void {
  // 获取页面的 body 元素
  const body = document.getElementsByTagName('body')[0];

  // 创建一个新的 script 元素
  const script = document.createElement('script');

  // 从插件资源中获取完整的 URL
  const src = chrome.runtime.getURL(file);

  // 设置 script 元素的属性
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', src);

  // 将 script 元素附加到 body 中
  body.appendChild(script);
}



// 监听来自 inject.ts 的自定义事件
window.addEventListener('globalDataFirstSet', function (e: Event) {
  const customEvent = e as CustomEvent;
  const { ideVersion = '', jflowVersion = '' } = customEvent.detail || {};

  const payload = {
    ideVersion,
    jflowVersion,
  };

  updatePage(payload);
});


chrome.runtime.onMessage.addListener((msg: IMessage) => {
  const { type, payload = {} } = msg;
  console.log('🔥 Content.js: chrome.runtime.onMessage.addListener', msg);

  switch (type) {
    case MessageTypeEnum.ENABLE_PERFORMANCE_MODE:
      window.localStorage.setItem(PERFORMANCE_MODE_KEY, 'beta');
      window.location.reload();
      break;
    case MessageTypeEnum.DISABLE_PERFORMANCE_MODE:
      window.localStorage.removeItem(PERFORMANCE_MODE_KEY);
      window.location.reload();
      break;
    case MessageTypeEnum.SET_SENTRY_CONFIG:
      window.sessionStorage.setItem(SENTRY_CONFIG_KEY, JSON.stringify(payload));
      break;
    case MessageTypeEnum.REMOVE_SENTRY_CONFIG:
      window.sessionStorage.removeItem(SENTRY_CONFIG_KEY);
      break;
    default:
      console.warn('Unknown message type:', type);
      break;
  }
});



