<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-form :model="searchForm">
        <el-form-item label="状态">
          <el-radio-group v-model="searchForm.status">
            <el-radio label>全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="频道">
          <channel></channel>
        </el-form-item>

        <el-form-item label="时间">
          <el-date-picker
            v-model="searchForm.date"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
      </el-form>

      <el-button type="primary" @click="search">筛选</el-button>
    </div>

    <p>共找到 {{ total }} 条符合条件的内容</p>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="cover.images[0]" label="封面" width="260">
        <template slot-scope="scope">
          <!-- scope.row是它所在的这一行的数据 -->
          <img v-for="item in scope.row.cover.images" width="60" height="60" :src="item" alt />
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" width="180"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.status | formatStatus }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="pubdate" label="发布时间"></el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary">修改</el-button>
          <el-button size="mini" type="danger" @click="doDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      :disabled="loading"
      :page-size="10"
      layout="total,prev,pager,next"
      :total="total"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </el-card>
</template>

<script>
// import JSONbig from "json-bigint";
// import axios from "axios";
// axios.defaults.baseURL = "https://some-domain.com/api/";
// axios.defaults.transformResponse = [
//   function(data) {
//     try {
//       return JSONbig.parse(data);
//     } catch (error) {
//       return data;
//     }
//   }
// ];

import channel from '@/components/channel'

export default {
  name: "homearticle",
  components:{
    channel
  },
  data() {
    return {
      loading:false,
      searchForm: {
        status: "",
        channel_id: "",
        date: []
      },
      total: 0,
      tableData: [],
      channelList: []
    };
  },
  methods: {
    doDel(row) {
      this.$confirm("请问真的要删除吗？", "是否删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
          this.$axios
            .delete(
              `http://ttapi.research.itcast.cn/mp/v1_0/articles/${row.id}`,
              {
                headers: {
                  Authorization: `Bearer ${userInfo.token}`
                }
              }
            )
            .then(res => {
              this.$message.success("删除成功");
              this.loadData(1);
            })
            .catch(error => {
              this.$message.error("删除失败！");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "真乖~~ 删库跑路不可取哈~~"
          });
        });
    },
    search() {
      this.loadData(1);
    },
    handleCurrentChange(page) {
      this.loadData(page);
    },
    loadData(page) {
      this.loading = true
      const res = JSON.parse(window.localStorage.getItem("userInfo"));
      this.$axios
        .get("mp/v1_0/articles", {
          headers: {
            Authorization: `Bearer ${res.token}`
          },
          params: {
            status:
              this.searchForm.status == "" ? undefined : this.searchForm.status,
            channel_id:
              this.searchForm.channel_id == ""
                ? undefined
                : this.searchForm.channel_id,
            begin_pubdate: this.searchForm.date[0],
            end_pubdate: this.searchForm.date[1],
            page,
            per_page: 10
          }
        })
        .then(res => {
          console.log(res);
          this.tableData = res.data.data.results;
          this.total = res.data.data.toal_count;
          this.loading = false;
        });
    }
  },
  created() {
    this.loadData(1);
    // axios.get("http://ttapi.research.itcast.cn/mp/v1_0/channels").then(res => {
    //   this.channelList = res.data.data.channels;
    // });
  },
  filters: {
    formatStatus(val) {
      switch (val) {
        case 0:
          return "草稿";
        case 1:
          return "待审核";
        case 2:
          return "审核通过";
        case 3:
          return "审核失败";
        case 4:
          return "已删除";
      }
    }
  }
};
</script>