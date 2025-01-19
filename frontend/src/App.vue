<!-- App.vue -->
<template>
  <main>
    <Menubar :model="items">
      <template #item="{ item, props }">
        <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
          <a v-ripple :href="href" v-bind="props.action" @click="navigate">
            <span :class="item.icon" />
            <span class="ml-2">{{ item.label }}</span>
          </a>
        </router-link>
      </template>
    </Menubar>
    <RouterView />
  </main>
</template>

<script>
import Menubar from 'primevue/menubar'

export default {
  name: 'App',
  components: {
    Menubar
  },
  data() {
    return {
      items: [
        {
          label: 'Home',
          icon: 'pi pi-home',
          route: '/'
        },
        {
          label: 'Images',
          icon: 'pi pi-upload',
          route: '/upload'
        }
      ]
    }
  }
}
</script>

<style scoped>
:deep(.p-menubar) {
  padding: 0.5rem;
  background: #f8f9fa;
}

:deep(.p-menuitem-link) {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: #495057;
}

:deep(.p-menuitem-link:hover) {
  background: #e9ecef;
  border-radius: 4px;
}
:deep(.p-menubar) {
  padding: 0.5rem;
  background: #f8f9fa;
  border: none;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

:deep(.p-menuitem-link) {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.25rem;
  text-decoration: none;
  color: #495057;
  font-weight: 500;
  transition: all 0.3s ease;
}

:deep(.p-menuitem-link:hover) {
  background: #e9ecef;
  border-radius: 6px;
  color: #2196F3;
}

:deep(.pi) {
  font-size: 1.5rem;
  margin-right: 0.5rem;
  font-family: 'Roboto', sans-serif;
}

:deep(.ml-2) {
  font-size: 1.5rem;
  letter-spacing: 0.3px;
  font-family: 'Roboto', sans-serif;
}

</style>
