<template>
    <div>
        <Menu></Menu>
        <!-- Display Orders -->
        <div class="container mx-auto p-6">
            <h1 class="text-3xl font-bold text-gray-800 mb-6">Orders</h1>

            <!-- Orders Table -->
            <div v-if="orders.length > 0">
                <table
                    class="table-auto w-full border-collapse border border-gray-300"
                >
                    <thead>
                        <tr class="bg-gray-100">
                            <th class="border border-gray-300 px-4 py-2">
                                Order ID
                            </th>
                            <th class="border border-gray-300 px-4 py-2">
                                Name
                            </th>
                            <th class="border border-gray-300 px-4 py-2">
                                Email
                            </th>
                            <th class="border border-gray-300 px-4 py-2">
                                Address
                            </th>
                            <th class="border border-gray-300 px-4 py-2">
                                View
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="order in orders" :key="order.id" class="text-center">
                            <td class="border border-gray-300 px-4 py-2">
                                {{ order.id }}
                            </td>
                            <td class="border border-gray-300 px-4 py-2">
                                {{ order.name }}
                            </td>
                            <td class="border border-gray-300 px-4 py-2">
                                {{ order.email }}
                            </td>
                            <td class="border border-gray-300 px-4 py-2">
                                {{ order.address }}
                            </td>
                            <td class="border border-gray-300 px-4 py-2">
                                <button
                                    @click="openCartModal(order.cart_items)"
                                    class="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    View Order
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-else class="text-gray-500">No orders available.</div>
            <!-- Cart Modal -->
            <div
                v-if="isModalOpen"
                class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
                @click.self="closeCartModal"
            >
                <div class="bg-white p-6 rounded shadow-lg w-full max-w-4xl">
                    <h2 class="text-xl font-semibold mb-4">
                        Your Placed Items
                    </h2>

                    <!-- Cart Items Table -->
                    <div v-if="cartItems.length === 0" class="text-gray-500">
                        Your Placed Items was empty.
                    </div>

                    <div v-else>
                        <table
                            class="table-auto w-full border-collapse border border-gray-300 mb-4"
                        >
                            <thead>
                                <tr class="bg-gray-100">
                                    <th
                                        class="border border-gray-300 px-4 py-2"
                                    >
                                        Img
                                    </th>
                                    <th
                                        class="border border-gray-300 px-4 py-2"
                                    >
                                        Name
                                    </th>
                                    <th
                                        class="border border-gray-300 px-4 py-2"
                                    >
                                        Price
                                    </th>
                                    <th
                                        class="border border-gray-300 px-4 py-2"
                                    >
                                        Quantity
                                    </th>
                                    <th
                                        class="border border-gray-300 px-4 py-2"
                                    >
                                        Subtotal
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in cartItems" :key="item.id">
                                    <td
                                        class="border border-gray-300 px-4 py-2"
                                    >
                                        <img
                                            :src="item.img_url"
                                            alt="Product Image"
                                            class="w-16 h-16 object-cover rounded"
                                        />
                                    </td>
                                    <td
                                        class="border border-gray-300 px-4 py-2"
                                    >
                                        {{ item.name }}
                                    </td>
                                    <td
                                        class="border border-gray-300 px-4 py-2"
                                    >
                                        {{ item.price }}
                                    </td>
                                    <td
                                        class="border border-gray-300 px-4 py-2"
                                    >
                                        {{ item.quantity }}
                                    </td>
                                    <td
                                        class="border border-gray-300 px-4 py-2"
                                    >
                                        {{
                                            (
                                                item.price * item.quantity
                                            ).toFixed(2)
                                        }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <!-- Total Price -->
                        <div class="flex justify-end font-semibold">
                            <span class="mr-4">Total: </span>
                            <span>{{ totalPrice }}</span>
                        </div>

                        <!-- Close Modal Button -->
                        <div class="flex justify-end mt-4">
                            <button
                                @click="closeCartModal"
                                class="bg-red-500 text-white px-4 py-2 rounded"
                            >
                                Close
                            </button>
                        </div>
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
        axios,
    },
    data() {
        return {
            isModalOpen: false, // Flag for modal visibility
            orders: [],  // Orders data
            cartItems: [], // To hold the cart items (you can fetch this from localStorage or an API)
        };
    },
    mounted() {
        this.fetchOrders(); // Fetch orders when the component is mounted
    },
    computed: {
        // Calculate the total price of all items in the cart
        totalPrice() {
            return this.cartItems.reduce((total, item) => {
                return total + (item.price * item.quantity);
            }, 0).toFixed(2); // Return the total price as a string with two decimal places
        }
    },
    methods: {
        async fetchOrders() {
            try {
                // Make the API request to get orders
                const response = await axios.get("/api/orders"); // Replace with your API endpoint
                this.orders = response.data; // Store the orders in the component's data
            } catch (error) {
                console.error("Error fetching orders:", error);
                alert("There was an error fetching the orders.");
            }
        },
        openCartModal(cartItems) {
            this.cartItems = cartItems; // Store cart items for this order
            this.isModalOpen = true; // Open the modal
        },

         // Close the cart modal
         closeCartModal() {
            this.isModalOpen = false;
        },
    }, 
    setup() {
        return {};
    },
};
</script>

<style lang="scss" scoped></style>
