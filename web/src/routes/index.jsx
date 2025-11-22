import Web from '../pages/home'
import Menu from '../pages/menu'
import MenuCategories from '../pages/menu-categories'
import CategoryRestaurants from '../pages/category-restaurants'
import RestaurantProducts from '../pages/restaurant-products'
import ProductDetail from '../pages/product-detail'
import CartPage from '../pages/cart'
import CheckoutPage from '../pages/checkout'
import PaymentSuccessPage from '../pages/payment-success'
import PaymentCancelPage from '../pages/payment-cancel'
import AccountPage from '../pages/account'
import Login from '../pages/login'
import Register from '../pages/register'
import Search from '../pages/search'
import PaymentRollbackPage from '../pages/payment-rollback'
import AdminLogin from '../pages/admin-login'

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
