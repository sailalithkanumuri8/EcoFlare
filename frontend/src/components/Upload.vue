<script>

import FileUpload from 'primevue/fileupload';

export default {
    data() {
      return {
        urlUpload: import.meta.env.VITE_PUBLIC_BACKEND_URL + "/uploadurl"
      }
    }, 
    methods: {
        upload() {
            this.$refs.fileupload.upload();
        },
        onUpload() {
            this.$toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
        }
    }
};


</script>

<template>
  <div class="card">
      <div>yippee</div>
      <Toast />
      <FileUpload name="demo[]" url="urlUpload" @upload="onAdvancedUpload($event)" :multiple="true" accept="image/*" :maxFileSize="1000000">
          <template #empty>
              <span>Drag and drop files to here to upload.</span>
          </template>
      </FileUpload>
  </div>
</template>

