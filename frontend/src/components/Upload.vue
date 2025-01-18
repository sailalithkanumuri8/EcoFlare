
<template>
  <div class="card flex flex-col gap-6 items-center justify-center">
    <h1>Echoflare</h1>
      <Toast />
      <FileUpload ref="fileupload" mode="basic" name="demo[]" url="urlUpload" accept="image/*" :maxFileSize="1000000" @upload="onUpload" />
      <Button label="Upload" @click="upload" severity="secondary" />
  </div>
</template>

<script setup>
import { useToast } from "primevue/usetoast";
const toast = useToast();

const onAdvancedUpload = () => {
  toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
};
</script>
