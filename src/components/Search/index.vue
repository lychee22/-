<template>
  <el-container>
    <el-header>
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
                <el-button
                  class="w-[50px] h-[45px]"
                  type="primary"
                  color="#10B981"
                  @click="onSearch"
                  >搜索</el-button
                >
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="4"> </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-row style="height: 100%; width: 100%">
        <el-col :span="3"></el-col>
        <el-col :span="18">
          <div class="min-h-screen">
            <div
              class="p-3 rounded-xl border-1 border-emerald-500 bg-yellow-50"
              v-for="item in newsList"
              style="margin-bottom: 5px"
            >
              <div class="font-bold text-2xl p-2">{{ item.newTitle }}</div>
              <div class="p-2">
                内容简介：{{ item.newCnt.slice(0, 100) }}......
              </div>
              <div class="flex">
                <div class="p-2">发表日期：{{ item.newDate }}</div>
                <div class="p-2">
                  新闻分类：<el-tag size="default">{{
                    item.newCategory
                  }}</el-tag>
                </div>
                <div style="margin-left: 45%" class="p-2">
                  <el-button
                    type="primary"
                    color="#38bdf8"
                    :id="item.newId"
                    @click="onSubmit"
                    round
                    >点击查看详情</el-button
                  >
                </div>
              </div>
            </div>
            <div class="flex justify-center items-center p-3">
              <el-pagination
                v-model:page-size="pageSize"
                :page-sizes="pageSizes"
                layout=" prev, pager, next"
                :total="pageTotal"
                hide-on-single-page
                @size-change="handleSizeChange"
                @current-change="changePage"
                background
              />
            </div>
          </div>
        </el-col>
        <el-row :span="3"></el-row>
      </el-row>
    </el-main>
  </el-container>
</template>
<script>
import { querybyid } from "~/api/news";
import { useRouter } from "vue-router";

export default {
  name: "Search",
  setup() {
    const router = useRouter();
    const onSubmit = (e) => {
        console.log(e);
      router.push("/newsdetail/" + e.currentTarget.id);
    };
    const toHome = ()=>{
        router.push('/index')
    }
    return {
      onSubmit,
      toHome,
    };
  },
  data() {
    return {
      newsList: [],
      pageSizes: [1, 2, 3],
      pageSize: 5,
      pageTotal: 20,
      form: {
        newTitle: "",
      },
    };
  },
  methods: {
    changePage(val) {
      querybyid(val + 1, 5, 10).then((res) => {
        this.newsList = res.data.records;
      });
    },
    onSearch(){
        console.log(this.form.newTitle)
        querybyid(this.form.newTitle + 1, 5, 10).then((res) => {
        this.newsList = res.data.records;
      });
    }
  },
  mounted() {
    querybyid(0, 5, 10).then((res) => {
      this.newsList = res.data.records;
      this.pageTotal = res.data.total - 1;
    });
  },
};
</script>
<style scoped>
.contentWrap {
  height: 100%;
  width: 100%;
  background-color: aqua;
}
</style>
