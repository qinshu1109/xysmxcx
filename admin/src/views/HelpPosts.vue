<template>
  <div class="page">
    <div class="page-header">
      <h2 class="page-title">求助领养管理</h2>
      <el-button type="primary" :icon="Plus" @click="openCreate">新增信息</el-button>
    </div>

    <div class="filter-bar">
      <el-input v-model="filters.keyword" placeholder="标题、地点" clearable style="width: 220px" @keyup.enter="loadData" />
      <el-select v-model="filters.type" placeholder="类型" clearable style="width: 140px">
        <el-option v-for="option in helpTypeOptions" :key="option.value" :label="option.label" :value="option.value" />
      </el-select>
      <el-select v-model="filters.status" placeholder="状态" clearable style="width: 140px">
        <el-option v-for="option in helpStatusOptions" :key="option.value" :label="option.label" :value="option.value" />
      </el-select>
      <el-button :icon="Search" @click="loadData">查询</el-button>
      <el-button @click="resetFilters">重置</el-button>
    </div>

    <PageTableState :loading="loading" :error="error" :empty="rows.length === 0">
      <el-table :data="rows" border>
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="title" label="标题" min-width="130" />
        <el-table-column label="类型" width="100">
          <template #default="{ row }">{{ getOptionLabel(helpTypeOptions, row.type) }}</template>
        </el-table-column>
        <el-table-column prop="userNickname" label="发布人" width="120" />
        <el-table-column prop="location" label="地点" min-width="130" />
        <el-table-column label="状态" width="110">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.status)">{{ getOptionLabel(helpStatusOptions, row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="发布时间" min-width="160" />
        <el-table-column label="操作" width="260" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" :icon="Edit" @click="openEdit(row)">编辑</el-button>
            <el-dropdown @command="(status) => changeStatus(row, status)">
              <el-button text type="primary" :icon="Refresh">修改状态</el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-for="option in helpStatusOptions"
                    :key="option.value"
                    :command="option.value"
                    :disabled="option.value === row.status"
                  >
                    {{ option.label }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
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

    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑求助领养' : '新增求助领养'" width="720px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="110px" class="dialog-form">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" maxlength="10" show-word-limit />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" style="width: 100%">
            <el-option v-for="option in helpTypeOptions" :key="option.value" :label="option.label" :value="option.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="4" maxlength="200" show-word-limit />
        </el-form-item>
        <el-form-item label="地点" prop="location"><el-input v-model="form.location" /></el-form-item>
        <el-form-item label="联系方式" prop="contactPhone"><el-input v-model="form.contactPhone" /></el-form-item>
        <el-form-item label="发布人" prop="userId">
          <el-select v-model="form.userId" filterable style="width: 100%">
            <el-option
              v-for="user in userOptions"
              :key="user.id"
              :label="`${user.nickname}（${user.username}）`"
              :value="user.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" style="width: 100%">
            <el-option v-for="option in helpStatusOptions" :key="option.value" :label="option.label" :value="option.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="配图">
          <ImageUpload v-model="form.images" multiple :limit="3" />
          <div class="form-tip">最多 3 张，上传后保存为 /uploads/... 路径。</div>
        </el-form-item>
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
import { Delete, Edit, Plus, Refresh, Search } from '@element-plus/icons-vue';
import PageTableState from '../components/PageTableState.vue';
import ImageUpload from '../components/ImageUpload.vue';
import {
  createHelpPost,
  deleteHelpPost,
  getHelpPosts,
  updateHelpPost,
  updateHelpPostStatus
} from '../api/helpPosts';
import { getUsers } from '../api/users';
import { getOptionLabel, getStatusTagType, helpStatusOptions, helpTypeOptions } from '../utils/enums';

const loading = ref(false);
const submitting = ref(false);
const error = ref('');
const rows = ref([]);
const userOptions = ref([]);
const dialogVisible = ref(false);
const editingId = ref(null);
const formRef = ref();
const filters = reactive({ keyword: '', type: '', status: '' });
const pagination = reactive({ page: 1, pageSize: 10, total: 0 });
const form = reactive(emptyForm());

const rules = {
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { max: 10, message: '标题最多 10 个字', trigger: 'blur' }
  ],
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  description: [
    { required: true, message: '请输入描述', trigger: 'blur' },
    { max: 200, message: '描述最多 200 字', trigger: 'blur' }
  ],
  location: [{ required: true, message: '请输入地点', trigger: 'blur' }],
  contactPhone: [{ required: true, message: '请输入联系方式', trigger: 'blur' }],
  userId: [{ required: true, message: '请选择发布人', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
};

function emptyForm() {
  return {
    title: '',
    type: 'help',
    description: '',
    location: '',
    contactPhone: '',
    userId: '',
    status: 'pending',
    images: []
  };
}

async function loadUsers() {
  const data = await getUsers({ page: 1, pageSize: 100 });
  userOptions.value = data.items || [];
}

async function loadData() {
  loading.value = true;
  error.value = '';
  try {
    const data = await getHelpPosts({
      page: pagination.page,
      pageSize: pagination.pageSize,
      keyword: filters.keyword || undefined,
      type: filters.type || undefined,
      status: filters.status || undefined
    });
    rows.value = data.items || [];
    pagination.total = data.total || 0;
  } catch (err) {
    error.value = err.message || '求助领养列表加载失败';
  } finally {
    loading.value = false;
  }
}

function resetFilters() {
  Object.assign(filters, { keyword: '', type: '', status: '' });
  pagination.page = 1;
  loadData();
}

function handleSizeChange() {
  pagination.page = 1;
  loadData();
}

async function openCreate() {
  await loadUsers();
  editingId.value = null;
  Object.assign(form, emptyForm());
  dialogVisible.value = true;
}

async function openEdit(row) {
  await loadUsers();
  editingId.value = row.id;
  Object.assign(form, {
    title: row.title,
    type: row.type,
    description: row.description,
    location: row.location,
    contactPhone: row.contactPhone,
    userId: row.userId,
    status: row.status,
    images: Array.isArray(row.images) ? [...row.images] : []
  });
  dialogVisible.value = true;
}

async function submit() {
  const valid = await formRef.value.validate().catch(() => false);
  if (!valid) return;
  submitting.value = true;
  try {
    if (editingId.value) {
      await updateHelpPost(editingId.value, form);
    } else {
      await createHelpPost(form);
    }
    ElMessage.success('保存成功');
    dialogVisible.value = false;
    loadData();
  } finally {
    submitting.value = false;
  }
}

async function changeStatus(row, status) {
  await updateHelpPostStatus(row.id, status);
  ElMessage.success('状态已更新');
  loadData();
}

async function confirmDelete(row) {
  await ElMessageBox.confirm(`确认删除“${row.title}”？`, '删除确认', { type: 'warning' });
  await deleteHelpPost(row.id);
  ElMessage.success('删除成功');
  loadData();
}

onMounted(loadData);
</script>
