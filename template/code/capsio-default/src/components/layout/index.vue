<template>
  <div class="layout">
    <el-container class="layout-left">
      <Aside></Aside>
      <el-container class="layout-right">
        <!-- <Header></Header> -->
        <div class="body">
          <Main></Main>
          <!-- <Footer></Footer> -->
        </div>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import Header from './src/Header.vue'
import Aside from './src/Aside.vue'
import Main from './src/Main.vue'
import Footer from './src/Footer.vue'
</script>

<style lang="scss" scoped>
@import '@/global/styles/color.scss';
.layout {
  display: flex;
  flex-direction: row;

  width: 100vw;
  height: 100vh;

  background-color: $global-background-color;
  .layout-left {
    width: 15%;
  }

  .layout-right {
    width: 85%;
  }
}
</style>
