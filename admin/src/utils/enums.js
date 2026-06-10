export const genderOptions = [
  { label: '公', value: 'male' },
  { label: '母', value: 'female' },
  { label: '未知', value: 'unknown' }
];

export const helpTypeOptions = [
  { label: '求助', value: 'help' },
  { label: '领养', value: 'adoption' },
  { label: '喂养', value: 'feeding' },
  { label: '绝育', value: 'neuter' },
  { label: '受伤救助', value: 'injury' },
  { label: '其他', value: 'other' }
];

export const helpStatusOptions = [
  { label: '待处理', value: 'pending', type: 'warning' },
  { label: '处理中', value: 'processing', type: 'primary' },
  { label: '已完成', value: 'done', type: 'success' }
];

export const targetTypeOptions = [
  { label: '猫咪', value: 'cat' },
  { label: '求助领养', value: 'help_post' }
];

export function getOptionLabel(options, value) {
  return options.find((option) => option.value === value)?.label || value || '-';
}

export function getStatusTagType(value) {
  return helpStatusOptions.find((option) => option.value === value)?.type || 'info';
}

export function booleanText(value) {
  return value ? '是' : '否';
}
