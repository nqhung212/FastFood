import Web from '../pages/home'
import Menu from '../pages/menu'
import MenuCategories from '../pages/menu-categories'
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
export const publicRoutes = [
  { path: '/', element: Web },
  { path: '/menu', element: Menu },
  { path: '/menu/:category', element: MenuCategories },
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
]

export const privateRoutes = []
