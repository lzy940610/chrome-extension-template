import React from 'react';
import { Switch, Space, message, Tooltip } from 'antd';
import { MessageTypeEnum } from '@/types';
import { sendMessage } from '@/utils/panelConnect';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const FullReportPerformance: React.FC = () => {
  const onFullReportPerformanceSwitch = (checked: boolean) => {
    if (checked) {
      sendMessage({ type: MessageTypeEnum.SET_SENTRY_CONFIG, payload: { tracesSampleRate: 1 } });
      message.success('已开启性能日志全量上报至 Sentry');
    } else {
      sendMessage({ type: MessageTypeEnum.REMOVE_SENTRY_CONFIG });
      message.info('已关闭性能日志全量上报 恢复至默认采样率');
    }
  };

  return (
    <>
      <Space direction="horizontal">
        <span>是否全量上报性能数据</span>
        <Switch checkedChildren="全量" unCheckedChildren="采样率" onChange={onFullReportPerformanceSwitch} />
        <Tooltip title="全量将当前 IDE 性能数据上报至 Sentry 平台">
          <ExclamationCircleOutlined />
        </Tooltip>
      </Space>
    </>

  );
};

export default FullReportPerformance;
