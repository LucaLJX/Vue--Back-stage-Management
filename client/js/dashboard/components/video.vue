<template>
  <div class="common-video-container">
    
    <video ref="myPlay" controls>
      <source :src="commonSrc" type="video/mp4">
    </video>
  </div>
</template>

<script>
  export default {
    props: {
      commonSrc: {
        type: String
      },
      commonPic: {
        type: String
      }
    },
    data() {
      return {
      }
    },
    
    mounted: function () {
      var _this = this;
      var players = plyr.setup(_this.$refs.myPlay, {
        autoplay: true,
        iconUrl: '/libs/plyr/plyr.svg'
      });
    },
    methods: {
      
    }
  }
</script>

<style lang="scss" scoped>
  .common-video-container {
    padding: 5px;
  }
  #my-player {
    width: 660px;
  }
</style>
