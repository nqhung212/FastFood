//src/routes/index.jsx
import Web from '../pages/home'
import Menu from '../pages/menu'
import MenuCategories from '../pages/menu-categories'
import ProductDetail from '../pages/product-detail'
import CartPage from '../pages/cart'
import Login from '../pages/login'
import Register from '../pages/register'

export const publicRoutes = [
  { path: '/', element: Web },
  { path: '/menu', element: Menu },
  { path: '/menu/:category', element: MenuCategories },
  { path: '/product/:slug', element: ProductDetail },
  { path: '/cart', element: CartPage },
  { path: '/login', element: Login },
  { path: '/register', element: Register },
]

export const privateRoutes = []
