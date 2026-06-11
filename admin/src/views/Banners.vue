<template>
  <div class="page">
    <div class="page-header">
      <h2 class="page-title">轮播图管理</h2>
      <el-button type="primary" :icon="Plus" @click="openCreate">新增轮播图</el-button>
    </div>

    <PageTableState :loading="loading" :error="error" :empty="rows.length === 0">
      <el-table :data="rows" border>
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column label="图片" width="90">
          <template #default="{ row }"><el-image class="image-cell" :src="getImageUrl(row.imageUrl)" fit="cover" /></template>
        </el-table-column>
        <el-table-column prop="title" label="标题" min-width="140" />
        <el-table-column prop="subtitle" label="副标题" min-width="180" show-overflow-tooltip />
        <el-table-column prop="linkType" label="跳转类型" width="110" />
        <el-table-column prop="linkTarget" label="跳转目标" min-width="150" show-overflow-tooltip />
        <el-table-column prop="sortOrder" label="排序" width="80" />
        <el-table-column label="是否显示" width="100">
          <template #default="{ row }"><el-tag :type="row.isVisible ? 'success' : 'info'">{{ booleanText(row.isVisible) }}</el-tag></template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" :icon="Edit" @click="openEdit(row)">编辑</el-button>
            <el-button text type="danger" :icon="Delete" @click="confirmDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </PageTableState>

    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑轮播图' : '新增轮播图'" width="640px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" class="dialog-form">
        <el-form-item label="图片" prop="imageUrl"><ImageUpload v-model="form.imageUrl" /></el-form-item>
        <el-form-item label="标题" prop="title"><el-input v-model="form.title" /></el-form-item>
        <el-form-item label="副标题"><el-input v-model="form.subtitle" /></el-form-item>
        <el-form-item label="跳转类型"><el-input v-model="form.linkType" /></el-form-item>
        <el-form-item label="跳转目标"><el-input v-model="form.linkTarget" /></el-form-item>
        <el-form-item label="排序"><el-input-number v-model="form.sortOrder" :min="0" /></el-form-item>
        <el-form-item label="是否显示"><el-switch v-model="form.isVisible" /></el-form-item>
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
import { Delete, Edit, Plus } from '@element-plus/icons-vue';
import PageTableState from '../components/PageTableState.vue';
import ImageUpload from '../components/ImageUpload.vue';
import { createBanner, deleteBanner, getBanners, updateBanner } from '../api/banners';
import { booleanText } from '../utils/enums';
import { getImageUrl } from '../utils/image';

const loading = ref(false);
const submitting = ref(false);
const error = ref('');
const rows = ref([]);
const dialogVisible = ref(false);
const editingId = ref(null);
const formRef = ref();
const form = reactive(emptyForm());
const rules = {
  imageUrl: [{ required: true, message: '请输入或上传图片', trigger: 'change' }],
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }]
};

function emptyForm() {
  return {
    imageUrl: '',
    title: '',
    subtitle: '',
    linkType: '',
    linkTarget: '',
    sortOrder: 0,
    isVisible: true
  };
}

async function loadData() {
  loading.value = true;
  error.value = '';
  try {
    rows.value = await getBanners();
  } catch (err) {
    error.value = err.message || '轮播图列表加载失败';
  } finally {
    loading.value = false;
  }
}

function openCreate() {
  editingId.value = null;
  Object.assign(form, emptyForm());
  dialogVisible.value = true;
}

function openEdit(row) {
  editingId.value = row.id;
  Object.assign(form, {
    imageUrl: row.imageUrl,
    title: row.title,
    subtitle: row.subtitle || '',
    linkType: row.linkType || '',
    linkTarget: row.linkTarget || '',
    sortOrder: row.sortOrder || 0,
    isVisible: Boolean(row.isVisible)
  });
  dialogVisible.value = true;
}

async function submit() {
  const valid = await formRef.value.validate().catch(() => false);
  if (!valid) return;
  submitting.value = true;
  try {
    if (editingId.value) {
      await updateBanner(editingId.value, form);
    } else {
      await createBanner(form);
    }
    ElMessage.success('保存成功');
    dialogVisible.value = false;
    loadData();
  } finally {
    submitting.value = false;
  }
}

async function confirmDelete(row) {
  await ElMessageBox.confirm(`确认删除轮播图“${row.title}”？`, '删除确认', { type: 'warning' });
  await deleteBanner(row.id);
  ElMessage.success('删除成功');
  loadData();
}

onMounted(loadData);
</script>
