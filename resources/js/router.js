import { createRouter, createWebHistory } from "vue-router";
import Categories from "./Components/Categories/index.vue" 
import Brands from "./Components/Brands/index.vue" 
import Products from "./Components/Products/index.vue" 

const routes = [
   {
      path: "/categories",
      component: Categories
   },
   {
      path: "/brands",
      component: Brands
   },{
      path: "/products",
      component: Products
   },
]

const router = createRouter({
   history: createWebHistory(),
   routes
})

export default router
