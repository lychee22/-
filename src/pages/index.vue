<template>
  <div>
    <el-container>
      <el-header>
        <Hearder></Hearder>
      </el-header>
      <el-main>
        <el-row>
          <el-col :span="4" class="pt-10">
            <hotnews />
          </el-col>
          <el-col :span="14" class="min-h-screen">
            <div>
              <Tabs />
            </div>
          </el-col>
          <el-col :span="6">
            <div class="border-gray-500">
              <Calender />
            </div>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import Tabs from "~/components/tabs.vue";
import Calender from "~/components/Calender.vue";
import hotnews from "../components/hotnews.vue";
import Hearder from '~/components/Hearder/index.vue';
</script>
