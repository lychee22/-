<template>
        <el-row>
          <el-col :span="4">
            <img
              src="https://s1.ax1x.com/2023/04/12/ppjQLff.png"
              class="pt-5 pl-10 pointer"
              style="width: 150px; height: 60px;cursor: pointer;"
              @click="toHome"
            />
            <div class="pt-10 pr-1"></div>
          </el-col>
          <el-col :span="16">
            <div>
              <el-form :model="form" class="flex items-center justify-center">
                <el-form-item @click="onSubmit">
                  <el-input
                    v-model="form.newtitle"
                    class="w-[500px] h-[60px] pr-4 pt-4"
                    placeholder="请输入查找新闻标题或内容"
                  />
                </el-form-item>
                <el-form-item class="pt-4">
                  <el-button
                    class="w-[50px] h-[45px]"
                    type="primary"
                    color="#10B981"
                    >搜索</el-button
                  >
                </el-form-item>
              </el-form>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="pt-4 flex items-center justify-center">
              <div>
                <el-avatar shape="square" :size="large" :src="avatorurl" />
              </div>
              <div>
                <el-dropdown @command="handleCommand">
                  <span class="pl-2 pt-1"> 更多操作 </span>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="a">个人中心</el-dropdown-item>
                      <el-dropdown-item command="b">修改信息</el-dropdown-item>
                      <el-dropdown-item command="c">发布文章</el-dropdown-item>
                      <el-dropdown-item command="d" disabled
                        >登出</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>
          </el-col>
        </el-row>
</template>
<script setup>
import { useRouter } from "vue-router";
import { reactive } from "vue";

const router = useRouter()
const form = reactive({
  newtitle: "",
});
// 跳转到搜索页
const onSubmit = () => {
  router.push('/search')
};
// 到首页
const toHome = ()=>{
    router.push('/index')
}
const handleCommand = (command) => {
  if (command == "a") {
    router.push("/about");
  } else if (command == "b") {
    router.push("/edit");
  } else if (command == "c") {
    router.push("/public");
  } else if (command == "d") {
    router.push('/');
  }
};
</script>