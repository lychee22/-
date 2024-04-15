<template>
  <el-row>
    <el-col :span="4">
      <img
        src="https://s1.ax1x.com/2023/04/12/ppjQLff.png"
        class="pt-5 pl-10 pointer"
        style="width: 150px; height: 60px; cursor: pointer"
        @click="toHome"
      />
      <div class="pt-10 pr-1"></div>
    </el-col>
    <el-col :span="16">
      <div>
        <el-form :model="form" class="flex items-center justify-center">
          <el-form-item>
            <el-input
              v-model="form.newtitle"
              class="w-[500px] h-[60px] pr-4 pt-4"
              placeholder="请输入查找新闻标题或内容"
            />
          </el-form-item>
          <el-form-item class="pt-4">
            <el-button class="w-[50px] h-[45px]" type="primary" color="#10B981" @click="onSearch"
              >搜索</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </el-col>
    <el-col :span="4"> </el-col>
  </el-row>
</template>
<script setup>
import { useRouter } from "vue-router";
import { reactive,toRef,defineEmits,defineProps } from "vue";

const emits = defineEmits([
    'onSearch'
])
const onSearch = ()=>{
    console.log(form.newtitle)
    emits('onSearch',form.newtitle)
}
const searchTitle = reactive('')
const router = useRouter();
const form = reactive({
  newtitle: "",
});
// 到首页
const toHome = () => {
  router.push("/index");
};
</script>
