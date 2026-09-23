import { useAssistanceRequestStore } from "../stores/AssistanceRequestStore";

// 调度员接单动作：被拒绝时（如障碍未关闭）暴露错误信息。
export function useAssistanceFlow(helperId: number) {
  const { rows, loading, accepting, lastError, load, accept, clearError } = useAssistanceRequestStore();

  return {
    rows,
    loading,
    accepting,
    error: lastError,
    load,
    accept: (id: number) => accept(id, helperId),
    clearError
  };
}
