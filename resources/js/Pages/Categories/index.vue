<template>
    <div>
        <Menu></Menu>
        <h1 class="text-center text-4xl">Trang Categories</h1>
        <div class="container mx-auto p-6">
            <div v-if="loading" class="text-center text-blue-600">
                Loading Categories...
            </div>
            <div v-else>
                <button
                    @click="openModal(null)"
                    class="bg-teal-500 text-white px-4 py-2 rounded mb-4"
                >
                    Add Category
                </button>

                <table
                    class="table-auto w-full border-collapse border border-gray-400"
                >
                    <thead>
                        <tr class="bg-gray-100 text-center">
                            <th class="border border-gray-300 px-4 py-2">ID</th>
                            <th class="border border-gray-300 px-4 py-2">
                                Name
                            </th>
                            <th class="border border-gray-300 px-4 py-2">
                                Description
                            </th>
                            <th class="border border-gray-300 px-4 py-2">
                                Manage
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="category in categories" :key="category.id">
                            <td
                                class="border border-gray-300 px-4 py-2 text-center"
                            >
                                {{ category.id }}
                            </td>
                            <td
                                class="border border-gray-300 px-4 py-2 text-center"
                            >
                                {{ category.name }}
                            </td>
                            <td
                                class="border border-gray-300 px-4 py-2 text-center"
                            >
                                {{ category.description }}
                            </td>
                            <td
                                class="border border-gray-300 px-4 py-2 text-center"
                            >
                                <button
                                    @click="openModal(category)"
                                    class="text-teal-500 hover:text-teal-700"
                                >
                                    Edit
                                </button>
                                |
                                <button
                                    @click="deleteCategory(category.id)"
                                    class="text-red-500 hover:text-red-700"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <!-- Modal for adding/editing categories -->
                <div
                    v-if="isModalOpen"
                    class="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center"
                >
                    <div class="bg-white p-6 rounded shadow-lg w-1/3">
                        <h2 class="text-xl font-semibold mb-4">
                            {{ isEditing ? "Edit Category" : "Add Category" }}
                        </h2>

                        <form @submit.prevent="handleSubmit">
                            <div class="mb-4">
                                <label
                                    for="name"
                                    class="block text-sm font-semibold"
                                    >Name</label
                                >
                                <input
                                    type="text"
                                    id="name"
                                    v-model="form.name"
                                    class="w-full p-2 border border-gray-300 rounded"
                                    placeholder="Category Name"
                                    required
                                />
                            </div>

                            <div class="mb-4">
                                <label
                                    for="description"
                                    class="block text-sm font-semibold"
                                    >Description</label
                                >
                                <input
                                    type="text"
                                    id="description"
                                    v-model="form.description"
                                    class="w-full p-2 border border-gray-300 rounded"
                                    placeholder="Category Description"
                                />
                            </div>

                            <div class="flex justify-end">
                                <button
                                    type="button"
                                    @click="closeModal"
                                    class="mr-4 text-gray-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    class="bg-teal-500 text-dark px-4 py-2 rounded"
                                >
                                    {{
                                        isEditing
                                            ? "Save Changes"
                                            : "Add Category"
                                    }}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Menu from "../Include/Menu.vue";
import axios from "axios";

export default {
    components: {
        Menu,
    },
    data() {
        return {
            categories: [], //Array to store categories
            loading: true, // Loading state
            error: null,
            isModalOpen: false, // Modal visibility state
            isEditing: false, // Whether we're editing an existing category
            form: {
                id: null,
                name: "",
                description: "",
            },
        };
    },
    mounted() {
        this.fetchCategories(); //Fetch categories when component is mounted
    },
    methods: {
        async fetchCategories() {
            try {
                // Make the GET request to the API endpoint
                const response = await axios.get(
                    "http://127.0.0.1:8000/api/categories"
                );
                this.categories = response.data; // Assign data to categories
                console.log(this.categories);
            } catch (error) {
                console.error("Error fetching categories:", error);
                this.error =
                    "Failed to load categories. Please try again later.";
            } finally {
                this.loading = false; // Stop loading spinner
            }
        },
        openModal(category) {
            if (category) {
                this.isEditing = true; // Pre-fill form for editing
                this.form = { ...category };
            } else {
                this.isEditing = false;
                this.form = { id: null, name: "", description: "" }; // Reset form for adding
            }
            this.isModalOpen = true;
        },

        closeModal() {
            this.isModalOpen = false;
        },
        async deleteCategory(id) {
            try {
                if (confirm("Are you sure you want to delete this category?")) {
                    // Make the DELETE request to the API
                    await axios.delete(
                        `http://127.0.0.1:8000/api/categories/${id}`
                    );
                    this.categories = this.categories.filter(
                        (category) => category.id !== id
                    ); // Remove from local state
                    alert("Category deleted successfully.");
                }
            } catch (error) {
                console.error("Error deleting category:", error);
                alert("Failed to delete category.");
            }
        },
        async handleSubmit() {
            if (this.isEditing) {
                //Edit
                await this.updateCategory();
            } else {
                //Add
                await this.addCategory();
            }
            this.closeModal();
        },
        async addCategory() {
            try {
                const response = await axios.post(
                    "http://127.0.0.1:8000/api/categories",
                    this.form
                );
                this.categories.push(response.data); // Add new category to local list
            } catch (error) {
                console.error("Error adding category:", error);
            }
        },
        async updateCategory() {
            try {
                const response = await axios.put(
                    `http://127.0.0.1:8000/api/categories/${this.form.id}`,
                    this.form
                );
                const index = this.categories.findIndex(
                    (category) => category.id === this.form.id
                );
                if (index !== -1) {
                    this.categories[index] = response.data; // Update the category in the local list
                }
            } catch (error) {
                console.error("Error updating category:", error);
            }
        },
    },
};
</script>

<style lang="scss" scoped></style>
