<template>
  <div class="page">
    <div class="page-header">
      <h2 class="page-title">用户管理</h2>
    </div>

    <div class="filter-bar">
      <el-input v-model="filters.keyword" placeholder="用户名、昵称" clearable style="width: 220px" @keyup.enter="loadData" />
      <el-button :icon="Search" @click="loadData">查询</el-button>
      <el-button @click="resetFilters">重置</el-button>
    </div>

    <PageTableState :loading="loading" :error="error" :empty="rows.length === 0">
      <el-table :data="rows" border>
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="username" label="用户名" min-width="120" />
        <el-table-column prop="nickname" label="昵称" min-width="120" />
        <el-table-column label="头像" width="90">
          <template #default="{ row }"><el-image class="image-cell" :src="getImageUrl(row.avatar)" fit="cover" /></template>
        </el-table-column>
        <el-table-column prop="createdAt" label="注册时间" min-width="160" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" :icon="Edit" @click="openEdit(row)">编辑</el-button>
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

    <el-dialog v-model="dialogVisible" title="编辑用户" width="560px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="昵称" prop="nickname"><el-input v-model="form.nickname" /></el-form-item>
        <el-form-item label="头像"><ImageUpload v-model="form.avatar" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search } from '@element-plus/icons-vue';
import PageTableState from '../components/PageTableState.vue';
import ImageUpload from '../components/ImageUpload.vue';
import { deleteUser, getUsers, updateUser } from '../api/users';
import { getImageUrl } from '../utils/image';

const loading = ref(false);
const submitting = ref(false);
const error = ref('');
const rows = ref([]);
const dialogVisible = ref(false);
const editingId = ref(null);
const formRef = ref();
const filters = reactive({ keyword: '' });
const pagination = reactive({ page: 1, pageSize: 10, total: 0 });
const form = reactive({ nickname: '', avatar: '' });
const rules = { nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }] };

async function loadData() {
  loading.value = true;
  error.value = '';
  try {
    const data = await getUsers({
      page: pagination.page,
      pageSize: pagination.pageSize,
      keyword: filters.keyword || undefined
    });
    rows.value = data.items || [];
    pagination.total = data.total || 0;
  } catch (err) {
    error.value = err.message || '用户列表加载失败';
  } finally {
    loading.value = false;
  }
}

function resetFilters() {
  filters.keyword = '';
  pagination.page = 1;
  loadData();
}

function handleSizeChange() {
  pagination.page = 1;
  loadData();
}

function openEdit(row) {
  editingId.value = row.id;
  Object.assign(form, { nickname: row.nickname, avatar: row.avatar || '' });
  dialogVisible.value = true;
}

async function submit() {
  const valid = await formRef.value.validate().catch(() => false);
  if (!valid) return;
  submitting.value = true;
  try {
    await updateUser(editingId.value, form);
    ElMessage.success('保存成功');
    dialogVisible.value = false;
    loadData();
  } finally {
    submitting.value = false;
  }
}

async function confirmDelete(row) {
  await ElMessageBox.confirm(`确认删除用户“${row.nickname}”？`, '删除确认', { type: 'warning' });
  await deleteUser(row.id);
  ElMessage.success('删除成功');
  loadData();
}

onMounted(loadData);
</script>
