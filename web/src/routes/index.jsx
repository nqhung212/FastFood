import Web from '../pages/customer/home'
import Menu from '../pages/customer/menu'
import MenuCategories from '../pages/customer/menu-categories'
import CategoryRestaurants from '../pages/customer/category-restaurants'
import RestaurantProducts from '../pages/customer/restaurant-products'
import ProductDetail from '../pages/customer/product-detail'
import CartPage from '../pages/customer/cart'
import CheckoutPage from '../pages/customer/checkout'
import PaymentSuccessPage from '../pages/customer/payment-success'
import PaymentCancelPage from '../pages/customer/payment-cancel'
import AccountPage from '../pages/customer/account'
import OrderDetail from '../pages/customer/order-detail'
import Login from '../pages/customer/login'
import Register from '../pages/customer/register'
import Search from '../pages/customer/search'
import PaymentRollbackPage from '../pages/customer/payment-rollback'
import AdminLogin from '../pages/admin/admin-login'

// Admin pages
import AdminDashboard from '../pages/admin/index'
import AdminOrders from '../pages/admin/orders'
import AdminUsers from '../pages/admin/users'
import AdminProducts from '../pages/admin/products'
import AdminCategories from '../pages/admin/categories'

// Restaurant Owner pages
import RestaurantRegister from '../pages/restaurant_owner/register'
import RestaurantLogin from '../pages/restaurant_owner/login'
import RestaurantSetup from '../pages/restaurant_owner/setup'
import RestaurantDashboard from '../pages/restaurant_owner/dashboard'
import ManageProducts from '../pages/restaurant_owner/manage-products'
import ManageCategories from '../pages/restaurant_owner/manage-categories'
import RestaurantInfo from '../pages/restaurant_owner/restaurant-info'
import RestaurantOrders from '../pages/restaurant_owner/orders'

export const publicRoutes = [
  { path: '/', element: Web },
  { path: '/category/:categoryName', element: CategoryRestaurants },
  { path: '/restaurant/:restaurantId/:categoryName', element: RestaurantProducts },
  { path: '/product/:slug', element: ProductDetail },
  { path: '/cart', element: CartPage },
  { path: '/checkout', element: CheckoutPage },
  { path: '/payment-success', element: PaymentSuccessPage },
  { path: '/payment-cancel', element: PaymentCancelPage },
  { path: '/account', element: AccountPage },
  { path: '/order-detail/:orderId', element: OrderDetail },
  { path: '/login', element: Login },
  { path: '/register', element: Register },
  { path: '/payment-rollback', element: PaymentRollbackPage },
  { path: '/admin/login', element: AdminLogin },
  { path: '/restaurant/register', element: RestaurantRegister },
  { path: '/restaurant/login', element: RestaurantLogin },
]

export const adminRoutes = [
  { path: '/admin', element: AdminDashboard },
  { path: '/admin/orders', element: AdminOrders },
  { path: '/admin/users', element: AdminUsers },
  { path: '/admin/products', element: AdminProducts },
  { path: '/admin/categories', element: AdminCategories },
]

export const restaurantOwnerRoutes = [
  { path: '/restaurant/setup', element: RestaurantSetup },
  { path: '/restaurant/dashboard', element: RestaurantDashboard },
  { path: '/restaurant/products', element: ManageProducts },
  { path: '/restaurant/categories', element: ManageCategories },
  { path: '/restaurant/info', element: RestaurantInfo },
  { path: '/restaurant/orders', element: RestaurantOrders },
]

export const privateRoutes = []
