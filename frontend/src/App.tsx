import Header from './components/header/index'
import './App.css'
import RenderRouter from './routes';
import AuthProvider from './context/useAuth';
import { ArticleProvider } from './context/ArticleContext';

function App() {
  return (
    <AuthProvider>
      <ArticleProvider>
        <div className='newsRoot'>
          <Header />
          <div className='newsWrap'>
            <RenderRouter />
          </div>
        </div >
      </ArticleProvider>
    </AuthProvider>
  )
}

export default App
