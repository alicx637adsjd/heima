<template>
  <div class="publish-wrap">
    <el-form class="my-form" ref="form" :model="form" label-width="80px">
      <el-form-item label="标题">
        <el-input v-model="form.title" placeholder="请输入标题"></el-input>
      </el-form-item>

      <el-form-item label="内容">
        <quillEditor class="my-editor"></quillEditor>
      </el-form-item>

      <el-form-item label="封面">
        <el-input></el-input>
      </el-form-item>

      <el-form-item label="频道">
        <channel></channel>
      </el-form-item>

      <el-form-item>
        <el-button size="small">保存草稿</el-button>
        <el-button type="primary" size="small">发布...</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import {quillEditor} from 'vue-quill-editor';

import channel from '@/components/channel'

export default {
    name:"publish",
    components:{
        quillEditor,
        channel
    },
    data(){
        return{
            form:{
                title:"",
                channel_id:""
            },
            channelList:[]
        };
    },
    created() {
        
    },
};
</script>

<style lang="less">
    .publish-wrap{
        background-color: #fff;
        padding-top: 20px;
        padding-right: 20px;
        .ql-editor{
            height: 400px;
        }
    }
</style>