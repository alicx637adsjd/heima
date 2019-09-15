<template>
  <el-select placeholder="请选择">
    <el-option label="全部频道" value></el-option>
    <el-option v-for="item in channelList" :label="item.name" :value="item.id"></el-option>
  </el-select>
</template>

<script>
export default {
  data() {
    return {
      channelList: []
    };
  },
  created() {
    this.$axios
      .get("http://ttapi.research.itcast.cn/mp/v1_0/channels")
      .then(res => {
        this.channelList = res.data.data.channels;
      });
  }
};
</script>

<style>
</style>