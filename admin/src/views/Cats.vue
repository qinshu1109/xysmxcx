<template>
  <div class="page">
    <div class="page-header">
      <h2 class="page-title">猫咪管理</h2>
      <el-button type="primary" :icon="Plus" @click="openCreate">新增猫咪</el-button>
    </div>

    <div class="filter-bar">
      <el-input v-model="filters.keyword" placeholder="名字、出没地点" clearable style="width: 220px" @keyup.enter="loadData" />
      <el-select v-model="filters.isAdoptable" placeholder="是否可领养" clearable style="width: 140px">
        <el-option label="可领养" :value="1" />
        <el-option label="不可领养" :value="0" />
      </el-select>
      <el-select v-model="filters.isNeutered" placeholder="是否已绝育" clearable style="width: 140px">
        <el-option label="已绝育" :value="1" />
        <el-option label="未绝育" :value="0" />
      </el-select>
      <el-button :icon="Search" @click="loadData">查询</el-button>
      <el-button @click="resetFilters">重置</el-button>
    </div>

    <PageTableState :loading="loading" :error="error" :empty="rows.length === 0">
      <el-table :data="rows" border>
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column label="照片" width="90">
          <template #default="{ row }">
            <el-image class="image-cell" :src="getImageUrl(row.imageUrl)" fit="cover" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名字" width="110" />
        <el-table-column label="性别" width="80">
          <template #default="{ row }">{{ getOptionLabel(genderOptions, row.gender) }}</template>
        </el-table-column>
        <el-table-column prop="location" label="出没地点" min-width="130" />
        <el-table-column prop="healthStatus" label="健康状态" min-width="160" show-overflow-tooltip />
        <el-table-column label="可领养" width="90">
          <template #default="{ row }"><el-tag :type="row.isAdoptable ? 'success' : 'info'">{{ booleanText(row.isAdoptable) }}</el-tag></template>
        </el-table-column>
        <el-table-column label="已绝育" width="90">
          <template #default="{ row }"><el-tag :type="row.isNeutered ? 'success' : 'info'">{{ booleanText(row.isNeutered) }}</el-tag></template>
        </el-table-column>
        <el-table-column label="需关注" width="90">
          <template #default="{ row }"><el-tag :type="row.needsAttention ? 'warning' : 'info'">{{ booleanText(row.needsAttention) }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" min-width="160" />
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

    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑猫咪' : '新增猫咪'" width="680px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" class="dialog-form">
        <el-form-item label="名字" prop="name"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="主照片" prop="imageUrl"><ImageUpload v-model="form.imageUrl" /></el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="form.gender" style="width: 100%">
            <el-option v-for="option in genderOptions" :key="option.value" :label="option.label" :value="option.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="年龄"><el-input v-model="form.age" /></el-form-item>
        <el-form-item label="毛色"><el-input v-model="form.color" /></el-form-item>
        <el-form-item label="性格"><el-input v-model="form.personality" /></el-form-item>
        <el-form-item label="出没地点" prop="location"><el-input v-model="form.location" /></el-form-item>
        <el-form-item label="健康状态" prop="healthStatus"><el-input v-model="form.healthStatus" /></el-form-item>
        <el-form-item label="状态">
          <el-space wrap>
            <el-switch v-model="form.isNeutered" active-text="已绝育" />
            <el-switch v-model="form.isAdoptable" active-text="可领养" />
            <el-switch v-model="form.needsAttention" active-text="需关注" />
          </el-space>
        </el-form-item>
        <el-form-item label="备注"><el-input v-model="form.remark" type="textarea" :rows="3" /></el-form-item>
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
import { Delete, Edit, Plus, Search } from '@element-plus/icons-vue';
import PageTableState from '../components/PageTableState.vue';
import ImageUpload from '../components/ImageUpload.vue';
import { createCat, deleteCat, getCats, updateCat } from '../api/cats';
import { booleanText, genderOptions, getOptionLabel } from '../utils/enums';
import { getImageUrl } from '../utils/image';

const loading = ref(false);
const submitting = ref(false);
const error = ref('');
const rows = ref([]);
const dialogVisible = ref(false);
const editingId = ref(null);
const formRef = ref();
const filters = reactive({ keyword: '', isAdoptable: '', isNeutered: '' });
const pagination = reactive({ page: 1, pageSize: 10, total: 0 });
const form = reactive(emptyForm());

const rules = {
  name: [{ required: true, message: '请输入名字', trigger: 'blur' }],
  imageUrl: [{ required: true, message: '请输入或上传照片', trigger: 'change' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  location: [{ required: true, message: '请输入出没地点', trigger: 'blur' }],
  healthStatus: [{ required: true, message: '请输入健康状态', trigger: 'blur' }]
};

function emptyForm() {
  return {
    name: '',
    imageUrl: '',
    gender: 'unknown',
    age: '',
    color: '',
    personality: '',
    location: '',
    healthStatus: '',
    isNeutered: false,
    isAdoptable: false,
    needsAttention: false,
    remark: ''
  };
}

function buildParams() {
  return {
    page: pagination.page,
    pageSize: pagination.pageSize,
    keyword: filters.keyword || undefined,
    isAdoptable: filters.isAdoptable === '' ? undefined : filters.isAdoptable,
    isNeutered: filters.isNeutered === '' ? undefined : filters.isNeutered
  };
}

async function loadData() {
  loading.value = true;
  error.value = '';
  try {
    const data = await getCats(buildParams());
    rows.value = data.items || [];
    pagination.total = data.total || 0;
  } catch (err) {
    error.value = err.message || '猫咪列表加载失败';
  } finally {
    loading.value = false;
  }
}

function resetFilters() {
  Object.assign(filters, { keyword: '', isAdoptable: '', isNeutered: '' });
  pagination.page = 1;
  loadData();
}

function handleSizeChange() {
  pagination.page = 1;
  loadData();
}

function openCreate() {
  editingId.value = null;
  Object.assign(form, emptyForm());
  dialogVisible.value = true;
}

function openEdit(row) {
  editingId.value = row.id;
  Object.assign(form, {
    name: row.name,
    imageUrl: row.imageUrl,
    gender: row.gender,
    age: row.age || '',
    color: row.color || '',
    personality: row.personality || '',
    location: row.location,
    healthStatus: row.healthStatus,
    isNeutered: Boolean(row.isNeutered),
    isAdoptable: Boolean(row.isAdoptable),
    needsAttention: Boolean(row.needsAttention),
    remark: row.remark || ''
  });
  dialogVisible.value = true;
}

async function submit() {
  const valid = await formRef.value.validate().catch(() => false);
  if (!valid) return;
  submitting.value = true;
  try {
    if (editingId.value) {
      await updateCat(editingId.value, form);
    } else {
      await createCat(form);
    }
    ElMessage.success('保存成功');
    dialogVisible.value = false;
    loadData();
  } finally {
    submitting.value = false;
  }
}

async function confirmDelete(row) {
  await ElMessageBox.confirm(`确认删除猫咪“${row.name}”？`, '删除确认', { type: 'warning' });
  await deleteCat(row.id);
  ElMessage.success('删除成功');
  loadData();
}

onMounted(loadData);
</script>
