<template>
  <div class="table-panel">
    <div v-if="loading" class="state-box">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>加载中</span>
    </div>
    <el-alert
      v-else-if="error"
      :title="error"
      type="error"
      show-icon
      :closable="false"
    />
    <el-empty v-else-if="empty" description="暂无数据" />
    <slot v-else />
  </div>
</template>

<script setup>
import { Loading } from '@element-plus/icons-vue';

defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  empty: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
});
</script>

<style scoped>
.state-box {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 220px;
  color: #6b7280;
}
</style>
