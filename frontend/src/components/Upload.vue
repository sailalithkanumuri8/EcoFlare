<script>
import Toast from 'primevue/toast';
import FileUpload from 'primevue/fileupload';

export default {
  components: {
    Toast,         
    FileUpload,    
  },
  data() {
    return {
      urlUpload: import.meta.env.VITE_PUBLIC_BACKEND_URL + "/uploadurl",
    };
  },
  methods: {
    upload() {
      this.$refs.fileupload.upload();
    },
    onAdvancedUpload() {
      this.$toast.add({
        severity: 'info',
        summary: 'Success',
        detail: 'File Uploaded',
        life: 3000,
      });
    },
  },
};
</script>


<template>
  <h1>Echoflare</h1>
  
      
  
</template>
<style>
</style>