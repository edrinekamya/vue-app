<script setup lang='ts'>
import { useCallStore } from '@/stores/call';
import { onMounted, ref } from 'vue';

const store = useCallStore()
const bins = 64
const audioData = new Uint8Array(bins)
const data = ref(Array.from(audioData))

onMounted(() => {
  const audioContext = new window.AudioContext()
  const analyser = audioContext.createAnalyser()
  const audioSource = audioContext.createMediaStreamSource(store.localStream)

  analyser.fftSize = bins / 2
  audioSource.connect(analyser)

  const updateData = () => {
    analyser.getByteFrequencyData(audioData);
    const high = Array.from(audioData.slice(0, bins *.5))
    data.value = [...high.slice().reverse(), ...high]
    requestAnimationFrame(updateData)
  }

  updateData()
})

</script>

<template>
  <div class="row">
    <div v-for="(h, i) in data" :key="i" :style="{ height: ((h) * 100 / 255) + '%' }">
    </div>
  </div>
</template>

<style scoped>
.row {
  width: 300px;
  height: 64px;
  gap: 2px;

}

.row>div {
  flex: 1;
  border-radius: 2em;
  background: wheat;
}
</style>
