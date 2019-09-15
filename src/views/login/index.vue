<template>
  <div class="login">
    <div class="form-wrap">
      <div class="header">
        <img src="./images/login_logo.png" alt />
      </div>

      <el-form :model="loginForm" :rules="rules" ref="loginForm" class="demo-ruleForm">
        <!-- 有几行就要有几个el-form-item -->
        <!-- prop代表指定这一行用哪一条规则 -->
        <!-- 规则的名字必须跟表单元素绑定的属性一致,规则名字不能乱写，要写它绑定的属性名 -->
        <el-form-item prop="mobile">
          <el-input v-model="loginForm.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>

        <el-form-item prop="code">
          <el-row>
            <el-col :span="12">
              <el-input v-model="loginForm.code" placeholder="请输入验证码"></el-input>
            </el-col>
            <el-col :span="10" :offset="2">
              <el-button @click="getCode" :disabled="isDisabled">{{ codeBtnTitle }}</el-button>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item prop="agree">
          <el-checkbox v-model="loginForm.agree"></el-checkbox>
          <span>
            我已阅读并同意
            <a href="javascript:void(0)">用户协议</a>和
            <a href="javascript:void(0)">隐私条款</a>
          </span>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            :loading="isLoading"
            class="login-btn"
            @click="submitForm('loginForm')"
          >登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// import axios from "axios";
export default {
  name: "login",
  data() {
    return {
      isLoading: false,
      codeBtnTitle: "获取验证码",
      isDisabled: false,
      loginForm: {
        mobile: "13911111111",
        code: "246810",
        agree: true
      },
      rules: {
        mobile: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          {
            pattern: /0?(13|14|15|18)[0-9]{9}/,
            message: "请输入正确的手机号",
            trigger: "blur"
          }
        ],
        code: [
          { required: true, message: "验证码不能为空", trigger: "blur" },
          { len: 6, message: "长度为6位", trigger: "blur" }
        ],
        agree: [
          { pattern: /true/, message: "必须勾选同意协议", trigger: "click" }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.isLoading = true;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post(
              "mp/v1_0/authorizations",
              this.loginForm
            )
            .then(res => {
              let jsonStr = JSON.stringify(res.data.data);
              window.localStorage.setItem("userInfo", jsonStr);

              this.$message.success("登录成功！");
              this.$router.push("/home");
            })
            .catch(error => {
              this.isLoading = false;
              this.$message.error("账号或密码错误！");
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getCode() {
      this.isDisabled = true;
      this.codeBtnTitle = "还有60秒";
      let sec = 60;
      let timerID = setInterval(() => {
        sec--;
        this.codeBtnTitle = `还有${sec}秒`;
        if (sec == 59) {
          this.loginForm.code = "246810";
        }
        if (sec == 0) {
          clearInterval(timerID);
          this.codeBtnTitle = "获取验证码";
          this.isDisabled = false;
        }
      }, 1000);
    }
  }
};
</script>

<style lang="less" scoped>
.login {
  height: 100%;
  background: url("./images/login_bg.jpg") no-repeat center/cover;
  display: flex;
  justify-content: center;
  align-items: center;
  .form-wrap {
    width: 300px;
    height: 300px;
    padding: 40px;
    background-color: #fff;
    .header {
      text-align: center;
      margin-bottom: 20px;
      img {
        width: 150px;
      }
    }
    .login-btn {
      width: 100%;
    }
  }
}
</style>