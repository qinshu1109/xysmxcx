<template>
  <div class="page">
    <div class="page-header">
      <h2 class="page-title">基础配置</h2>
      <el-button :icon="Refresh" @click="loadData">刷新</el-button>
    </div>

    <PageTableState :loading="loading" :error="error" :empty="rows.length === 0">
      <el-table :data="rows" border>
        <el-table-column prop="configKey" label="配置键" min-width="160" />
        <el-table-column prop="configValue" label="配置值" min-width="240" show-overflow-tooltip />
        <el-table-column prop="description" label="说明" min-width="180" />
        <el-table-column prop="updatedAt" label="更新时间" min-width="160" />
        <el-table-column label="操作" width="90" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" :icon="Edit" @click="openEdit(row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </PageTableState>

    <el-dialog v-model="dialogVisible" title="编辑配置" width="620px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="配置键"><el-input v-model="form.configKey" disabled /></el-form-item>
        <el-form-item label="配置值" prop="configValue">
          <el-input v-model="form.configValue" type="textarea" :rows="4" />
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
import { ElMessage } from 'element-plus';
import { Edit, Refresh } from '@element-plus/icons-vue';
import PageTableState from '../components/PageTableState.vue';
import { getConfigs, updateConfig } from '../api/configs';

const loading = ref(false);
const submitting = ref(false);
const error = ref('');
const rows = ref([]);
const dialogVisible = ref(false);
const formRef = ref();
const form = reactive({ configKey: '', configValue: '' });
const rules = { configValue: [{ required: true, message: '请输入配置值', trigger: 'blur' }] };

async function loadData() {
  loading.value = true;
  error.value = '';
  try {
    rows.value = await getConfigs();
  } catch (err) {
    error.value = err.message || '配置列表加载失败';
  } finally {
    loading.value = false;
  }
}

function openEdit(row) {
  Object.assign(form, {
    configKey: row.configKey,
    configValue: row.configValue
  });
  dialogVisible.value = true;
}

async function submit() {
  const valid = await formRef.value.validate().catch(() => false);
  if (!valid) return;
  submitting.value = true;
  try {
    await updateConfig(form.configKey, { configValue: form.configValue });
    ElMessage.success('保存成功');
    dialogVisible.value = false;
    loadData();
  } finally {
    submitting.value = false;
  }
}

onMounted(loadData);
</script>
