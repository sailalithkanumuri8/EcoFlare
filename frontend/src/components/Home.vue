<script>
import {ref} from 'vue'
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
<div class="ecoflare">
    <!-- Hero Section -->
    <section class="hero">
      <h1>EcoFlare</h1>
      <div class="hero-text">
        <p>An innovative web application where users can upload aerial images of trees to detect if there are any dead trees. EcoFlare is created to contribute toward decarbonization efforts.</p>
      </div>
    </section>

    <section class="upload-container">
    <header class="upload-header">
        <h1>Upload Files</h1>
        <p class="upload-subtitle">Drag & drop files or click to browse</p>
    </header>
    
    <div class="upload-card">
        <div class="upload-dropzone">
            <Toast />
            <FileUpload 
                ref="fileupload"
                mode="advanced"
                name="files[]"
                :url="urlUpload"
                accept="image/*"
                :maxFileSize="1000000"
                @upload="onAdvancedUpload"
                :showUploadButton="false"
                :showCancelButton="true"
                class="upload-input"
            >
                <template #empty>
                    <div class="upload-placeholder">
                        <i class="upload-icon"></i>
                        <p>Drag images here or click to browse</p>
                        <span class="upload-hint">Supported formats: JPG, PNG, GIF (max 1MB)</span>
                    </div>
                </template>
            </FileUpload>
        </div>

        <div class="upload-actions">
            <input type="submit" id="list-submit" v-on:click="upload">
        </div>
    </div>
</section>
    
    <!-- Problem Section -->
    <section class="problem">
      <h2>The Problem with Dead Trees</h2>
      <div class="problem-text">
        <p>Dead trees in forests pose significant environmental challenges. When trees die in large numbers, they create unstable forest conditions that can lead to various ecological problems. These standing dead trees, known as snags, can significantly alter forest dynamics and create hazardous conditions.</p>
      </div>
    </section>

    <!-- Carbon Section -->
    <section class="carbon">
      <h2>Dead Trees Releasing Extra Carbon</h2>
      <div class="carbon-text">
        <p>When trees die, they transition from being carbon sinks to carbon sources. As dead trees decompose, they release their stored carbon back into the atmosphere. This process can release substantial amounts of CO2, contributing to greenhouse gas emissions. A single dead tree can release years' worth of stored carbon during decomposition.</p>
      </div>
    </section>

    <!-- Fire Risk Section -->
    <section class="fire-risk">
      <h2>Dead Trees Causing Forest Fires</h2>
      <div class="fire-risk-text">
        <p>Dead trees significantly increase the risk of catastrophic forest fires. These deceased trees act as perfect fuel sources, creating:</p>
      </div>
      <ul>
        <li>Higher intensity fires</li>
        <li>Faster fire spread rates</li>
        <li>More difficult fire containment scenarios</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
/* Base Styles */
.ecoflare {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Roboto', sans-serif;
  background-color: #f8f9fa;
  color: #2c3e50;
}

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

/* Hero Section */
.hero {
  background: linear-gradient(135deg, #198754, #20c997);
  color: white;
  text-align: center;
  padding: 4rem 2rem;
}

.hero h1 {
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.hero-text p {
  font-size: 1.2rem;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.8;
  color: white;
}

/* Problem Section */
.problem {
  background-color: #fff;
  border-left: 5px solid #dc3545;
}

/* Carbon Section */
.carbon {
  background-color: #fff;
  border-left: 5px solid #ffc107;
}
.upload {
    background-color: #fff;
    border-left: 5px solid #ffc107;
}

/* Fire Risk Section */
.fire-risk {
  background-color: #fff;
  border-left: 5px solid #fd7e14;
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
/* Upload Container Section */
.upload-container {
  background-color: #fff;
  border-left: 5px solid #198754;
}

.upload-header {
  text-align: center;
  margin-bottom: 2rem;
}

.upload-header h1 {
  font-size: 2.5rem;
  color: #198754;
  margin-bottom: 1rem;
  font-weight: 600;
}

.upload-subtitle {
  font-size: 1.2rem;
  color: #495057;
  margin-bottom: 2rem;
}

.upload-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.upload-dropzone {
  border: 2px dashed #20c997;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  transition: border-color 0.3s ease;
}

.upload-dropzone:hover {
  border-color: #198754;
}

.upload-placeholder {
  padding: 2rem;
}

.upload-icon {
  font-size: 2rem;
  color: #20c997;
  margin-bottom: 1rem;
}

.upload-hint {
  display: block;
  font-size: 0.9rem;
  color: #6c757d;
  margin-top: 0.5rem;
}

.upload-actions {
  margin-top: 2rem;
  text-align: center;
}

.upload-button {
  background-color: #198754;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
  transition: background-color 0.3s ease;
}

.upload-button:hover {
  background-color: #20c997;
}

/* Responsive Design for Upload Section */
@media (max-width: 768px) {
  .upload-header h1 {
    font-size: 2rem;
  }
  
  .upload-subtitle {
    font-size: 1rem;
  }
  
  .upload-card {
    padding: 1rem;
  }
  
  .upload-dropzone {
    padding: 1rem;
  }
  
  .upload-button {
    width: 100%;
    padding: 0.5rem 1rem;
  }
}
</style>
