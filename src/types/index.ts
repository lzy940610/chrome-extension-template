// 定义消息类型
export enum MessageTypeEnum {
  ADD = "add",
  UPDATE = 'update',
  REMOVE = "remove",
  SET_SENTRY_CONFIG = 'setSentryConfig',
  REMOVE_SENTRY_CONFIG = 'removeSentryConfig',
  ENABLE_PERFORMANCE_MODE = 'enablePerformanceMode',
  DISABLE_PERFORMANCE_MODE = 'disablePerformanceMode'
}


export enum CrashReportTriggerTypeEnum {
  CLOSE_TAB = 'closeTab',
  RELOAD_TAB = 'reloadTab',
};
export interface IMessage {
  type: MessageTypeEnum;
  payload?: Record<string, any>;
}

export interface IPayload {
  ideVersion: string;
  jflowVersion: string;
};

export interface IExtendedMessageSender extends chrome.runtime.MessageSender {
  payload: IPayload;
}


export interface IMessage {
  type: MessageTypeEnum;
  payload?: Record<string, any>;
}

