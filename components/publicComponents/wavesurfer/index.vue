<!--
 * @Author: janeliangrui_v
 * @Date: 2020-12-09 17:20:13
 * @LastEditors: janeliangrui_v
 * @LastEditTime: 2020-12-09 17:20:40
 * @FilePath: /kiseki-ui/components/wavesurfer/index.vue
-->
<template>
  <div>
    <el-dialog title="播放音频" :visible="true" :before-close="closeWave" width="800px">
      <div id="waveform" class="waveform"></div>
      <div id="wave-timeline" ref="wave-timeline"></div>
      <div class="toolBtn">
        <!-- //播放/暂停按钮 -->
        <el-button type="primary" @click="playAduio" size="small" round>
          <i class="el-icon-video-play"></i>
          播放 /
          <i class="el-icon-video-pause"></i>
          暂停
        </el-button>
        <el-tooltip class="item" effect="dark" content="音量" placement="bottom">
          <el-popover
            placement="top-start"
            trigger="click"
            style="min-width: 8px;margin-left: 10px"
          >
            <div class="block" style="width: 8px">
              <el-slider v-model="value" vertical height="100px" @change="setVolume" />
            </div>
            <el-button slot="reference" round size="small">音量</el-button>
          </el-popover>
        </el-tooltip>
      </div>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
.toolBtn {
  margin-top: 15px;
}
</style>

<script>
import WaveSurfer from "wavesurfer.js";
import CursorPlugin from "wavesurfer.js/dist/plugin/wavesurfer.cursor.js";
import TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js";
// import MinimapPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.minimap.min.js';
export default {
  name: "ksk-wavesurfer",
  components: {},
  data() {
    return {
      wavesurfer: null,
      value: 60,
    };
  },
  props: ["url"],
  mounted() {
    this.$nextTick(() => {
      this.waveInit();
    });
  },
  methods: {
    waveInit() {
      // eslint-disable-next-line no-undef
      console.log(WaveSurfer);
      // eslint-disable-next-line no-undef
      this.wavesurfer = WaveSurfer.create({
        container: "#waveform",
        waveColor: "violet",
        progressColor: "purple",
        mediaControls: true,
        audioRate: "1",
        // 插件：此教程配置了光标插件和时间轴插件
        plugins: [
          // 光标插件
          CursorPlugin.create({
            showTime: true,
            opacity: 1,
            customShowTimeStyle: {
              "background-color": "#000",
              color: "#fff",
              padding: "2px",
              "font-size": "10px",
            },
          }),
          TimelinePlugin.create({
            container: "#wave-timeline",
          }),
        ],
      });
      this.wavesurfer.load(this.url);
      this.wavesurfer.on("error", (e) => {
        console.log(e);
      });
    },
    closeWave() {
      this.$emit("closeWave");
    },
    //"播放/暂停"按钮的单击触发事件，暂停的话单击则播放，正在播放的话单击则暂停播放
    playAduio() {
      this.wavesurfer.playPause.bind(this.wavesurfer)();
    },
     // 设置音量：
    setVolume(val) {
      this.wavesurfer.setVolume(val / 100)
    },
  },
};
</script>

<style></style>
