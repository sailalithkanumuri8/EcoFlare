<script>
import Image from 'primevue/image';
import axios from "axios";

export default {
  components: {
      Image
  },
  data() {
    return {
      urlDisplay: "https://afpjlrs2dio5sd3cqfdhcl4udi0otbar.lambda-url.us-east-1.on.aws/images",
      urlRDisplay: "https://ecoflare-rohannair-bucket-bexbwach.s3.us-east-1.amazonaws.com",
      imageCount: 0,
      images: [
      ]
    };
  },
  methods: {
    addImage() {
      this.imageCount++
      this.images.push({
        id: this.imageCount,
        title: `Image ${this.imageCount}`
      })
    },
    mounted() {
    this.intervalId = setInterval(() => {
      this.showImageArray()
    }, 5000)
  },
  beforeUnmount() {
    clearInterval(this.intervalId)
  },
    async showImageArray() {
      
      try {
        const response = await axios.get(this.urlDisplay);
        console.log(response.data[0].id);
        const tag = response.data[0].id;
        const response2 = await axios.get(this.urlRDisplay + "/" + tag);
        console.log(response2);
      } catch (error) {
        console.error("Error during file upload:", error);
      }
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
      <button @click="showImageArray" class="create-button">Create Image</button>
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
