<script>
import Image from 'primevue/image';
import Button from 'primevue/button';
import axios from "axios";

import ProgressBar from 'primevue/progressbar';


export default {
  components: {
      Image,
      Button,
      ProgressBar
  },
  data() {
    return {
      urlDisplay: "https://afpjlrs2dio5sd3cqfdhcl4udi0otbar.lambda-url.us-east-1.on.aws/images",
      urlRDisplay: "https://ecoflare-rohannair-bucket-bexbwach.s3.us-east-1.amazonaws.com",
      imageCount: 0,
      images: {}
      ,
      accuracies: []
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
    }, 1000)
  },
  beforeUnmount() {
    clearInterval(this.intervalId)
  },
    async showImageArray() {
      
      try {
        const response = await axios.get(this.urlDisplay);
  
        const tag = response.data[0].id;
        const response2 = await axios.get(this.urlRDisplay + "/" + tag);
        
        for(let i = 0; i < response.data.length; i++) {
          const img = this.urlRDisplay + "/" + response.data[i].id;
          const accuracy = response.data[i].deadTrees;
          this.images[img] = accuracy;
        }
        console.log(this.images);
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
        <section  v-for="(key, value) in images" :key="key" > 
          <div>
            <img :src = "value" width ="150" height ="150">
            <div class ="progress-bar">
              <div class="progress-bar-fill" :style ="{ width: 10000}"></div>
            </div>
            <ProgressBar :value="key"></ProgressBar>
            
          </div>
          
        </section>
      </section>
      <Button label="Generate image from datasets" class="upload-button" @click="showImageArray" />

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
