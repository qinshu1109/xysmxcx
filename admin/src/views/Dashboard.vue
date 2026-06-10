<template>
  <div class="page">
    <div class="page-header">
      <h2 class="page-title">后台首页</h2>
      <el-button :icon="Refresh" @click="loadData">刷新</el-button>
    </div>

    <PageTableState :loading="loading" :error="error" :empty="false">
      <div class="stats-grid">
        <div v-for="item in stats" :key="item.label" class="stat-card">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </div>
      </div>

      <div class="dashboard-grid">
        <section class="dashboard-section">
          <h3>最近求助领养</h3>
          <el-table :data="dashboard.recentHelpPosts || []" border>
            <el-table-column prop="title" label="标题" min-width="120" />
            <el-table-column label="类型" width="100">
              <template #default="{ row }">{{ getOptionLabel(helpTypeOptions, row.type) }}</template>
            </el-table-column>
            <el-table-column prop="location" label="地点" min-width="120" />
            <el-table-column label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getStatusTagType(row.status)">
                  {{ getOptionLabel(helpStatusOptions, row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="userNickname" label="发布人" width="120" />
            <el-table-column prop="createdAt" label="时间" min-width="160" />
          </el-table>
        </section>

        <section class="dashboard-section">
          <h3>最近评论</h3>
          <el-table :data="dashboard.recentComments || []" border>
            <el-table-column prop="userNickname" label="评论人" width="120" />
            <el-table-column prop="targetTitle" label="评论对象" min-width="130" />
            <el-table-column prop="content" label="内容" min-width="180" show-overflow-tooltip />
            <el-table-column prop="createdAt" label="时间" min-width="160" />
          </el-table>
        </section>
      </div>
    </PageTableState>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { Refresh } from '@element-plus/icons-vue';
import PageTableState from '../components/PageTableState.vue';
import { getDashboard } from '../api/dashboard';
import { getOptionLabel, getStatusTagType, helpStatusOptions, helpTypeOptions } from '../utils/enums';

const loading = ref(false);
const error = ref('');
const dashboard = ref({});

const stats = computed(() => [
  { label: '用户数量', value: dashboard.value.userCount ?? 0 },
  { label: '猫咪数量', value: dashboard.value.catCount ?? 0 },
  { label: '求助领养数量', value: dashboard.value.helpPostCount ?? 0 },
  { label: '待处理求助', value: dashboard.value.pendingHelpPostCount ?? 0 },
  { label: '评论数量', value: dashboard.value.commentCount ?? 0 }
]);

async function loadData() {
  loading.value = true;
  error.value = '';
  try {
    dashboard.value = await getDashboard();
  } catch (err) {
    error.value = err.message || '后台首页加载失败';
  } finally {
    loading.value = false;
  }
}

onMounted(loadData);
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(130px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.stat-card {
  display: grid;
  gap: 8px;
  padding: 16px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #e5e7eb;
}

.stat-card span {
  color: #6b7280;
  font-size: 13px;
}

.stat-card strong {
  color: #111827;
  font-size: 26px;
}

.dashboard-grid {
  display: grid;
  gap: 16px;
}

.dashboard-section {
  padding: 16px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #e5e7eb;
}

.dashboard-section h3 {
  margin: 0 0 12px;
  font-size: 16px;
}
</style>
