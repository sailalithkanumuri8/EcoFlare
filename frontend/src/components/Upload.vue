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
      urlUpload: import.meta.env.VITE_PUBLIC_BACKEND_URL + "uploadurl",
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
<div class="Uploadedfiles">
  <!--Uploadedfiles-->
  <section class="mainHead">
    <h1>View your uploaded file(s) here:</h1>
    <section>
    <div class="Image1">
      <h3> Image 1</h3>
    </div>
    </section>
    <section>
    <div class="Image2">
      <h3> Image 2</h3>
    </div>
    </section>
    <section>
    <div class="Image3">
      <h3> Image 3</h3>
    </div>
    </section>
    <section>
    <div class="Image4">
      <h3> Image 4</h3>
    </div>
    </section>
  </section>

</div>
</template>
<style>
</style>
