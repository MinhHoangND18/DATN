import React from "react";

import { notification } from "antd";

const notificationSuccess = (
  message: React.ReactNode,
  description?: React.ReactNode,
  duration?: number,
) =>
  notification.success({
    message,
    description,
    duration,
  });

const notificationError = (
  message: React.ReactNode,
  description?: React.ReactNode,
  duration?: number,
) =>
  notification.error({
    message,
    description,
    duration,
  });

export default {
  notificationSuccess,
  notificationError,
};
