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
      urlDisplay: `${import.meta.env.VITE_PUBLIC_BACKEND_URL}images`,
      urlRDisplay: import.meta.env.VITE_PUBLIC_BUCKET_URL,
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
  <section>
    <h1>View your upload image(s) here</h1>
    <div class = "image-grid">
      <div v-for="(id, image) in images" :key="image" id="aiowefuhiwa">
        <Image :src="image" alt="image" />
        <p style="size: 20px">{{ id }}</p>
        <ProgressBar :value="id" displayValueTemplate="{value}%" />
      </div>
    </div>
  </section>
  <button @click = "showImageArray">Show all images!</button>
  
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
    font-size: 1.875rem; /* 30px */
line-height: 2.25rem; /* 36px */
  }
}
      #aiowefuhiwa {
        display: flex;
        flex-direction: row;
        	gap: 2rem;
          align-items: center;

      }
</style>
