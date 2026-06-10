<template>
  <div class="login-page">
    <div class="login-panel">
      <h1>校园拾喵驿站后台</h1>
      <p>默认账号：admin / 123456</p>
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @keyup.enter="submit">
        <el-form-item label="管理员账号" prop="username">
          <el-input v-model="form.username" placeholder="admin" autocomplete="username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="123456"
            autocomplete="current-password"
            show-password
          />
        </el-form-item>
        <el-button type="primary" :loading="loading" class="login-button" @click="submit">
          登录
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { loginAdmin } from '../api/auth';
import { setAdminInfo, setAdminToken } from '../utils/auth';

const router = useRouter();
const route = useRoute();
const formRef = ref();
const loading = ref(false);
const form = reactive({
  username: 'admin',
  password: '123456'
});

const rules = {
  username: [{ required: true, message: '请输入管理员账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
};

async function submit() {
  const valid = await formRef.value.validate().catch(() => false);
  if (!valid) return;
  loading.value = true;
  try {
    const data = await loginAdmin(form);
    setAdminToken(data.token);
    setAdminInfo(data.admin);
    ElMessage.success('登录成功');
    router.replace(route.query.redirect || '/dashboard');
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background:
    linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(59, 130, 246, 0.12)),
    #f4f6f8;
}

.login-panel {
  width: min(420px, 100%);
  padding: 28px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.12);
}

.login-panel h1 {
  margin: 0 0 8px;
  font-size: 24px;
}

.login-panel p {
  margin: 0 0 22px;
  color: #6b7280;
}

.login-button {
  width: 100%;
}
</style>
