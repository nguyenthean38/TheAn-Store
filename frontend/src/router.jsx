import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { CheckoutLayout, MainLayout, RequireAuth } from '@/components/layout/Layouts'

// Mỗi trang được tách chunk riêng (code splitting).
const HomePage = lazy(() => import('@/pages/HomePage'))
const ProductListPage = lazy(() => import('@/pages/ProductListPage'))
const SearchPage = lazy(() => import('@/pages/SearchPage'))
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'))
const WriteReviewPage = lazy(() => import('@/pages/WriteReviewPage'))
const ReviewThanksPage = lazy(() => import('@/pages/ReviewThanksPage'))
const WishlistPage = lazy(() => import('@/pages/WishlistPage'))
const CartPage = lazy(() => import('@/pages/CartPage'))
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'))
const OrderConfirmationPage = lazy(() => import('@/pages/OrderConfirmationPage'))
const ResetPasswordPage = lazy(() => import('@/pages/ResetPasswordPage'))
const AdiclubPage = lazy(() => import('@/pages/AdiclubPage'))
const InfoPage = lazy(() => import('@/pages/InfoPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

const AccountLayout = lazy(() => import('@/pages/account/AccountLayout'))
const FeedPage = lazy(() => import('@/pages/account/FeedPage'))
const OrdersPage = lazy(() => import('@/pages/account/OrdersPage'))
const OrderDetailPage = lazy(() => import('@/pages/account/OrderDetailPage'))
const CancelOrderPage = lazy(() => import('@/pages/account/CancelOrderPage'))
const DetailsPage = lazy(() => import('@/pages/account/DetailsPage'))
const AddressBookPage = lazy(() => import('@/pages/account/AddressBookPage'))
const PreferencesPage = lazy(() => import('@/pages/account/PreferencesPage'))
const SizeProfilePage = lazy(() => import('@/pages/account/SizeProfilePage'))

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/c/:slug', element: <ProductListPage /> },
      { path: '/search', element: <SearchPage /> },
      { path: '/p/:slug', element: <ProductDetailPage /> },
      { path: '/p/:slug/review', element: <WriteReviewPage /> },
      { path: '/review/thanks', element: <ReviewThanksPage /> },
      { path: '/wishlist', element: <WishlistPage /> },
      { path: '/cart', element: <CartPage /> },
      { path: '/reset-password', element: <ResetPasswordPage /> },
      { path: '/club', element: <AdiclubPage /> },
      { path: '/help', element: <InfoPage title="Trợ giúp" /> },
      { path: '/gift-cards', element: <InfoPage title="Thẻ quà tặng" /> },
      {
        path: '/account',
        element: (
          <RequireAuth>
            <AccountLayout />
          </RequireAuth>
        ),
        children: [
          { index: true, element: <FeedPage /> },
          { path: 'orders', element: <OrdersPage /> },
          { path: 'orders/:number', element: <OrderDetailPage /> },
          { path: 'orders/:number/cancel', element: <CancelOrderPage /> },
          { path: 'details', element: <DetailsPage /> },
          { path: 'addresses', element: <AddressBookPage /> },
          { path: 'preferences', element: <PreferencesPage /> },
          { path: 'size-profile', element: <SizeProfilePage /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    element: <CheckoutLayout />,
    children: [
      { path: '/checkout', element: <CheckoutPage /> },
      { path: '/order/:number/confirmation', element: <OrderConfirmationPage /> },
    ],
  },
])
