import React from 'react';
import { Switch, Space, Tooltip, message } from 'antd';
import { MessageTypeEnum } from '@/types';
import { sendMessage } from '@/utils/panelConnect';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const PerformanceMode: React.FC = () => {

  const onPerformanceModeSwitch = (checked: boolean) => {
    if (checked) {
      sendMessage({ type: MessageTypeEnum.ENABLE_PERFORMANCE_MODE });
      message.success('已启用性能模式 等待应用重载~');
    } else {
      sendMessage({ type: MessageTypeEnum.DISABLE_PERFORMANCE_MODE });
      message.info('已停用性能模式 等在应用重载~');
    }
  };

  return (
    <>
      <Space direction="horizontal">
        <span>启用/关闭 性能模式并重载应用</span>
        <Switch checkedChildren="启用" unCheckedChildren="关闭" onChange={onPerformanceModeSwitch} />
        <Tooltip title="目前仅支持 v2.20 v2.21 v2.22 版本 不在范围内强制使用会白屏">
          <ExclamationCircleOutlined />
        </Tooltip>
      </Space>
    </>

  );
};

export default PerformanceMode;
