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

export const publicRoutes = [
  { path: '/', element: Web },
  { path: '/menu', element: Menu },
  { path: '/menu/:category', element: MenuCategories },
  { path: '/category/:categoryName', element: CategoryRestaurants },
  { path: '/restaurant/:restaurantId/:categoryName', element: RestaurantProducts },
  { path: '/product/:slug', element: ProductDetail },
  { path: '/cart', element: CartPage },
  { path: '/checkout', element: CheckoutPage },
  { path: '/payment-success', element: PaymentSuccessPage },
  { path: '/payment-cancel', element: PaymentCancelPage },
  { path: '/account', element: AccountPage },
  { path: '/login', element: Login },
  { path: '/register', element: Register },
  { path: '/menu/search/:searchTerm', element: Search },
  { path: '/payment-rollback', element: PaymentRollbackPage },
  { path: '/admin/login', element: AdminLogin },
]

export const adminRoutes = [
  { path: '/admin', element: AdminDashboard },
  { path: '/admin/orders', element: AdminOrders },
  { path: '/admin/users', element: AdminUsers },
  { path: '/admin/products', element: AdminProducts },
  { path: '/admin/categories', element: AdminCategories },
]

export const privateRoutes = []
