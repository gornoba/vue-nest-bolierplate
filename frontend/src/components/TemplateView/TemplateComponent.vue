<script lang="ts" setup>
import { onBeforeMount, onUnmounted, ref } from 'vue';
import _ from 'lodash';
import { request } from '@/common/configs/axios';
import { axiosErrorHandler } from '@/common/util/error';
import { useStore } from '@/store';

const store = useStore();
const URL = ref(store.state.templateStore.URL);
const eventSource = ref();

onBeforeMount(async () => {
  const result = await request('post', '/template/login', {
    username: 'liting',
    password: '1',
  });
  console.log(result);

  const sseUrl = _.concat(URL.value, '/api/template/dynamic_modal/template-indata/12345').join('');
  eventSource.value = new EventSource(sseUrl, { withCredentials: true });

  eventSource.value.onmessage = (event: any) => {
    const data = JSON.parse(event.data);
    console.log(data);
  };

  eventSource.value.onerror = (error: any) => {
    eventSource.value.close();
    axiosErrorHandler(error);
  };
});

onUnmounted(() => {
  eventSource.value.close();
});
</script>
<template>
  <div>임시</div>
</template>

<style></style>
`
