<template>
    <div>
        <Menu></Menu>
        <h1 class="text-center text-4xl">Trang Checkout</h1>
        <div class="container mx-auto p-6">
            <!-- Page Title -->
            <div>
                <div v-if="cart.length === 0" class="text-gray-500">Your cart is empty.</div>
                <div v-else>
                    <table class="table-auto w-full border-collapse border border-gray-300">
                        <thead>
                            <tr class="bg-gray-100">
                                <th class="border border-gray-300 px-4 py-2">Img</th>
                                <th class="border border-gray-300 px-4 py-2">Name</th>
                                <th class="border border-gray-300 px-4 py-2">Price</th>
                                <th class="border border-gray-300 px-4 py-2">Quantity</th>
                                <th class="border border-gray-300 px-4 py-2">Subtotal</th>
                                <th class="border border-gray-300 px-4 py-2">Manage</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in cart" :key="item.id" class="text-center">
                                <td class="border px-4 py-2 flex justify-center"> <img :src="item.img_url"
                                        alt="Product Image" class="w-16 h-16 object-cover rounded" /></td>
                                <td class="border border-gray-300 px-4 py-2">{{ item.name }}</td>
                                <td class="border border-gray-300 px-4 py-2">{{ item.price }}</td>
                                <td class="border border-gray-300 px-4 py-2">{{ item.quantity }}</td>
                                <td class="border border-gray-300 px-4 py-2">{{ (item.price *
                                    item.quantity).toFixed(2) }}</td>
                                <td class="border border-gray-300 px-4 py-2"> <button @click="removeFromCart(item.id)"
                                        class="ml-4 text-red-500">X</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <!-- Sum Total -->
                    <div class="mt-4 text-right font-semibold">
                        <span>Total: </span>
                        <span>{{ total?.toFixed(2) }}</span>
                    </div>
                </div>
            </div>
            <!-- Checkout Form Section -->
            <div v-if="cart.length > 0" class="mt-8">
                <h2 class="text-xl font-semibold mb-4">Checkout Form</h2>
                <form @submit.prevent="handleSubmit">
                    <!-- Name -->
                    <div class="mb-4">
                        <label for="name" class="block text-sm font-medium mb-2">Name</label>
                        <input type="text" v-model="form.name" id="name" class="w-full p-2 border rounded"
                            placeholder="Enter your name" required />
                    </div>

                    <!-- Phone -->
                    <div class="mb-4">
                        <label for="phone" class="block text-sm font-medium mb-2">Phone</label>
                        <input type="text" v-model="form.phone" id="phone" class="w-full p-2 border rounded"
                            placeholder="Enter your phone number" required />
                    </div>

                    <!-- Address -->
                    <div class="mb-4">
                        <label for="address" class="block text-sm font-medium mb-2">Address</label>
                        <textarea v-model="form.address" id="address" class="w-full p-2 border rounded"
                            placeholder="Enter your address" required></textarea>
                    </div>

                    <!-- Email -->
                    <div class="mb-4">
                        <label for="email" class="block text-sm font-medium mb-2">Email</label>
                        <input type="email" v-model="form.email" id="email" class="w-full p-2 border rounded"
                            placeholder="Enter your email" required />
                    </div>

                    <!-- Submit Button -->
                    <div class="flex justify-end">
                        <button type="submit" class="bg-teal-500 text-white px-4 py-2 rounded">Place Order</button>
                        <button type="submit" name="redirect" @click="initiatePayment"
                            class="bg-teal-500 text-white px-4 py-2 mx-3 rounded">VNPAY</button>
                    </div>
                </form>
            </div>

            <!-- If Cart is Empty -->
            <div v-else class="text-gray-500">Please add items to your cart before proceeding.
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
            cart: [], // To hold the cart data
            form: {
                name: "",
                phone: "",
                address: "",
                email: "",
            },
        };
    },
    mounted() {
        // Fetch the cart data from localStorage
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
        }
    },
    computed: {
        // Computed property to calculate total sum
        total() {
            return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        }
    },
    methods: {
        async initiatePayment() {
        // vào trang "Thanh toán VNPAY test" để lấy thông tin thẻ
            try {
                // Replace with your API endpoint
                const response = await axios.post("/api/payment", {
                    amount: this.total, // Replace with actual amount
                });

                if (response.data.payment_url) {
                    window.location.href = response.data.payment_url;
                    localStorage.removeItem("cart"); // Clear cart from localStorage after payment initiation
                    this.cart = []; // Clear cart state
                } else {
                    alert("Failed to generate payment URL");
                }
            } catch (error) {
                console.error("Payment error:", error);
                alert("An error occurred during payment initialization.");
            }
        },
        async handleSubmit() {
            // Prepare the data to be sent (shipping info and cart items)
            const orderData = {
                name: this.form.name,
                phone: this.form.phone,
                address: this.form.address,
                email: this.form.email,
                cart_items: this.cart, // Include the cart items here
            };

            try {
                // Send POST request with shipping and cart data
                const response = await axios.post('/api/orders', orderData);

                // Handle the response (e.g., show a success message)
                alert(response.data.message);

                // Optionally, save the shipping information and cart to localStorage
                localStorage.setItem('shipping', JSON.stringify(this.form));
                localStorage.setItem('cart', JSON.stringify(this.cart));
                // Remove the cart data from localStorage and clear cart state
                localStorage.removeItem('cart');
                // Clear the cart after the order is placed
                this.cart = []; // Clear cart if necessary
            } catch (error) {
                console.error('There was an error!', error);
                alert('There was an error placing your order.');
            }
        },
        saveCartToLocalStorage() {
            localStorage.setItem('cart', JSON.stringify(this.cart));
        },
        removeFromCart(productId) {
            this.cart = this.cart.filter(item => item.id !== productId);
            this.saveCartToLocalStorage();
        },
        saveShippingInfo() {
            // Save the shipping info to localStorage
            localStorage.setItem('shipping', JSON.stringify(this.form));
        },
        loadShippingInfo() {
            // Load the saved shipping info from localStorage
            const savedShipping = localStorage.getItem('shipping');
            if (savedShipping) {
                this.form = JSON.parse(savedShipping);
            }
        },
    },
    setup() {
        return {};
    },
};
</script>

<style lang="scss" scoped></style>
