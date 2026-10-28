import FX from './components/FX'
import Header from './components/Header'
import Hero from './components/Hero'
import Work from './components/Work'
import Process from './components/Process'
import Packages from './components/Packages'
import Care from './components/Care'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <FX />
      <Header />
      <main>
        <Hero />
        <Process />
        <Work />
        <Packages />
        <Care />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
