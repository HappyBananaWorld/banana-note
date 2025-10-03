"use client";
// hooks/useMessage.js

import { useMemo } from "react";
import { message } from "antd";

/**
 * useMessage is a custom hook that provides a convenient way
 * to display various types of messages (success, error, warning)
 * using Ant Design's message component.
 *
 * This hook encapsulates the logic for showing messages and maintains
 * a local state to indicate the visibility of the message.
 *
 * @returns {Object} An object containing:
 *   - showMessage: A function to display a message of a specified type
 *   - successMessage: A function to display a success message
 *   - errorMessage: A function to display an error message
 *   - warningMessage: A function to display a warning message
 *   - visible: A boolean indicating whether a message is visible
 */
const useMessage = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const api = useMemo(() => ({
    showMessage: (type, content) => messageApi.open({ type, content }),
    successMessage: (content) => messageApi.success(content),
    errorMessage: (content) => messageApi.error(content),
    warningMessage: (content) => messageApi.warning(content),
  }), [messageApi]);

  return { ...api, contextHolder };
};

export default useMessage;
