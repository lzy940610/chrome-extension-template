type PollingOptions = {
  maxAttempts?: number;
  interval?: number;
};

/**
 * 触发自定义的全局数据设置事件
 * @param globalData 全局数据对象
 */
function triggerGlobalDataSetEvent(detail: any): void {
  const event = new CustomEvent('globalDataFirstSet', {
    detail
  });

  window.dispatchEvent(event);
}

/**
 * 轮询 window.globalData
 * @param onFound 当全局数据被发现时的回调函数
 * @param options 配置对象，可以设置最大尝试次数和轮询间隔
 */
function pollForGlobalData(onFound: (data: any) => void, options?: PollingOptions): void {
  const maxAttempts = options?.maxAttempts || 10;
  const interval = options?.interval || 3000; // 3 seconds

  let attempts = 0;

  const polling = setInterval(() => {
    attempts++;

    const {
      globalData: {
        ideVersionDetail: {
          version: ideVersion = ''
        } = {}
      } = {},
      $jflow_version: jflowVersion = ''
    } = window || {};

    if (ideVersion && jflowVersion) {
      clearInterval(polling);
      onFound({
        ideVersion,
        jflowVersion
      });
    }

    if (attempts >= maxAttempts) {
      clearInterval(polling);
      console.warn('Max polling attempts reached. Stopping.');
    }
  }, interval);
}

// 使用
pollForGlobalData(triggerGlobalDataSetEvent);
