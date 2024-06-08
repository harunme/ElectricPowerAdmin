<template>
  <div class="CirecleNumber" :style="`color:${props.color}`">
    <span class="value">{{ props.value }}</span>
    <span class="label">{{ props.label }}</span>
  </div>
</template>

<script setup lang="tsx" name="CirecleNumber">
interface CirecleNumberProps {
  label: string;
  value: number;
  color: string;
}

const props = withDefaults(defineProps<CirecleNumberProps>(), {
  label: "正常运行",
  value: 0,
  color: "#ff4949"
});
</script>

<style lang="scss" scoped>
.CirecleNumber {
  align-self: center;
  width: 100px;
  height: 100px;
  margin: 15px auto;
  clear: both;
  text-align: center;
  cursor: pointer;
  border: 2px solid;
  border-radius: 50%;
  -ms-flex-item-align: center;
  .value {
    display: block;
    float: left;
    width: 100%;
    height: 30px;
    font-size: 28px;
    line-height: 75px;
  }
  .label {
    display: block;
    float: left;
    width: 100%;
    font-size: 12px;
    line-height: 70px;
  }
}
</style>
