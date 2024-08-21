<script setup>
import { theme } from 'ant-design-vue';
import { ConfigProvider } from 'ant-design-vue';
</script>

<template>
  <ConfigProvider :theme="{
    token: {
      colorPrimary: '#00C292',
      motionDurationFast: '0s',
      motionDurationMid: '0.01s',
    }
  }">
    <RouterView />
  </ConfigProvider>
</template>

<style>
body {
  margin: 0;
  height: 100%;
}
html {
  height: 100%;
}
#app {
  height: 100%;
}
</style>