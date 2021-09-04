<template>
  <div class='main-container'>
    <div class='error-container'>
      <span class='main-title'>我们很抱歉，但发生了错误。</span>
      <b-link href='https://www.daziannetwork.com'
              style='font-size: 35px; user-select: none'>回到首页</b-link>
    </div>
    <div class='splitter'></div>
    <div>
      <span>具体错误信息见下：</span>
      <div class='detail-error-container'>
        <span>错误码：{{ errorCode }}</span>
        <span>错误原因：{{ errorReason }}</span>
        <span>原路由：{{ route }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ErrorPage',
  props: {
    error: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      errorCode: this.error.statusCode,
      errorReason: this.error.message,
      route: this.error.path!==undefined ?
              this.error.path :
              "(N/A)"
    }
  },
  head () {
    return {
      title: "错误 - 家庭网络"
    }
  },
  mounted() {
    console.log(this.error)
  }
}
</script>
<style scoped>
.main-container {
  margin: 10px;
}
.error-container {
  display: flex;
  align-items: center;
}
.main-title {
  display: inline;
  font-size: 35px;
  font-weight: bold;
  user-select: none;
}
.splitter {
  margin-top: 1rem;
  margin-bottom: 1rem;
  border: 1px solid white;
}
.detail-error-container {
  display: flex;
  flex-direction: column;
}

</style>
