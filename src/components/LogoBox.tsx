import Link from 'next/link'
import Image from 'next/image'

import logoDark from '@/assets/images/logo-dark.png'
import logoLight from '@/assets/images/logo-light.png'
import logoSm from '@/assets/images/logo-sm.png'
import logoSmLight from '@/assets/images/logo-sm-light.png'

const LogoBox = () => {
  return (
    <Link href="/" className="logo">
      <span>
        <Image src={logoSm} alt="logo-small" width={50} height={50} className='logo-dark'/>
        <Image src={logoSmLight} alt="logo-small" width={50} height={50} className='logo-light' />
      </span>
      <span>
        <Image src={logoLight} alt="logo-large" className="logo-lg logo-light" />
        <Image src={logoDark} alt="logo-large" className="logo-lg logo-dark" />
      </span>
    </Link>
  )
}

export default LogoBox
