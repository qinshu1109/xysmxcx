<template>
  <div class="page">
    <div class="page-header">
      <h2 class="page-title">评论管理</h2>
    </div>

    <div class="filter-bar">
      <el-select v-model="filters.targetType" placeholder="评论对象类型" clearable style="width: 160px">
        <el-option v-for="option in targetTypeOptions" :key="option.value" :label="option.label" :value="option.value" />
      </el-select>
      <el-input v-model="filters.keyword" placeholder="评论内容、评论人" clearable style="width: 220px" @keyup.enter="loadData" />
      <el-button :icon="Search" @click="loadData">查询</el-button>
      <el-button @click="resetFilters">重置</el-button>
    </div>

    <PageTableState :loading="loading" :error="error" :empty="rows.length === 0">
      <el-table :data="rows" border>
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column label="评论对象类型" width="120">
          <template #default="{ row }">{{ getOptionLabel(targetTypeOptions, row.targetType) }}</template>
        </el-table-column>
        <el-table-column prop="targetTitle" label="评论对象" min-width="140" />
        <el-table-column prop="userNickname" label="评论人" width="120" />
        <el-table-column prop="content" label="评论内容" min-width="220" show-overflow-tooltip />
        <el-table-column prop="createdAt" label="评论时间" min-width="160" />
        <el-table-column label="操作" width="90" fixed="right">
          <template #default="{ row }">
            <el-button text type="danger" :icon="Delete" @click="confirmDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-row">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next"
          @current-change="loadData"
          @size-change="handleSizeChange"
        />
      </div>
    </PageTableState>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Search } from '@element-plus/icons-vue';
import PageTableState from '../components/PageTableState.vue';
import { deleteComment, getComments } from '../api/comments';
import { getOptionLabel, targetTypeOptions } from '../utils/enums';

const loading = ref(false);
const error = ref('');
const rows = ref([]);
const filters = reactive({ targetType: '', keyword: '' });
const pagination = reactive({ page: 1, pageSize: 10, total: 0 });

async function loadData() {
  loading.value = true;
  error.value = '';
  try {
    const data = await getComments({
      page: pagination.page,
      pageSize: pagination.pageSize,
      targetType: filters.targetType || undefined,
      keyword: filters.keyword || undefined
    });
    rows.value = data.items || [];
    pagination.total = data.total || 0;
  } catch (err) {
    error.value = err.message || '评论列表加载失败';
  } finally {
    loading.value = false;
  }
}

function resetFilters() {
  Object.assign(filters, { targetType: '', keyword: '' });
  pagination.page = 1;
  loadData();
}

function handleSizeChange() {
  pagination.page = 1;
  loadData();
}

async function confirmDelete(row) {
  await ElMessageBox.confirm(`确认删除评论 #${row.id}？`, '删除确认', { type: 'warning' });
  await deleteComment(row.id);
  ElMessage.success('删除成功');
  loadData();
}

onMounted(loadData);
</script>
