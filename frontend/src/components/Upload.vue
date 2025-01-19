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
    addImage() {
      this.imageCount++
      this.images.push({
        id: this.imageCount,
        title: `Image ${this.imageCount}`
      })
    }
  }
}
</script>

<template>
<div class="Uploadedfiles">
    <section class="titleHead">
      <h1>View your uploaded file(s) here:</h1>
      <section class="mainHead" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
        <section v-for="image in images" :key="image.id" :class="'Image' + image.id"> 
          <div>
            <h3>{{ image.title }}</h3>
          </div>
        </section>
      </section>
      <button @click="addImage" class="create-button">Create Image</button>
    </section>
  </div>
</template>

<style scoped>



/* Section Common Styles */
section {
  margin-bottom: 4rem;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: white;
  transition: transform 0.3s ease;
}

section:hover {
  transform: translateY(-5px);
}
/* Remove hover effect from mainHead specifically */
.mainHead {
  transform: none !important;
  box-shadow: none;
  border: 2px solid transparent;
  background-origin: border-box;
  background-clip: content-box, border-box;
}


/* Headings */
h2 {
  color: #198754;
  font-size: 2rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

/* Text Content */
p {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #495057;
  margin-bottom: 1.5rem;
}

/* List Styles */
ul {
  list-style-type: none;
  padding-left: 1.5rem;
}

li {
  font-size: 1.1rem;
  color: #495057;
  margin-bottom: 0.8rem;
  position: relative;
  padding-left: 1.5rem;
}

li::before {
  content: "•";
  color: #198754;
  font-weight: bold;
  position: absolute;
  left: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .ecoflare {
    padding: 1rem;
  }
  
  section {
    padding: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .hero h1 {
    font-size: 2.5rem;
  }
  
  h2 {
    font-size: 1.75rem;
  }
  
  p, li {
    font-size: 1rem;
  }
}
</style>
