<template>
  <div class="image-upload">
    <div v-if="multiple" class="manual-row">
      <el-input v-model="manualValue" placeholder="/uploads/example.jpg 或 /static/..." clearable />
      <el-button :icon="Plus" @click="addManual">添加路径</el-button>
    </div>
    <el-input
      v-else
      :model-value="singleValue"
      placeholder="/uploads/example.jpg 或 /static/..."
      clearable
      @update:model-value="emit('update:modelValue', $event)"
    />

    <el-upload
      :show-file-list="false"
      :http-request="handleUpload"
      :before-upload="beforeUpload"
      :disabled="uploading || reachLimit"
    >
      <el-button type="primary" :icon="Upload" :loading="uploading" :disabled="reachLimit">
        上传图片
      </el-button>
    </el-upload>

    <div v-if="imageItems.length" class="preview-list">
      <div v-for="(item, index) in imageItems" :key="item.url + index" class="preview-item">
        <el-image
          v-if="item.previewUrl"
          :src="item.previewUrl"
          fit="cover"
          class="preview-image"
          :preview-src-list="[item.previewUrl]"
          preview-teleported
        />
        <div v-else class="preview-empty">无预览</div>
        <span class="preview-path">{{ item.url }}</span>
        <el-button
          v-if="multiple"
          text
          type="danger"
          :icon="Delete"
          @click="removeAt(index)"
        >
          移除
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Delete, Plus, Upload } from '@element-plus/icons-vue';
import { uploadImage } from '../api/upload';
import { getImageUrl } from '../utils/image';

const props = defineProps({
  modelValue: {
    type: [String, Array],
    default: ''
  },
  multiple: {
    type: Boolean,
    default: false
  },
  limit: {
    type: Number,
    default: 3
  }
});

const emit = defineEmits(['update:modelValue']);
const uploading = ref(false);
const manualValue = ref('');

const values = computed(() => {
  if (props.multiple) {
    return Array.isArray(props.modelValue) ? props.modelValue.filter(Boolean) : [];
  }
  return props.modelValue ? [props.modelValue] : [];
});

const singleValue = computed(() => props.modelValue || '');
const reachLimit = computed(() => props.multiple && values.value.length >= props.limit);
const imageItems = computed(() => values.value.map((url) => ({ url, previewUrl: getImageUrl(url) })));

function beforeUpload(file) {
  if (!file.type.startsWith('image/')) {
    ElMessage.warning('请选择图片文件');
    return false;
  }
  if (file.size > 5 * 1024 * 1024) {
    ElMessage.warning('图片不能超过 5MB');
    return false;
  }
  if (reachLimit.value) {
    ElMessage.warning(`最多上传 ${props.limit} 张图片`);
    return false;
  }
  return true;
}

async function handleUpload(option) {
  uploading.value = true;
  try {
    const data = await uploadImage(option.file);
    const url = data.url;
    if (props.multiple) {
      emit('update:modelValue', [...values.value, url].slice(0, props.limit));
    } else {
      emit('update:modelValue', url);
    }
    ElMessage.success('上传成功');
  } finally {
    uploading.value = false;
  }
}

function addManual() {
  const value = manualValue.value.trim();
  if (!value) return;
  if (reachLimit.value) {
    ElMessage.warning(`最多添加 ${props.limit} 张图片`);
    return;
  }
  emit('update:modelValue', [...values.value, value].slice(0, props.limit));
  manualValue.value = '';
}

function removeAt(index) {
  const next = [...values.value];
  next.splice(index, 1);
  emit('update:modelValue', next);
}
</script>

<style scoped>
.image-upload {
  display: grid;
  gap: 10px;
}

.manual-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
}

.preview-list {
  display: grid;
  gap: 8px;
}

.preview-item {
  display: grid;
  grid-template-columns: 58px minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px;
}

.preview-image,
.preview-empty {
  width: 58px;
  height: 58px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  background: #f3f4f6;
}

.preview-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 12px;
}

.preview-path {
  min-width: 0;
  overflow: hidden;
  color: #4b5563;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
